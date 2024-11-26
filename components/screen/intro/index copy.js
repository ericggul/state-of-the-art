import * as S from "./styles";
import { memo, useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";

const SOUND_URL = "/audio/intro/intro1126.wav";

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
  const prevStateRef = useRef(introState);
  const isInitializedRef = useRef(false);

  // Initial setup effect
  useEffect(() => {
    console.log("Initial setup - introState:", introState);
    console.log("Initial setup - isInitialized:", isInitializedRef.current);
    console.log("Initial setup - hasAudio:", !!audioRef.current);

    if (audioRef.current && !isInitializedRef.current) {
      if (introState >= 2) {
        console.log("Initial setup - stopping audio");
        audioRef.current.volume = 0;
        audioRef.current.pause();
      } else {
        console.log("Initial setup - starting audio");
        audioRef.current.volume = 1;
        audioRef.current.play();
      }
      isInitializedRef.current = true;
    }
  }, [introState]);

  // Main effect for handling state changes
  useEffect(() => {
    console.log("Effect triggered:", {
      introState,
      prevState: prevStateRef.current,
      isProjector,
      hasAudio: !!audioRef.current,
      audioVolume: audioRef.current?.volume,
      isPlaying: !audioRef.current?.paused,
      hasFadeInterval: !!fadeIntervalRef.current,
    });

    if (!audioRef.current || !isProjector) {
      console.log("Early return: missing audio or not projector");
      return;
    }

    const wasBeforeThreshold = prevStateRef.current < 2;
    const isAfterThreshold = introState >= 2;
    const needsFadeOut = wasBeforeThreshold && isAfterThreshold;
    prevStateRef.current = introState;

    console.log("State transition:", {
      wasBeforeThreshold,
      isAfterThreshold,
      needsFadeOut,
      introState,
    });

    if (wasBeforeThreshold !== !isAfterThreshold) {
      if (fadeIntervalRef.current) {
        console.log("Clearing existing fade interval");
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      if (needsFadeOut) {
        console.log("Starting fade out");
        const fadeOutDuration = 1000;
        const startVolume = audioRef.current.volume;
        const steps = 20;
        const stepTime = fadeOutDuration / steps;
        const volumeStep = startVolume / steps;

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
            console.log("Fade complete, stopping audio");
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }, stepTime);
      } else if (!isAfterThreshold) {
        console.log("Starting playback");
        audioRef.current.volume = 1;
        audioRef.current.play();
      }
    }

    return () => {
      console.log("Cleanup effect:", {
        hasFadeInterval: !!fadeIntervalRef.current,
        hasAudio: !!audioRef.current,
      });
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      if (isAfterThreshold && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [introState, isProjector]);

  return (
    <>
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
      {isProjector && (
        <audio
          ref={audioRef}
          src={SOUND_URL}
          autoPlay={introState < 2}
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
