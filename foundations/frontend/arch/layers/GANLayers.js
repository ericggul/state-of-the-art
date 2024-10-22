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
      let xPosition = 0;
      let zPosition = 0;

      // Adjust positions for CycleGAN
      if (model === "CYCLEGAN") {
        if (layer.stack.includes("generator")) {
          xPosition = layer.stack === "generator_A" ? -150 : 150;
          zPosition = -50;
        } else if (layer.stack.includes("discriminator")) {
          xPosition = layer.stack === "discriminator_A" ? -150 : 150;
          zPosition = 50;
        }
      } else {
        zPosition = layer.stack === "discriminator" ? 100 : -100;
      }

      return {
        ...layer,
        position: [xPosition, yPosition, zPosition],
      };
    });
  }, [structure, layerHeight, layerGap, model]);

  console.log(layers);

  const groupLayers = (stack) =>
    layers.filter((layer) => layer.stack.includes(stack));

  const generatorALayers = groupLayers("generator_A");
  const generatorBLayers = groupLayers("generator_B");
  const discriminatorALayers = groupLayers("discriminator_A");
  const discriminatorBLayers = groupLayers("discriminator_B");
  const generalGeneratorLayers = groupLayers("generator");
  const generalDiscriminatorLayers = groupLayers("discriminator");

  return (
    <group>
      <GANConnections layers={layers} style={style} />
      {model === "CYCLEGAN" ? (
        <>
          <group name="Generator A">
            {generatorALayers.map((layer, i) => (
              <Sublayer
                key={`generator-a-${i}`}
                position={layer.position}
                sublayer={layer}
                style={style}
                model={model}
              />
            ))}
          </group>
          <group name="Generator B">
            {generatorBLayers.map((layer, i) => (
              <Sublayer
                key={`generator-b-${i}`}
                position={layer.position}
                sublayer={layer}
                style={style}
                model={model}
              />
            ))}
          </group>
          <group name="Discriminator A">
            {discriminatorALayers.map((layer, i) => (
              <Sublayer
                key={`discriminator-a-${i}`}
                position={layer.position}
                sublayer={layer}
                style={style}
                model={model}
              />
            ))}
          </group>
          <group name="Discriminator B">
            {discriminatorBLayers.map((layer, i) => (
              <Sublayer
                key={`discriminator-b-${i}`}
                position={layer.position}
                sublayer={layer}
                style={style}
                model={model}
              />
            ))}
          </group>
        </>
      ) : (
        <>
          <group name="Generator">
            {generalGeneratorLayers.map((layer, i) => (
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
            {generalDiscriminatorLayers.map((layer, i) => (
              <Sublayer
                key={`discriminator-${i}`}
                position={layer.position}
                sublayer={layer}
                style={style}
                model={model}
              />
            ))}
          </group>
        </>
      )}
    </group>
  );
}
