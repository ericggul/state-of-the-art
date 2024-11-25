import * as S from "./styles";
import { memo, useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";
import useMembraneSynth from "@/utils/hooks/audio/useMembraneSynth";

const SOUND_URL = "/audio/intro/intro1126.wav";

const Intro0 = memo(function Intro0() {
  const userName = useScreenStore((state) => state.userName);
  useMembraneSynth(userName);

  return <S.Container>INTRO 0 {userName}</S.Container>;
});

const Intro1 = memo(function Intro1() {
  return <S.Container>INTRO 1</S.Container>;
});

const Intro2 = memo(function Intro2() {
  return <S.Container>Scroll down on your phone</S.Container>;
});

function Intro() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !isProjector) return;

    console.log({ introState });
    if (introState >= 2) {
      // Fade out audio over 1 second
      const fadeOutDuration = 1000;
      const startVolume = audioRef.current.volume;
      const steps = 20;
      const stepTime = fadeOutDuration / steps;
      const volumeStep = startVolume / steps;

      const fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > volumeStep) {
          audioRef.current.volume = Math.max(
            0,
            audioRef.current.volume - volumeStep
          );
        } else {
          clearInterval(fadeInterval);
          if (audioRef.current) {
            audioRef.current.pause();
          }
        }
      }, stepTime);

      return () => clearInterval(fadeInterval);
    } else {
      // Reset and play audio for states 0 and 1 only if isProjector is true
      audioRef.current.volume = 1;
      if (isProjector) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [introState, isProjector]);

  return (
    <>
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
      {isProjector && (
        <audio ref={audioRef} src={SOUND_URL} autoPlay={introState < 2} loop />
      )}
    </>
  );
}

export default memo(Intro);
