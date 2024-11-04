import { useState, useEffect, useRef } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

export default function useViseme() {
  const { latestSpeech, currentArchitectures } = useScreenStore();

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

  const debouncedSpeech = useDebounce(latestSpeech, 1000);

  // Handle audio end and trigger next speech
  const handleAudioEnd = async () => {
    console.log("audio end");
    isPlayingRef.current = false;

    // Add random delay between 2-3 seconds
    const delay = Math.random() * 2000 + 5000; // Random between 2000-3000ms

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (pendingTTSRef.current) {
      const message = pendingTTSRef.current;
      pendingTTSRef.current = null;
      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
      isPlayingRef.current = true;

      message.audioPlayer.currentTime = 0;
      message.audioPlayer.volume = 1;
      console.log("audio start");
      message.audioPlayer.play();

      generateNextSpeech();
    } else {
      await generateNextSpeech();
    }
  };

  // Generate next speech using Langchain Avatar
  const generateNextSpeech = async () => {
    if (nextSpeechGenerationRef.current) {
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

      // Start fresh with the new topic
      setConversationHistory([{ content: debouncedSpeech }]);
      getViseme({ text: debouncedSpeech });
    }
  }, [debouncedSpeech]);

  // Modified getViseme to start next generation earlier
  async function getViseme({ text, preGeneratedTTS = null }) {
    try {
      let message;
      if (preGeneratedTTS) {
        message = preGeneratedTTS;
      } else {
        const audioRes = await axios.post(
          "/api/azure-tts",
          { text },
          { responseType: "blob" }
        );

        const audio = audioRes.data;
        const visemes = JSON.parse(audioRes.headers.visemes);
        const audioUrl = URL.createObjectURL(audio);
        const audioPlayer = new Audio(audioUrl);
        audioPlayer.addEventListener("ended", handleAudioEnd);

        message = { visemes, audioPlayer };
      }

      if (previousAudioRef.current) {
        fadeOutAudio(previousAudioRef.current);
      }

      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
      isPlayingRef.current = true;

      message.audioPlayer.currentTime = 0;
      message.audioPlayer.volume = 1;
      message.audioPlayer.play();

      generateNextSpeech();
    } catch (e) {
      console.error("❌ TTS Error:", e.message);
      isPlayingRef.current = false;
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousAudioRef.current) {
        previousAudioRef.current.removeEventListener("ended", handleAudioEnd);
        previousAudioRef.current.pause();
        if (previousAudioRef.current.src) {
          URL.revokeObjectURL(previousAudioRef.current.src);
        }
      }
    };
  }, []);

  return { visemeMessage, conversationHistory };
}
