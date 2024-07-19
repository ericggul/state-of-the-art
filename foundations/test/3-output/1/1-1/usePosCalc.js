import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

export default function usePosCalc({ tokens, logProbs }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => (windowWidth * 0.9) / wordLength, [windowWidth, wordLength]);
  const verticalInterval = useMemo(() => windowHeight * 0.04, [windowHeight]);

  const xMargin = useMemo(() => wordInterval * 0.03, [wordInterval]);

  const wordPosCalc = useCallback(
    (xIdx, yIdx = -1) => {
      const xPos = windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + xIdx * wordInterval;
      let yPos = windowHeight / 2;

      if (yIdx !== -1) {
        const targetLength = logProbs[xIdx].top_logprobs.length;
        const splitNumber = targetLength > 0 ? Math.floor(targetLength / 2) : 0;
        const adjustedYIdx = yIdx < splitNumber ? yIdx : yIdx + 1;
        yPos = windowHeight / 2 + (adjustedYIdx - Math.ceil((targetLength - 1) / 2)) * verticalInterval;
      }

      return [xPos, yPos];
    },
    [wordInterval, wordLength, logProbs, verticalInterval]
  );

  return {
    wordPosCalc,
    wordInterval,
    verticalInterval,
    xMargin,
  };
}
