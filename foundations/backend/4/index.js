import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as S from "./styles";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/backend/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import useStore from "@/components/backend/store";

// Constants moved to the top
const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 10,
  controlY2Factor: 5,
};

// Utility functions moved to separate section
const getRandom = (a, b) => Math.random() * (b - a) + a;

const getWeightedRandom = (min, max) => {
  const range = max - min;
  const mid = (min + max) / 2;
  const r = Math.random();
  return r < 0.5
    ? min + Math.sqrt(r * range * (mid - min))
    : max - Math.sqrt((1 - r) * range * (max - mid));
};

// Custom hooks section
const useBezierParams = (
  inputTokens,
  outputTokens,
  xRange,
  yRange,
  visible,
  isAnimating,
  timeUnit
) => {
  const [bezierParams, setBezierParams] = useState({});

  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;

    const newParams = {};
    inputTokens.forEach((_, i) => {
      outputTokens.forEach((_, j) => {
        const key = `${i}-${j}`;
        newParams[key] = {
          controlX1Factor: getWeightedRandom(-xRange, xRange),
          controlX2Factor: getWeightedRandom(0.7 - xRange, 0.7 + xRange),
          controlY1Factor: getWeightedRandom(10 - yRange, 10 + yRange),
          controlY2Factor: getWeightedRandom(10 - yRange, 10 + yRange),
        };
      });
    });

    setBezierParams(newParams);
  }, [inputTokens, outputTokens, xRange, yRange, visible, isAnimating]);

  useRandomInterval(updateBezierParams, 5 * timeUnit, 70 * timeUnit, visible);

  return bezierParams;
};

// Components section
const TokenComponent = React.memo(function TokenComponent({
  i,
  wordPosCalc,
  wordInterval,
  token,
}) {
  return (
    <S.Token
      style={{
        left: wordPosCalc(i)[0],
        top: wordPosCalc(i)[1],
        width: wordInterval,
      }}
    >
      {token}
    </S.Token>
  );
});

function SingleRandom({ range, visible, timeUnit }) {
  // Get state from Zustand
  const {
    isblack,
    inputEmbeddings: newInputEmbeddings,
    outputEmbeddings: newOutputEmbeddings,
  } = useStore();

  const { embeddings: inputEmbeddings, tokens: inputTokens } =
    newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } =
    newOutputEmbeddings;

  // Local state
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Compute similarity matrix
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  // Effects
  useEffect(() => {
    setXRange(1.5);
    setYRange(18);
    setIsAnimating(isblack && visible);
  }, [isblack, visible]);

  // Position calculations
  const inputPosCalc = usePosCalc({
    tokens: inputTokens,
    type: "input",
    isAnimating,
    range,
    timeUnit,
  });

  const outputPosCalc = usePosCalc({
    tokens: outputTokens,
    type: "output",
    isAnimating,
    range,
    timeUnit,
  });

  // Bezier parameters
  const bezierParams = useBezierParams(
    inputTokens,
    outputTokens,
    xRange,
    yRange,
    visible,
    isAnimating,
    timeUnit
  );

  // Path creation logic
  const createBezierPath = useCallback(
    (x1, y1, x2, y2, bezierParam) => {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return "";

      const controlX1 = x1 + (x2 - x1) * bezierParam.controlX1Factor;
      const controlY1 = y1 + inputPosCalc.yMargin * bezierParam.controlY1Factor;
      const controlX2 = x1 + (x2 - x1) * bezierParam.controlX2Factor;
      const controlY2 =
        y2 - outputPosCalc.yMargin * bezierParam.controlY2Factor;

      return `M${x1},${
        y1 + inputPosCalc.yMargin
      } C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${
        y2 - outputPosCalc.yMargin
      }`;
    },
    [inputPosCalc.yMargin, outputPosCalc.yMargin]
  );

  // Paths calculation
  const paths = useMemo(() => {
    return inputTokens.flatMap((_, i) =>
      outputTokens
        .map((_, j) => {
          const similarity = crossSimilarityMatrix[i][j];
          if (similarity <= 0.2) return null;

          const [x1, y1] = inputPosCalc.wordPosCalc(i);
          const [x2, y2] = outputPosCalc.wordPosCalc(j);
          const d = createBezierPath(
            x1,
            y1,
            x2,
            y2,
            bezierParams[`${i}-${j}`] || BEZIER_DEFAULT
          );

          return (
            <path
              key={`arc-${i}-${j}`}
              d={d}
              fill="none"
              strokeWidth={Math.pow(similarity, 3) * 4}
            />
          );
        })
        .filter(Boolean)
    );
  }, [
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    createBezierPath,
    bezierParams,
  ]);

  return (
    <S.Container
      isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        style={{
          opacity: isblack ? 0 : 1,
          transition: "opacity 0.5s",
          transitionDelay: ".1s",
        }}
      >
        {inputTokens.map((token, i) => (
          <TokenComponent
            key={`input-${i}`}
            i={i}
            token={token}
            wordPosCalc={inputPosCalc.wordPosCalc}
            wordInterval={inputPosCalc.wordInterval}
          />
        ))}

        {outputTokens.map((token, i) => (
          <TokenComponent
            key={`output-${i}`}
            i={i}
            token={token}
            wordPosCalc={outputPosCalc.wordPosCalc}
            wordInterval={outputPosCalc.wordInterval}
          />
        ))}
      </div>

      <S.Pic>{paths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(SingleRandom);
