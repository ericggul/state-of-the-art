import { useEffect, useRef, useCallback } from "react";

const audioFiles = [
  "/audio/test.wav",
  "/audio/test2.wav",
  "/audio/test3.wav",
  "/audio/test4.wav",
];

export default function useAudio({ isblack }) {
  const audioRef = useRef(null);

  const getRandomAudioFile = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex];
  }, []);

  // Load a random audio file when isblack changes to true
  useEffect(() => {
    if (isblack) {
      const newAudioFile = getRandomAudioFile();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(newAudioFile);
      audioRef.current.loop = true; // Ensure looping
      audioRef.current.load();
      audioRef.current
        .play()
        .catch((error) => console.error("Audio playback failed:", error));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    // Cleanup the audio when the effect re-runs or component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isblack, getRandomAudioFile]);

  return null;
}
