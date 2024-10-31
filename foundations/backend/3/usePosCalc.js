import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

import {
  Y_START,
  Y_MARGIN,
  X_WIDTH_MAX,
} from "@/foundations/backend/constant/vis-params";

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
    return Math.min(
      0.05 * windowWidth,
      (windowWidth * X_WIDTH_MAX) / wordLength
    );
  }, [windowWidth, wordLength]);

  const yMargin = useMemo(() => windowHeight * Y_MARGIN, [windowHeight]);

  const [tokenPositions, setTokenPositions] = useState([]);

  // Memoized position calculator for non-animated state
  const generateStaticPositions = useCallback(() => {
    return tokens.map((_, idx) => {
      const xPos =
        windowWidth / 2 -
        ((wordLength - 1) * wordInterval) / 2 +
        idx * wordInterval;
      let yPos = windowHeight / 2;

      if (type === "input") {
        yPos = windowHeight * Y_START;
      } else if (type === "output") {
        yPos = windowHeight * (1 - Y_START);
      }

      return { x: xPos, y: yPos };
    });
  }, [tokens, wordLength, wordInterval, windowWidth, windowHeight, type]);

  useEffect(() => {
    setTokenPositions(generateStaticPositions());
  }, [generateStaticPositions, isAnimating, timeUnit]);

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
