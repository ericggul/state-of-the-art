import { useState, useCallback } from "react";
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
  const [bezierParams, setBezierParams] = useState(generateBezierParams(0, 0));

  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;
    setBezierParams(generateBezierParams(xRange, yRange));
  }, [xRange, yRange, visible, isAnimating]);

  useRandomInterval(updateBezierParams, 1 * timeUnit, 10 * timeUnit, visible);

  return bezierParams;
}
