"use client";

import { memo, useRef, useState, useCallback, useEffect } from "react";
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
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const videoRef = useRef(null);
  const [oscillatingOpacity, setOscillatingOpacity] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isVisible = useVideoFade(videoRef);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      console.log("🎬 Initial video setup", {
        src: video.src,
        readyState: video.readyState,
        networkState: video.networkState,
      });

      if (video.readyState < 3) {
        video.load();
      }

      const playVideo = async () => {
        try {
          await video.play();
          console.log("✅ Video playing successfully");
        } catch (error) {
          console.error("❌ Video playback failed:", {
            error,
            src: video.src,
            readyState: video.readyState,
          });
          if (error.name === "AbortError" && video.readyState >= 3) {
            console.log("🔄 Retrying video playback");
            video.play().catch((e) => console.error("❌ Retry failed:", e));
          }
        }
      };

      playVideo();
    }
  }, [intDeviceIdx]);

  useEffect(() => {
    console.log("🎨 Render state:", {
      isVisible,
      isInitialLoad,
      oscillatingOpacity,
    });
  }, [isVisible, isInitialLoad, oscillatingOpacity]);

  useEffect(() => {
    console.log("🎨 Opacity state:", {
      isVisible,
      oscillatingOpacity,
      isInitialLoad,
      finalOpacity: isVisible
        ? typeof oscillatingOpacity === "number"
          ? oscillatingOpacity
          : 1
        : 0,
    });
  }, [isVisible, oscillatingOpacity, isInitialLoad]);

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
          value={IDLE_QR_LINK}
          size={windowWidth * 0.15}
          fgColor="white"
          bgColor="transparent"
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
