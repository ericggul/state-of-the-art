import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

import { AudioEffectProcessor } from "./audioEffects";

export default function useViseme() {
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );

  const introState = useScreenStore((state) => state.introState);
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);
  const iteration = useScreenStore((state) => state.iteration);
  const userName = useScreenStore((state) => state.userName);

  const stage = useScreenStore((state) => state.stage);

  const currentArchitectureRef = useRef("");

  useEffect(() => {
    currentArchitectureRef.current = currentArchitectures[0]?.name || "";
  }, [currentArchitectures]);

  const [visemeMessage, setVisemeMessage] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const [nextSpeech, setNextSpeech] = useState(null);
  const previousAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  const pendingTTSRef = useRef(null);
  const nextSpeechGenerationRef = useRef(null);

  const audioProcessorRef = useRef(null);

  useEffect(() => {
    audioProcessorRef.current = new AudioEffectProcessor();
    return () => {
      audioProcessorRef.current?.cleanup();
    };
  }, []);

  const latestSpeech = useMemo(() => {
    try {
      if (!currentArchitectures?.length) {
        return "";
      }

      const architecture = currentArchitectures[0];
      if (!architecture) {
        return "";
      }

      const parts = [architecture.name, architecture.explanation].filter(
        Boolean
      ); // Remove falsy values

      return parts.join(" ").trim() || "";
    } catch (error) {
      console.error("❌ Error generating latest speech:", error);
      return "";
    }
  }, [currentArchitectures]);
  const debouncedSpeech = useDebounce(latestSpeech, 1000);

  const isActiveStageRef = useRef(stage === "Frontend");

  // Combine all cleanup logic into one function
  const cleanupAudio = () => {
    if (previousAudioRef.current) {
      previousAudioRef.current.pause();
      previousAudioRef.current.currentTime = 0;
      previousAudioRef.current.removeEventListener("ended", handleAudioEnd);
      if (previousAudioRef.current.src) {
        URL.revokeObjectURL(previousAudioRef.current.src);
      }
    }

    if (pendingTTSRef.current?.audioPlayer) {
      pendingTTSRef.current.audioPlayer.pause();
      pendingTTSRef.current.audioPlayer.currentTime = 0;
      pendingTTSRef.current.audioPlayer.removeEventListener(
        "ended",
        handleAudioEnd
      );
      if (pendingTTSRef.current.audioPlayer.src) {
        URL.revokeObjectURL(pendingTTSRef.current.audioPlayer.src);
      }
    }

    // Reset all state
    pendingTTSRef.current = null;
    nextSpeechGenerationRef.current = false;
    isPlayingRef.current = false;
    setVisemeMessage({});
    setConversationHistory([]);
    audioProcessorRef.current?.cleanup();
  };

  // Replace immediateStopAudio with cleanupAudio
  const immediateStopAudio = cleanupAudio;

  // Handle audio end and trigger next speech
  const handleAudioEnd = async () => {
    if (!isActiveStageRef.current) {
      immediateStopAudio();
      return;
    }
    isPlayingRef.current = false;

    // Add random delay between 2-3 seconds
    const delay = Math.random() * 2000 + 1500;

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (pendingTTSRef.current) {
      const message = pendingTTSRef.current;
      pendingTTSRef.current = null;
      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
      isPlayingRef.current = true;

      if (audioProcessorRef.current) {
        audioProcessorRef.current.initialize(message.audioPlayer);
      }

      message.audioPlayer.currentTime = 0;
      message.audioPlayer.volume = 1;
      message.audioPlayer.play();

      generateNextSpeech();
    } else {
      await generateNextSpeech();
    }
  };

  // Generate next speech using Langchain Avatar
  const generateNextSpeech = async () => {
    if (!isActiveStageRef.current || nextSpeechGenerationRef.current) {
      return;
    }
    nextSpeechGenerationRef.current = true;

    try {
      const targetModel = currentArchitectures[0]?.name || "";
      const lastSpeech =
        conversationHistory[conversationHistory.length - 1]?.content || "";

      const response = await axios.post("/api/langchain/avatar-v1", {
        messages: [{ role: "user", content: lastSpeech }],
        currentArchitecture: currentArchitectureRef.current || targetModel,
        userName: userName,
      });

      if (!response.data?.content) {
        throw new Error("Unexpected response format");
      }

      const newSpeech = response.data.content;

      setConversationHistory((prev) => {
        const recentHistory = prev.slice(-8);
        return [...recentHistory, { content: newSpeech }];
      });

      const audioRes = await axios.post(
        "/api/azure-tts",
        { text: newSpeech },
        { responseType: "blob" }
      );

      const audio = audioRes.data;
      const visemes = JSON.parse(audioRes.headers.visemes);
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);
      audioPlayer.addEventListener("ended", handleAudioEnd);

      const message = { visemes, audioPlayer };

      pendingTTSRef.current = message;
      setNextSpeech(null);
    } catch (error) {
      console.error("❌ Speech generation error:", error);
      isPlayingRef.current = false;
    } finally {
      nextSpeechGenerationRef.current = false;
    }
  };

  const fadeOutAudio = (audio, duration = 1000) => {
    const startVolume = audio.volume;
    const steps = 15;
    const volumeStep = startVolume / steps;
    const intervalTime = duration / steps;

    const fadeInterval = setInterval(() => {
      if (audio.volume > volumeStep) {
        audio.volume = Math.max(0, audio.volume - volumeStep);
      } else {
        clearInterval(fadeInterval);
        audio.pause();
        audio.volume = startVolume;
      }
    }, intervalTime);
  };

  // Handle new speech from screen store
  useEffect(() => {
    if (debouncedSpeech && debouncedSpeech.length > 0) {
      // Stop current speech and clear next speech
      if (previousAudioRef.current) {
        fadeOutAudio(previousAudioRef.current);
      }
      setNextSpeech(null);

      // Append to conversation history instead of resetting
      setConversationHistory((prev) => [...prev, { content: debouncedSpeech }]);
      getViseme({ text: debouncedSpeech });
    }
  }, [debouncedSpeech]);

  // Add stage check before starting any new audio
  async function getViseme({ text, preGeneratedTTS = null }) {
    if (!isActiveStageRef.current) {
      immediateStopAudio();
      return;
    }

    try {
      // Double check stage before proceeding with audio generation
      if (!isActiveStageRef.current) {
        immediateStopAudio();
        return;
      }

      let message;
      if (preGeneratedTTS) {
        message = preGeneratedTTS;
      } else {
        const audioRes = await axios.post(
          "/api/azure-tts",
          { text },
          { responseType: "blob" }
        );

        // Check stage again after API call
        if (!isActiveStageRef.current) {
          immediateStopAudio();
          return;
        }

        const audio = audioRes.data;
        const visemes = JSON.parse(audioRes.headers.visemes);
        const audioUrl = URL.createObjectURL(audio);
        const audioPlayer = new Audio(audioUrl);
        audioPlayer.addEventListener("ended", handleAudioEnd);
        message = { visemes, audioPlayer };
      }

      // Final stage check before playing
      if (!isActiveStageRef.current) {
        immediateStopAudio();
        return;
      }

      if (previousAudioRef.current) {
        fadeOutAudio(previousAudioRef.current);
      }

      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
      isPlayingRef.current = true;

      if (audioProcessorRef.current) {
        audioProcessorRef.current.initialize(message.audioPlayer);
      }

      message.audioPlayer.currentTime = 0;
      message.audioPlayer.volume = 1;
      message.audioPlayer.play();

      generateNextSpeech();
    } catch (e) {
      console.error("❌ TTS Error:", e.message);
      isPlayingRef.current = false;
    }
  }

  // Stage effect
  useEffect(() => {
    const wasActive = isActiveStageRef.current;
    isActiveStageRef.current = stage === "Frontend";

    if (!isActiveStageRef.current) {
      cleanupAudio();
    }
  }, [stage]);

  // Unmount effect
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  //////INTRO LOGIC//////
  // Add effect for welcome message

  // Add effect for intro state messages
  useEffect(() => {
    const handleIntroSpeech = async (message) => {
      // Always stop current speech with fade out, regardless of playing state
      if (previousAudioRef.current) {
        fadeOutAudio(previousAudioRef.current);
      }
      if (pendingTTSRef.current?.audioPlayer) {
        fadeOutAudio(pendingTTSRef.current.audioPlayer);
      }

      // Reset pending states
      pendingTTSRef.current = null;
      nextSpeechGenerationRef.current = false;
      setNextSpeech(null);

      // Force isPlayingRef to false to allow new speech
      isPlayingRef.current = false;

      // Add to conversation history and speak
      setConversationHistory((prev) => [...prev, { content: message }]);
      await getViseme({ text: message });
    };

    if (stage === "Frontend") {
      if (introState === 0) {
        const welcomeMessage = `Welcome to the state of the art neural network gallery. Might I have your name, esteemed visitor?`;
        handleIntroSpeech(welcomeMessage);
      } else if (introState === 1) {
        const accelerometerMessage = `Hi ${userName}, please activate the motion sensor for more immersive experience.`;
        handleIntroSpeech(accelerometerMessage);
      } else if (introState === 2) {
        const mobileMessage = `${userName}, Please scroll down to explore state of the art neural network architectures.`;
        handleIntroSpeech(mobileMessage);
      } else if (introState >= 2 && mobileVisibility && iteration >= 2) {
        const welcomeMessage = `Welcome back, ${userName}. Shall we continue our exploration?`;
        handleIntroSpeech(welcomeMessage);
      }
    }
  }, [introState, stage, mobileVisibility, iteration]);

  return { visemeMessage, conversationHistory };
}
