import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

const ANIM_SPEED = 0.33;

export default function MultiModalLayers({ structure, style, model }) {
  const modelConfig = LAYER_CONFIGS[model] || {};
  const layerGap = modelConfig.layerHeight * 0.3 || 10;

  // Separate layers into different modalities
  const { imageLayers, audioLayers, textLayers, fusionLayers } = useMemo(() => {
    const gridConfig = GRID_CONFIGS[model] || {};
    const imageLayers = [];
    const audioLayers = [];
    const textLayers = [];
    const fusionLayers = [];

    const processLayer = (l, parentStream) => {
      const layerWithGrid = {
        ...l,
        grid: gridConfig[l.type] || {
          xCount: 1,
          yCount: 1,
          xInterval: 1,
          yInterval: 1,
        },
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
        layerWithGrid.stream === "audio" ||
        layerWithGrid.type.includes("audio")
      ) {
        audioLayers.push(layerWithGrid);
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

    structure.forEach((layer) => processLayer(layer));
    return { imageLayers, audioLayers, textLayers, fusionLayers };
  }, [structure, model]);

  // Modified positioning strategy
  const positionLayers = (layers, modalityType) => {
    // Base offsets for each modality type - give audio its own space
    const baseOffset =
      {
        image: -modelConfig.layerHeight * 20, // Far left
        audio: -modelConfig.layerHeight * 7, // Center-left
        text: modelConfig.layerHeight * 20, // Far right
        fusion: 0, // Center
      }[modalityType] || 0;

    let cumulativeX = baseOffset;
    const maxHeight = Math.max(
      ...layers.map((layer) => layer.dimensions[1] || 20)
    );

    // Calculate radius and angle based on modality
    const radius = 50;
    const angleOffset =
      {
        image: -Math.PI / 4,
        audio: -Math.PI / 6, // Smaller angle for audio
        text: Math.PI / 4,
        fusion: 0,
      }[modalityType] || 0;

    const layersWithPositions = layers.map((layer, index) => {
      const layerWidth = layer.dimensions[1] || 20;
      const layerHeight = layer.dimensions[1] || 20;

      // Calculate position along the arc
      const progress = index / (layers.length - 1 || 1);
      const angle = angleOffset + (progress * Math.PI) / 4;

      const x = Math.cos(angle) * radius + cumulativeX;
      const y = Math.sin(angle) * radius;

      // Distinct Z positioning for audio
      const z =
        {
          image: -layer.dimensions[2] / 2,
          audio: -layer.dimensions[2] / 4, // Slightly different Z than image
          text: layer.dimensions[2] / 2,
          fusion: 0,
        }[modalityType] || 0;

      // Update cumulative X position with direction based on modality
      const direction =
        {
          image: -1,
          audio: -0.5, // Slower leftward movement for audio
          text: 1,
          fusion: 1,
        }[modalityType] || 1;

      cumulativeX += direction * (layerWidth + layerGap);

      return {
        ...layer,
        position: [x, y, z],
      };
    });

    // Center each stream independently with adjusted offsets
    const streamWidth = Math.abs(cumulativeX - baseOffset);
    const centerOffset =
      (streamWidth / 2) *
      ({
        image: -1,
        audio: -0.5, // Half the centering effect for audio
        text: 1,
        fusion: 1,
      }[modalityType] || 1);

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
  const positionedAudioLayers = useMemo(
    () => positionLayers(audioLayers, "audio"),
    [audioLayers]
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
            rotation={
              layer.type === "mlp" || layer.type.includes("mlp")
                ? [Math.PI / 2, 0, 0]
                : layer.type === "attention" || layer.type.includes("attention")
                ? [0, 0, Math.PI / 2]
                : [0, 0, 0]
            }
          />
        ))}
      </group>

      {/* Audio Stream */}
      <group>
        {positionedAudioLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-audio-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
            idx={i * ANIM_SPEED}
            rotation={
              layer.type === "mlp" || layer.type.includes("mlp")
                ? [Math.PI / 2, 0, 0]
                : layer.type === "attention" || layer.type.includes("attention")
                ? [0, 0, Math.PI / 2]
                : [0, 0, 0]
            }
          />
        ))}
      </group>

      {/* Text Stream */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {positionedTextLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-text-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
            idx={(i + 1 / 3) * ANIM_SPEED}
            rotation={
              layer.type === "mlp" || layer.type.includes("mlp")
                ? [Math.PI / 2, 0, 0]
                : layer.type === "attention" || layer.type.includes("attention")
                ? [0, 0, Math.PI / 2]
                : [0, 0, 0]
            }
          />
        ))}
      </group>

      {/* Fusion Layers */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {positionedFusionLayers.map((layer, i) => (
          <Sublayer
            key={`${model}-fusion-${layer.name}-${i}`}
            position={layer.position}
            sublayer={layer}
            style={style}
            model={model}
            useGivenInterval={true}
            idx={(i + 2 / 3) * ANIM_SPEED}
            rotation={
              layer.type === "mlp" || layer.type.includes("mlp")
                ? [Math.PI / 2, 0, 0]
                : layer.type === "attention" || layer.type.includes("attention")
                ? [0, 0, Math.PI / 2]
                : [0, 0, 0]
            }
          />
        ))}
      </group>
    </group>
  );
}
