import React from "react";
import Layer from "../Layer";
import { LAYER_CONFIGS } from "../../structure";

const CommonLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model];
  const layerHeight = config.layerHeight;

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;
    return (
      <Layer
        key={`${config.keyPrefix}-${i}`}
        position={[0, y, 0]}
        layer={layer}
        style={style}
        model={model}
      />
    );
  });
});

export default CommonLayers;
