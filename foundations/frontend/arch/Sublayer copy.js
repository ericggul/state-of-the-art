import React, { useMemo, memo } from "react";
import { Text } from "@react-three/drei";
import InstancedNodes from "./InstancedNodes";
import { GRID_CONFIGS } from "../arch-models";

import useScreenStore from "@/components/screen/store";

// export const INTERLAYER_MARGIN_X = 1.6;
// export const INTERLAYER_MARGIN_Y = 3.0;

export const INTERLAYER_MARGIN_X = 5;
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

const Sublayer = memo(
  function Sublayer({
    position,
    sublayer,
    rotation,
    style,
    model,
    useGivenInterval = false,
  }) {
    const isProjector = useScreenStore((state) => state.isProjector);
    const size = sublayer.dimensions || [20, 8, 8];
    let gridConfig = GRID_CONFIGS[model] || {};

    const grid = isProjector
      ? gridConfig[sublayer.type] || DEFAULT_GRID
      : DEFAULT_GRID;

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
          isProjector={isProjector}
        />
      </group>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.model === nextProps.model &&
      prevProps.useGivenInterval === nextProps.useGivenInterval &&
      JSON.stringify(prevProps.position) ===
        JSON.stringify(nextProps.position) &&
      JSON.stringify(prevProps.rotation) ===
        JSON.stringify(nextProps.rotation) &&
      JSON.stringify(prevProps.sublayer) ===
        JSON.stringify(nextProps.sublayer) &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
    );
  }
);

Sublayer.displayName = "Sublayer";
export default Sublayer;
