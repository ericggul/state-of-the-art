import { BEZIER_DEFAULT } from "../utils/mathUtils";
import { useMemo, useCallback, memo } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import useResize from "@/utils/hooks/useResize";

const getRandom = (a, b) => Math.random() * (b - a) + a;

// Memoized base path component
const BasePath = memo(({ d, stroke, strokeWidth, opacity = 1, key }) => (
  <path
    key={key}
    d={d}
    stroke={stroke}
    fill="none"
    strokeWidth={strokeWidth}
    opacity={opacity}
  />
));

const calculateResponsiveStrokeWidth = (baseWidth, windowWidth) =>
  (baseWidth * windowWidth) / 1920;

const useStrokeColor = (isblack) =>
  useMemo(() => (isblack ? "white" : "black"), [isblack]);

const useValidPaths = (options) => {
  const {
    tokens,
    similarityMatrix,
    similarityThreshold = 0.05,
    targetWordIdx = null,
    inputTokens = null,
    outputTokens = null,
    crossSimilarityMatrix = null,
  } = options;

  return useMemo(() => {
    // Pre-allocate array with estimated size
    const paths = new Array(
      inputTokens && outputTokens
        ? inputTokens.length * outputTokens.length
        : (tokens?.length * (tokens?.length - 1)) / 2 || 0
    );
    let pathIdx = 0;

    if (inputTokens && outputTokens) {
      for (let i = 0; i < inputTokens.length; i++) {
        for (let j = 0; j < outputTokens.length; j++) {
          const similarity = crossSimilarityMatrix[i][j];
          if (similarity > similarityThreshold) {
            paths[pathIdx++] = { i, j, similarity };
          }
        }
      }
    } else if (targetWordIdx !== null) {
      for (let i = 0; i < tokens.length; i++) {
        if (i === targetWordIdx) continue;
        const similarity = similarityMatrix[i][targetWordIdx];
        if (similarity > similarityThreshold) {
          paths[pathIdx++] = { i, targetWordIdx, similarity };
        }
      }
    } else {
      for (let i = 0; i < tokens.length - 1; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
          const similarity = similarityMatrix[i][j];
          if (similarity > similarityThreshold) {
            paths[pathIdx++] = { i, j, similarity };
          }
        }
      }
    }

    return paths.slice(0, pathIdx);
  }, [
    tokens,
    similarityMatrix,
    similarityThreshold,
    targetWordIdx,
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
  ]);
};

// Keep usePathsV1 unchanged
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
  const strokeColor = useMemo(() => (isblack ? "white" : "black"), [isblack]);
  const baseOpacity = useMemo(
    () => [0.7, 0.5, 0.3][subLevel] || 0.5,
    [subLevel]
  );
  const [windowWidth] = useResize();

  const calculateTextPoint = useCallback(
    (x1, y1, x2, y2, dir) => {
      const midX = (x1 + x2) / 2;
      const radius = Math.abs(x2 - x1) / 2;
      const midY =
        (y1 + y2) / 2 + (dir === 1 ? -1 : 1) * (radius * 0.6 + yMargin * 1.5);
      return [midX, midY];
    },
    [yMargin]
  );

  const getTextOpacity = useCallback(
    (type) => {
      if (type === "token") {
        return isAnimating ? 1 : 0;
      }
      return isAnimating ? 0 : 1 - baseOpacity;
    },
    [isAnimating, baseOpacity]
  );

  const getPathOpacity = useCallback(
    (i, j) =>
      !isAnimating || j === targetWordIdx || i === targetWordIdx ? 1 : 0.15,
    [isAnimating, targetWordIdx]
  );

  const createPathElement = useCallback(
    (
      x1,
      y1,
      x2,
      y2,
      similarity,
      dir,
      isInteraction = false,
      pathOpacity = 1,
      key,
      type
    ) => {
      const baseWidth =
        subLevel === 0
          ? type === "token"
            ? 1
            : 0.4
          : similarity ** 2 * (subLevel === 1 ? 2 : 4) + 0.2;

      return (
        <g key={key}>
          <path
            d={createArcPath(x1, y1, x2, y2, { yMargin, dir })}
            stroke={strokeColor}
            fill="none"
            strokeWidth={calculateResponsiveStrokeWidth(baseWidth, windowWidth)}
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
              opacity={getTextOpacity(type)}
            >
              {similarity.toFixed(2)}
            </text>
          )}
        </g>
      );
    },
    [
      createArcPath,
      strokeColor,
      yMargin,
      subLevel,
      getTextOpacity,
      calculateTextPoint,
    ]
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
      paths.push(
        createPathElement(
          x1,
          y1,
          x2,
          y2,
          similarity,
          i % 2 === 0 ? 1 : 0,
          false,
          1,
          `arc-group-${i}`,
          "token"
        )
      );
    });

    // Interaction paths with optimized loop
    for (let i = 0; i < tokens.length - 1; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        const similarity = similarityMatrix[i][j];
        if (similarity <= 0.01 || !similarity) continue;

        const [x1, y1] = wordPosCalc(i);
        const [x2, y2] = wordPosCalc(j);

        paths.push(
          createPathElement(
            x1,
            y1,
            x2,
            y2,
            similarity,
            j % 2 === 0 ? 1 : 0,
            true,
            getPathOpacity(i, j),
            `arc-group-${i}-${j}`,
            "all"
          )
        );
      }
    }

    return paths;
  }, [
    tokens,
    similarityMatrix,
    wordPosCalc,
    targetWordIdx,
    createPathElement,
    getPathOpacity,
  ]);
}

export function usePathsV2({
  tokens,
  similarityMatrix,
  wordPosCalc,
  yMargin,
  radialIdx,
  isblack,
  createRadialPath,
  isAnimating,
  subLevel,
}) {
  const strokeColor = useStrokeColor(isblack);
  const opacityMultiply = useMemo(
    () => [1, 0.7, 0.7][subLevel] || 1,
    [subLevel]
  );
  const [windowWidth] = useResize();

  const directionStates = useMemo(() => {
    const states = new Map();
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        states.set(`${i}-${j}`, Math.random() < 0.5 ? 1 : 0);
      }
    }
    return states;
  }, [tokens]);

  useRandomInterval(
    () => {
      directionStates.forEach((_, key) => {
        if (Math.random() < 0.3) {
          directionStates.set(key, Math.random() < 0.5 ? 1 : 0);
        }
      });
    },
    5,
    50,
    isAnimating
  );

  const calculateRadialTextPoint = useCallback(
    (x1, y1, x2, y2, dir, radialIdx) => {
      const midX = (x1 + x2) / 2;
      const radius = Math.abs(x2 - x1) / 2;
      const midY =
        (y1 + y2) / 2 +
        (dir === 1 ? -1 : 1) * (radius * radialIdx + yMargin * 1.5);
      return [midX, midY];
    },
    [yMargin]
  );

  return useMemo(() => {
    return tokens.flatMap((_, i) =>
      tokens
        .map((_, j) => {
          if (i >= j) return null;
          const similarity = similarityMatrix[i][j];
          if (similarity <= 0.05) return null;

          const [x1, y1] = wordPosCalc(i);
          const [x2, y2] = wordPosCalc(j);
          const dir = directionStates.get(`${i}-${j}`);
          const pathRadialIdx = Math.random() < 0.5 ? radialIdx : 1 - radialIdx;

          const [textX, textY] = calculateRadialTextPoint(
            x1,
            y1,
            x2,
            y2,
            dir,
            pathRadialIdx
          );

          const baseWidth = similarity ** 2 * 4;

          return (
            <g key={`arc-${i}-${j}`}>
              <BasePath
                d={createRadialPath(x1, y1, x2, y2, {
                  margin: yMargin,
                  radialIdx: pathRadialIdx,
                  dir,
                })}
                stroke={strokeColor}
                strokeWidth={calculateResponsiveStrokeWidth(
                  baseWidth,
                  windowWidth
                )}
              />
              <text
                x={textX}
                y={textY}
                fill={strokeColor}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize="0.7vw"
                opacity={opacityMultiply}
              >
                {similarity.toFixed(2)}
              </text>
            </g>
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
    createRadialPath,
    strokeColor,
    calculateRadialTextPoint,
    opacityMultiply,
    directionStates,
    windowWidth,
  ]);
}

export function usePathsBezier({
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
  isPlural,
}) {
  const strokeColor = useStrokeColor(isblack);
  const [windowWidth] = useResize();

  const validPaths = useValidPaths({
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    similarityThreshold,
  });

  return useMemo(() => {
    return validPaths.map(({ i, j, similarity }) => {
      const [x1, y1] = inputPosCalc.wordPosCalc(i);
      const [x2, y2] = outputPosCalc.wordPosCalc(j);

      const bezierParam = isPlural
        ? (bezierParams && bezierParams[`${i}-${j}`]) || BEZIER_DEFAULT
        : bezierParams;

      const baseWidth = Math.pow(similarity, 3) * strokeWidthMultiplier;

      return (
        <BasePath
          key={`arc-${i}-${j}`}
          d={createBezierPath(x1, y1, x2, y2, bezierParam, {
            inputMargin: inputPosCalc.yMargin,
            outputMargin: outputPosCalc.yMargin,
          })}
          stroke={strokeColor}
          strokeWidth={calculateResponsiveStrokeWidth(baseWidth, windowWidth)}
        />
      );
    });
  }, [
    validPaths,
    inputPosCalc,
    outputPosCalc,
    bezierParams,
    createBezierPath,
    strokeColor,
    strokeWidthMultiplier,
    isPlural,
    windowWidth,
  ]);
}

export function usePathsRadial({
  tokens,
  similarityMatrix,
  wordPosCalc,
  yMargin,
  isblack,
  createRadialPath,
  similarityThreshold,
  strokeWidthMultiplier,
  type,
  show,
}) {
  const strokeColor = useStrokeColor(isblack);
  const direction = type === "input" ? 0 : 1;
  const [windowWidth] = useResize();

  const validPaths = useValidPaths({
    tokens,
    similarityMatrix,
    similarityThreshold,
  });

  return useMemo(() => {
    if (!show) return [];

    return validPaths.map(({ i, j, similarity }) => {
      const [x1, y1] = wordPosCalc(i);
      const [x2, y2] = wordPosCalc(j);

      const baseWidth = Math.pow(similarity, 3) * strokeWidthMultiplier;

      return (
        <BasePath
          key={`${type}-radial-${i}-${j}`}
          d={createRadialPath(x1, y1, x2, y2, {
            margin: yMargin,
            radialIdx: 1,
            dir: direction,
          })}
          stroke={strokeColor}
          strokeWidth={calculateResponsiveStrokeWidth(baseWidth, windowWidth)}
        />
      );
    });
  }, [
    show,
    validPaths,
    wordPosCalc,
    yMargin,
    createRadialPath,
    strokeColor,
    strokeWidthMultiplier,
    direction,
    type,
    windowWidth,
  ]);
}
