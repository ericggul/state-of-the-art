import { useState, useEffect, useMemo } from "react";

const LEVEL_CONFIG = {
  0: { xRange: 0.5, yRange: 18 },
  1: { xRange: 2.5, yRange: 20 },
  2: { xRange: 2.0, yRange: 15 },
  default: { xRange: 0, yRange: 0 },
};

const getRandom = (min, max) => Math.random() * (max - min) + min;

const randomiseLevelConfig = () => {
  const xRandom = getRandom(0.5, 2.5);
  const yRandom = 15 - xRandom * 5 + getRandom(0, 2);
  return { xRange: xRandom, yRange: yRandom };
};

export function useAnimationState({ isblack, visible, subLevel, level }) {
  const [state, setState] = useState(() => ({
    ...LEVEL_CONFIG[0],
    isAnimating: false,
  }));

  const baseConfig = useMemo(
    () =>
      isblack || subLevel === 2
        ? level >= 5
          ? randomiseLevelConfig()
          : LEVEL_CONFIG[subLevel] ?? LEVEL_CONFIG[1]
        : LEVEL_CONFIG.default,
    [isblack, subLevel, level >= 5]
  );

  useEffect(() => {
    // Initial config setup
    setState({
      xRange: baseConfig.xRange,
      yRange: baseConfig.yRange,
      isAnimating: isblack && visible,
    });

    // Set up interval for config updates when isblack is true
    let intervalId;
    if (isblack) {
      intervalId = setInterval(() => {
        const newConfig = level >= 5 ? randomiseLevelConfig() : baseConfig;

        setState((prev) => ({
          ...prev,
          xRange: newConfig.xRange,
          yRange: newConfig.yRange,
        }));
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [baseConfig, isblack, visible, level]);

  return state;
}
