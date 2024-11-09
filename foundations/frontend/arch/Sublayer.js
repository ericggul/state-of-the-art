import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import InstancedNodes from "./InstancedNodes";
import { GRID_CONFIGS } from "../arch-models";

import useScreenStore from "@/components/screen/store";

export const INTERLAYER_MARGIN_X = 1.6;
export const INTERLAYER_MARGIN_Y = 3.0;

const DEFAULT_GRID = {
  xCount: 3,
  yCount: 3,
  xInterval: 10,
  yInterval: 10,
};

const NON_PROJECTOR_GRID = {
  xCount: 1,
  yCount: 1,
  xInterval: 10,
  yInterval: 10,
};

const Sublayer = ({
  position,
  sublayer,
  rotation,
  style,
  model,
  useGivenInterval = false,
}) => {
  const { isProjector } = useScreenStore();
  const size = sublayer.dimensions || [20, 8, 8];
  let gridConfig = GRID_CONFIGS[model] || {};

  const grid = isProjector
    ? gridConfig[sublayer.type] || DEFAULT_GRID
    : DEFAULT_GRID;

  console.log(grid, style);

  return (
    <group position={position}>
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
      />
    </group>
  );
};

export default Sublayer;
