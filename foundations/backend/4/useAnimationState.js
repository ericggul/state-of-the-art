import { useState, useEffect } from "react";

export function useAnimationState(isblack, visible, subLevel) {
  const [xRange, setXRange] = useState(0.5);
  const [yRange, setYRange] = useState(18);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (subLevel === 0) {
      setXRange(0.5);
      setYRange(18);
    }
    if (subLevel === 1) {
      setXRange(2.5);
      setYRange(20);
    }
    if (subLevel === 2) {
      setXRange(3);
      setYRange(30);
    }

    setIsAnimating(isblack && visible);
  }, [isblack, visible, subLevel]);

  return { xRange, yRange, isAnimating };
}
