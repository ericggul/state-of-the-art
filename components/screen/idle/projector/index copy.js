"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import { VIDEOS } from "../utils/constants";

const AUDIO_URL = "/audio/idle/idle1126.wav";
const FADE_DURATION = 3000;
const AUDIO_FADE_STEPS = 30;

const Idle = memo(function Idle() {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const initialSyncDoneRef = useRef(false);
  const fadeIntervalRef = useRef(null);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);
  const isVisible = useVideoFade(videoRef);

  // Add fade utility without changing existing functionality
  const fadeAudio = useCallback((from, to, duration = FADE_DURATION) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const steps = AUDIO_FADE_STEPS;
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
  }, []);

  // Preserve existing click-to-play with added fade in
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
        fadeAudio(0, 1);
        setIsAudioPermitted(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsAudioPermitted(false);
      }
    }
  };

  // Keep existing sync logic
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

    return () => {
      video.removeEventListener("timeupdate", handleInitialSync);
      if (audio && !video.isConnected) {
        fadeAudio(audio.volume, 0, 1000);
      }
    };
  }, [isAudioPermitted]);

  // Add loop transition fades
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioPermitted) return;

    const handleAudioEnd = () => {
      fadeAudio(1, 0);
      setTimeout(() => fadeAudio(0, 1), FADE_DURATION);
    };

    audio.addEventListener("ended", handleAudioEnd);
    return () => audio.removeEventListener("ended", handleAudioEnd);
  }, [isAudioPermitted, fadeAudio]);

  // Add cleanup for fade intervals
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
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
