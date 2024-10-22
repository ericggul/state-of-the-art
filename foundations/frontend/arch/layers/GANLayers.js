import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import GANConnections from "../connections/GANConnections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

export default function GANLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerHeight = modelConfig.layerHeight || 60;

  const { generator, discriminator } = structure;

  // Positioning layers for generator and discriminator
  const generatorLayers = useMemo(() => {
    return generator.map((layer, index) => ({
      ...layer,
      position: [0, index * -layerHeight, 0],
    }));
  }, [generator, layerHeight]);

  const discriminatorLayers = useMemo(() => {
    const offsetX = modelConfig.discriminatorOffset || 200; // Offset to separate discriminator visually
    return discriminator.map((layer, index) => ({
      ...layer,
      position: [offsetX, index * -layerHeight, 0],
    }));
  }, [discriminator, layerHeight, modelConfig]);

  return (
    <group>
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

      {/* Discriminator Layers */}
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

      {/* Connections */}
      {/* <GANConnections
        generatorLayers={generatorLayers}
        discriminatorLayers={discriminatorLayers}
        style={style}
      /> */}
    </group>
  );
}
