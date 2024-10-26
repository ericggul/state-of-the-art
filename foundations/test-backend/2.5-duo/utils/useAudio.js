import { useEffect, useRef } from "react";

export default function useAudio({ isblack }) {
  const audioRef = useRef(null);

  // Load the audio file when the component mounts
  useEffect(() => {
    audioRef.current = new Audio("/audio/test3.wav");

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

  // Play or pause the audio based on the `isblack` state
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    if (audio) {
      if (isblack) {
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
  }, [isblack]);
}
