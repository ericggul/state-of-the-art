// index.js
"use client";

import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";
import ModelEl from "../models";
import { Leva } from "leva";

import { TEST_MODELS } from "./constant";

// Main component to render the neural network
export default function ProductPreview({ enableDeviceControls = true }) {
  const [modelIdx, setModelIdx] = useState(0);

  return (
    <S.Container>
      <ModelEl enableDeviceControls={enableDeviceControls} />
      <Leva />
      <UI data={TEST_MODELS[modelIdx]} />
    </S.Container>
  );
}

function UI({ data }) {
  return (
    <S.UIWrapper>
      <S.TopLeft>Neural Network Architcture</S.TopLeft>
      <S.BottomLeft>
        <S.Title>{data.name.header + " "}</S.Title>
        <S.TitleRight>
          {data.name.fullName && <S.TRTop>{data.name.fullName}</S.TRTop>}
          <S.TRBottom>{`v${data.version}`}</S.TRBottom>
        </S.TitleRight>
      </S.BottomLeft>
      <S.BottomRight>
        <S.Row>{data.year}</S.Row>
        <S.Row>{data.createdFrom}</S.Row>
        <S.Row>
          {data.citation} <p>Citation</p>
        </S.Row>
        <S.Row>
          <p>{data.description}</p>
        </S.Row>
      </S.BottomRight>
    </S.UIWrapper>
  );
}
