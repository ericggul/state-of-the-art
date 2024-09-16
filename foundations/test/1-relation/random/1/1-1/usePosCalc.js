import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({ tokens, type = null, isAnimating, range }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  // State to store positions
  const [tokenPositions, setTokenPositions] = useState([]);

  // Function to generate positions
  const generatePositions = () => {
    if (isAnimating) {
      // Generate random positions within the given range
      return tokens.map(() => ({
        x: getRandom(range.x[0], range.x[1]) * windowWidth,
        y: getRandom(range.y[0], range.y[1]) * windowHeight,
      }));
    } else {
      // Generate positions based on type (input or output)
      return tokens.map((_, idx) => {
        const xPos = windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval;
        let yPos = windowHeight / 2;

        if (type === "input") {
          yPos = windowHeight * 0.2;
        } else if (type === "output") {
          yPos = windowHeight * 0.8;
        }

        return { x: xPos, y: yPos };
      });
    }
  };

  useEffect(() => {
    setTokenPositions(generatePositions());

    let intervalId;
    if (isAnimating) {
      intervalId = setInterval(() => {
        setTokenPositions(generatePositions());
      }, 100);
    }

    // Cleanup interval on component unmount or when animation stops
    return () => clearInterval(intervalId);
  }, [windowWidth, windowHeight, tokens, isAnimating, range]);

  const wordPosCalc = useCallback((idx) => [tokenPositions[idx]?.x, tokenPositions[idx]?.y], [tokenPositions]);

  return {
    wordPosCalc,
    wordInterval,
    yMargin,
  };
}
