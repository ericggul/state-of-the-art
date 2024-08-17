import { useMemo, useCallback } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function usePosCalc({ tokens, type = null }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const yMargin = useMemo(() => windowHeight * 0.03, [windowHeight]);

  // Generate completely random positions for each token (both x and y) and store them in useMemo
  const randomPositions = useMemo(
    () =>
      tokens.map(() => ({
        x: getRandom(0.1, 0.9) * windowWidth,
        y: getRandom(0.1, 0.9) * windowHeight,
      })),
    [tokens, windowWidth, windowHeight]
  );

  const wordPosCalc = useCallback(
    (idx) => {
      const xPos = randomPositions[idx].x;
      let yPos = randomPositions[idx].y;

      if (type === "input") {
        yPos = randomPositions[idx].y; // Random y position for input
      } else if (type === "output") {
        yPos = randomPositions[idx].y; // Random y position for output
      }

      return [xPos, yPos];
    },
    [randomPositions]
  );

  return {
    wordPosCalc,
    yMargin,
  };
}
