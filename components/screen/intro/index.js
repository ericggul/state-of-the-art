import * as S from "./styles";
import { memo, useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";

const SOUND_URL = "/audio/intro/intro1126.wav";
const FADE_DURATION = 1000;
const PAUSE_DELAY = 500;
const FADE_STEPS = 20;
const THRESHOLD_STATE = 2;

const useAudioFade = (audioRef, fadeIntervalRef, timeoutRef) => {
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

  return startFadeOut;
};

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

const Intro0 = memo(function Intro0() {
  const userName = useScreenStore((state) => state.userName);
  return <S.Container>Welcome {userName}</S.Container>;
});

const Intro1 = memo(function Intro1() {
  return <S.Container>Please activate your accelerometer</S.Container>;
});

const Intro2 = memo(function Intro2() {
  return <S.Container>Scroll down on your phone</S.Container>;
});

const TurnPhone = memo(function TurnPhone() {
  return <S.Container>Please turn your phone back on</S.Container>;
});

function Intro() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const prevStateRef = useRef(introState);
  const isInitializedRef = useRef(false);

  const startFadeOut = useAudioFade(audioRef, fadeIntervalRef, timeoutRef);

  useEffect(() => {
    if (audioRef.current && !isInitializedRef.current) {
      if (introState >= THRESHOLD_STATE) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
      } else {
        audioRef.current.volume = 1;
        audioRef.current.play();
      }
      isInitializedRef.current = true;
    }
  }, [introState]);

  useEffect(() => {
    if (!audioRef.current || !isProjector) return;

    // Simple logic: fade out if we reach or exceed threshold
    if (introState >= THRESHOLD_STATE) {
      startFadeOut();
    } else {
      audioRef.current.volume = 1;
      audioRef.current.play();
    }

    return () => {
      clearAudioTimers(fadeIntervalRef, timeoutRef);
    };
  }, [introState, isProjector, startFadeOut]);

  return (
    <S.Wrapper
      style={{
        opacity: introState >= 3 ? 0 : 1,
        background: introState >= 2 ? "transparent" : "black",
      }}
    >
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
      {!mobileVisibility && introState <= 2 && <TurnPhone />}
      {isProjector && (
        <audio ref={audioRef} src={SOUND_URL} autoPlay={false} loop />
      )}
    </S.Wrapper>
  );
}

export default memo(Intro);
