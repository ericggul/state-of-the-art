import { useState, useEffect, useCallback, useMemo } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRangeConfig = {
  0: { x: [0, 1], y: [0.3, 0.7] },
  1: { x: [0.25, 0.75], y: [0.25, 0.75] },
  2: { x: [0.3, 0.7], y: [0, 1] },
};

const randomise1 = () => {
  const startOff = getRandom(-0.1, 0.2);
  const xRandom = getRandom(startOff, 0.45);
  let yRandom;
  if (Math.random() < 0.5) {
    yRandom = 0.5 + startOff - xRandom;
  } else {
    yRandom = getRandom(0, 1);
  }
  return { x: [xRandom, 1 - xRandom], y: [yRandom, 1 - yRandom] };
};

const randomise2 = () => {
  // const xRandom = getRandom(0, 1);
  // const yRandom = getRandom(0, 0.4);
  const xRandom = getRandom(0, 1);
  const yRandom = getRandom(0, 0.4);
  return { x: [xRandom, 1 - xRandom], y: [yRandom, 1 - yRandom] };
};

const randomise3 = () => {
  const xRandom = getRandom(0.3, 0.6);
  const yRandom = getRandom(0.3, 0.45);
  return { x: [xRandom, 1 - xRandom], y: [yRandom, 1 - yRandom] };
};

const randomise4 = () => {
  const pointX = getRandom(0.1, 0.5);
  const pointY = getRandom(0.1, 0.5);
  const xRandom = getRandom(pointX - 0.1, pointX + 0.1);
  const yRandom = getRandom(pointY - 0.1, pointY + 0.1);
  return { x: [xRandom, 1 - xRandom], y: [yRandom, 1 - yRandom] };
};

const randomiseRangeConfig = () => {
  return randomise1();
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
  const [currentRange, setCurrentRange] = useState(() =>
    level >= 5
      ? randomiseRangeConfig()
      : getRangeConfig[subLevel] ?? randomiseRangeConfig()
  );

  const [intervalRange, setIntervalRange] = useState({ min: 10, max: 80 });

  // useEffect(() => {
  //   if (isAnimating) {
  //     setIntervalRange({ min: getRandom(1, 20), max: getRandom(20, 70) });
  //   }
  // }, [isAnimating]);

  useRandomInterval(
    () => {
      setCurrentRange(
        level >= 5
          ? randomiseRangeConfig()
          : getRangeConfig[subLevel] ?? randomiseRangeConfig()
      );
    },
    intervalRange.min * timeUnit,
    intervalRange.max * timeUnit,
    isAnimating
  );

  const generateRandomPositions = useCallback(() => {
    const basePosition = () => ({
      x: getRandom(currentRange.x[0], currentRange.x[1]) * windowWidth,
    });

    if (subLevel === 1) {
      const thirdPoint = (currentRange.y[1] - currentRange.y[0]) / 2;
      return tokens.map(() => ({
        ...basePosition(),
        y:
          (type === "input"
            ? getRandom(currentRange.y[0], currentRange.y[0] + thirdPoint)
            : getRandom(currentRange.y[1] - thirdPoint, currentRange.y[1])) *
          windowHeight,
      }));
    }

    return tokens.map(() => ({
      ...basePosition(),
      y: getRandom(currentRange.y[0], currentRange.y[1]) * windowHeight,
    }));
  }, [tokens, currentRange, windowWidth, windowHeight, subLevel, type]);

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generateRandomPositions());
      const positionIntervalId = setInterval(() => {
        setTokenPositions(generateRandomPositions());
      }, getRandom(50, 150) * timeUnit);
      return () => clearInterval(positionIntervalId);
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
    level,
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
