import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import usePosCalc from "./usePosCalc";
import { useComputeMultiCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";

export default function Layer1({ newMultiEmbeddings }) {
  const embeddingsArr = useMemo(() => newMultiEmbeddings.map((embeddings) => embeddings.embeddings), [newMultiEmbeddings]);
  const tokensArr = useMemo(() => newMultiEmbeddings.map((embeddings) => embeddings.tokens), [newMultiEmbeddings]);

  const crossSimilarityMatrix = useComputeMultiCrossSimlarity({
    newMultiEmbeddings,
  });

  console.log(crossSimilarityMatrix);

  // const { wordPosCalc: inputWordPosCalc, wordInterval: inputWordInterval, verticalInterval: inputVerticalInterval } = usePosCalc({ tokens: inputTokens, type: "input" });
  // const { wordPosCalc: outputWordPosCalc, wordInterval: outputWordInterval, verticalInterval: outputVerticalInterval } = usePosCalc({ tokens: outputTokens, type: "output" });

  // // Function to create a smoother cubic Bezier curve path between two points
  // const createBezierPath = (x1, y1, x2, y2) => {
  //   const controlX1 = x1 + (x2 - x1) / 2;
  //   const controlY1 = y1 + inputVerticalInterval;
  //   const controlX2 = x2 - (x2 - x1) / 2;
  //   const controlY2 = y2 - outputVerticalInterval;

  //   return `M${x1},${y1 + inputVerticalInterval} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2 - outputVerticalInterval}`;
  // };

  return (
    <S.Container>
      {/* {inputTokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: inputWordPosCalc(i)[0],
            top: inputWordPosCalc(i)[1],
            width: inputWordInterval,
          }}
        >
          {token}
        </S.Token>
      ))}

      {outputTokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: outputWordPosCalc(i)[0],
            top: outputWordPosCalc(i)[1],
            width: outputWordInterval,
          }}
        >
          {token}
        </S.Token>
      ))}

      <S.Pic>
        {inputTokens.map((token, i) =>
          outputTokens.map((targetToken, j) => (
            <path
              key={`arc-${i}-${j}`}
              d={createBezierPath(inputWordPosCalc(i)[0], inputWordPosCalc(i)[1], outputWordPosCalc(j)[0], outputWordPosCalc(j)[1])}
              stroke="white"
              fill="none"
              strokeWidth={crossSimilarityMatrix[i][j] > 0.2 ? crossSimilarityMatrix[i][j] ** 3 * 4 : 0}
              // opacity={j == targetWordIdx || i == targetWordIdx ? 1 : 0.1}
            />
          ))
        )}
      </S.Pic> */}
    </S.Container>
  );
}
