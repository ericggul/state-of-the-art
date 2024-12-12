import useScreenStore from "@/components/screen/store";
import { useAudio } from "@/utils/hooks/audio/useAudio";
import { useRef, useEffect, useState } from "react";

const SOUND_URL = "/audio/main/main1209.wav";
const INTRO_SOUND_URL = "/audio/main/maininit1209.wav";
const DELAY_MS = 2100;
const THRESHOLD_STATE = 3;

export default function Audio() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const isTransition = useScreenStore((state) => state.isTransition);
  const [delayedPlaying, setDelayedPlaying] = useState(false);

  // Handle the 2s delay for main audio
  useEffect(() => {
    const shouldPlay = introState >= THRESHOLD_STATE && !isTransition;
    if (shouldPlay) {
      const timer = setTimeout(() => {
        setDelayedPlaying(true);
      }, DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setDelayedPlaying(false);
    }
  }, [introState, isTransition]);

  const { audioRef } = useAudio({ isPlaying: delayedPlaying, isProjector });
  const audioRefIntro = useRef(null);

  // Play intro sound immediately when threshold is reached
  useEffect(() => {
    if (introState >= THRESHOLD_STATE) {
      audioRefIntro.current.play();
    }
  }, [introState]);

  // Handle pausing when transition occurs
  useEffect(() => {
    if (isTransition && audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {
        console.log(e);
      }
    }
  }, [isTransition]);

  return (
    <>
      <audio ref={audioRef} src={SOUND_URL} loop />
      <audio ref={audioRefIntro} src={INTRO_SOUND_URL} />
    </>
  );
}
