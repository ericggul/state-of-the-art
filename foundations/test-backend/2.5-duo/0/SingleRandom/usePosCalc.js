import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({ tokens, isAnimating, range }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = tokens.length;

  const wordInterval = useMemo(() => {
    if (wordLength === 0) return 0;
    return Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength);
  }, [windowWidth, wordLength]);

  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  const [tokenPositions, setTokenPositions] = useState([]);

  // Memoized position generator
  const generatePositions = useCallback(() => {
    return tokens.map(() => ({
      x: getRandom(range.x[0], range.x[1]) * windowWidth,
      y: getRandom(range.y[0], range.y[1]) * windowHeight,
    }));
  }, [tokens, range, windowWidth, windowHeight]);

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generatePositions());

      const intervalId = setInterval(() => {
        setTokenPositions(generatePositions());
      }, 100);

      return () => clearInterval(intervalId);
    } else {
      // Set static positions when not animating
      setTokenPositions(generatePositions());
    }
  }, [generatePositions, isAnimating]);

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
