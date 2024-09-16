import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import usePosCalc from "./usePosCalc";
import useComputeSimilarity, { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 10,
  controlY2Factor: 5,
};

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Layer1({ newInputEmbeddings, newOutputEmbeddings, isblack, range, visible }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  const inputSimilarityMatrix = useComputeSimilarity({ newEmbeddings: newInputEmbeddings });
  const outputSimilarityMatrix = useComputeSimilarity({ newEmbeddings: newOutputEmbeddings });

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setXRange((r) => 1.5 - r);
    setYRange((r) => 18 - r);
    setIsAnimating((animating) => !animating); // Toggle animation when isblack changes
  }, [isblack]);

  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(0 - xRange, 0 + xRange),
        controlX2Factor: getRandom(0.7 - xRange, 0.7 + xRange),
        controlY1Factor: getRandom(10 - yRange, 10 + yRange),
        controlY2Factor: getRandom(10 - yRange, 10 + yRange),
      });
    },
    5,
    50
  );

  const { wordPosCalc: inputWordPosCalc, wordInterval: inputWordInterval, yMargin: inputyMargin } = usePosCalc({ tokens: inputTokens, type: "input", isAnimating, range });
  const { wordPosCalc: outputWordPosCalc, wordInterval: outputWordInterval, yMargin: outputyMargin } = usePosCalc({ tokens: outputTokens, type: "output", isAnimating, range });

  // Function to create a smoother cubic Bezier curve path between two points
  const createBezierPath = (x1, y1, x2, y2) => {
    // Fallback for undefined or NaN values
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      return "";
    }

    const controlX1 = x1 + (x2 - x1) * bezierParams.controlX1Factor;
    const controlY1 = y1 + inputyMargin * bezierParams.controlY1Factor;
    const controlX2 = x1 + (x2 - x1) * bezierParams.controlX2Factor;
    const controlY2 = y2 - outputyMargin * bezierParams.controlY2Factor;

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

  return (
    <S.Container
      isblack={isblack && "true"}
      style={{
        opacity: visible ? 1 : 0, // Control visibility based on the `visible` prop
      }}
    >
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
            />
          ))
        )}

        {inputTokens.map((token, i) =>
          inputTokens.map((targetToken, j) =>
            i < j ? (
              <path
                key={`arc-${i}-${j}`}
                d={createArcPath(inputWordPosCalc(i)[0], inputWordPosCalc(i)[1], inputWordPosCalc(j)[0], inputWordPosCalc(j)[1], 0)}
                stroke="white"
                fill="none"
                strokeWidth={inputSimilarityMatrix[i][j] > 0.2 ? inputSimilarityMatrix[i][j] ** 3 * 2 : 0}
              />
            ) : null
          )
        )}

        {outputTokens.map((token, i) =>
          outputTokens.map((targetToken, j) =>
            i < j ? (
              <path
                key={`arc-${i}-${j}`}
                d={createArcPath(outputWordPosCalc(i)[0], outputWordPosCalc(i)[1], outputWordPosCalc(j)[0], outputWordPosCalc(j)[1], 1)}
                stroke="white"
                fill="none"
                strokeWidth={outputSimilarityMatrix[i][j] > 0.2 ? outputSimilarityMatrix[i][j] ** 3 * 2 : 0}
              />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}
