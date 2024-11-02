import { useState, useCallback, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function useRadialParams(
  visible,
  isAnimating,
  timeUnit,
  subLevel
) {
  const [radialIdx, setRadialIdx] = useState(0.6);

  const updateRadialParams = useCallback(() => {
    if (!visible || !isAnimating) return;

    if (subLevel === 0) {
      setRadialIdx(getRandom(0.5, 0.6));
    } else if (subLevel === 1) {
      setRadialIdx(getRandom(0.2, 0.8));
    } else {
      setRadialIdx(getRandom(0.3, 12.0));
    }
  }, [visible, isAnimating]);

  useRandomInterval(
    updateRadialParams,
    1 * timeUnit,
    30 * timeUnit,
    isAnimating
  );

  useEffect(() => {
    if (!isAnimating) {
      setRadialIdx(0.6);
    }
  }, [isAnimating]);

  return radialIdx;
}
