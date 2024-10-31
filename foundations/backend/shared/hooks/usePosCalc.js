import { useMemo, useCallback } from "react";

export function useBasePosCalc({
  tokens,
  windowWidth,
  windowHeight,
  wordLength,
  type,
}) {
  const wordInterval = useMemo(() => {
    if (wordLength === 0) return 0;
    return Math.min(
      0.05 * windowWidth,
      (windowWidth * X_WIDTH_MAX) / wordLength
    );
  }, [windowWidth, wordLength]);

  const yMargin = useMemo(() => windowHeight * Y_MARGIN, [windowHeight]);

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

  return {
    wordInterval,
    yMargin,
    generateStaticPositions,
  };
}
