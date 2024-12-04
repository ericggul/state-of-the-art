import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "./useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 15,
  controlY2Factor: 5,
};

const getWeightedRandom = (min, max) => {
  const range = max - min;
  const mid = (min + max) / 2;

  // Generate a random number between 0 and 1
  const r = Math.random();

  // Use the inverse cumulative distribution function of a triangular distribution
  let result;
  if (r < 0.5) {
    result = min + Math.sqrt(r * range * (mid - min));
  } else {
    result = max - Math.sqrt((1 - r) * range * (max - mid));
  }

  return result;
};

const getRandom = (min, max) => Math.random() * (max - min) + min;

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
          controlX1Factor: getWeightedRandom(-1, 1),
          controlX2Factor: getWeightedRandom(0, 2),
          controlY1Factor: getWeightedRandom(-0, 20),
          controlY2Factor: getWeightedRandom(-0, 20),
        };
      });
    });

    setBezierParams(newParams);
  }, [inputTokens, outputTokens, xRange, yRange, visible, isAnimating]);

  useRandomInterval(updateBezierParams, 1 * timeUnit, 8 * timeUnit, visible);

  return bezierParams;
};

const X_RANGE_MIN = 0.5;
const X_RANGE_MAX = 2.5;
const Y_RANGE_MIN = 10;
const Y_RANGE_MAX = 25;

function SingleRandom({
  newInputEmbeddings,
  newOutputEmbeddings,
  isblack,
  range,
  visible,
  timeUnit,
}) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } =
    newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } =
    newOutputEmbeddings;

  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update ranges more frequently
  useEffect(() => {
    if (!isblack || !visible) {
      setXRange(0);
      setYRange(0);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    // Initial values
    setXRange(getWeightedRandom(X_RANGE_MIN, X_RANGE_MAX));
    setYRange(getWeightedRandom(Y_RANGE_MIN, Y_RANGE_MAX));

    // Continuously update ranges
    const intervalId = setInterval(() => {
      setXRange((prev) => {
        const target = getWeightedRandom(X_RANGE_MIN, X_RANGE_MAX);
        return target;
      });
      setYRange((prev) => {
        const target = getWeightedRandom(Y_RANGE_MIN, Y_RANGE_MAX);
        return target;
      });
    }, 10); // Update every 50ms for smooth animation

    return () => clearInterval(intervalId);
  }, [isblack, visible]);

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

  const bezierParams = useBezierParams(
    inputTokens,
    outputTokens,
    xRange,
    yRange,
    visible,
    isAnimating,
    timeUnit
  );

  const createBezierPath = useCallback(
    (x1, y1, x2, y2, bezierParam) => {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        return "";
      }

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

  const [windowWidth, _] = useResize();

  // Modify paths calculation
  const paths = useMemo(() => {
    return inputTokens.flatMap((_, i) => {
      return outputTokens
        .map((_, j) => {
          const similarity = crossSimilarityMatrix[i][j];
          if (similarity > 0.08) {
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
                strokeWidth={Math.pow(similarity, 3.2) * windowWidth * 0.003}
              />
            );
          }
          return null;
        })
        .filter(Boolean);
    });
  }, [
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    createBezierPath,
    bezierParams,
    windowWidth,
  ]);

  return (
    <S.Container
      isblack={isblack ? "true" : undefined}
      style={{
        opacity: visible ? 1 : 0,
      }}
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

// Single reusable Token component for both input and output tokens
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

export default React.memo(SingleRandom);
