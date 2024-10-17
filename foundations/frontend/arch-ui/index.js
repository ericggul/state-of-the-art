import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";

// Main component to render the neural network
export default function ProductPreview({ model }) {
  return <UI model={model} />;
}

function UI({ model }) {
  return (
    <S.UIWrapper>
      <S.TopLeft>Neural Network Architecture</S.TopLeft>
      <S.BottomLeft>
        <S.Title>{model.name}</S.Title>
        <S.TitleRight>
          {/* <S.TRTop>{model.place}</S.TRTop> */}
          <S.TRBottom>{`${model.version}`}</S.TRBottom>
        </S.TitleRight>
      </S.BottomLeft>
      <S.BottomRight>
        <S.Row>{model.year}</S.Row>
        <S.Row>{model.place}</S.Row>
        <S.Row>
          <p>{model.explanation}</p>
        </S.Row>
      </S.BottomRight>
    </S.UIWrapper>
  );
}
