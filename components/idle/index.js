"use client";

import { useMemo } from "react";
import * as S from "./styles";

export default function Idle() {
  return (
    <S.Container>
      <video src="/videos/test.mp4" autoPlay loop muted />
    </S.Container>
  );
}
