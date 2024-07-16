import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "../useComputeSimilarity";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);

  const wordPosCalc = useCallback((idx) => [windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval, windowHeight / 2], [wordInterval, wordLength]);

  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = x1 < x2 ? 1 : 0;
    return `M${x1},${y1} A${radius},${radius} 0 0,${sweepFlag} ${x2},${y2}`;
  };

  return (
    <S.Container>
      {tokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: wordPosCalc(i)[0],
            top: wordPosCalc(i)[1],
            width: wordInterval,
          }}
        >
          {token}
        </S.Token>
      ))}
      <S.Pic>
        {tokens.map((token, i) =>
          tokens.map((targetToken, j) =>
            i < j ? <path key={`arc-${i}-${j}`} d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1])} stroke="white" fill="none" /> : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}
