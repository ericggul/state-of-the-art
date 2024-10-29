import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

export default function DiffusionLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const layerGap = model === "STABLE_DIFFUSION" ? 5 : 0.3;
  const sublayerGap = model === "STABLE_DIFFUSION" ? 5 : 0.3;

  const layers = useMemo(() => {
    let cumulativeHeight = 0;

    const layersWithPositions = structure.map((layer, i) => {
      // Calculate total height including nested sublayers
      const calculateTotalHeight = (layer) => {
        if (!layer.sublayers) return layer.dimensions?.[0] || 20;

        return layer.sublayers.reduce((acc, sublayer) => {
          const sublayerHeight = sublayer.sublayers
            ? calculateTotalHeight(sublayer)
            : sublayer.dimensions?.[0] || 20;
          return acc + sublayerHeight + sublayerGap;
        }, 0);
      };

      const layerHeight = calculateTotalHeight(layer);

      const y = cumulativeHeight + layerHeight / 2;
      cumulativeHeight += layerHeight + layerGap;

      // Process sublayers recursively
      const processSublayers = (sublayers, parentY, depth = 0) => {
        if (!sublayers) return [];

        let subCumulativeHeight = parentY - layerHeight / 2;
        return sublayers.map((sublayer) => {
          const sublayerHeight = sublayer.dimensions?.[0] || 20;
          const sublayerY = subCumulativeHeight + sublayerHeight / 2;
          subCumulativeHeight += sublayerHeight + sublayerGap;

          // Process nested sublayers
          const nestedSublayers = processSublayers(
            sublayer.sublayers,
            sublayerY,
            depth + 1
          );

          return {
            ...sublayer,
            position: [depth * 2, sublayerY, 0], // Offset x position for nested layers
            sublayers: nestedSublayers,
          };
        });
      };

      return {
        ...layer,
        position: [0, cumulativeHeight, 0],
        sublayers: processSublayers(layer.sublayers, cumulativeHeight),
      };
    });

    const totalHeight = cumulativeHeight;
    const centerOffset = totalHeight / 2;

    // Center all layers and sublayers
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
          sublayer.position[1] - centerOffset,
          sublayer.position[2],
        ],
      })),
    }));
  }, [structure, model]);

  // Recursive render function for layers and sublayers
  const renderLayer = (layer, i, parentKey = "") => {
    const key = parentKey ? `${parentKey}-${i}` : `${model}-${layer.name}-${i}`;

    return (
      <React.Fragment key={key}>
        {layer.sublayers && layer.sublayers.length > 0 ? (
          <>
            {layer.sublayers.map((sublayer, j) => (
              <React.Fragment key={`${key}-${sublayer.name}-${j}`}>
                <Sublayer
                  position={sublayer.position}
                  sublayer={sublayer}
                  style={style}
                  model={model}
                />
                {sublayer.sublayers?.map((nestedSublayer, k) =>
                  renderLayer(nestedSublayer, k, `${key}-${sublayer.name}-${j}`)
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          <Sublayer
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <group position={[0, 0, 0]}>
      {layers.map((layer, i) => renderLayer(layer, i))}
    </group>
  );
}
