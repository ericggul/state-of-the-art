"use client";

import { memo } from "react";
import { QRCodeSVG } from "qrcode.react";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";

const QR_LINK = "https://sota-xdlab.net/mobile";

const Idle = memo(function Idle() {
  const [windowWidth, windowHeight] = useResize();

  return (
    <S.Container>
      <S.QRCodeWrapper>
        <QRCodeSVG
          value={QR_LINK}
          size={windowWidth * 0.2} // Customize size
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
