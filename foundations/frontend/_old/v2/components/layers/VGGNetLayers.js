import React from "react";
import Layer from "../Layer";

const VGGNetLayers = React.memo(({ structure, style, model }) => {
  const layerHeight = 15; // Vertical spacing between layers

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;
    return (
      <Layer
        key={`vggnet-${i}`}
        position={[0, y, 0]}
        layer={layer}
        style={style}
        model={model}
      />
    );
  });
});

export default VGGNetLayers;
