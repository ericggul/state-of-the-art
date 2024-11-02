import { useState, useEffect } from "react";

export function useAnimationState(isblack, visible) {
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setXRange(1.5);
    setYRange(18);
    setIsAnimating(isblack && visible);
  }, [isblack, visible]);

  return { xRange, yRange, isAnimating };
}
