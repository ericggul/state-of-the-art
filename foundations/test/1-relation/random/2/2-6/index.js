import * as S from "./styles";
import { useState, useEffect } from "react";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

import SingleRandom from "./SingleRandom";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Wrapper({ newInputEmbeddings, newOutputEmbeddings }) {
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlack((b) => !b);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <S.Container
        style={{
          background: isBlack ? "black" : "white",
        }}
      >
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} />
      </S.Container>
    </>
  );
}
