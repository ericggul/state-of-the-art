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
  const [bezierParams, setBezierParams] = useState({});

  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;

    const newParams = {};
    inputTokens.forEach((_, i) => {
      outputTokens.forEach((_, j) => {
        const key = `${i}-${j}`;
        newParams[key] = {
          controlX1Factor: getWeightedRandom(-xRange, xRange),
          controlX2Factor: getWeightedRandom(0.7 - xRange, 0.7 + xRange),
          controlY1Factor: getWeightedRandom(10 - yRange, 10 + yRange),
          controlY2Factor: getWeightedRandom(10 - yRange, 10 + yRange),
        };
      });
    });

    setBezierParams(newParams);
  }, [inputTokens, outputTokens, xRange, yRange, visible, isAnimating]);

  useRandomInterval(updateBezierParams, 1 * timeUnit, 10 * timeUnit, visible);

  return bezierParams;
}
