"use client";

import { memo, useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";
import useScreenStore from "@/components/screen/store";

const QR_LINK = "https://sota-xdlab.net/mobile";
const VIDEOS = ["01_close", "01_far", "02_close", "02_far"];
const FADE_DURATION = 3;

const Idle = memo(function Idle() {
  const [windowWidth] = useResize();
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Only video fade handling for PC
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= FADE_DURATION) {
        setIsVisible(false);
      } else if (timeLeft > FADE_DURATION) {
        setIsVisible(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <S.Container>
      <S.Background $isVisible={isVisible}>
        <S.Video
          ref={videoRef}
          src={`/videos/${VIDEOS[intDeviceIdx % VIDEOS.length]}.mp4`}
          autoPlay
          loop
          muted
          playsInline
        />
      </S.Background>
      <S.QRCodeWrapper>
        <QRCodeSVG
          value={QR_LINK}
          size={windowWidth * 0.15}
          fgColor="white"
          bgColor="transparent"
        />
        <p>Scan the QR Code to start the experience</p>
      </S.QRCodeWrapper>
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
