"use client";

import { useMemo } from "react";
import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import ArchitectureUI from "@/foundations/frontend/ui";

export default function ScreenFrontend({ isTesting, initVersion = null }) {
  return (
    <S.Container>
      <Architecture3D isTesting={isTesting} initVersion={initVersion} />
      <ArchitectureUI />
    </S.Container>
  );
}
