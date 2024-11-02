import { useState, useEffect } from "react";

const LEVEL_CONFIG = {
  0: { xRange: 0.5, yRange: 18 },
  1: { xRange: 2.5, yRange: 20 },
  2: { xRange: 1, yRange: 20 },
};

export function useAnimationState(isblack, visible, subLevel) {
  const [state, setState] = useState({
    xRange: LEVEL_CONFIG[0].xRange,
    yRange: LEVEL_CONFIG[0].yRange,
    isAnimating: false,
  });

  useEffect(() => {
    const config = LEVEL_CONFIG[subLevel] ?? LEVEL_CONFIG[0];

    if (isblack || subLevel === 2) {
      setState({
        xRange: config.xRange,
        yRange: config.yRange,
        isAnimating: isblack && visible,
      });
    } else {
      setState({
        xRange: 0,
        yRange: 0,
        isAnimating: false,
      });
    }
  }, [isblack, visible, subLevel]);

  return state;
}
