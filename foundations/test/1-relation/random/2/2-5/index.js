import * as S from "./styles";
import { useState, useEffect } from "react";

import Random24 from "@/foundations/test/1-relation/random/2/2-4";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Layer1({ newInputEmbeddings, newOutputEmbeddings }) {
  return (
    <>
      <S.Container>
        <Random24 newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} />
      </S.Container>

      <S.Container
        style={{
          mixBlendMode: "difference",
          WebkitMixBlendMode: "difference",
        }}
      >
        <Random24 newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} />
      </S.Container>
      <S.Container
        style={{
          mixBlendMode: "difference",
          WebkitMixBlendMode: "difference",
        }}
      >
        <Random24 newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} />
      </S.Container>
      <S.Container
        style={{
          mixBlendMode: "difference",
          WebkitMixBlendMode: "difference",
        }}
      >
        <Random24 newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} />
      </S.Container>
      <S.Container
        style={{
          mixBlendMode: "difference",
          WebkitMixBlendMode: "difference",
        }}
      >
        <Random24 newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} />
      </S.Container>
    </>
  );
}
