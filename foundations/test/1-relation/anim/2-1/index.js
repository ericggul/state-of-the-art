import * as S from "./styles";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import usePosCalc from "./usePosCalc";
import useComputeSimilarity, { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";

import useOpacityInterval from "@/utils/hooks/intervals/useOpacityInterval";

export default function Layer1({ newInputEmbeddings, newOutputEmbeddings }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  const inputSimilarityMatrix = useComputeSimilarity({ newEmbeddings: newInputEmbeddings });
  const outputSimilarityMatrix = useComputeSimilarity({ newEmbeddings: newOutputEmbeddings });

  const { wordPosCalc: inputWordPosCalc, wordInterval: inputWordInterval, yMargin: inputyMargin } = usePosCalc({ tokens: inputTokens, type: "input" });
  const { wordPosCalc: outputWordPosCalc, wordInterval: outputWordInterval, yMargin: outputyMargin } = usePosCalc({ tokens: outputTokens, type: "output" });

  // Function to create a smoother cubic Bezier curve path between two points
  const createBezierPath = (x1, y1, x2, y2) => {
    const controlX1 = x1 + (x2 - x1) / 2;
    const controlY1 = y1 + inputyMargin;
    const controlX2 = x2 - (x2 - x1) / 2;
    const controlY2 = y2 - outputyMargin;

    return `M${x1},${y1 + inputyMargin} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2 - outputyMargin}`;
  };

  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2, dir = 1) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = dir;
    const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * inputyMargin;
    const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * inputyMargin;
    return `M${x1} ${y1Adjusted} A${radius} ${radius} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
  };

  const [opacity, setOpacity] = useState(1.0);
  // useRandomInterval(() => setOpacity((s) => 1 - s), 10, 200);

  return (
    <S.Container>
      {inputTokens.map((token, i) => (
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
            opacity,
          }}
        >
          {token}
        </S.Token>
      ))}

      <S.Pic
        style={
          {
            // opacity,
          }
        }
      >
        {inputTokens.map((token, i) =>
          outputTokens.map((targetToken, j) => (
            <Path
              key={`arc-${i}-${j}`}
              d={createBezierPath(inputWordPosCalc(i)[0], inputWordPosCalc(i)[1], outputWordPosCalc(j)[0], outputWordPosCalc(j)[1])}
              strokeWidth={crossSimilarityMatrix[i][j] > 0.2 ? crossSimilarityMatrix[i][j] ** 3 * 4 : 0}
              parentOpacity={opacity}
            />
          ))
        )}

        {inputTokens.map((token, i) =>
          inputTokens.map((targetToken, j) =>
            i < j ? (
              <Path
                key={`arc-${i}-${j}`}
                d={createArcPath(inputWordPosCalc(i)[0], inputWordPosCalc(i)[1], inputWordPosCalc(j)[0], inputWordPosCalc(j)[1], 0)}
                strokeWidth={inputSimilarityMatrix[i][j] > 0.2 ? inputSimilarityMatrix[i][j] ** 3 * 2 : 0}
              />
            ) : null
          )
        )}
        {outputTokens.map((token, i) =>
          outputTokens.map((targetToken, j) =>
            i < j ? (
              <Path
                key={`arc-${i}-${j}`}
                d={createArcPath(outputWordPosCalc(i)[0], outputWordPosCalc(i)[1], outputWordPosCalc(j)[0], outputWordPosCalc(j)[1], 1)}
                parentOpacity={opacity}
                strokeWidth={outputSimilarityMatrix[i][j] > 0.2 ? outputSimilarityMatrix[i][j] ** 3 * 2 : 0}
              />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}

const Path = React.memo(({ d, strokeWidth, parentOpacity = 1 }) => {
  const opacity = useOpacityInterval();

  return <path d={d} stroke="white" fill="none" strokeWidth={strokeWidth} opacity={opacity * parentOpacity} />;
});
