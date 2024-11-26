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
    console.log("Starting fade out");
    if (!audioRef.current) return;

    const startVolume = audioRef.current.volume;
    const stepTime = FADE_DURATION / FADE_STEPS;
    const volumeStep = startVolume / FADE_STEPS;

    console.log("Fade parameters:", { startVolume, stepTime, volumeStep });
    clearAudioTimers(fadeIntervalRef, timeoutRef);

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return;

      if (audioRef.current.volume > volumeStep) {
        const newVolume = Math.max(0, audioRef.current.volume - volumeStep);
        console.log("Fading volume:", {
          from: audioRef.current.volume,
          to: newVolume,
          step: volumeStep,
        });
        audioRef.current.volume = newVolume;
      } else {
        console.log("Fade complete, starting pause delay");
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;

        timeoutRef.current = setTimeout(() => {
          console.log("Pause delay complete, stopping audio");
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

function Intro() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const prevStateRef = useRef(introState);
  const isInitializedRef = useRef(false);

  const startFadeOut = useAudioFade(audioRef, fadeIntervalRef, timeoutRef);

  useEffect(() => {
    console.log("Initial setup effect:", {
      introState,
      isInitialized: isInitializedRef.current,
      hasAudio: !!audioRef.current,
    });

    if (audioRef.current) {
      if (introState >= THRESHOLD_STATE) {
        console.log("Initial setup - immediately stopping audio");
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0;
      } else if (!isInitializedRef.current) {
        console.log("Initial setup - starting audio");
        audioRef.current.volume = 1;
        audioRef.current.play();
      }
      isInitializedRef.current = true;
    }
  }, [introState]);

  useEffect(() => {
    console.log("State change effect:", {
      introState,
      prevState: prevStateRef.current,
      isProjector,
      hasAudio: !!audioRef.current,
      audioVolume: audioRef.current?.volume,
      isPlaying: !audioRef.current?.paused,
    });

    if (!audioRef.current || !isProjector) return;

    const wasBeforeThreshold = prevStateRef.current < THRESHOLD_STATE;
    const isAfterThreshold = introState >= THRESHOLD_STATE;
    const needsFadeOut = wasBeforeThreshold && isAfterThreshold;

    if (wasBeforeThreshold) {
      prevStateRef.current = introState;
    }

    console.log("State transition:", {
      wasBeforeThreshold,
      isAfterThreshold,
      needsFadeOut,
      introState,
    });

    if (wasBeforeThreshold !== !isAfterThreshold) {
      clearAudioTimers(fadeIntervalRef, timeoutRef);

      if (needsFadeOut) {
        startFadeOut();
      } else if (!isAfterThreshold) {
        console.log("Starting playback");
        audioRef.current.volume = 1;
        audioRef.current.play();
      }
    }

    return () => {
      console.log("Cleanup effect:", {
        hasFadeInterval: !!fadeIntervalRef.current,
        hasTimeout: !!timeoutRef.current,
        isAfterThreshold,
      });
      clearAudioTimers(fadeIntervalRef, timeoutRef);
      if (isAfterThreshold && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [introState, isProjector, startFadeOut]);

  return (
    <>
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
      {isProjector && (
        <audio
          ref={audioRef}
          src={SOUND_URL}
          autoPlay={introState < THRESHOLD_STATE}
          loop
          onPlay={() => console.log("Audio started playing")}
          onPause={() => console.log("Audio paused")}
          onVolumeChange={() =>
            console.log("Volume changed:", audioRef.current?.volume)
          }
        />
      )}
    </>
  );
}

export default memo(Intro);
