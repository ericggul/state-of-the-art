"use client";

import { memo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";
import useScreenStore from "@/components/screen/store";
import { useVideoFade } from "../utils/useVideoFade";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import { VIDEOS } from "../utils/constants";

const QR_LINK = "https://sota-xdlab.net/mobile";
const MIN_INTERVAL = 10000; // 10s
const MAX_INTERVAL = 15000; // 15s

const Idle = memo(function Idle() {
  const [windowWidth] = useResize();
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);
  const videoRef = useRef(null);
  const [oscillatingOpacity, setOscillatingOpacity] = useState(1);
  const isVisible = useVideoFade(videoRef);

  useRandomInterval(
    () => setOscillatingOpacity((prev) => (prev === 1 ? 0 : 1)),
    MIN_INTERVAL,
    MAX_INTERVAL
  );

  return (
    <S.Container>
      <S.Background
        $isVisible={isVisible}
        $oscillatingOpacity={oscillatingOpacity}
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
        <p>Scan the QR Code to start the experience</p>
      </S.QRCodeWrapper>
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
