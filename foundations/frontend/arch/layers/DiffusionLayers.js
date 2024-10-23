import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

export default function DiffusionLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerGap = model === "STABLE_DIFFUSION" ? 5 : 0.3; // Reduce gap for Stable Diffusion
  const sublayerGap = model === "STABLE_DIFFUSION" ? 5 : 0.3;

  const layers = useMemo(() => {
    let cumulativeHeight = 0;

    const layersWithPositions = structure.map((layer, i) => {
      const layerHeight = layer.sublayers
        ? layer.sublayers.reduce(
            (acc, sublayer) =>
              acc + (sublayer.dimensions?.[0] || 20) + sublayerGap,
            0
          )
        : layer.dimensions?.[0] || 20;

      const y = cumulativeHeight + layerHeight / 2;
      cumulativeHeight += layerHeight + layerGap;

      let sublayerCumulativeHeight = -layerHeight / 2;
      const sublayersWithPositions = layer.sublayers
        ? layer.sublayers.map((sublayer, j) => {
            const sublayerHeight = sublayer.dimensions?.[1] || 20;
            const sublayerY = sublayerCumulativeHeight + sublayerHeight / 2;
            sublayerCumulativeHeight += sublayerHeight + sublayerGap;
            return {
              ...sublayer,
              position: [0, sublayerY, 0],
            };
          })
        : [];

      return {
        ...layer,
        position: [0, cumulativeHeight, 0],
        sublayers: sublayersWithPositions,
      };
    });

    const totalHeight = cumulativeHeight;
    const centerOffset = totalHeight / 2;

    return layersWithPositions.map((layer) => ({
      ...layer,
      position: [
        layer.position[0],
        layer.position[1] - centerOffset,
        layer.position[2],
      ],
      sublayers: layer.sublayers.map((sublayer) => ({
        ...sublayer,
        position: [
          sublayer.position[0],
          sublayer.position[1] + layer.position[1] - centerOffset,
          sublayer.position[2],
        ],
      })),
    }));
  }, [structure, model]);

  return (
    <group position={[0, 0, 0]}>
      {" "}
      {/* Center the entire group */}
      {layers.map((layer, i) => (
        <React.Fragment key={`${model}-${layer.name}-${i}`}>
          {layer.sublayers && layer.sublayers.length > 0 ? (
            layer.sublayers.map((sublayer, j) => (
              <Sublayer
                key={`${model}-${layer.name}-${i}-${sublayer.name}-${j}`}
                position={sublayer.position}
                sublayer={sublayer}
                style={style}
                model={model}
              />
            ))
          ) : (
            <Sublayer
              key={`${model}-${layer.name}-${i}`}
              position={layer.position}
              sublayer={layer}
              style={style}
              model={model}
            />
          )}
        </React.Fragment>
      ))}
    </group>
  );
}
