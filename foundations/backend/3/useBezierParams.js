import { useState, useCallback, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

import { generateBezierParams } from "../shared/hooks/useBezierBase";

export default function useBezierParams(
  xRange,
  yRange,
  visible,
  isAnimating,
  timeUnit,
  subLevel
) {
  const [bezierParams, setBezierParams] = useState(() =>
    generateBezierParams(0, 0)
  );

  const shouldUpdate = visible && isAnimating;

  useEffect(() => {
    if (!shouldUpdate) return;
    setBezierParams(generateBezierParams(xRange, yRange));
  }, [xRange, yRange, shouldUpdate]);

  useRandomInterval(
    useCallback(() => {
      if (shouldUpdate) {
        setBezierParams(generateBezierParams(xRange, yRange));
      }
    }, [xRange, yRange, shouldUpdate]),
    timeUnit,
    10 * timeUnit,
    visible
  );

  return bezierParams;
}
