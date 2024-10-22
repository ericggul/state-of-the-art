import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import {
  LAYER_CONFIGS,
  GRID_CONFIGS,
} from "../../arch-models/diffusion_models";
// import DiffusionConnections from "../connections/DiffusionConnections";

export default function DiffusionLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerGap = 10;

  const layers = useMemo(() => {
    let cumulativeHeight = 0;

    const layersWithPositions = structure.map((layer, i) => {
      const layerHeight = layer.dimensions[1] || 20;
      const y = cumulativeHeight + layerHeight / 2;
      cumulativeHeight += layerHeight + layerGap;

      return {
        ...layer,
        position: [0, y, 0],
      };
    });

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
      {/* <DiffusionConnections layers={layers} style={style} /> */}
      {layers.map((layer, i) => (
        <Sublayer
          key={`${model}-${layer.name}-${i}`}
          position={layer.position}
          sublayer={layer}
          style={style}
          model={model}
        />
      ))}
    </group>
  );
}
