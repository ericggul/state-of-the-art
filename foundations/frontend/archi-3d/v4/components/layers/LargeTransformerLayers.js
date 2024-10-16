import React from "react";
import Node from "../Node";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS } from "../../models";

const TransformerLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model] || {};
  const layerHeight = style.layout?.layerHeight || config.layerHeight || 13;
  const encoderPosition = style.layout?.encoderPosition || -50;
  const decoderPosition = style.layout?.decoderPosition || 50;

  const encoderLayers = structure.filter((layer) => layer.stack === "encoder");
  const decoderLayers = structure.filter((layer) => layer.stack === "decoder");

  const renderLayers = (layers, zPosition) => {
    return layers.map((layer, i) => {
      const y = calculateYPosition(i, layers.length, layerHeight * 20);
      return (
        <TransformerLayer
          key={`${config.keyPrefix || model}-${layer.stack}-${i}`}
          position={[0, y, zPosition]}
          layer={layer}
          style={style}
          model={model}
        />
      );
    });
  };

  return (
    <>
      {renderLayers(encoderLayers, encoderPosition)}
      {renderLayers(decoderLayers, decoderPosition)}
    </>
  );
});

const TransformerLayer = ({ position, layer, style, model }) => {
  const size = [30, 10, 10];
  const gap = 10;

  if (layer.sublayers) {
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer
            key={`${layer.name}-sublayer-${idx}`}
            position={[
              0,
              (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap),
              0,
            ]}
            sublayer={sublayer}
            style={style}
            model={model}
          />
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <Node
        size={layer.dimensions || size}
        style={style}
        color={style.colors[layer.type] || style.colors.outer}
      />
    </group>
  );
};

function calculateYPosition(index, totalLayers, layerHeight) {
  return (
    index * layerHeight - (totalLayers * layerHeight) / 2 + layerHeight / 2
  );
}

export default TransformerLayers;
