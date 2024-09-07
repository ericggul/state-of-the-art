import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({ tokens, logProbs, isAnimating, range }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => (windowWidth * 0.9) / wordLength, [windowWidth, wordLength]);
  const verticalInterval = useMemo(() => windowHeight * 0.04, [windowHeight]);

  const xMargin = useMemo(() => -wordInterval * 0.02, [wordInterval]);

  // State to store randomized X positions
  const [xPositions, setXPositions] = useState([]);

  // Function to generate random X positions
  const generateRandomXPositions = () => {
    return tokens.map(() => getRandom(range.x[0], range.x[1]) * windowWidth);
  };

  useEffect(() => {
    if (isAnimating) {
      // Generate initial random X positions
      setXPositions(generateRandomXPositions());

      const intervalId = setInterval(() => {
        setXPositions(generateRandomXPositions());
      }, 100); // Update interval for X positions

      // Cleanup interval when component unmounts or animation stops
      return () => clearInterval(intervalId);
    }
  }, [windowWidth, tokens, isAnimating]);

  const wordPosCalc = useCallback(
    (xIdx, yIdx = -1) => {
      const xPos = xPositions[xIdx] ?? windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + xIdx * wordInterval; // Use random xPosition or fallback to regular xPos
      let yPos = windowHeight / 2;

      if (yIdx !== -1) {
        const targetLength = logProbs[xIdx].top_logprobs.length;
        const splitNumber = targetLength > 0 ? Math.floor(targetLength / 2) : 0;
        const adjustedYIdx = yIdx < splitNumber ? yIdx : yIdx + 1;
        yPos = windowHeight / 2 + (adjustedYIdx - Math.ceil((targetLength - 1) / 2)) * verticalInterval;
      }

      return [xPos, yPos];
    },
    [xPositions, windowWidth, windowHeight, wordInterval, wordLength, logProbs, verticalInterval]
  );

  return {
    wordPosCalc,
    wordInterval,
    verticalInterval,
    xMargin,
  };
}
