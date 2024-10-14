import React from "react";
import Layer from "./Layer";

const AlexNetLayers = React.memo(({ structure, style }) => {
  return structure.map(({ dimensions, type, zSpan }, i) => (
    <Layer
      key={i}
      position={[0, 0, (i - (structure.length - 1) / 2) * 60]}
      unexpandedNode={{
        size: [dimensions[0], dimensions[1], dimensions[2] * 0.1],
        wireframeDivision: 1,
      }}
      node={{
        size: [dimensions[0] * 0.5, dimensions[1] * 0.5, 1],
        wireframeDivision: 1,
      }}
      grid={{
        xCount: zSpan[0],
        yCount: zSpan[1],
        xInterval: dimensions[0] * 0.55,
        yInterval: dimensions[1] * 0.55,
      }}
      type={type}
      color={style.colors.inner || `hsl(240, 100%, 50%)`}
      style={style}
    />
  ));
});

export default AlexNetLayers;
