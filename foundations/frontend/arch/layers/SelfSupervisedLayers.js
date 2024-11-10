import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models/self_supervised";

export default function SelfSupervisedLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerGap = 10; // Adjust this value to change the gap between layers

  // Calculate layer positions
  const layers = useMemo(() => {
    const gridConfig = GRID_CONFIGS[model] || {};
    let cumulativeHeight = 0;

    const layersWithPositions = structure.map((layer, i) => {
      const grid = gridConfig[layer.type] || {
        xCount: 1,
        yCount: 1,
        xInterval: 1,
        yInterval: 1,
      };

      const layerHeight = layer.dimensions[1] || 20; // Use the layer's height or default to 20

      // Calculate the y position for this layer
      const y = cumulativeHeight + layerHeight / 2;

      // Update the cumulative height for the next layer
      cumulativeHeight += layerHeight + layerGap;

      return {
        ...layer,
        grid,
        position: [0, y, 0],
        dimensions: layer.dimensions || [20, 20, 20], // Default dimensions if not provided
      };
    });

    // Center the entire model vertically
    const totalHeight = cumulativeHeight - layerGap;
    const centerOffset = totalHeight / 2;

    return layersWithPositions.map((layer) => ({
      ...layer,
      position: [
        layer.position[0],
        layer.position[1] - centerOffset,
        layer.position[2],
      ],
    }));
  }, [structure, model]);

  return (
    <group>
      {layers.map((layer, i) => (
        <Sublayer
          key={`${model}-${layer.name}-${i}`}
          position={layer.position}
          sublayer={layer}
          style={style}
          model={model}
          useGivenInterval={true}
          idx={i}
        />
      ))}
    </group>
  );
}
