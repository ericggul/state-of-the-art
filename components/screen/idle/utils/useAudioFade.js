import { useRef, useCallback } from "react";

const FADE_DURATION = 3000;
const FADE_STEPS = 30;

export const useAudioFade = () => {
  const fadeIntervalRef = useRef(null);

  const fadeAudio = useCallback((audio, from, to, duration = FADE_DURATION) => {
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = FADE_STEPS;
    const stepValue = (to - from) / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    audio.volume = from;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        audio.volume = from + stepValue * currentStep;
      } else {
        clearInterval(fadeIntervalRef.current);
        audio.volume = to;
      }
    }, stepDuration);

    return fadeIntervalRef.current;
  }, []);

  const cleanup = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
  }, []);

  return { fadeAudio, cleanup };
};
