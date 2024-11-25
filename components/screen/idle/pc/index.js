"use client";

import { memo, useRef, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import { useTypewriter } from "../utils/useTypewriter";
import { VIDEOS } from "../utils/constants";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const QR_LINK = "https://sota-xdlab.net/mobile";
const MIN_INTERVAL = 10 * 1000;
const MAX_INTERVAL = 25 * 1000;
const TEXT = "Scan the QR Code to experience the state-of-the-art.";

const Idle = memo(function Idle() {
  const [windowWidth] = useResize();
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const videoRef = useRef(null);
  const [oscillatingOpacity, setOscillatingOpacity] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isVisible = useVideoFade(videoRef);

  const handleOscillation = useCallback(() => {
    if (!isInitialLoad) {
      setOscillatingOpacity((prev) => (prev === 1 ? 0 : 1));
    }
  }, [isInitialLoad]);

  const handleTransitionEnd = useCallback(() => {
    setIsInitialLoad(false);
  }, []);

  useRandomInterval(
    handleOscillation,
    isInitialLoad ? null : MIN_INTERVAL,
    isInitialLoad ? null : MAX_INTERVAL
  );

  const displayText = useTypewriter(
    TEXT,
    oscillatingOpacity === 0 && !isInitialLoad
  );

  return (
    <S.Container>
      <S.Background
        $isVisible={isVisible}
        $oscillatingOpacity={oscillatingOpacity}
        $isInitialFade={isInitialLoad}
        onTransitionEnd={handleTransitionEnd}
      >
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
        <S.AnimatedText
          $oscillatingOpacity={oscillatingOpacity}
          $isInitialFade={isInitialLoad}
        >
          {displayText}
        </S.AnimatedText>
      </S.QRCodeWrapper>
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
