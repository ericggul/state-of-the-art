import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import Connections from "../connections/Connections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../models/self_supervised";

// Constants for positioning
const INTERLAYER_MARGIN = 1.2; // Adjust as needed

export default function SelfSupervisedLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerHeight = modelConfig.layerHeight || 20;

  // Calculate layer positions
  const layers = useMemo(() => {
    const gridConfig = GRID_CONFIGS[model] || {};

    return structure.map((layer, i) => {
      const grid = gridConfig[layer.type] || {
        xCount: 1,
        yCount: 1,
        xInterval: 1,
        yInterval: 1,
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
      {layers.map((layer, i) => (
        <Sublayer
          key={`${model}-${layer.name}-${i}`}
          position={layer.position}
          sublayer={layer}
          style={style}
          model={model}
        />
      ))}
      {/* <Connections structure={layers} style={style} /> */}
    </group>
  );
}
