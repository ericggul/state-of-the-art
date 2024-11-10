"use client";

import { memo } from "react";
import * as S from "./styles";

const Idle = memo(function Idle() {
  return (
    <S.Container>
      <video src="/videos/test.mp4" autoPlay loop muted />
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
