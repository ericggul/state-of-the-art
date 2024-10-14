import React from "react";
import Layer from "../Layer";
import { LAYER_CONFIGS } from "../../structure";

const TransformerLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model];
  const layerHeight = config.layerHeight;
  const encoderPosition = style.layout?.encoderPosition || -50;
  const decoderPosition = style.layout?.decoderPosition || 50;

  const encoderLayers = structure.filter((layer) => layer.stack === "encoder");
  const decoderLayers = structure.filter((layer) => layer.stack === "decoder");

  const renderLayers = (layers, xPosition) => {
    return layers.map((layer, i) => {
      const y =
        i * layerHeight - (layers.length * layerHeight) / 2 + layerHeight / 2;
      return (
        <Layer
          key={`${config.keyPrefix}-${layer.stack}-${i}`}
          position={[xPosition, y, 0]}
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

export default TransformerLayers;
