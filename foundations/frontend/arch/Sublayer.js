import React, { memo } from "react";
import { useSpring, animated } from "@react-spring/three";
import InstancedNodes from "./InstancedNodes";
import { GRID_CONFIGS } from "../arch-models";
import useScreenStore from "@/components/screen/store";
import { Text } from "@react-three/drei";

export const INTERLAYER_MARGIN_X = 2.0;
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
  rotation = [0, 0, 0],
  interlayerMarginX = INTERLAYER_MARGIN_X,
  interlayerMarginY = INTERLAYER_MARGIN_Y,
}) {
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: {
      mass: 4,
      tension: 120,
      friction: 30,
      clamp: false,
    },
    delay: idx * 250,
  });

  const isProjector = useScreenStore((state) => state.isProjector);
  const size = sublayer.dimensions || [20, 8, 8];
  let gridConfig = GRID_CONFIGS[model] || {};

  const grid = isProjector
    ? gridConfig[sublayer.type] || DEFAULT_GRID
    : DEFAULT_GRID;

  const calculateFontSize = () => {
    try {
      const [width, height, depth] = size;
      const layerSize = Math.sqrt(width ** 2 + height ** 2 + depth ** 2);
      return Math.max(layerSize * 0.03, 2);
    } catch (e) {
      console.log(e);
      return 2;
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <animated.group scale={scale}>
        <InstancedNodes
          xCount={grid.xCount}
          yCount={grid.yCount}
          xInterval={
            useGivenInterval
              ? grid.xInterval
              : (size[0] / grid.xCount) * interlayerMarginX
          }
          yInterval={
            useGivenInterval
              ? grid.yInterval
              : (size[1] / grid.yCount) * interlayerMarginY
          }
          nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
          style={style}
          color={style.colors[sublayer.type] || style.colors.inner}
          rotation={[Math.PI / 2, 0, 0]}
          sublayer={sublayer}
          isProjector={isProjector}
        />
        {!isProjector && (
          <Text
            position={[0, 0, 0]}
            fontSize={calculateFontSize()}
            color={style.colors[sublayer.type] || style.colors.inner}
            anchorX="center"
            anchorY="middle"
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
            depthTest={false}
          >
            {sublayer.name}
          </Text>
        )}
      </animated.group>
    </group>
  );
});

Sublayer.displayName = "Sublayer";
export default Sublayer;
