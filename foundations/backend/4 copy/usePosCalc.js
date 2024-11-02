import { useState, useEffect, useCallback } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({
  tokens,
  isAnimating,
  range,
  timeUnit,
  type,
}) {
  const {
    windowWidth,
    windowHeight,
    wordInterval,
    yMargin,
    generateStaticPositions,
  } = useBasePosCalc({ tokens, type });
  const [tokenPositions, setTokenPositions] = useState([]);

  const generateRandomPositions = useCallback(() => {
    return tokens.map(() => ({
      x: getRandom(range.x[0], range.x[1]) * windowWidth,
      y: getRandom(range.y[0], range.y[1]) * windowHeight,
    }));
  }, [tokens, range, windowWidth, windowHeight]);

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generateRandomPositions());
      const intervalId = setInterval(() => {
        setTokenPositions(generateRandomPositions());
      }, 100 * timeUnit);
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

  return { wordPosCalc, wordInterval, yMargin };
}
