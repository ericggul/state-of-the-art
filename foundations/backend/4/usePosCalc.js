import { useState, useEffect, useCallback, useMemo } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRangeConfig = {
  0: { x: [0, 1], y: [0.3, 0.7] },
  1: { x: [0.25, 0.75], y: [0.25, 0.75] },
  2: { x: [0.3, 0.7], y: [0, 1] },
};

const randomiseRangeConfig = () => {
  const xRandom = getRandom(0, 1);
  // const yRandom = 1 - xRandom;
  const yRandom = getRandom(0, 1);

  return { x: [xRandom, 1 - xRandom], y: [yRandom, 1 - yRandom] };
};

export default function usePosCalc({
  tokens,
  isAnimating,
  timeUnit,
  type,
  subLevel,
  level,
}) {
  const {
    windowWidth,
    windowHeight,
    wordInterval,
    yMargin,
    generateStaticPositions,
  } = useBasePosCalc({ tokens, type });
  const [tokenPositions, setTokenPositions] = useState([]);

  // const range = useMemo(
  //   () => getRangeConfig[subLevel] ?? randomiseRangeConfig(),
  //   [subLevel]
  // );
  const range = useMemo(randomiseRangeConfig, [subLevel]);

  const generateRandomPositions = useCallback(() => {
    const basePosition = () => ({
      x: getRandom(range.x[0], range.x[1]) * windowWidth,
    });

    if (subLevel === 1) {
      const midPoint = (range.y[1] - range.y[0]) / 2;
      const thirdPoint = (range.y[1] - range.y[0]) / 2;
      return tokens.map(() => ({
        ...basePosition(),
        y:
          (type === "input"
            ? getRandom(range.y[0], range.y[0] + thirdPoint)
            : getRandom(range.y[1] - thirdPoint, range.y[1])) * windowHeight,
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
      if (subLevel === 0 || level === 4) {
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
