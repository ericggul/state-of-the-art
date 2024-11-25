"use client";

import { memo, useRef, useState, useEffect } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import { VIDEOS } from "../utils/constants";

const AUDIO_URL = "/audio/idle/idle1126.wav";

const Idle = memo(function Idle() {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);
  const isVisible = useVideoFade(videoRef);

  // Initialize audio context only once
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

        // If context is already running, try to play
        if (context.state === "running" && audioRef.current) {
          audioRef.current.currentTime = videoRef.current?.currentTime || 0;
          await audioRef.current.play();
          setIsAudioPermitted(true);
        }
      } catch (error) {
        console.error("Audio setup failed:", error);
      }
    };

    setupAudio();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleScreenClick = async () => {
    if (!isAudioPermitted && audioRef.current && videoRef.current) {
      try {
        // Ensure audio context is resumed
        if (audioContextRef.current) {
          await audioContextRef.current.resume();
        }

        // Sync and play audio
        audioRef.current.currentTime = videoRef.current.currentTime;
        await audioRef.current.play();
        setIsAudioPermitted(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        // Reset audio context if failed
        audioContextRef.current = null;
        setIsAudioPermitted(false);
      }
    }
  };

  // Ensure audio stays synced with video
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio && isAudioPermitted) {
      const syncAudio = () => {
        if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
          audio.currentTime = video.currentTime;
        }
      };

      video.addEventListener("timeupdate", syncAudio);
      return () => video.removeEventListener("timeupdate", syncAudio);
    }
  }, [isAudioPermitted]);

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
