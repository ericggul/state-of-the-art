// index.js
"use client";

import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";
import ModelEl from "../models";
import { Leva } from "leva";

// Main component to render the neural network
export default function ProductPreview({ enableDeviceControls = true }) {
  return (
    <S.Container>
      <ModelEl enableDeviceControls={enableDeviceControls} />
      <Leva />
    </S.Container>
  );
}
