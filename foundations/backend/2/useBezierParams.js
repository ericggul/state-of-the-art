import { useState, useCallback } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import { generateBezierParams } from "../shared/hooks/useBezierBase";

export default function useBezierParams(
  inputTokens,
  outputTokens,
  xRange,
  yRange,
  visible,
  isAnimating,
  timeUnit
) {
  const [bezierParams, setBezierParams] = useState(() => ({
    ...generateBezierParams(0, 0),
    directions: new Array(inputTokens.length * outputTokens.length)
      .fill(0)
      .map(() => (Math.random() < 0.5 ? 1 : 0)),
  }));

  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;
    setBezierParams({
      ...generateBezierParams(xRange, yRange),
      directions: new Array(inputTokens.length * outputTokens.length)
        .fill(0)
        .map(() => (Math.random() < 0.5 ? 1 : 0)),
    });
  }, [
    xRange,
    yRange,
    visible,
    isAnimating,
    inputTokens.length,
    outputTokens.length,
  ]);

  useRandomInterval(updateBezierParams, 1 * timeUnit, 10 * timeUnit, visible);

  return bezierParams;
}
