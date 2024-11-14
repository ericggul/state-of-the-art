"use client";

import { memo } from "react";
import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import ArchitectureUI from "@/foundations/frontend/ui";

const ScreenFrontend = memo(function ScreenFrontend({
  isTesting,
  initVersion = null,
}) {
  return (
    <S.Container>
      <Architecture3D isTesting={isTesting} initVersion={initVersion} />
      {/* <ArchitectureUI /> */}
    </S.Container>
  );
});

ScreenFrontend.displayName = "ScreenFrontend";
export default ScreenFrontend;
