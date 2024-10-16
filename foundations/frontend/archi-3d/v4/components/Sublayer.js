import React from "react";
import InstancedNodes from "./InstancedNodes";

const Sublayer = ({ position, sublayer, style, model }) => {
  const size = sublayer.dimensions || [20, 8, 8];

  const grid = sublayer.gridConfig || {
    xCount: 1,
    yCount: 1,
    xInterval: 10,
    yInterval: 10,
  };

  return (
    <group position={position}>
      <InstancedNodes
        xCount={grid.xCount}
        yCount={grid.yCount}
        xInterval={grid.xInterval}
        yInterval={grid.yInterval}
        nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        style={style}
        color={style.colors.inner}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

export default Sublayer;
