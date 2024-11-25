"use client";

import { memo, useRef, useState, useEffect } from "react";
import * as S from "./styles";

import useScreenStore from "@/components/screen/store";

const VIDEOS = ["01_close", "01_far", "02_close", "02_far"];
const AUDIO_URL = "/audio/idle/idle1126.wav";

const Idle = memo(function Idle() {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const isProjector = useScreenStore((state) => state.isProjector || false);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isAudioPermitted, setIsAudioPermitted] = useState(false);

  useEffect(() => {
    // Check if audio context is already running
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    if (audioContext.state === "running") {
      setIsAudioPermitted(true);
    }
  }, []);

  const handleScreenClick = () => {
    if (!isAudioPermitted && audioRef.current && videoRef.current) {
      // Get current video time
      const currentTime = videoRef.current.currentTime;

      // Set audio time to match video before playing
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
      <video
        ref={videoRef}
        src={`/videos/${VIDEOS[intDeviceIdx % VIDEOS.length]}.mp4`}
        autoPlay
        loop
        muted
      />
      <audio ref={audioRef} src={AUDIO_URL} loop autoPlay={isAudioPermitted} />
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
