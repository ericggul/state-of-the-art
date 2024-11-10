import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

const ANIM_SPEED = 0.5;

const calculateOverallCenter = (imageLayers, textLayers, fusionLayers) => {
  // Find the extremes of all layers
  const allLayers = [...imageLayers, ...textLayers, ...fusionLayers];
  if (allLayers.length === 0) return [0, 0, 0];

  const xPositions = allLayers.map((l) => l.position[0]);
  const yPositions = allLayers.map((l) => l.position[1]);
  const zPositions = allLayers.map((l) => l.position[2]);

  // Calculate bounds
  const minX = Math.min(...xPositions);
  const maxX = Math.max(...xPositions);
  const minY = Math.min(...yPositions);
  const maxY = Math.max(...yPositions);
  const minZ = Math.min(...zPositions);
  const maxZ = Math.max(...zPositions);

  // Calculate center offsets
  return [(maxX + minX) / 2, (maxY + minY) / 2, (maxZ + minZ) / 2];
};

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
    if (!layers || layers.length === 0) return [];

    const MAX_LAYERS_PER_COLUMN = 5;
    const X_GAP = layerGap;
    const Z_GAP = layerGap * 0.1;

    // Adjusted modality offsets to center around dense/fusion area
    const modalityOffset = {
      // Main modalities - adjusted to bring dense/fusion to center
      image: [-layerGap * 4, 0, -layerGap * 0.1], // Further left
      text: [layerGap * 4, 0, -layerGap * 0.1], // Further right
      fusion: [0, 0, 0], // Center position

      // Layer type offsets - adjusted relative to their modality
      vision_transformer: [-layerGap * 3.5, 0, -layerGap * 0.08],
      text_transformer: [layerGap * 3.5, 0, -layerGap * 0.08],
      transformer_layer: [0, 0, layerGap * 0.08],
      attention: [0, 0, 0],
      cross_attention: [0, 0, layerGap * 0.05],
      mlp: [0, 0, -layerGap * 0.05],
      dense: [0, 0, 0], // Centered
      embedding: [-layerGap * 2, 0, -layerGap * 0.06],
      layernorm: [0, 0, 0],
      input: [-layerGap * 5, 0, -layerGap * 0.12], // Further out
      output: [layerGap * 5, 0, layerGap * 0.12], // Further out

      default: [0, 0, 0],
    }[modalityType] || [0, 0, 0];

    return layers.map((layer, index) => {
      const layerWidth = Math.max(layer.dimensions?.[0] || 20, 1);
      const layerHeight = Math.max(layer.dimensions?.[1] || 20, 1);
      const layerDepth = Math.max(layer.dimensions?.[2] || 20, 1);

      const col = Math.floor(index / MAX_LAYERS_PER_COLUMN);
      const depth = index % MAX_LAYERS_PER_COLUMN;

      let x = col * (layerWidth + X_GAP);
      let z = depth * (layerDepth * 0.2 + Z_GAP);

      // Apply modality offset
      x += modalityOffset[0];
      const y = modalityOffset[1];
      z += modalityOffset[2];

      // Additional offset for dense/fusion layers
      if (layer.type === "dense" || layer.type === "fusion") {
        x = 0; // Force dense/fusion layers to x=0
        z = 0; // Force dense/fusion layers to z=0
      }

      return {
        ...layer,
        position: [
          Number.isFinite(x) ? x : 0,
          Number.isFinite(y) ? y : 0,
          Number.isFinite(z) ? z : 0,
        ],
        dimensions: [layerWidth, layerHeight, layerDepth],
      };
    });
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

  return (
    <group position={[0, 0, 0]}>
      {(() => {
        const [centerX, centerY, centerZ] = calculateOverallCenter(
          positionedImageLayers,
          positionedTextLayers,
          positionedFusionLayers
        );

        return (
          <group position={[-centerX, -centerY, -centerZ]}>
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
      })()}
    </group>
  );
}
