import React from "react";
import Layer from "../Layer";

const LeNetLayers = React.memo(({ structure, style, model }) => {
  const layerHeight = 20; // Vertical spacing between layers

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;
    return (
      <Layer
        key={`lenet-${i}`}
        position={[0, y, 0]}
        layer={layer}
        style={style}
        model={model}
      />
    );
  });
});

export default LeNetLayers;
