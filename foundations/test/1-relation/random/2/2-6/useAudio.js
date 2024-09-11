import { useEffect, useRef } from "react";

export default function useAudio({ isBlack }) {
  const audioRef = useRef(null);

  // Load the audio file when the component mounts
  useEffect(() => {
    audioRef.current = new Audio("/audio/test.wav");

    // Ensure audio is preloaded
    audioRef.current.load();

    // Cleanup the audio when the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play or pause the audio based on the `isBlack` state
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    if (audio) {
      if (isBlack) {
        audio.play();
      } else {
        audio.pause();
      }
    }

    // Cleanup function to pause the audio when the component unmounts
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [isBlack]);
}
