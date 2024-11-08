import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

export default function DiffusionLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model];
  const baseGap = model === "STABLE_DIFFUSION" ? 5 : 0.3;
  const layerGap = baseGap * (1 / Math.log(structure.length + 1));
  const sublayerGap = layerGap * 0.8;

  const layers = useMemo(() => {
    let cumulativeHeight = 0;

    // Helper function to process sublayers recursively
    const processSublayers = (sublayers, parentY = 0) => {
      if (!sublayers) return [];

      let localCumulativeHeight = 0;
      return sublayers.map((sublayer, index) => {
        const sublayerHeight = sublayer.dimensions?.[1] || 20;
        const y = localCumulativeHeight + sublayerHeight / 2;
        localCumulativeHeight += sublayerHeight + sublayerGap;

        // Process nested sublayers if they exist
        const processedNestedSublayers = processSublayers(
          sublayer.sublayers,
          y + parentY
        );

        return {
          ...sublayer,
          position: [0, y + parentY, 0],
          sublayers: processedNestedSublayers,
        };
      });
    };

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

      // Process all levels of sublayers
      const processedSublayers = processSublayers(layer.sublayers, y);

      return {
        ...layer,
        position: [0, cumulativeHeight, 0],
        sublayers: processedSublayers,
      };
    });

    const totalHeight = cumulativeHeight - layerGap;
    const centerOffset = totalHeight / 2;

    // Center all positions
    return layersWithPositions.map((layer) => ({
      ...layer,
      position: [
        layer.position[0],
        layer.position[1] - centerOffset,
        layer.position[2],
      ],
      sublayers: layer.sublayers?.map((sublayer) => ({
        ...sublayer,
        position: [
          sublayer.position[0],
          sublayer.position[1] - centerOffset,
          sublayer.position[2],
        ],
        // Recursively adjust nested sublayer positions
        sublayers: sublayer.sublayers?.map((nestedSublayer) => ({
          ...nestedSublayer,
          position: [
            nestedSublayer.position[0],
            nestedSublayer.position[1] - centerOffset,
            nestedSublayer.position[2],
          ],
        })),
      })),
    }));
  }, [structure, model, layerGap, sublayerGap]);

  console.log(layers);

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
