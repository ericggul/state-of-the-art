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
  const [bezierParams, setBezierParams] = useState({});

  const updateBezierParams = useCallback(() => {
    if (!visible || !isAnimating) return;

    const newParams = {};
    inputTokens.forEach((_, i) => {
      outputTokens.forEach((_, j) => {
        const key = `${i}-${j}`;
        newParams[key] = generateBezierParams(xRange, yRange);
      });
    });

    setBezierParams(newParams);
  }, [inputTokens, outputTokens, xRange, yRange, visible, isAnimating]);

  useRandomInterval(updateBezierParams, 1 * timeUnit, 10 * timeUnit, visible);

  return bezierParams;
}

export function useBezierParamsSingular(
  xRange,
  yRange,
  visible,
  isAnimating,
  timeUnit
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
