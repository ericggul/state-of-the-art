import { useRef, useCallback } from "react";

const FADE_DURATION = 3000;
const FADE_STEPS = 30;
const PAUSE_DELAY = 500;

export const useAudioFade = () => {
  const fadeIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const currentStepRef = useRef(0);

  const cleanup = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fadeAudio = useCallback(
    (audio, from, to, duration = FADE_DURATION) => {
      if (!audio) return;

      cleanup();

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
          fadeIntervalRef.current = null;

          if (to === 0) {
            timeoutRef.current = setTimeout(() => {
              if (audio) {
                audio.pause();
                audio.currentTime = 0;
              }
            }, PAUSE_DELAY);
          }
        }
      }, stepDuration);

      return fadeIntervalRef.current;
    },
    [cleanup]
  );

  return { fadeAudio, cleanup };
};
