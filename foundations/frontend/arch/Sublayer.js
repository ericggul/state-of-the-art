import React from "react";
import InstancedNodes from "./InstancedNodes";
import { GRID_CONFIGS } from "../arch-models";

export const INTERLAYER_MARGIN_X = 1.3;
export const INTERLAYER_MARGIN_Y = 3.0;

const Sublayer = ({
  position,
  sublayer,
  style,
  model,
  useGivenInterval = false,
}) => {
  const size = sublayer.dimensions || [20, 8, 8];
  let gridConfig = GRID_CONFIGS[model] || {};

  const grid = gridConfig[sublayer.type] || {
    xCount: 3,
    yCount: 3,
    xInterval: 10,
    yInterval: 10,
  };

  return (
    <group position={position}>
      <InstancedNodes
        xCount={grid.xCount}
        yCount={grid.yCount}
        //New Method: Automatically calculate xInterval and yInterval based on size and grid size
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
        //Old Method: Use the xInterval and yInterval from the grid
        // xInterval={grid.xInterval}
        // yInterval={grid.yInterval}
        // nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        style={style}
        color={style.colors.inner}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

export default Sublayer;
