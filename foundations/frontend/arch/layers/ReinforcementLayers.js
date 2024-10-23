import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS } from "../../arch-models/_structure";

function ReinforcementLayers({ structure, style, model }) {
  const layerConfig = LAYER_CONFIGS[model];
  const layerHeight = layerConfig ? layerConfig.layerHeight : 60;

  const { layers, totalHeight } = useMemo(() => {
    let height = 0;
    const layersWithPosition = structure.map((layer) => {
      const sublayerCount = layer.sublayers ? layer.sublayers.length : 1;
      const layerThickness = sublayerCount * layerHeight * 1.2; // Adjust spacing
      const layerPosition = height + layerThickness / 2;
      height += layerThickness + layerHeight * 0.2; // Add spacing between layers
      return { ...layer, position: layerPosition };
    });
    return { layers: layersWithPosition, totalHeight: height };
  }, [structure, layerHeight]);

  const renderSublayers = (layer, layerIndex, basePosition) => {
    const sublayers = layer.sublayers || [layer];
    const sublayerCount = sublayers.length;
    return sublayers.map((sublayer, sublayerIndex) => (
      <Sublayer
        key={`${model}-${layer.name}-${layerIndex}-${sublayer.name}-${sublayerIndex}`}
        position={[
          0,
          basePosition +
            (sublayerIndex - (sublayerCount - 1) / 2) * layerHeight * 1.2 -
            totalHeight / 2,
          0,
        ]}
        sublayer={sublayer}
        style={style}
        model={model}
      />
    ));
  };

  const renderModelLayers = () => {
    return layers.map((layer, layerIndex) => (
      <group key={`${model}-${layer.name}-${layerIndex}`}>
        {renderSublayers(layer, layerIndex, layer.position)}
      </group>
    ));
  };

  return <group>{renderModelLayers()}</group>;
}

export default ReinforcementLayers;
