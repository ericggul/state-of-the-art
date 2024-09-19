import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as S from "./styles";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 10,
  controlY2Factor: 5,
};

const getRandom = (a, b) => Math.random() * (b - a) + a;

function SingleRandom({ newInputEmbeddings, newOutputEmbeddings, isblack, range, visible, timeUnit }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update ranges and animation state based on `isblack`
  useEffect(() => {
    setXRange(isblack ? 1.5 : 0);
    setYRange(isblack ? 18 : 0);
    setIsAnimating(isblack);
  }, [isblack]);

  // Reduced update frequency to improve performance
  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(-xRange, xRange),
        controlX2Factor: getRandom(0.7 - xRange, 0.7 + xRange),
        controlY1Factor: getRandom(10 - yRange, 10 + yRange),
        controlY2Factor: getRandom(10 - yRange, 10 + yRange),
      });
    },
    5 * timeUnit,
    70 * timeUnit
  );

  const {
    wordPosCalc: inputWordPosCalc,
    wordInterval: inputWordInterval,
    yMargin: inputyMargin,
  } = usePosCalc({
    tokens: inputTokens,
    type: "input",
    isAnimating,
    range,
    timeUnit,
  });

  const {
    wordPosCalc: outputWordPosCalc,
    wordInterval: outputWordInterval,
    yMargin: outputyMargin,
  } = usePosCalc({
    tokens: outputTokens,
    type: "output",
    isAnimating,
    range,
    timeUnit,
  });

  // Memoized function to avoid unnecessary recalculations
  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        return "";
      }

      const controlX1 = x1 + (x2 - x1) * bezierParams.controlX1Factor;
      const controlY1 = y1 + inputyMargin * bezierParams.controlY1Factor;
      const controlX2 = x1 + (x2 - x1) * bezierParams.controlX2Factor;
      const controlY2 = y2 - outputyMargin * bezierParams.controlY2Factor;

      return `M${x1},${y1 + inputyMargin} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2 - outputyMargin}`;
    },
    [bezierParams, inputyMargin, outputyMargin]
  );

  // Precompute paths to reduce rendering overhead
  const paths = useMemo(() => {
    const result = [];
    for (let i = 0; i < inputTokens.length; i++) {
      for (let j = 0; j < outputTokens.length; j++) {
        const similarity = crossSimilarityMatrix[i][j];
        if (similarity > 0.2) {
          const [x1, y1] = inputWordPosCalc(i);
          const [x2, y2] = outputWordPosCalc(j);
          const d = createBezierPath(x1, y1, x2, y2);
          result.push(<path key={`arc-${i}-${j}`} d={d} fill="none" strokeWidth={Math.pow(similarity, 3) * 4} />);
        }
      }
    }
    return result;
  }, [inputTokens.length, outputTokens.length, crossSimilarityMatrix, inputWordPosCalc, outputWordPosCalc, createBezierPath]);

  return (
    <S.Container
      isblack={isblack && "true"}
      style={{
        opacity: visible ? 1 : 0,
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
        <SingleOutputToken key={i} i={i} outputWordInterval={outputWordInterval} outputWordPosCalc={outputWordPosCalc} token={token} />
      ))}

      <S.Pic>{paths}</S.Pic>
    </S.Container>
  );
}

// Memoized component to prevent unnecessary re-renders
const SingleOutputToken = React.memo(function SingleOutputToken({ i, outputWordInterval, outputWordPosCalc, token }) {
  return (
    <S.Token
      style={{
        left: outputWordPosCalc(i)[0],
        top: outputWordPosCalc(i)[1],
        width: outputWordInterval,
      }}
    >
      {token}
    </S.Token>
  );
});

export default React.memo(SingleRandom);
