import React from "react";
import Layer from "./Layer";

const VideoGenLayers = React.memo(({ structure, style }) => {
  const layerHeight = style.layout?.layerHeight || 13;
  const encoderPosition = style.layout?.encoderPosition || -50;
  const decoderPosition = style.layout?.decoderPosition || 50;

  const encoderLayers = structure.filter((layer) => layer.stack === "encoder");
  const decoderLayers = structure.filter((layer) => layer.stack === "decoder");

  return (
    <>
      {encoderLayers.map((layer, i) => (
        <Layer
          key={`encoder-${i}`}
          position={[
            encoderPosition,
            calculateYPosition(i, encoderLayers.length, layerHeight),
            0,
          ]}
          layer={layer}
          style={style}
        />
      ))}
      {decoderLayers.map((layer, i) => (
        <Layer
          key={`decoder-${i}`}
          position={[
            decoderPosition,
            calculateYPosition(i, decoderLayers.length, layerHeight),
            0,
          ]}
          layer={layer}
          style={style}
        />
      ))}
    </>
  );
});

function calculateYPosition(index, totalLayers, layerHeight) {
  return (
    index * layerHeight - (totalLayers * layerHeight) / 2 + layerHeight / 2
  );
}

export default VideoGenLayers;
