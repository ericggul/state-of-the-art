import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models/multi_modal";

export default function MultiModalLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model] || {};
  const layerGap = 3; // Adjust this value to change the gap between layers

  // Separate layers into different modalities if applicable
  const { imageLayers, textLayers, fusionLayers } = useMemo(() => {
    const gridConfig = GRID_CONFIGS[model] || {};
    const imageLayers = [];
    const textLayers = [];
    const fusionLayers = [];

    structure.forEach((layer) => {
      const grid = gridConfig[layer.type] || {
        xCount: 1,
        yCount: 1,
        xInterval: 1,
        yInterval: 1,
      };

      const processLayer = (l, parentStream) => {
        const layerWithGrid = {
          ...l,
          grid,
          dimensions: l.dimensions || [100, 100, 100],
          stream: l.stream || parentStream,
        };

        if (
          layerWithGrid.stream === "image" ||
          layerWithGrid.type.includes("cnn") ||
          layerWithGrid.type === "vision_transformer"
        ) {
          imageLayers.push(layerWithGrid);
        } else if (
          layerWithGrid.stream === "text" ||
          layerWithGrid.type.includes("text")
        ) {
          textLayers.push(layerWithGrid);
        } else {
          fusionLayers.push(layerWithGrid);
        }

        if (l.sublayers) {
          l.sublayers.forEach((sublayer) =>
            processLayer(sublayer, layerWithGrid.stream)
          );
        }
      };

      processLayer(layer);
    });

    return { imageLayers, textLayers, fusionLayers };
  }, [structure, model]);

  // Function to calculate positions for a set of layers
  const positionLayers = (layers) => {
    let cumulativeHeight = 0;

    const layersWithPositions = layers.map((layer) => {
      const layerHeight = layer.dimensions[1] || 20; // Default height if not specified
      const y = cumulativeHeight + layerHeight / 2;
      cumulativeHeight += layerHeight + layerGap;

      return {
        ...layer,
        position: [0, y, 0],
      };
    });

    // Center the layers vertically
    const totalHeight = cumulativeHeight - layerGap;
    const centerOffset = totalHeight / 2;

    return layersWithPositions.map((layer) => ({
      ...layer,
      position: [
        layer.position[0],
        layer.position[1] - centerOffset,
        layer.position[2],
      ],
    }));
  };

  const positionedImageLayers = useMemo(
    () => positionLayers(imageLayers),
    [imageLayers]
  );
  const positionedTextLayers = useMemo(
    () => positionLayers(textLayers),
    [textLayers]
  );
  const positionedFusionLayers = useMemo(
    () => positionLayers(fusionLayers),
    [fusionLayers]
  );

  // Define positions for different modality streams
  const imageStreamPositionX = -100; // Adjust as needed
  const textStreamPositionX = 100; // Adjust as needed
  const fusionStreamPositionX = 0;

  return (
    <group>
      {/* Image Stream */}
      <group position={[imageStreamPositionX, 0, 0]}>
        {positionedImageLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-image-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
          />
        ))}
      </group>

      {/* Text Stream */}
      <group position={[textStreamPositionX, 0, 0]}>
        {positionedTextLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-text-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
          />
        ))}
      </group>

      {/* Fusion Layers */}
      <group position={[fusionStreamPositionX, 0, 0]}>
        {positionedFusionLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-fusion-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
          />
        ))}
      </group>
    </group>
  );
}
