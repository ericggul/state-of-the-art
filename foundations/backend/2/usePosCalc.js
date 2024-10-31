import { useState, useEffect, useCallback } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";

export default function usePosCalc({
  tokens,
  isAnimating,
  range,
  timeUnit,
  type,
}) {
  const { wordInterval, yMargin, generateStaticPositions } = useBasePosCalc({
    tokens,
    type: "center",
  });
  const [tokenPositions, setTokenPositions] = useState([]);

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

  return { wordPosCalc, wordInterval, yMargin };
}
