"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Backend = dynamic(() => import("@/foundations/backend"));

import * as S from "./styles";

export default function ScreenBackend({ showBackend = true }) {
  return (
    <S.Container $glitchEffect={false}>
      <Backend />
    </S.Container>
  );
}
