import { useState, useCallback, useMemo, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import { generateBezierParams } from "../shared/hooks/useBezierBase";

export default function useBezierParams(
  inputTokens,
  outputTokens,
  xRange,
  yRange,
  visible,
  isAnimating,
  timeUnit,
  isPlural,
  skip = false
) {
  if (skip) return [];

  const [params, setParams] = useState(() => ({
    single: generateBezierParams(0, 0),
    multi: {},
  }));

  const shouldUpdate = useMemo(
    () => visible && isAnimating,
    [visible, isAnimating]
  );

  const updateParams = useCallback(() => {
    if (!shouldUpdate) return;

    const newParams = isPlural
      ? inputTokens.reduce((acc, _, i) => {
          outputTokens.forEach((_, j) => {
            acc[`${i}-${j}`] = generateBezierParams(xRange, yRange);
          });
          return acc;
        }, {})
      : generateBezierParams(xRange, yRange);

    setParams((prev) => ({
      ...prev,
      [isPlural ? "multi" : "single"]: newParams,
    }));
  }, [shouldUpdate, isPlural, inputTokens, outputTokens, xRange, yRange]);

  useEffect(() => {
    if (!isPlural && shouldUpdate) {
      updateParams();
    }
  }, [isPlural, shouldUpdate, updateParams]);

  useRandomInterval(updateParams, 8 * timeUnit, 30 * timeUnit, visible);

  return isPlural ? params.multi : params.single;
}
