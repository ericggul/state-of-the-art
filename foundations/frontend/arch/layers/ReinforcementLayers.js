import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS } from "../../arch-models/_structure";

function ReinforcementLayers({ structure, style, model }) {
  const layerConfig = LAYER_CONFIGS[model];
  const layerWidth = layerConfig.layerWidth || 60;

  const { layers, totalWidth } = useMemo(() => {
    let width = 0;
    const layersWithPosition = structure.map((layer) => {
      const layerThickness = layerWidth * 1.2;
      const layerPosition = width + layerThickness / 2;
      width += layerThickness + layerWidth * 0.2;
      return { ...layer, position: layerPosition };
    });
    return { layers: layersWithPosition, totalWidth: width };
  }, [structure, layerWidth]);

  const renderSublayers = (
    sublayers,
    basePositionX,
    basePositionY,
    depth = 0,
    inheritIdx = 0
  ) => {
    const sublayerCount = sublayers.length;
    return sublayers.map((sublayer, index) => {
      const positionX = basePositionX + depth * layerWidth * 0.6; // Indent nested sublayers horizontally
      const positionY =
        basePositionY + (index - (sublayerCount - 1) / 2) * layerWidth * 0.6;

      if (sublayer.sublayers) {
        // Render nested sublayers recursively
        return (
          <group key={`group-${sublayer.name}-${depth}-${index}`}>
            {renderSublayers(
              sublayer.sublayers,
              positionX,
              positionY,
              depth + 1,
              inheritIdx + index
            )}
          </group>
        );
      } else {
        // Render individual sublayer
        return (
          <Sublayer
            key={`sublayer-${sublayer.name}-${depth}-${index}`}
            position={[positionX - totalWidth / 2, positionY, 0]}
            sublayer={sublayer}
            style={style}
            model={model}
            idx={depth + inheritIdx}
          />
        );
      }
    });
  };

  const renderModelLayers = () => {
    return layers.map((layer, layerIndex) => (
      <group key={`${model}-${layer.name}-${layerIndex}`}>
        {renderSublayers(
          [layer],
          layer.position,
          0, // Start Y position at 0 for each top-level layer
          0, // Initial depth is 0,
          0 // Initial inheritIdx is 0
        )}
      </group>
    ));
  };

  return <group>{renderModelLayers()}</group>;
}

export default ReinforcementLayers;
