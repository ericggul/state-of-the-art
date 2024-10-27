import { useEffect, useRef, useCallback } from "react";

const audioFiles = [
  "/audio/test.wav",
  "/audio/test2.wav",
  "/audio/test3.wav",
  "/audio/test4.wav",
];

const ROBOT = "/audio/robot/test.m4a";

export default function useAudio({ isblack }) {
  const mainAudioRef = useRef(null);
  const robotAudioRef = useRef(null);

  const getRandomAudioFile = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex];
  }, []);

  useEffect(() => {
    if (isblack) {
      // Main audio (random from audioFiles)
      const newAudioFile = getRandomAudioFile();
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      mainAudioRef.current = new Audio(newAudioFile);
      mainAudioRef.current.loop = true;
      //0.5 volume
      mainAudioRef.current.volume = 0.5;
      mainAudioRef.current.load();
      mainAudioRef.current
        .play()
        .catch((error) => console.error("Main audio playback failed:", error));

      // Robot audio
      if (robotAudioRef.current) {
        robotAudioRef.current.pause();
      }
      robotAudioRef.current = new Audio(ROBOT);
      robotAudioRef.current.loop = true;
      robotAudioRef.current.load();
      robotAudioRef.current
        .play()
        .catch((error) => console.error("Robot audio playback failed:", error));
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
  }, [isblack, getRandomAudioFile]);

  return null;
}
