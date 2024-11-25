import { useRef, useCallback } from "react";

const FADE_DURATION = 3000;
const FADE_STEPS = 30;

export const useAudioFade = () => {
  const fadeIntervalRef = useRef(null);
  const currentStepRef = useRef(0);

  const fadeAudio = useCallback((audio, from, to, duration = FADE_DURATION) => {
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const stepValue = (to - from) / FADE_STEPS;
    const stepDuration = duration / FADE_STEPS;
    currentStepRef.current = 0;

    audio.volume = from;

    fadeIntervalRef.current = setInterval(() => {
      currentStepRef.current++;
      if (currentStepRef.current <= FADE_STEPS) {
        audio.volume = from + stepValue * currentStepRef.current;
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
