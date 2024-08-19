import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({ tokens, type = null }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  // State to store positions
  const [tokenPositions, setTokenPositions] = useState([]);

  // Function to generate completely random positions across the entire window
  const generatePositions = () => {
    return tokens.map(() => ({
      x: getRandom(0.1, 0.9) * windowWidth,
      y: getRandom(0.1, 0.9) * windowHeight,
    }));
  };

  // useEffect to update positions every 100 milliseconds
  useEffect(() => {
    // Initial position generation
    setTokenPositions(generatePositions());

    const intervalId = setInterval(() => {
      setTokenPositions(generatePositions());
    }, 50);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [windowWidth, windowHeight, tokens]);

  const wordPosCalc = useCallback((idx) => [tokenPositions[idx]?.x, tokenPositions[idx]?.y], [tokenPositions]);

  return {
    wordPosCalc,
    wordInterval,
    yMargin,
  };
}
