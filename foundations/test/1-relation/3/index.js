import * as S from "./styles";
import { useMemo } from "react";
import usePosCalc from "./usePosCalc";
import { useComputeMultiCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";

export default function Layer1({ newMultiEmbeddings }) {
  const embeddingsArr = useMemo(() => newMultiEmbeddings.map((embeddings) => embeddings.embeddings), [newMultiEmbeddings]);
  const tokensArr = useMemo(() => newMultiEmbeddings.map((embeddings) => embeddings.tokens), [newMultiEmbeddings]);

  const multiSimilarityMatrix = useComputeMultiCrossSimlarity({
    newMultiEmbeddings,
  });

  const posCalcArr = usePosCalc({ tokensArr });
  console.log(posCalcArr);

  const bezierParams = {
    controlX1Factor: 0,
    controlX2Factor: 1,
    controlY1Factor: 2,
    controlY2Factor: 8,
  };

  // Function to create a smoother cubic Bezier curve path between two points
  const createBezierPath = (x1, y1, x2, y2, inputyMargin, outputyMargin) => {
    const controlX1 = x1 + (x2 - x1) * bezierParams.controlX1Factor;
    const controlY1 = y1 + inputyMargin * bezierParams.controlY1Factor;
    const controlX2 = x1 + (x2 - x1) * bezierParams.controlX2Factor;
    const controlY2 = y2 - outputyMargin * bezierParams.controlY2Factor;

    return `M${x1},${y1 + inputyMargin} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2 - outputyMargin}`;
  };

  return (
    <S.Container>
      {tokensArr.map((tokens, layerIdx) =>
        tokens.map((token, tokenIdx) => (
          <S.Token
            key={`token-${layerIdx}-${tokenIdx}`}
            style={{
              left: posCalcArr[layerIdx].wordPosCalc(tokenIdx)[0],
              top: posCalcArr[layerIdx].wordPosCalc(tokenIdx)[1],
              width: posCalcArr[layerIdx].wordInterval,
            }}
          >
            {token}
          </S.Token>
        ))
      )}

      <S.Pic>
        {tokensArr
          .slice(0, tokensArr.length - 1)
          .map((tokens, layerIdx) =>
            tokens.map((token, tokenIdx) =>
              tokensArr[layerIdx + 1].map((nextToken, nextTokenIdx) => (
                <path
                  key={`arc-${layerIdx}-${tokenIdx}-${nextTokenIdx}`}
                  d={createBezierPath(
                    posCalcArr[layerIdx].wordPosCalc(tokenIdx)[0],
                    posCalcArr[layerIdx].wordPosCalc(tokenIdx)[1],
                    posCalcArr[layerIdx + 1].wordPosCalc(nextTokenIdx)[0],
                    posCalcArr[layerIdx + 1].wordPosCalc(nextTokenIdx)[1],
                    posCalcArr[layerIdx].yMargin,
                    posCalcArr[layerIdx + 1].yMargin
                  )}
                  stroke="white"
                  fill="none"
                  strokeWidth={multiSimilarityMatrix[layerIdx][tokenIdx][nextTokenIdx] > 0.2 ? multiSimilarityMatrix[layerIdx][tokenIdx][nextTokenIdx] ** 3 * 4 : 0}
                />
              ))
            )
          )}
      </S.Pic>
    </S.Container>
  );
}
