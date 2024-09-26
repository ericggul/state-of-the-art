// index.js
"use client";

import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";
import ThreeEl from "./3d";

// Main component to render the neural network
export default function ProductPreview({ enableDeviceControls = true }) {
  return (
    <S.Container>
      <ThreeEl enableDeviceControls={enableDeviceControls} />
    </S.Container>
  );
}
