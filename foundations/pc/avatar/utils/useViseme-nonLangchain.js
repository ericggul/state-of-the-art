import { useState, useEffect, useRef } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

export default function useViseme() {
  const { latestSpeech, currentArchitectures } = useScreenStore();

  const [visemeMessage, setVisemeMessage] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const [nextSpeech, setNextSpeech] = useState(null);
  const previousAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  const pendingTTSRef = useRef(null);
  const nextSpeechGenerationRef = useRef(null);

  const debouncedSpeech = useDebounce(latestSpeech, 1000);

  console.log(currentArchitectures, conversationHistory);

  // Handle audio end and trigger next speech
  const handleAudioEnd = async () => {
    console.log("🔚 Audio ended, checking next steps...", {
      hasPendingTTS: !!pendingTTSRef.current,
      hasNextSpeech: !!nextSpeech,
    });

    isPlayingRef.current = false;

    // Add random delay between 2-3 seconds
    const delay = Math.random() * 1000 + 500; // Random between 2000-3000ms
    console.log(
      `⏳ Adding ${Math.round(delay)}ms pause for natural speech rhythm`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (pendingTTSRef.current) {
      console.log("✨ Found pending TTS, playing immediately");
      const message = pendingTTSRef.current;
      pendingTTSRef.current = null;
      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
      isPlayingRef.current = true;

      message.audioPlayer.currentTime = 0;
      message.audioPlayer.volume = 1;
      message.audioPlayer.play();

      // Start generating next speech immediately
      generateNextSpeech();
    } else {
      console.log("🆕 No pending content, generating new speech");
      await generateNextSpeech();
    }
  };

  // Generate next speech using GPT-4
  const generateNextSpeech = async () => {
    if (nextSpeechGenerationRef.current) {
      console.log("⚠️ Speech generation already in progress");
      return;
    }
    console.log("🎯 Starting next speech generation");
    nextSpeechGenerationRef.current = true;

    try {
      const targetModel = currentArchitectures[0]?.name || "";
      const lastSpeech =
        conversationHistory[conversationHistory.length - 1]?.content || "";

      // Generate GPT response first
      console.log("📤 Requesting GPT response for:", targetModel);
      const response = await axios.post("/api/openai/gpt-4o-avatar", {
        text: lastSpeech,
        targetModel,
        params: { temperature: 0.7 },
      });

      if (!response.data?.message?.content) {
        throw new Error("Unexpected response format");
      }

      const newSpeech = response.data.message.content;
      console.log("📥 Received new speech:", newSpeech);

      setConversationHistory((prev) => {
        const recentHistory = prev.slice(-8);
        return [...recentHistory, { content: newSpeech }];
      });

      console.log("🎵 Generating TTS for new speech");
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
      console.log("🎵 TTS generation complete, storing as pending");

      // Store in ref instead of state
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
      console.log("🎤 Starting getViseme", {
        hasPreGeneratedTTS: !!preGeneratedTTS,
      });

      let message;
      if (preGeneratedTTS) {
        message = preGeneratedTTS;
        console.log("📦 Using pre-generated TTS");
      } else {
        console.log("🔄 Generating new TTS");
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
        console.log("✅ TTS generation complete");
      }

      if (previousAudioRef.current) {
        console.log("🔉 Fading out previous audio");
        fadeOutAudio(previousAudioRef.current);
      }

      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
      isPlayingRef.current = true;

      // Start playing current speech and generate next immediately
      message.audioPlayer.currentTime = 0;
      message.audioPlayer.volume = 1;
      message.audioPlayer.play();

      // Start generating next speech right away
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
