"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";

export default function Brain() {
  return (
    <S.Container>
      <Canvas></Canvas>
    </S.Container>
  );
}
