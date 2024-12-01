import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({
  tokens,
  isAnimating,
  range,
  timeUnit,
  type,
}) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = tokens.length;

  const wordInterval = useMemo(() => {
    if (wordLength === 0) return 0;
    return Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength);
  }, [windowWidth, wordLength]);

  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  const [tokenPositions, setTokenPositions] = useState([]);

  // Memoized position generator for animated state
  const generateRandomPositions = useCallback(() => {
    return tokens.map(() => ({
      x: getRandom(range.x[0], range.x[1]) * windowWidth,
      y: getRandom(range.y[0], range.y[1]) * windowHeight,
    }));
  }, [tokens, range, windowWidth, windowHeight]);

  // Memoized position calculator for non-animated state
  const generateStaticPositions = useCallback(() => {
    return tokens.map((_, idx) => {
      const xPos =
        windowWidth / 2 -
        ((wordLength - 1) * wordInterval) / 2 +
        idx * wordInterval;
      let yPos = windowHeight / 2;

      if (type === "input") {
        yPos = windowHeight * 0.2;
      } else if (type === "output") {
        yPos = windowHeight * 0.8;
      }

      return { x: xPos, y: yPos };
    });
  }, [tokens, wordLength, wordInterval, windowWidth, windowHeight, type]);

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generateRandomPositions());

      const intervalId = setInterval(() => {
        setTokenPositions(generateRandomPositions());
      }, 100 * timeUnit);

      return () => clearInterval(intervalId);
    } else {
      // Set static positions when not animating
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
