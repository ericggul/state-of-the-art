import { useMemo, useCallback } from "react";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";

export default function usePosCalc({ tokens }) {
  const { wordInterval, yMargin, generateStaticPositions } = useBasePosCalc({
    tokens,
    type: "center", // This will center the tokens vertically
  });

  const positions = useMemo(
    () => generateStaticPositions(),
    [generateStaticPositions]
  );

  const wordPosCalc = useCallback(
    (idx) => {
      const position = positions[idx];
      return position ? [position.x, position.y] : [0, 0];
    },
    [positions]
  );

  return {
    wordPosCalc,
    wordInterval,
    yMargin,
  };
}
