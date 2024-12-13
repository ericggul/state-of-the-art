"use client";

import { memo, useRef, useState, useCallback, useEffect, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import { useTypewriter } from "../utils/useTypewriter";
import { VIDEOS } from "../utils/constants";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

import {
  IDLE_TEXTS,
  IDLE_QR_LINK,
  IDLE_MIN_INTERVAL,
  IDLE_MAX_INTERVAL,
} from "@/utils/constant";

const Idle = memo(function Idle() {
  const [windowWidth] = useResize();
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const sessionId = useScreenStore((state) => state.sessionId || "");
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const videoRef = useRef(null);
  const [oscillatingOpacity, setOscillatingOpacity] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isVisible = useVideoFade(videoRef);

  const qrLinkWithSessionId = useMemo(() => {
    return `${IDLE_QR_LINK}?sessionId=${sessionId}`;
  }, [sessionId]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.readyState < 3) {
        video.load();
      }

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          if (error.name === "AbortError" && video.readyState >= 3) {
            video.play().catch((e) => console.error("Retry failed:", e));
          }
        }
      };

      playVideo();
    }
  }, [intDeviceIdx]);

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
    isInitialLoad ? null : IDLE_MIN_INTERVAL,
    isInitialLoad ? null : IDLE_MAX_INTERVAL
  );

  const targetText = IDLE_TEXTS[intDeviceIdx % IDLE_TEXTS.length];

  const { text: displayText, isVisible: isTextVisible } = useTypewriter(
    targetText,
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
          preload="auto"
        />
      </S.Background>
      <S.QRCodeWrapper>
        <QRCodeSVG
          value={qrLinkWithSessionId}
          size={windowWidth * 0.15}
          fgColor="white"
          bgColor="transparent"
          // key={qrLinkWithSessionId}
        />
        <S.AnimatedText
          $oscillatingOpacity={oscillatingOpacity}
          $isInitialFade={isInitialLoad}
          $isVisible={isTextVisible}
        >
          {displayText}
        </S.AnimatedText>
      </S.QRCodeWrapper>
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
