import { BEZIER_DEFAULT } from "../utils/mathUtils";
import { useMemo } from "react";

export function usePathsV2(params) {
  const {
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    radialIdx,
    isblack,
    createRadialPath,
  } = params;

  return useMemo(() => {
    return tokens.flatMap((_, i) =>
      tokens
        .map((_, j) => {
          if (i >= j) return null;
          const similarity = similarityMatrix[i][j];
          if (similarity <= 0.05) return null;

          const [x1, y1] = wordPosCalc(i);
          const [x2, y2] = wordPosCalc(j);

          return (
            <path
              key={`arc-${i}-${j}`}
              d={createRadialPath(x1, y1, x2, y2, {
                margin: yMargin,
                radialIdx,
                dir: i % 2,
              })}
              stroke={isblack ? "white" : "black"}
              fill="none"
              strokeWidth={Math.pow(similarity, 3) * 2.0 + 0.2}
            />
          );
        })
        .filter(Boolean)
    );
  }, [
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    radialIdx,
    isblack,
    createRadialPath,
  ]);
}

export function usePathsBezier(params) {
  const {
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    bezierParams,
    isblack,
    createBezierPath,
    similarityThreshold = 0.2,
    strokeWidthMultiplier = 4,
    isV4 = false,
  } = params;

  return useMemo(() => {
    return inputTokens.flatMap((_, i) =>
      outputTokens
        .map((_, j) => {
          const similarity = crossSimilarityMatrix[i][j];
          if (similarity <= similarityThreshold) return null;

          const [x1, y1] = inputPosCalc.wordPosCalc(i);
          const [x2, y2] = outputPosCalc.wordPosCalc(j);

          const bezierParam = isV4
            ? bezierParams && Object.keys(bezierParams).length > 0
              ? bezierParams[`${i}-${j}`] ?? BEZIER_DEFAULT
              : BEZIER_DEFAULT
            : bezierParams;

          return (
            <path
              key={`arc-${i}-${j}`}
              d={createBezierPath(x1, y1, x2, y2, bezierParam, {
                inputMargin: inputPosCalc.yMargin,
                outputMargin: outputPosCalc.yMargin,
              })}
              stroke={isblack ? "white" : "black"}
              fill="none"
              strokeWidth={Math.pow(similarity, 3) * strokeWidthMultiplier}
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
    bezierParams,
    isblack,
    createBezierPath,
    similarityThreshold,
    strokeWidthMultiplier,
    isV4,
    BEZIER_DEFAULT,
  ]);
}
