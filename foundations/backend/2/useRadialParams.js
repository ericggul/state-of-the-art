import { useState, useCallback, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function useRadialParams(visible, isAnimating, timeUnit) {
  const [radialIdx, setRadialIdx] = useState(0.6);

  const updateRadialParams = useCallback(() => {
    if (!visible || !isAnimating) return;
    setRadialIdx(Math.random() * 1.2 + 0.2);
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
