import { useState, useEffect, useCallback, useMemo } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRangeConfig = {
  0: { x: [0, 1], y: [0.3, 0.7] },
  1: { x: [0.25, 0.75], y: [0.25, 0.75] },
  2: { x: [0.3, 0.7], y: [0, 1] },
};

const randomiseRangeConfig = () => {
  const startOff = getRandom(-0.1, 0);

  const xRandom = getRandom(startOff, 0.45);
  // const yRandom = getRandom(0, 1);
  let yRandom;
  if (Math.random() < 0.55) {
    yRandom = 0.5 + startOff - xRandom;
  } else {
    yRandom = getRandom(0, 1);
  }

  return { x: [xRandom, 1 - xRandom], y: [yRandom, 1 - yRandom] };
};

// const randomiseRangeConfig = () => {
//   const x1Random = getRandom(0, 0.3);
//   const x2Random = getRandom(0.7, 1);
//   const y1Random = getRandom(0, 0.3);
//   const y2Random = getRandom(0.7, 1);

//   return { x: [x1Random, x2Random], y: [y1Random, y2Random] };
// };

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
  const range = useMemo(
    () =>
      level >= 5
        ? randomiseRangeConfig()
        : getRangeConfig[subLevel] ?? randomiseRangeConfig(),
    [subLevel, level >= 5]
  );

  useEffect(() => {
    console.log("range changed", range.x, range.y);
  }, [range]);

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
      }, getRandom(50, 150) * timeUnit);
      return () => clearInterval(intervalId);
    } else {
      if (level === 4 || subLevel === 0) {
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
