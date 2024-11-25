"use client";

import { memo, useRef, useState, useEffect } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import { VIDEOS } from "../utils/constants";

const AUDIO_URL = "/audio/idle/idle1126.wav";
const FADE_DURATION = 3000;
const FADE_STEPS = 30;

const Idle = memo(function Idle({ $isFrontend }) {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const initialSyncDoneRef = useRef(false);
  const fadeIntervalRef = useRef(null);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);
  const isVisible = useVideoFade(videoRef);

  const fadeAudio = (audio, from, to, duration = FADE_DURATION) => {
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
  };

  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      return audioContextRef.current;
    };

    const setupAudio = async () => {
      try {
        const context = initAudioContext();

        if (context.state === "running" && audioRef.current) {
          audioRef.current.volume = 0;
          audioRef.current.currentTime = videoRef.current?.currentTime || 0;
          await audioRef.current.play();
          fadeAudio(audioRef.current, 0, 1);
          setIsAudioPermitted(true);
        }
      } catch (error) {
        console.error("Audio setup failed:", error);
      }
    };

    setupAudio();

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const handleScreenClick = async () => {
    if (!isAudioPermitted && audioRef.current && videoRef.current) {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        await audioContext.resume();

        const audio = audioRef.current;
        audio.currentTime = videoRef.current.currentTime;
        audio.volume = 0;
        await audio.play();
        fadeAudio(audio, 0, 1);
        setIsAudioPermitted(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsAudioPermitted(false);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioPermitted) return;

    const handleTimeUpdate = () => {
      const timeLeft = audio.duration - audio.currentTime;
      if (timeLeft <= FADE_DURATION / 1000) {
        fadeAudio(audio, audio.volume, 0);
      } else if (timeLeft > FADE_DURATION / 1000 && audio.volume === 0) {
        fadeAudio(audio, 0, 1);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isAudioPermitted]);

  useEffect(() => {
    if (!isAudioPermitted || initialSyncDoneRef.current) return;

    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    const handleInitialSync = () => {
      if (!initialSyncDoneRef.current) {
        audio.currentTime = video.currentTime;
        initialSyncDoneRef.current = true;
        video.removeEventListener("timeupdate", handleInitialSync);
      }
    };

    video.addEventListener("timeupdate", handleInitialSync);
    return () => video.removeEventListener("timeupdate", handleInitialSync);
  }, [isAudioPermitted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        fadeAudio(audioRef.current, audioRef.current.volume, 0, 1000);
      }
    };
  }, []);

  return (
    <S.Container onClick={handleScreenClick}>
      <S.VideoWrapper $isVisible={isVisible}>
        <video
          ref={videoRef}
          src={`/videos/${VIDEOS[intDeviceIdx % VIDEOS.length]}.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />
      </S.VideoWrapper>
      <audio ref={audioRef} src={AUDIO_URL} loop preload="auto" />
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
