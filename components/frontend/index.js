"use client";

import { memo } from "react";
import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import Audio from "./utils/audio";
import AudioTransition from "./utils/audioChange";

const ScreenFrontend = memo(function ScreenFrontend({
  isTesting = false,
  initVersion = null,
}) {
  return (
    <>
      <S.Container>
        <Architecture3D isTesting={isTesting} initVersion={initVersion} />
        <Audio />
        <AudioTransition />
      </S.Container>
    </>
  );
});

ScreenFrontend.displayName = "ScreenFrontend";
export default ScreenFrontend;
