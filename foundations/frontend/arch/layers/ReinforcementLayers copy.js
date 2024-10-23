import React, { useMemo } from "react";
import Sublayer from "../Sublayer";
import { LAYER_CONFIGS } from "../../arch-models/_structure";

const ReinforcementLayers = ({ structure, style, model }) => {
  const layerConfig = LAYER_CONFIGS[model];
  const layerHeight = layerConfig ? layerConfig.layerHeight : 60;

  const { layers, totalHeight } = useMemo(() => {
    let height = 0;
    const layersWithPosition = structure.map((layer) => {
      const layerThickness = layer.sublayers
        ? layer.sublayers.length * layerHeight * 0.5
        : layerHeight;
      const layerPosition = height + layerThickness / 2;
      height += layerThickness;
      return { ...layer, position: layerPosition };
    });
    return { layers: layersWithPosition, totalHeight: height };
  }, [structure, layerHeight]);

  const renderSublayers = (layer, layerIndex, basePosition) => {
    if (layer.sublayers) {
      return layer.sublayers.map((sublayer, sublayerIndex) => (
        <Sublayer
          key={`${model}-${layer.name}-${layerIndex}-${sublayer.name}-${sublayerIndex}`}
          position={[
            0,
            basePosition + sublayerIndex * layerHeight * 0.5 - totalHeight / 2,
            0,
          ]}
          sublayer={sublayer}
          style={style}
          model={model}
        />
      ));
    } else {
      return (
        <Sublayer
          key={`${model}-${layer.name}-${layerIndex}`}
          position={[0, basePosition - totalHeight / 2, 0]}
          sublayer={layer}
          style={style}
          model={model}
        />
      );
    }
  };

  const renderLayers = () => {
    return layers.map((layer, layerIndex) => (
      <group key={`${model}-${layer.name}-${layerIndex}`} position={[0, 0, 0]}>
        {renderSublayers(layer, layerIndex, layer.position)}
      </group>
    ));
  };

  return <group position={[0, 0, 0]}>{renderLayers()}</group>;
};

export default ReinforcementLayers;
