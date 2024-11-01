import { BEZIER_DEFAULT } from "../utils/mathUtils";
import { useMemo } from "react";

export function usePathsV1(params) {
  const {
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    isblack,
    createArcPath,
    targetWordIdx,
    isAnimating,
    showNumbers = false,
  } = params;

  // Helper function to calculate text position (similar to reference code)
  const calculateTextPoint = (x1, y1, x2, y2, dir) => {
    const midX = (x1 + x2) / 2;
    const radius = Math.abs(x2 - x1) / 2;
    const midY =
      (y1 + y2) / 2 + (dir === 1 ? -1 : 1) * (radius * 0.6 + yMargin * 1.5);
    return [midX, midY];
  };

  // Token paths with numbers
  const tokenPaths = useMemo(() => {
    return tokens.map((_, i) => {
      if (i === targetWordIdx) return null;
      const similarity = similarityMatrix[i][targetWordIdx];
      if (similarity <= 0.2 || !similarity) return null;

      const [x1, y1] = wordPosCalc(i);
      const [x2, y2] = wordPosCalc(targetWordIdx);
      const dir = i % 2 === 0 ? 1 : 0;

      return (
        <g key={`arc-group-${i}`}>
          <path
            d={createArcPath(x1, y1, x2, y2, {
              yMargin,
              dir,
            })}
            stroke={isblack ? "white" : "black"}
            fill="none"
            strokeWidth={similarity ** 2 * 5}
            opacity={1}
          />
          {showNumbers && similarity && (
            <text
              x={calculateTextPoint(x1, y1, x2, y2, dir)[0]}
              y={calculateTextPoint(x1, y1, x2, y2, dir)[1]}
              fill={isblack ? "white" : "black"}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="0.7vw"
            >
              {similarity.toFixed(2)}
            </text>
          )}
        </g>
      );
    });
  }, [
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    isblack,
    targetWordIdx,
    showNumbers,
  ]);

  // Interaction paths with numbers
  const interactionPaths = useMemo(() => {
    return tokens
      .flatMap((_, i) =>
        tokens.map((_, j) => {
          if (i >= j) return null;
          const similarity = similarityMatrix[i][j];
          const dir = j % 2 === 0 ? 1 : 0;
          const [x1, y1] = wordPosCalc(i);
          const [x2, y2] = wordPosCalc(j);

          return (
            <g key={`arc-group-${i}-${j}`}>
              <path
                d={createArcPath(x1, y1, x2, y2, {
                  yMargin,
                  dir,
                })}
                stroke={isblack ? "white" : "black"}
                fill="none"
                strokeWidth={similarity ** 2 * 2}
                opacity={
                  !isAnimating || j === targetWordIdx || i === targetWordIdx
                    ? 1
                    : 0.15
                }
              />
              {showNumbers && similarity > 0.2 && (
                <text
                  x={calculateTextPoint(x1, y1, x2, y2, dir)[0]}
                  y={calculateTextPoint(x1, y1, x2, y2, dir)[1]}
                  fill={isblack ? "white" : "black"}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="0.7vw"
                  opacity={
                    !isAnimating || j === targetWordIdx || i === targetWordIdx
                      ? 1
                      : 0.15
                  }
                >
                  {similarity.toFixed(2)}
                </text>
              )}
            </g>
          );
        })
      )
      .filter(Boolean);
  }, [
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    isblack,
    targetWordIdx,
    isAnimating,
    showNumbers,
  ]);

  return [...tokenPaths, ...interactionPaths];
}

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
