import { useMemo, useCallback } from "react";
import useResize from "@/utils/hooks/useResize";
import {
  Y_START,
  Y_START_PROJECTOR,
  Y_MARGIN,
  X_WIDTH_MAX,
} from "@/foundations/backend/shared/constants/vis-params";
import useScreenStore from "@/components/screen/store";

export function useBasePosCalc({ tokens, type }) {
  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const isProjector = useScreenStore((state) => state.isProjector);

  // Calculate word interval based on window width and word count
  const wordInterval = useMemo(() => {
    if (wordLength === 0) return 0;
    return Math.min(
      0.05 * windowWidth,
      (windowWidth * X_WIDTH_MAX) / wordLength
    );
  }, [windowWidth, wordLength]);

  // Calculate vertical margin
  const yMargin = useMemo(() => windowHeight * Y_MARGIN, [windowHeight]);

  // Calculate Y position based on type
  const getYPosition = useCallback(
    (type) => {
      const y = isProjector ? Y_START_PROJECTOR : Y_START;
      switch (type) {
        case "input":
          return windowHeight * y;
        case "output":
          return windowHeight * (1 - y);
        case "center":
        default:
          return windowHeight / 2;
      }
    },
    [windowHeight]
  );

  // Generate positions for all tokens
  const generateStaticPositions = useCallback(() => {
    const yPos = getYPosition(type);

    return tokens.map((_, idx) => {
      const xPos =
        windowWidth / 2 -
        ((wordLength - 1) * wordInterval) / 2 +
        idx * wordInterval;

      return { x: xPos, y: yPos };
    });
  }, [tokens, wordLength, wordInterval, windowWidth, type, getYPosition]);

  return {
    windowWidth,
    windowHeight,
    wordInterval,
    yMargin,
    generateStaticPositions,
  };
}
