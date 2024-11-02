import { useState, useEffect, useMemo } from "react";

const LEVEL_CONFIG = {
  0: { xRange: 0.5, yRange: 18 },
  1: { xRange: 2.5, yRange: 20 },
  2: { xRange: 2.0, yRange: 15 },
  default: { xRange: 0, yRange: 0 },
};

export function useAnimationState(isblack, visible, subLevel) {
  const [state, setState] = useState(() => ({
    ...LEVEL_CONFIG[0],
    isAnimating: false,
  }));

  const config = useMemo(
    () =>
      isblack || subLevel === 2
        ? LEVEL_CONFIG[subLevel] ?? LEVEL_CONFIG[0]
        : LEVEL_CONFIG.default,
    [isblack, subLevel]
  );

  useEffect(() => {
    setState({
      xRange: config.xRange,
      yRange: config.yRange,
      isAnimating: isblack && visible,
    });
  }, [config, isblack, visible]);

  return state;
}
