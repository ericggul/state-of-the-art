import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS } from "../../arch-models/_structure";

function ReinforcementLayers({ structure, style, model }) {
  const layerConfig = LAYER_CONFIGS[model];
  const layerWidth = layerConfig.layerHeight || 60;

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

  const renderSublayers = (layer, layerIndex, basePosition) => {
    const sublayers = layer.sublayers || [layer];
    const sublayerCount = sublayers.length;
    return sublayers.map((sublayer, sublayerIndex) => (
      <Sublayer
        key={`${model}-${layer.name}-${layerIndex}-${sublayer.name}-${sublayerIndex}`}
        position={[
          basePosition - totalWidth / 2,
          (sublayerIndex - (sublayerCount - 1) / 2) * layerWidth * 0.6,
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
