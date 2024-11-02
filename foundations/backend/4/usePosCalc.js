import { useState, useEffect, useCallback, useMemo } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRangeConfig = {
  0: { x: [0.2, 0.8], y: [0.2, 0.8] },
  1: { x: [0.25, 0.75], y: [0.25, 0.75] },
  2: { x: [0.15, 0.85], y: [0.15, 0.85] },
};

export default function usePosCalc({
  tokens,
  isAnimating,
  timeUnit,
  type,
  subLevel,
}) {
  const {
    windowWidth,
    windowHeight,
    wordInterval,
    yMargin,
    generateStaticPositions,
  } = useBasePosCalc({ tokens, type });
  const [tokenPositions, setTokenPositions] = useState([]);

  const range = useMemo(
    () => getRangeConfig[subLevel] ?? getRangeConfig[2],
    [subLevel]
  );

  const generateRandomPositions = useCallback(() => {
    const basePosition = () => ({
      x: getRandom(range.x[0], range.x[1]) * windowWidth,
    });

    if (subLevel === 1) {
      const midPoint = (range.y[1] - range.y[0]) / 2;
      return tokens.map(() => ({
        ...basePosition(),
        y:
          (type === "input"
            ? getRandom(range.y[0], midPoint)
            : getRandom(midPoint, range.y[1])) * windowHeight,
      }));
    }

    return tokens.map(() => ({
      ...basePosition(),
      y: getRandom(range.y[0], range.y[1]) * windowHeight,
    }));
  }, [tokens, range, windowWidth, windowHeight, subLevel, type]);

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generateRandomPositions());
      const intervalId = setInterval(() => {
        setTokenPositions(generateRandomPositions());
      }, 100 * timeUnit);
      return () => clearInterval(intervalId);
    } else {
      if (subLevel === 0) {
        setTokenPositions(generateStaticPositions());
      }
    }
  }, [
    generateRandomPositions,
    generateStaticPositions,
    isAnimating,
    timeUnit,
    subLevel,
  ]);

  const wordPosCalc = useCallback(
    (idx) => {
      const position = tokenPositions[idx];
      return position ? [position.x, position.y] : [0, 0];
    },
    [tokenPositions]
  );

  return { wordPosCalc, wordInterval, yMargin };
}
