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
  const initialSyncDoneRef = useRef(false);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);
  const isVisible = useVideoFade(videoRef);

  // Only handle click-to-play
  const handleScreenClick = async () => {
    if (!isAudioPermitted && audioRef.current && videoRef.current) {
      try {
        // Create AudioContext only on user interaction
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        await audioContext.resume();

        // Initial sync and play
        audioRef.current.currentTime = videoRef.current.currentTime;
        await audioRef.current.play();
        setIsAudioPermitted(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsAudioPermitted(false);
      }
    }
  };

  // Only sync audio with video on initial play
  useEffect(() => {
    if (!isAudioPermitted || initialSyncDoneRef.current) return;

    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    const handleInitialSync = () => {
      if (!initialSyncDoneRef.current) {
        audio.currentTime = video.currentTime;
        initialSyncDoneRef.current = true;
        // Remove listener after initial sync
        video.removeEventListener("timeupdate", handleInitialSync);
      }
    };

    video.addEventListener("timeupdate", handleInitialSync);

    return () => {
      video.removeEventListener("timeupdate", handleInitialSync);
      // Only pause audio if component is unmounting
      if (audio && !video.isConnected) {
        audio.pause();
      }
    };
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
