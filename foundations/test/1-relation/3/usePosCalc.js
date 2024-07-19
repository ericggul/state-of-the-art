import { useMemo } from "react";
import useResize from "@/utils/hooks/useResize";

export default function usePosCalc({ tokensArr }) {
  const [windowWidth, windowHeight] = useResize();

  const posCalcArr = useMemo(() => {
    return tokensArr.map((tokens, idx) => {
      const wordLength = tokens.length;
      const wordInterval = Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength);
      const yMargin = windowHeight * 0.02;

      const yLoc = 0.1 + (0.8 * idx) / (tokensArr.length - 1);

      const wordPosCalc = (tokenIdx) => {
        const xPos = windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + tokenIdx * wordInterval;
        const yPos = windowHeight * yLoc;

        return [xPos, yPos];
      };

      return {
        wordPosCalc,
        wordInterval,
        yMargin,
      };
    });
  }, [tokensArr, windowWidth, windowHeight]);

  return posCalcArr;
}
