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

const X_RANGE = 1.5;
const Y_RANGE = 20;

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

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update ranges and animation state based on `isblack` and `visible` only when necessary
  useEffect(() => {
    setIsAnimating(isblack && visible);
  }, [isblack, visible]);

  // Use a memoized callback to update the bezier parameters
  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;
    setBezierParams({
      controlX1Factor: getRandom(-X_RANGE, X_RANGE),
      controlX2Factor: getRandom(0.5 - X_RANGE, 0.5 + X_RANGE),
      controlY1Factor: getRandom(10 - Y_RANGE, 10 + Y_RANGE),
      controlY2Factor: getRandom(10 - Y_RANGE, 10 + Y_RANGE),
    });
  }, [X_RANGE, Y_RANGE, visible, isAnimating]);

  // Use the custom interval hook to call the bezier update within the given time range
  useRandomInterval(updateBezierParams, 5 * timeUnit, 70 * timeUnit, visible);

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

  // Memoized bezier path creation to avoid recalculations
  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        return "";
      }

      const controlX1 = x1 + (x2 - x1) * bezierParams.controlX1Factor;
      const controlY1 =
        y1 + inputPosCalc.yMargin * bezierParams.controlY1Factor;
      const controlX2 = x1 + (x2 - x1) * bezierParams.controlX2Factor;
      const controlY2 =
        y2 - outputPosCalc.yMargin * bezierParams.controlY2Factor;

      return `M${x1},${
        y1 + inputPosCalc.yMargin
      } C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${
        y2 - outputPosCalc.yMargin
      }`;
    },
    [bezierParams, inputPosCalc.yMargin, outputPosCalc.yMargin]
  );

  // Memoized paths to reduce re-renders
  const paths = useMemo(() => {
    return inputTokens.flatMap((_, i) => {
      return outputTokens
        .map((_, j) => {
          const similarity = crossSimilarityMatrix[i][j];
          if (similarity > 0.2) {
            const [x1, y1] = inputPosCalc.wordPosCalc(i);
            const [x2, y2] = outputPosCalc.wordPosCalc(j);
            const d = createBezierPath(x1, y1, x2, y2);
            return (
              <path
                key={`arc-${i}-${j}`}
                d={d}
                fill="none"
                strokeWidth={Math.pow(similarity, 3) * 4}
              />
            );
          }
          return null;
        })
        .filter(Boolean); // Filter out null values
    });
  }, [
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    createBezierPath,
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
