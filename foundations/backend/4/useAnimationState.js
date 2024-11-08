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

  const config = useMemo(
    () =>
      isblack || subLevel === 2
        ? level >= 6
          ? randomiseLevelConfig()
          : LEVEL_CONFIG[subLevel] ?? LEVEL_CONFIG[1]
        : LEVEL_CONFIG.default,
    [isblack, subLevel, level]
  );

  useEffect(() => {
    console.log("config changed", config);
    setState({
      xRange: config.xRange,
      yRange: config.yRange,
      isAnimating: isblack && visible,
    });
  }, [config, isblack, visible]);

  return state;
}
