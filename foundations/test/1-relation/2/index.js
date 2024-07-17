import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import usePosCalc from "@/foundations/test/1-relation/utils/usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";

export default function Layer1({ newInputEmbeddings, newOutputEmbeddings }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  console.log(crossSimilarityMatrix);

  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ tokens: inputTokens });

  const [targetWordIdx, setTargetWordIdx] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTargetWordIdx((prev) => (prev + 1) % wordLength);
  //   }, 400);

  //   return () => clearInterval(interval);
  // }, []);

  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2, dir = 1) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = dir;
    const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * verticalInterval;
    const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * verticalInterval;
    return `M${x1} ${y1Adjusted} A${radius} ${radius * 0.6} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
  };

  return (
    <S.Container>
      {inputTokens.map((token, i) => (
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
        {inputTokens.map((token, i) =>
          inputTokens.map((targetToken, j) =>
            i < j ? (
              <path
                key={`arc-${i}-${j}`}
                d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0)}
                stroke="white"
                fill="none"
                // strokeWidth={similarityMatrix[i][j] > 0.2 ? similarityMatrix[i][j] ** 2 * 4 : 0}
                // opacity={j == targetWordIdx || i == targetWordIdx ? 1 : 0.1}

                //end circular
              />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}
