import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

export default function usePosCalc({ tokens, type = null }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.025, [windowHeight]);

  const wordPosCalc = useCallback(
    (idx) => {
      const xPos = windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval;
      let yPos = windowHeight / 2;

      if (type === "input") {
        yPos = windowHeight * 0.2;
      } else if (type === "output") {
        yPos = windowHeight * 0.8;
      }

      return [xPos, yPos];
    },
    [wordInterval, wordLength, type]
  );

  return {
    wordPosCalc,
    wordInterval,
    yMargin,
  };
}
