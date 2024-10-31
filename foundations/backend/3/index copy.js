import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as S from "./styles";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/backend/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import useStore from "@/components/backend/store";

const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 10,
  controlY2Factor: 5,
};

const getRandom = (a, b) => Math.random() * (b - a) + a;

// Memoized SingleOutputToken component
const SingleOutputToken = React.memo(function SingleOutputToken({
  i,
  outputWordInterval,
  outputWordPosCalc,
  token,
}) {
  const [displayToken, setDisplayToken] = useState(token);

  useRandomInterval(
    () =>
      setDisplayToken((given) => {
        if (given !== token) return token;
        const randomString = Array.from({ length: token.length }, () =>
          Math.round(Math.random())
        ).join("");
        return randomString;
      }),
    10,
    1000
  );

  return (
    <S.Token
      style={{
        left: outputWordPosCalc(i)[0],
        top: outputWordPosCalc(i)[1],
        width: outputWordInterval,
      }}
    >
      {displayToken}
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
  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [opacity, setOpacity] = useState(1);

  // Compute similarity matrix
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  // Position calculations
  const inputPosCalc = usePosCalc({
    tokens: inputTokens,
    type: "input",
  });

  const outputPosCalc = usePosCalc({
    tokens: outputTokens,
    type: "output",
  });

  // Effects for animation states
  useEffect(() => {
    if (visible) {
      setXRange(1.5);
      setYRange(18);
      setOpacity(isblack ? 1 : 0.5);
    }
  }, [visible, isblack]);

  // Bezier parameter updates
  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(0 - xRange, 0 + xRange),
        controlX2Factor: getRandom(0.7 - xRange, 0.7 + xRange),
        controlY1Factor: getRandom(10 - yRange, 10 + yRange),
        controlY2Factor: getRandom(10 - yRange, 10 + yRange),
      });
    },
    5 * timeUnit,
    50 * timeUnit
  );

  // Path creation
  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
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

  // Memoized renders
  const renderedInputTokens = useMemo(() => {
    return inputTokens.map((token, i) => (
      <S.Token
        key={`input-${i}`}
        style={{
          left: inputPosCalc.wordPosCalc(i)[0],
          top: inputPosCalc.wordPosCalc(i)[1],
          width: inputPosCalc.wordInterval,
        }}
      >
        {token}
      </S.Token>
    ));
  }, [inputTokens, inputPosCalc]);

  const renderedPaths = useMemo(() => {
    return inputTokens.map((token, i) =>
      outputTokens.map((targetToken, j) => (
        <path
          key={`arc-${i}-${j}`}
          d={createBezierPath(
            inputPosCalc.wordPosCalc(i)[0],
            inputPosCalc.wordPosCalc(i)[1],
            outputPosCalc.wordPosCalc(j)[0],
            outputPosCalc.wordPosCalc(j)[1]
          )}
          stroke={isblack ? "white" : "black"}
          fill="none"
          strokeWidth={
            crossSimilarityMatrix[i][j] > 0.2
              ? Math.pow(crossSimilarityMatrix[i][j], 3) * 4
              : 0
          }
        />
      ))
    );
  }, [
    inputTokens,
    outputTokens,
    inputPosCalc,
    outputPosCalc,
    createBezierPath,
    crossSimilarityMatrix,
    isblack,
  ]);

  return (
    <S.Container
      style={{
        background: isblack ? "black" : "white",
        color: isblack ? "white" : "black",
        opacity: visible ? 1 : 0,
      }}
    >
      <div>
        {renderedInputTokens}
        {outputTokens.map((token, i) => (
          <SingleOutputToken
            key={`output-${i}`}
            i={i}
            outputWordInterval={outputPosCalc.wordInterval}
            outputWordPosCalc={outputPosCalc.wordPosCalc}
            token={token}
          />
        ))}
      </div>

      <S.Pic style={{ opacity }}>{renderedPaths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(SingleRandom);
