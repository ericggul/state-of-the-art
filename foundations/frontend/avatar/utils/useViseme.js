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

  const debouncedSpeech = useDebounce(latestSpeech, 1000);

  // Handle audio end and trigger next speech
  const handleAudioEnd = async () => {
    isPlayingRef.current = false;
    if (nextSpeech) {
      const speech = nextSpeech;
      setNextSpeech(null);
      await getViseme({ text: speech });
    } else {
      generateNextSpeech();
    }
  };

  console.log(conversationHistory);
  // Generate next speech using GPT-4
  const generateNextSpeech = async () => {
    if (isPlayingRef.current || nextSpeech) return;

    try {
      const targetModel = currentArchitectures[0]?.name || "";

      // Send the entire conversation history to the API
      const response = await axios.post("/api/openai/gpt-4o-avatar", {
        text:
          conversationHistory[conversationHistory.length - 1]?.content || "",
        conversationHistory: conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        targetModel,
        params: {
          temperature: 0.7,
        },
      });

      if (!response.data?.message?.content) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const newSpeech = response.data.message.content;

      // Update conversation history with the new response
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: newSpeech },
      ]);

      // Either play the speech now or queue it
      if (!isPlayingRef.current) {
        await getViseme({ text: newSpeech });
      } else {
        setNextSpeech(newSpeech);
      }
    } catch (error) {
      console.error("Failed to generate next speech:", error);
      isPlayingRef.current = false;
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

      // Append new user message instead of resetting conversation
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: debouncedSpeech },
      ]);

      getViseme({ text: debouncedSpeech });
    }
  }, [debouncedSpeech]);

  async function getViseme({ text }) {
    try {
      isPlayingRef.current = true;
      const audioRes = await axios.post(
        "/api/azure-tts",
        { text },
        { responseType: "blob" }
      );

      if (previousAudioRef.current) {
        fadeOutAudio(previousAudioRef.current);
      }

      const audio = audioRes.data;
      const visemes = JSON.parse(audioRes.headers.visemes);
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      if (previousAudioRef.current?.src) {
        URL.revokeObjectURL(previousAudioRef.current.src);
      }

      audioPlayer.addEventListener("ended", handleAudioEnd);

      let message = {
        visemes,
        audioPlayer,
      };

      setTimeout(() => {
        message.audioPlayer.currentTime = 0;
        message.audioPlayer.volume = 1;
        message.audioPlayer.play();
      }, 1000);

      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
    } catch (e) {
      console.error("TTS Error:", e.message);
      isPlayingRef.current = false;
    }
  }

  // Prepare next speech while current is playing
  useEffect(() => {
    if (isPlayingRef.current && !nextSpeech && !debouncedSpeech) {
      generateNextSpeech();
    }
  }, [isPlayingRef.current, nextSpeech, debouncedSpeech]);

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
