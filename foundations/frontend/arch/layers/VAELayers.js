import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import VAEConnections from "../connections/VAEConnections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

export default function VAELayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerHeight = modelConfig.layerHeight || 60;

  const layers = useMemo(() => {
    const gridConfig = GRID_CONFIGS[model] || {};

    return structure.map((layer, i) => {
      const grid = gridConfig[layer.type] || {
        xCount: 1,
        yCount: 1,
        xInterval: 5,
        yInterval: 5,
      };

      const position = [0, 0, layerHeight * (i - (structure.length - 1) / 2)];

      return {
        ...layer,
        grid,
        position,
      };
    });
  }, [structure, model, layerHeight]);

  return (
    <group>
      <VAEConnections structure={layers} style={style} />
      {layers.map((layer, i) => (
        <Sublayer
          key={`${model}-${i}`}
          position={layer.position}
          sublayer={layer}
          style={style}
          model={model}
          idx={i}
        />
      ))}
    </group>
  );
}
