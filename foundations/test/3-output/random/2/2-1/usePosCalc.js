import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function usePosCalc({ tokens, logProbs, isAnimating }) {
  const [windowWidth, windowHeight] = useResize();
  const [tokenPositions, setTokenPositions] = useState([]);

  const generatePositions = () => {
    return tokens.map((token, idx) => {
      const x = getRandom(0.1, 0.9) * windowWidth;
      const y = getRandom(0.1, 0.9) * windowHeight;

      const subPositions = logProbs[idx].top_logprobs.map(() => ({
        x: x + getRandom(-50, 50),
        y: y + getRandom(-50, 50),
      }));

      return {
        main: { x, y },
        subs: subPositions,
      };
    });
  };

  useEffect(() => {
    if (isAnimating) {
      setTokenPositions(generatePositions());
    } else {
      // Optionally set positions when not animating
      // setTokenPositions(generatePositions());
    }
  }, [windowWidth, windowHeight, tokens, logProbs, isAnimating]);

  const wordPosCalc = useCallback(
    (xIdx, yIdx = -1) => {
      if (yIdx === -1) {
        return [tokenPositions[xIdx]?.main.x, tokenPositions[xIdx]?.main.y];
      } else {
        return [tokenPositions[xIdx]?.subs[yIdx]?.x, tokenPositions[xIdx]?.subs[yIdx]?.y];
      }
    },
    [tokenPositions]
  );

  return {
    wordPosCalc,
  };
}
