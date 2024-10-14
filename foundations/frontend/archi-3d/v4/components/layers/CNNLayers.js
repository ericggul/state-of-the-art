import React from "react";
import Layer from "../Layer";
import { LAYER_CONFIGS } from "../../structure";

const CNNLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model];
  const layerHeight = config.layerHeight;

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;
    return (
      <Layer
        key={`${config.keyPrefix}-${i}`}
        position={[0, y, 0]}
        unexpandedNode={{
          size: [
            layer.dimensions[0],
            layer.dimensions[1],
            layer.dimensions[2] * 0.1,
          ],
          wireframeDivision: 1,
        }}
        node={{
          size: [layer.dimensions[0] * 0.5, layer.dimensions[1] * 0.5, 1],
          wireframeDivision: 1,
        }}
        grid={{
          xCount: layer.zSpan[0],
          yCount: layer.zSpan[1],
          xInterval: layer.dimensions[0] * 0.55,
          yInterval: layer.dimensions[1] * 0.55,
        }}
        type={layer.type}
        color={
          style.colors[layer.type] ||
          style.colors.inner ||
          `hsl(240, 100%, 50%)`
        }
        style={style}
        model={model}
      />
    );
  });
});

export default CNNLayers;
