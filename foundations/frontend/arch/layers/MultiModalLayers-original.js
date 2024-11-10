import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

const ANIM_SPEED = 0.33;

export default function MultiModalLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model] || {};
  const layerGap = modelConfig.layerHeight || 10;

  // Separate layers into different modalities
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

  // Modified positioning strategy
  const positionLayers = (layers, modalityType) => {
    let cumulativeX = 0;
    const maxHeight = Math.max(
      ...layers.map((layer) => layer.dimensions[1] || 20)
    );

    // Calculate radius and angle based on modality
    const radius = 150; // Adjust for desired spread
    const angleOffset =
      {
        image: -Math.PI / 4, // 45 degrees left
        text: Math.PI / 4, // 45 degrees right
        fusion: 0, // Center
      }[modalityType] || 0;

    const layersWithPositions = layers.map((layer, index) => {
      const layerWidth = layer.dimensions[0] || 20;
      const layerHeight = layer.dimensions[1] || 20;

      // Calculate position along the arc
      const progress = index / (layers.length - 1 || 1);
      const angle = angleOffset + (progress * Math.PI) / 4; // 45 degree arc

      const x = Math.cos(angle) * radius + cumulativeX;
      const y = Math.sin(angle) * radius;

      cumulativeX += layerWidth + layerGap;

      return {
        ...layer,
        position: [x, y, 0],
      };
    });

    // Center the layers
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
    () => positionLayers(imageLayers, "image"),
    [imageLayers]
  );
  const positionedTextLayers = useMemo(
    () => positionLayers(textLayers, "text"),
    [textLayers]
  );
  const positionedFusionLayers = useMemo(
    () => positionLayers(fusionLayers, "fusion"),
    [fusionLayers]
  );

  // Calculate overall structure dimensions
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

  return (
    <group>
      {/* Image Stream */}
      <group>
        {positionedImageLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-image-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
            idx={i * ANIM_SPEED}
          />
        ))}
      </group>

      {/* Text Stream */}
      <group>
        {positionedTextLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-text-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
            idx={(i + 1 / 3) * ANIM_SPEED}
          />
        ))}
      </group>

      {/* Fusion Layers */}
      <group>
        {positionedFusionLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-fusion-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
            idx={(i + 2 / 3) * ANIM_SPEED}
          />
        ))}
      </group>
    </group>
  );
}
