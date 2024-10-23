import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

export default function MultiModalLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model] || {};
  const layerGap = modelConfig.layerHeight || 50;

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
    let cumulativeX = 0;
    const maxHeight = Math.max(
      ...layers.map((layer) => layer.dimensions[1] || 20)
    );

    const layersWithPositions = layers.map((layer) => {
      const layerWidth = layer.dimensions[0] || 20;
      const layerHeight = layer.dimensions[1] || 20;
      const x = cumulativeX + layerWidth / 2;
      const y = (maxHeight - layerHeight) / 2; // Center vertically within the stream
      cumulativeX += layerWidth + layerGap;

      return {
        ...layer,
        position: [x, y, 0],
      };
    });

    // Center the layers horizontally
    const totalWidth = cumulativeX - layerGap;
    const centerOffset = totalWidth / 2;

    return layersWithPositions.map((layer) => ({
      ...layer,
      position: [
        layer.position[0] - centerOffset,
        layer.position[1],
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

  // Calculate the overall structure dimensions
  const structureWidth =
    Math.max(
      ...positionedImageLayers.map(
        (l) => Math.abs(l.position[0]) + (l.dimensions[0] || 20) / 2
      ),
      ...positionedTextLayers.map(
        (l) => Math.abs(l.position[0]) + (l.dimensions[0] || 20) / 2
      ),
      ...positionedFusionLayers.map(
        (l) => Math.abs(l.position[0]) + (l.dimensions[0] || 20) / 2
      )
    ) * 2;

  const structureHeight =
    100 * 2 +
    Math.max(
      Math.max(...positionedImageLayers.map((l) => l.dimensions[1] || 20)),
      Math.max(...positionedTextLayers.map((l) => l.dimensions[1] || 20)),
      Math.max(...positionedFusionLayers.map((l) => l.dimensions[1] || 20))
    );

  // Define positions for different modality streams
  const streamGap = 100; // Adjust as needed
  const imageStreamPositionY = streamGap;
  const textStreamPositionY = 0;
  const fusionStreamPositionY = -streamGap;

  return (
    <group position={[0, -textStreamPositionY, 0]}>
      {" "}
      {/* Center vertically */}
      {/* Image Stream */}
      <group position={[0, imageStreamPositionY, 0]}>
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
      <group position={[0, textStreamPositionY, 0]}>
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
      <group position={[0, fusionStreamPositionY, 0]}>
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
