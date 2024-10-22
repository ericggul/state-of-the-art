import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import GANConnections from "../connections/GANConnections";

import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

const MAX_DIMENSION = 10000;

function scaleDimensions(dimensions) {
  const maxDim = Math.max(...dimensions);
  if (maxDim > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / maxDim;
    return dimensions.map((dim) => Math.round(dim * scale));
  }
  return dimensions;
}

export default function GANLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerHeight = modelConfig.layerHeight || 60;
  const layerGap = 10; // Gap between layers

  const layers = useMemo(() => {
    // Scale down dimensions if they exceed the threshold
    const scaledStructure = structure.map((layer) => ({
      ...layer,
      dimensions: scaleDimensions(layer.dimensions),
    }));

    // Calculate heights for all layers
    const layerHeights = scaledStructure.map((layer) => layer.dimensions[1]);

    // Calculate cumulative positions
    const positions = [];
    let cumulativeHeight = 0;
    for (let i = 0; i < layerHeights.length; i++) {
      if (i > 0) {
        cumulativeHeight +=
          (layerHeights[i - 1] + layerHeights[i]) / 2 + layerHeight;
      }
      positions.push(cumulativeHeight);
    }

    // Calculate total height and center offset
    const totalHeight =
      cumulativeHeight + layerHeights[layerHeights.length - 1];
    const centerOffset = totalHeight / 2;

    return scaledStructure.map((layer, index) => {
      const yPosition = positions[index] - centerOffset;
      const zPosition = layer.stack === "discriminator" ? 100 : -100;

      return {
        ...layer,
        position: [0, yPosition, zPosition],
      };
    });
  }, [structure, layerHeight, layerGap]);

  console.log(layers);

  const generatorLayers = layers.filter((layer) => layer.stack === "generator");
  const discriminatorLayers = layers.filter(
    (layer) => layer.stack === "discriminator"
  );

  return (
    <group>
      {/* <GANConnections layers={layers} style={style} /> */}
      {/* Generator Layers */}
      <group name="Generator">
        {generatorLayers.map((layer, i) => (
          <Sublayer
            key={`generator-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
          />
        ))}
      </group>

      <group name="Discriminator">
        {discriminatorLayers.map((layer, i) => (
          <Sublayer
            key={`discriminator-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
          />
        ))}
      </group>
    </group>
  );
}
