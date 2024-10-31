import { useState, useCallback } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import { getWeightedRandom } from "./mathUtils";

export default function useBezierParams(
  inputTokens,
  outputTokens,
  xRange,
  yRange,
  visible,
  isAnimating,
  timeUnit
) {
  const [bezierParams, setBezierParams] = useState({
    controlX1Factor: 0,
    controlX2Factor: 1,
    controlY1Factor: 10,
    controlY2Factor: 5,
  });

  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;

    setBezierParams({
      controlX1Factor: getWeightedRandom(-xRange, xRange),
      controlX2Factor: getWeightedRandom(0.7 - xRange, 0.7 + xRange),
      controlY1Factor: getWeightedRandom(10 - yRange, 10 + yRange),
      controlY2Factor: getWeightedRandom(10 - yRange, 10 + yRange),
    });
  }, [xRange, yRange, visible, isAnimating]);

  useRandomInterval(updateBezierParams, 1 * timeUnit, 10 * timeUnit, visible);

  return bezierParams;
}
