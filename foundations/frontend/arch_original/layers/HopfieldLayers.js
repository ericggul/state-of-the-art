import React from "react";
import Circle from "../Circle";
import HopfieldConnections from "../connections/HopfieldConnections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

function HopfieldLayers({ structure, style, model }) {
  const config = LAYER_CONFIGS[model];
  const gridConfig = GRID_CONFIGS[model];

  return (
    <group>
      <HopfieldConnections structure={structure} style={style} model={model} />
      {structure.map((layer, i) => {
        const gridForLayer = gridConfig[layer.type];

        if (!gridForLayer) {
          console.error("Missing grid config for layer type:", layer.type);
          return null;
        }

        return (
          <HopfieldLayer
            key={`${config.keyPrefix}-layer-${i}`}
            layer={layer}
            style={style}
            grid={gridForLayer}
          />
        );
      })}
    </group>
  );
}

function HopfieldLayer({ layer, style, grid }) {
  const { nodeCount, radius } = grid;

  return (
    <Circle
      nodeCount={nodeCount}
      radius={radius * 2}
      style={style}
      layer={layer}
      nodeSize={[2, 2, 2]}
    />
  );
}

export default HopfieldLayers;
