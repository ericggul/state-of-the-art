import { useEffect, useRef, useCallback } from "react";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";
const audioFiles = [
  "/audio/test.wav",
  "/audio/test2.wav",
  "/audio/test3.wav",
  "/audio/test4.wav",
];

export default function useAudio() {
  const isblack = useStore((state) => state.isblack);
  const stage = useScreenStore((state) => state.stage);

  const mainAudioRef = useRef(null);
  const robotAudioRef = useRef(null);

  const getRandomAudioFile = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex];
  }, []);

  useEffect(() => {
    if (isblack && stage == "Backend") {
      // Main audio (random from audioFiles)
      const newAudioFile = getRandomAudioFile();
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      mainAudioRef.current = new Audio(newAudioFile);
      mainAudioRef.current.loop = true;

      mainAudioRef.current.load();
      mainAudioRef.current
        .play()
        .catch((error) => console.error("Main audio playback failed:", error));
    } else {
      // Pause both audio tracks when isblack is false
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      if (robotAudioRef.current) {
        robotAudioRef.current.pause();
      }
    }

    // Cleanup function
    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
      if (robotAudioRef.current) {
        robotAudioRef.current.pause();
        robotAudioRef.current = null;
      }
    };
  }, [isblack, getRandomAudioFile, stage]);

  return null;
}
