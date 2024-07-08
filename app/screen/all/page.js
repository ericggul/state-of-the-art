"use client";

import * as S from "./styles";

export default function Screen() {
  return (
    <S.Container>
      {new Array(4).fill(0).map((_, i) => (
        <S.Element key={i}>
          <iframe src={`/screen?layerIdx=${i}`} />
        </S.Element>
      ))}
    </S.Container>
  );
}
