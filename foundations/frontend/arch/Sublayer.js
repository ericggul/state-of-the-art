import React, { memo } from "react";
import { useSpring, animated } from "@react-spring/three";
import InstancedNodes from "./InstancedNodes";
import { GRID_CONFIGS } from "../arch-models";
import useScreenStore from "@/components/screen/store";

export const INTERLAYER_MARGIN_X = 3.0;
export const INTERLAYER_MARGIN_Y = 3.0;

const DEFAULT_GRID = {
  xCount: 3,
  yCount: 3,
  xInterval: 10,
  yInterval: 10,
};

const Sublayer = memo(function Sublayer({
  position,
  sublayer,
  style,
  model,
  idx = 0,
  useGivenInterval = false,
}) {
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: {
      mass: 2,
      tension: 180,
      friction: 40,
    },
    delay: idx * 250,
  });

  const isProjector = useScreenStore((state) => state.isProjector);
  const size = sublayer.dimensions || [20, 8, 8];
  let gridConfig = GRID_CONFIGS[model] || {};

  const grid = isProjector
    ? gridConfig[sublayer.type] || DEFAULT_GRID
    : DEFAULT_GRID;

  return (
    <group position={position}>
      <animated.group scale={scale}>
        <InstancedNodes
          xCount={grid.xCount}
          yCount={grid.yCount}
          xInterval={
            useGivenInterval
              ? grid.xInterval
              : (size[0] / grid.xCount) * INTERLAYER_MARGIN_X
          }
          yInterval={
            useGivenInterval
              ? grid.yInterval
              : (size[1] / grid.yCount) * INTERLAYER_MARGIN_Y
          }
          nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
          style={style}
          color={style.colors[sublayer.type] || style.colors.inner}
          rotation={[Math.PI / 2, 0, 0]}
          sublayer={sublayer}
          isProjector={isProjector}
        />
      </animated.group>
    </group>
  );
});

Sublayer.displayName = "Sublayer";
export default Sublayer;
