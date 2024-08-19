import { useMemo, useCallback } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({ tokens, type = null }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  // Generate random positions for each token and store them in useMemo
  const tokenPositions = useMemo(() => {
    return tokens.map(() => ({
      x: getRandom(0.1, 0.9) * windowWidth,
      y: type === "input" ? getRandom(0.1, 0.3) * windowHeight : getRandom(0.7, 0.9) * windowHeight,
    }));
  }, [tokens, windowWidth, windowHeight, type]);

  const wordPosCalc = useCallback((idx) => [tokenPositions[idx].x, tokenPositions[idx].y], [tokenPositions]);

  return {
    wordPosCalc,
    wordInterval,
    yMargin,
  };
}
