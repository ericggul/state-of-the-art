import { useState, useEffect, useRef } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

export default function useViseme() {
  const { latestSpeech, currentArchitectures } = useScreenStore();

  const [visemeMessage, setVisemeMessage] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const [speechQueue, setSpeechQueue] = useState([]);
  const isGeneratingSpeech = useRef(false);
  const isPlayingSpeech = useRef(false);
  const previousAudioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const debouncedSpeech = useDebounce(latestSpeech, 500);

  console.log(latestSpeech);

  // Smooth fadeout function
  const fadeOutAudio = (audio, duration = 1000) => {
    return new Promise((resolve) => {
      if (!audio) {
        resolve();
        return;
      }

      // Clear any existing fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const startVolume = audio.volume;
      const steps = 15;
      const volumeStep = startVolume / steps;
      const intervalTime = duration / steps;

      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume = Math.max(0, audio.volume - volumeStep);
        } else {
          clearInterval(fadeIntervalRef.current);
          audio.pause();
          audio.volume = startVolume; // Reset volume for potential reuse
          resolve();
        }
      }, intervalTime);
    });
  };

  // Stop current speech with fadeout
  const stopCurrentSpeech = async () => {
    if (previousAudioRef.current) {
      await fadeOutAudio(previousAudioRef.current);
      if (previousAudioRef.current.src) {
        URL.revokeObjectURL(previousAudioRef.current.src);
      }
      previousAudioRef.current = null;
    }

    setSpeechQueue([]);
    isGeneratingSpeech.current = false;
    isPlayingSpeech.current = false;
  };

  useEffect(() => {
    if (debouncedSpeech && debouncedSpeech.length > 0) {
      stopCurrentSpeech().then(() => {
        setConversationHistory([]);
        processUserSpeech(debouncedSpeech);
      });
    }
  }, [debouncedSpeech]);

  const processUserSpeech = async (text) => {
    setConversationHistory([{ role: "user", content: text }]);
    await generateAssistantResponse();
  };

  const generateAssistantResponse = async () => {
    if (isGeneratingSpeech.current) return;
    isGeneratingSpeech.current = true;

    try {
      const response = await axios.post("/api/openai/gpt-4o-avatar", {
        conversationHistory,
        targetModel: currentArchitectures[0]?.name || "",
        params: {},
      });
      console.log(response.data);

      const assistantMessage = response.data.completion.message.content;
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
      await generateTTS(assistantMessage);

      isGeneratingSpeech.current = false;
      if (!isPlayingSpeech.current) {
        playNextSpeech();
      }
    } catch (error) {
      console.error("Error generating assistant response:", error);
      isGeneratingSpeech.current = false;
    }
  };

  const generateTTS = async (text) => {
    try {
      const audioRes = await axios.post(
        "/api/azure-tts",
        { text },
        { responseType: "blob" }
      );

      const audioBlob = audioRes.data;
      const visemes = JSON.parse(audioRes.headers.visemes);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = new Audio(audioUrl);

      setSpeechQueue((prev) => [
        ...prev,
        {
          visemes,
          audioPlayer,
        },
      ]);
    } catch (e) {
      console.error("TTS Error:", e.message);
    }
  };

  const playNextSpeech = async () => {
    if (speechQueue.length === 0) {
      if (!isGeneratingSpeech.current) {
        generateAssistantResponse();
      }
      return;
    }

    isPlayingSpeech.current = true;
    const message = speechQueue[0];

    // Fade out previous audio if exists
    if (previousAudioRef.current) {
      await fadeOutAudio(previousAudioRef.current);
    }

    // Set up new audio
    previousAudioRef.current = message.audioPlayer;
    setVisemeMessage({
      visemes: message.visemes,
      audioPlayer: message.audioPlayer,
    });

    // Play new audio after a short delay
    setTimeout(() => {
      if (message.audioPlayer) {
        message.audioPlayer.currentTime = 0;
        message.audioPlayer.volume = 1;
        message.audioPlayer.play();
      }
    }, 100);

    // Handle audio completion
    message.audioPlayer.onended = () => {
      if (message.audioPlayer.src) {
        URL.revokeObjectURL(message.audioPlayer.src);
      }
      setSpeechQueue((prev) => prev.slice(1));
      isPlayingSpeech.current = false;
      playNextSpeech();
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (previousAudioRef.current) {
        previousAudioRef.current.pause();
        if (previousAudioRef.current.src) {
          URL.revokeObjectURL(previousAudioRef.current.src);
        }
      }
    };
  }, []);

  return { visemeMessage };
}
