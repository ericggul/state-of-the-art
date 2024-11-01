import { BEZIER_DEFAULT } from "../utils/mathUtils";
import { useMemo } from "react";

export function usePathsV1({
  tokens,
  similarityMatrix,
  wordPosCalc,
  yMargin,
  isblack,
  createArcPath,
  targetWordIdx,
  isAnimating,
  subLevel,
}) {
  const strokeColor = isblack ? "white" : "black";

  const calculateTextPoint = useMemo(
    () => (x1, y1, x2, y2, dir) => {
      const midX = (x1 + x2) / 2;
      const radius = Math.abs(x2 - x1) / 2;
      const midY =
        (y1 + y2) / 2 + (dir === 1 ? -1 : 1) * (radius * 0.6 + yMargin * 1.5);
      return [midX, midY];
    },
    [yMargin]
  );

  return useMemo(() => {
    const paths = [];

    // Token paths
    tokens.forEach((_, i) => {
      if (i === targetWordIdx) return;
      const similarity = similarityMatrix[i][targetWordIdx];
      if (similarity <= 0.05 || !similarity) return;

      const [x1, y1] = wordPosCalc(i);
      const [x2, y2] = wordPosCalc(targetWordIdx);
      const dir = i % 2 === 0 ? 1 : 0;

      const strokeWidth =
        subLevel === 0
          ? 1
          : subLevel === 1
          ? similarity ** 2 * 4 + 0.2
          : similarity ** 2 * 8 + 0.2;

      paths.push(
        <g key={`arc-group-${i}`}>
          <path
            d={createArcPath(x1, y1, x2, y2, { yMargin, dir })}
            stroke={strokeColor}
            fill="none"
            strokeWidth={strokeWidth}
          />
          {subLevel >= 1 && similarity && (
            <text
              x={calculateTextPoint(x1, y1, x2, y2, dir)[0]}
              y={calculateTextPoint(x1, y1, x2, y2, dir)[1]}
              fill={strokeColor}
              opacity={isblack ? 1 : 0}
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

    // Interaction paths
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const similarity = similarityMatrix[i][j];
        if (similarity <= 0.01 || !similarity) return;

        const dir = j % 2 === 0 ? 1 : 0;
        const [x1, y1] = wordPosCalc(i);
        const [x2, y2] = wordPosCalc(j);
        const pathOpacity =
          !isAnimating || j === targetWordIdx || i === targetWordIdx ? 1 : 0.15;

        const strokeWidth =
          subLevel === 0
            ? 1
            : subLevel === 1
            ? similarity ** 2 * 4 + 0.2
            : similarity ** 2 * 8 + 0.2;

        paths.push(
          <g key={`arc-group-${i}-${j}`}>
            <path
              d={createArcPath(x1, y1, x2, y2, { yMargin, dir })}
              stroke={strokeColor}
              fill="none"
              strokeWidth={strokeWidth * 0.5}
              opacity={pathOpacity}
            />
            {subLevel >= 1 && (
              <text
                x={calculateTextPoint(x1, y1, x2, y2, dir)[0]}
                y={calculateTextPoint(x1, y1, x2, y2, dir)[1]}
                fill={strokeColor}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="0.7vw"
                opacity={pathOpacity}
              >
                {similarity.toFixed(2)}
              </text>
            )}
          </g>
        );
      }
    }

    return paths;
  }, [
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    isblack,
    targetWordIdx,
    isAnimating,
    strokeColor,
    calculateTextPoint,
    createArcPath,
  ]);
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
              strokeWidth={Math.pow(similarity, 3) * 3.0 + 0.2}
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
