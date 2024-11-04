import { useState, useEffect, useRef } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

export default function useViseme() {
  const { latestSpeech } = useScreenStore();

  const [visemeMessage, setVisemeMessage] = useState({});
  const previousAudioRef = useRef(null);

  // 500ms 디바운스 적용
  const debouncedSpeech = useDebounce(latestSpeech, 1000);

  const fadeOutAudio = (audio, duration = 1000) => {
    const startVolume = audio.volume;
    const steps = 15; // Number of steps for smooth transition
    const volumeStep = startVolume / steps;
    const intervalTime = duration / steps;

    const fadeInterval = setInterval(() => {
      if (audio.volume > volumeStep) {
        audio.volume = Math.max(0, audio.volume - volumeStep);
      } else {
        clearInterval(fadeInterval);
        audio.pause();
        audio.volume = startVolume; // Reset volume for potential reuse
      }
    }, intervalTime);
  };

  useEffect(() => {
    if (debouncedSpeech && debouncedSpeech.length > 0) {
      getViseme({ text: debouncedSpeech });
    }
  }, [debouncedSpeech]);

  async function getViseme({ text }) {
    try {
      const audioRes = await axios.post(
        "/api/azure-tts",
        { text },
        { responseType: "blob" }
      );

      // Fade out previous audio if exists
      if (previousAudioRef.current) {
        fadeOutAudio(previousAudioRef.current);
      }

      const audio = audioRes.data;
      const visemes = JSON.parse(audioRes.headers.visemes);
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      // Clean up old audio URL when creating new one
      if (previousAudioRef.current?.src) {
        URL.revokeObjectURL(previousAudioRef.current.src);
      }

      let message = {
        visemes,
        audioPlayer,
      };

      // Play new audio after fade-out duration
      setTimeout(() => {
        message.audioPlayer.currentTime = 0;
        message.audioPlayer.volume = 1;
        message.audioPlayer.play();
      }, 1000);

      previousAudioRef.current = message.audioPlayer;
      setVisemeMessage(message);
    } catch (e) {
      console.error("TTS Error:", e.message);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
