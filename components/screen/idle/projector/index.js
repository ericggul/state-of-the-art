"use client";

import { memo, useRef, useState, useEffect } from "react";
import * as S from "./styles";

import useScreenStore from "@/components/screen/store";

const VIDEOS = ["01_close", "01_far", "02_close", "02_far"];
const AUDIO_URL = "/audio/idle/idle1126.wav";
const FADE_DURATION = 3; // 3 seconds for fade

const Idle = memo(function Idle() {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;

      // Toggle visibility near the end of each loop
      if (timeLeft <= FADE_DURATION) {
        setIsVisible(false);
      } else if (timeLeft > FADE_DURATION) {
        setIsVisible(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    if (audioContext.state === "running") {
      setIsAudioPermitted(true);
    }
  }, []);

  const handleScreenClick = () => {
    if (!isAudioPermitted && audioRef.current && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      audioRef.current.currentTime = currentTime;

      audioRef.current
        .play()
        .then(() => {
          setIsAudioPermitted(true);
        })
        .catch((error) => {
          console.error("Audio playback failed:", error);
        });
    }
  };

  return (
    <S.Container onClick={handleScreenClick}>
      <S.Video
        ref={videoRef}
        src={`/videos/${VIDEOS[intDeviceIdx % VIDEOS.length]}.mp4`}
        autoPlay
        loop
        muted
        playsInline
        $isVisible={isVisible}
      />
      <audio ref={audioRef} src={AUDIO_URL} loop autoPlay={isAudioPermitted} />
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
