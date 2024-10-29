import React from "react";
import Circle from "../Circle";
import BoltzmannConnections from "../connections/BoltzmannConnections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

function BoltzmannLayers({ structure, style, model }) {
  const config = LAYER_CONFIGS[model];
  const gridConfig = GRID_CONFIGS[model];

  return (
    <group>
      <BoltzmannConnections structure={structure} style={style} />
      {structure.map((layer, i) => {
        const gridForLayer = gridConfig[layer.type];

        if (!gridForLayer) {
          console.error("Missing grid config for layer type:", layer.type);
          return null;
        }

        return (
          <BoltzmannLayer
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

function BoltzmannLayer({ layer, style, grid }) {
  const { nodeCount, radius, layerPosition } = grid;

  return (
    <group position={[0, layerPosition, 0]}>
      <Circle
        nodeCount={nodeCount}
        radius={radius * 2}
        style={style}
        layer={layer}
        nodeSize={[2, 2, 2]}
      />
    </group>
  );
}

export default BoltzmannLayers;
