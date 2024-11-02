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
  isPlural
) {
  // For subLevel 0 (singular)
  const [singleParams, setSingleParams] = useState(() =>
    generateBezierParams(0, 0)
  );
  // For subLevel 1,2 (plural)
  const [multiParams, setMultiParams] = useState({});

  const shouldUpdate = useMemo(
    () => visible && isAnimating,
    [visible, isAnimating]
  );

  const updateMultiParams = useCallback(() => {
    if (!shouldUpdate) return;

    const newParams = inputTokens.reduce((acc, _, i) => {
      outputTokens.forEach((_, j) => {
        acc[`${i}-${j}`] = generateBezierParams(xRange, yRange);
      });
      return acc;
    }, {});

    setMultiParams(newParams);
  }, [inputTokens, outputTokens, xRange, yRange, shouldUpdate]);

  const updateSingleParams = useCallback(() => {
    if (shouldUpdate) {
      setSingleParams(generateBezierParams(xRange, yRange));
    }
  }, [xRange, yRange, shouldUpdate]);

  // Effect for singular mode initial update
  useEffect(() => {
    if (!isPlural) {
      updateSingleParams();
    }
  }, [xRange, yRange, shouldUpdate, isPlural]);

  // Random interval for updates
  useRandomInterval(
    !isPlural ? updateSingleParams : updateMultiParams,
    2 * timeUnit,
    30 * timeUnit,
    visible
  );

  return !isPlural ? singleParams : multiParams;
}
