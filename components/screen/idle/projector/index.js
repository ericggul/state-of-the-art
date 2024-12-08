"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import { useAudioFade } from "../utils/useAudioFade";
import { VIDEOS } from "../utils/constants";

const AUDIO_URL = "/audio/idle/idle1208.wav";
const FADE_OUT_THRESHOLD = 3;
const FADE_OUT_DURATION = 2500;

const Idle = memo(function Idle({ $isFrontend, isUnmounting }) {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const initialSyncDoneRef = useRef(false);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isVisible = useVideoFade(videoRef);
  const { fadeAudio, cleanup: cleanupFade } = useAudioFade();

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const timeLeft = audio.duration - audio.currentTime;
    if (timeLeft <= FADE_OUT_THRESHOLD) {
      fadeAudio(audio, audio.volume, 0);
    } else if (timeLeft > FADE_OUT_THRESHOLD && audio.volume === 0) {
      fadeAudio(audio, 0, 1);
    }
  }, [fadeAudio]);

  const handleInitialSync = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!initialSyncDoneRef.current && video && audio) {
      audio.currentTime = video.currentTime;
      initialSyncDoneRef.current = true;
      video.removeEventListener("timeupdate", handleInitialSync);
    }
  }, []);

  const handleScreenClick = useCallback(async () => {
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
  }, [isAudioPermitted, fadeAudio]);

  const handleTransitionEnd = useCallback(() => {
    setIsInitialLoad(false);
  }, []);

  // Add audio loop handler
  const handleAudioLoop = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video && audio) {
      // Reset video time to match audio
      video.currentTime = audio.currentTime;
    }
  }, []);

  // Initial audio setup
  useEffect(() => {
    const setupAudio = async () => {
      try {
        const context = initAudioContext();
        const audio = audioRef.current;

        if (context.state === "running" && audio) {
          audio.volume = 0;
          audio.currentTime = videoRef.current?.currentTime || 0;
          await audio.play();
          fadeAudio(audio, 0, 1);
          setIsAudioPermitted(true);
        }
      } catch (error) {
        console.error("Audio setup failed:", error);
      }
    };

    setupAudio();
    return cleanupFade;
  }, [initAudioContext, fadeAudio, cleanupFade]);

  // Modify audio time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioPermitted) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loop", handleAudioLoop);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loop", handleAudioLoop);
    };
  }, [isAudioPermitted, handleTimeUpdate, handleAudioLoop]);

  // Initial sync effect
  useEffect(() => {
    if (!isAudioPermitted || initialSyncDoneRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", handleInitialSync);
    return () => video.removeEventListener("timeupdate", handleInitialSync);
  }, [isAudioPermitted, handleInitialSync]);

  // Add effect to handle unmounting
  useEffect(() => {
    if (isUnmounting && audioRef.current) {
      fadeAudio(
        audioRef.current,
        audioRef.current.volume,
        0,
        FADE_OUT_DURATION
      );
    }
  }, [isUnmounting, fadeAudio]);

  // Modify cleanup effect to avoid double fade
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio && !isUnmounting) {
        fadeAudio(audio, audio.volume, 0, FADE_OUT_DURATION);
      }
    };
  }, [fadeAudio, isUnmounting]);

  return (
    <S.Container onClick={handleScreenClick}>
      <S.VideoWrapper
        $isVisible={isVisible}
        $isInitialFade={isInitialLoad}
        onTransitionEnd={handleTransitionEnd}
      >
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
