"use client";

import * as S from "./styles";

import { useSearchParams } from "next/navigation";

export default function Screen() {
  const searchParams = useSearchParams();

  const testIdx = searchParams.get("testIdx");

  return (
    <S.Container>
      {new Array(4).fill(0).map((_, i) => (
        <S.Element key={i}>
          <iframe src={`/screen?layerIdx=${i}&testIdx=${testIdx}`} />
        </S.Element>
      ))}
    </S.Container>
  );
}
