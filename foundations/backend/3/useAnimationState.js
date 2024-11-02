import { useState, useEffect } from "react";

export function useAnimationState(isblack, visible, subLevel) {
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setXRange(1 * (subLevel ** 2 + 0.01));
    setYRange(8 * (subLevel ** 2 + 0.2));
    setIsAnimating(isblack && visible);
  }, [isblack, visible, subLevel]);

  return { xRange, yRange, isAnimating };
}
