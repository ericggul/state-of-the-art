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

// Move cache outside component and make it persistent
const videoCache = new Map();

const Idle = memo(function Idle() {
  const [windowWidth] = useResize();
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const sessionId = useScreenStore((state) => state.sessionId || "");
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const videoRef = useRef(null);
  const [oscillatingOpacity, setOscillatingOpacity] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const currentVideoIndex = intDeviceIdx % VIDEOS.length;

  const currentVideoSrc = useMemo(() => {
    return `/videos/${VIDEOS[currentVideoIndex]}.webm`;
  }, [currentVideoIndex]);

  // Fade logic unchanged
  const isVisible = useVideoFade(videoRef);

  const qrLinkWithSessionId = useMemo(() => {
    return `${IDLE_QR_LINK}?sessionId=${sessionId}`;
  }, [sessionId]);

  // Handle video loading and caching
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;

    const loadVideo = async () => {
      try {
        // If video is already playing the correct source, do nothing
        if (video.src && video.src === videoCache.get(currentVideoSrc)) {
          return;
        }

        setIsLoading(true);

        // Use existing blob URL if available
        if (videoCache.has(currentVideoSrc)) {
          video.src = videoCache.get(currentVideoSrc);
        } else {
          // Only fetch if we don't have it cached
          const response = await fetch(currentVideoSrc);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          videoCache.set(currentVideoSrc, blobUrl);
          if (isMounted) {
            video.src = blobUrl;
          }
        }

        // Wait for video to be ready
        await new Promise((resolve) => {
          video.addEventListener("canplay", resolve, { once: true });
        });

        if (isMounted) {
          await video.play();
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Video loading/playback failed:", error);
        setIsLoading(false);
      }
    };

    loadVideo();

    return () => {
      isMounted = false;
      // Don't revoke blob URLs here, keep them for reuse
    };
  }, [currentVideoSrc]);

  // Cleanup blob URLs only on unmount
  useEffect(() => {
    return () => {
      videoCache.forEach((blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
      videoCache.clear();
    };
  }, []);

  // Add effect to handle video playback based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // When text is showing (opacity is 0) or loading, pause the video
    if (oscillatingOpacity === 0 || isLoading) {
      video.pause();
    } else {
      // Only play if we have a valid source
      if (video.src) {
        video.play().catch((error) => {
          console.error("Video play failed:", error);
        });
      }
    }
  }, [oscillatingOpacity, isLoading]);

  // Modify handleOscillation to include video control
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

  console.log("Video cache size:", videoCache.size);
  console.log("Cache contents:", Array.from(videoCache.keys()));

  return (
    <S.Container>
      <S.Background
        $isVisible={isVisible && !isLoading}
        $oscillatingOpacity={oscillatingOpacity}
        $isInitialFade={isInitialLoad}
        onTransitionEnd={handleTransitionEnd}
      >
        <S.Video ref={videoRef} loop muted playsInline preload="none" />
      </S.Background>
      <S.QRCodeWrapper>
        <S.SVGWrapper>
          <QRCodeSVG
            value={qrLinkWithSessionId}
            size={windowWidth * 0.18}
            fgColor="white"
            bgColor="transparent"
          />
        </S.SVGWrapper>

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
