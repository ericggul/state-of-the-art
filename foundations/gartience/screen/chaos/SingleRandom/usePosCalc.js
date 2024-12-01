import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const getRandom = (min, max) => Math.random() * (max - min) + min;

const randomiseRange = () => {
  const startOff = getRandom(0, 0.25);
  const xRandom = getRandom(startOff, 0.47);
  let yRandom;

  if (Math.random() < 0.7) {
    yRandom = 0.5 + startOff - xRandom;
  } else {
    yRandom = getRandom(0.1, 0.9);
  }

  return {
    x: [xRandom, 1 - xRandom],
    y: [yRandom, 1 - yRandom],
  };
};

export default function usePosCalc({
  tokens,
  isAnimating,
  range,
  timeUnit,
  type,
}) {
  const [windowWidth, windowHeight] = useResize();
  const [currentRange, setCurrentRange] = useState(range);
  const [tokenPositions, setTokenPositions] = useState([]);

  // Update range randomly
  useRandomInterval(
    () => {
      if (isAnimating) {
        setCurrentRange(randomiseRange());
      }
    },
    5 * timeUnit,
    30 * timeUnit,
    isAnimating
  );

  const generateRandomPositions = useCallback(() => {
    const basePosition = () => ({
      x: getRandom(currentRange.x[0], currentRange.x[1]) * windowWidth,
    });

    return tokens.map(() => ({
      ...basePosition(),
      y: getRandom(currentRange.y[0], currentRange.y[1]) * windowHeight,
    }));
  }, [tokens, currentRange, windowWidth, windowHeight, type]);

  const wordInterval = useMemo(() => {
    if (tokens.length === 0) return 0;
    return Math.min(0.05 * windowWidth, (windowWidth * 0.9) / tokens.length);
  }, [windowWidth, tokens.length]);

  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  const generateStaticPositions = useCallback(() => {
    return tokens.map((_, idx) => {
      const xPos =
        windowWidth / 2 -
        ((tokens.length - 1) * wordInterval) / 2 +
        idx * wordInterval;
      let yPos = windowHeight / 2;

      if (type === "input") {
        yPos = windowHeight * 0.2;
      } else if (type === "output") {
        yPos = windowHeight * 0.8;
      }

      return { x: xPos, y: yPos };
    });
  }, [tokens, wordInterval, windowWidth, windowHeight, type]);

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generateRandomPositions());
      const intervalId = setInterval(() => {
        setTokenPositions(generateRandomPositions());
      }, getRandom(1, 8) * timeUnit); // Randomized interval for more chaos
      return () => clearInterval(intervalId);
    } else {
      setTokenPositions(generateStaticPositions());
    }
  }, [generateRandomPositions, generateStaticPositions, isAnimating, timeUnit]);

  const wordPosCalc = useCallback(
    (idx) => {
      const position = tokenPositions[idx];
      return position ? [position.x, position.y] : [0, 0];
    },
    [tokenPositions]
  );

  return {
    wordPosCalc,
    wordInterval,
    yMargin,
  };
}
