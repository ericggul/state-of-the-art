import { useEffect, useRef } from "react";

const FADE_DURATION = 1000;
const PAUSE_DELAY = 500;
const FADE_STEPS = 20;

const clearAudioTimers = (fadeIntervalRef, timeoutRef) => {
  if (fadeIntervalRef.current) {
    clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = null;
  }
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};

export const useAudio = ({ isPlaying, isProjector }) => {
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  const startFadeOut = () => {
    if (!audioRef.current) return;

    const startVolume = audioRef.current.volume;
    const stepTime = FADE_DURATION / FADE_STEPS;
    const volumeStep = startVolume / FADE_STEPS;

    clearAudioTimers(fadeIntervalRef, timeoutRef);

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return;

      if (audioRef.current.volume > volumeStep) {
        const newVolume = Math.max(0, audioRef.current.volume - volumeStep);
        audioRef.current.volume = newVolume;
      } else {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;

        timeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }, PAUSE_DELAY);
      }
    }, stepTime);
  };

  useEffect(() => {
    if (audioRef.current && !isInitializedRef.current) {
      if (!isPlaying) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 1;
        audioRef.current.play();
      }
      isInitializedRef.current = true;
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current || !isProjector) return;

    if (!isPlaying) {
      startFadeOut();
    } else {
      audioRef.current.volume = 1;
      audioRef.current.play();
    }

    return () => {
      clearAudioTimers(fadeIntervalRef, timeoutRef);
    };
  }, [isPlaying, isProjector]);

  return {
    audioRef,
    SOUND_URL: "/audio/intro/intro1126.wav",
  };
};
