import React from "react";
import Layer from "../Layer";
import { LAYER_CONFIGS } from "../../structure";

const VideoGenLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model] || {};
  const layerHeight = style.layout?.layerHeight || config.layerHeight || 13;
  const encoderPosition = style.layout?.encoderPosition || -50;
  const decoderPosition = style.layout?.decoderPosition || 50;

  const encoderLayers = structure.filter((layer) => layer.stack === "encoder");
  const decoderLayers = structure.filter((layer) => layer.stack === "decoder");

  const renderLayers = (layers, xPosition) => {
    return layers.map((layer, i) => (
      <Layer
        key={`${model}-${layer.stack}-${i}`}
        position={[
          xPosition,
          calculateYPosition(i, layers.length, layerHeight),
          0,
        ]}
        layer={layer}
        style={style}
        model={model}
      />
    ));
  };

  return (
    <>
      {renderLayers(encoderLayers, encoderPosition)}
      {renderLayers(decoderLayers, decoderPosition)}
    </>
  );
});

function calculateYPosition(index, totalLayers, layerHeight) {
  return (
    index * layerHeight - (totalLayers * layerHeight) / 2 + layerHeight / 2
  );
}

export default VideoGenLayers;
