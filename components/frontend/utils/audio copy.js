import useScreenStore from "@/components/screen/store";
import { useAudio } from "@/utils/hooks/audio/useAudio";
import { useRef, useEffect } from "react";
const SOUND_URL = "/audio/main/main1208.wav";
const INTRO_SOUND_URL = "/audio/main/maininit1208.wav";

const THRESHOLD_STATE = 3;

export default function Audio() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const isPlaying = introState >= THRESHOLD_STATE;

  const { audioRef } = useAudio({ isPlaying, isProjector });
  const audioRefIntro = useRef(null);

  useEffect(() => {
    if (introState >= THRESHOLD_STATE) {
      audioRefIntro.current.play();
    }
  }, [introState]);

  return (
    <>
      <audio ref={audioRef} src={SOUND_URL} loop />
      <audio ref={audioRefIntro} src={INTRO_SOUND_URL} />
    </>
  );
}
