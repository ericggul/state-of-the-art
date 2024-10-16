import React, { useMemo, useState, useEffect } from "react";
import Sublayer from "../Sublayer";
import Connections from "../Connections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../models";

export default function RNNLayers({ structure, style, model }) {
  const [layersExpanded, setLayersExpanded] = useState([]);

  // Retrieve the model configuration
  const modelConfig = LAYER_CONFIGS[model];

  // Use modelConfig.layerHeight for positioning
  const layerHeight = modelConfig.layerHeight || 60;

  // Generate layers with positions and grids
  const layers = useMemo(() => {
    const gridConfig = GRID_CONFIGS[model] || {};

    return structure.map((layer, i) => {
      // Retrieve grid settings for the layer type
      const grid = gridConfig[layer.type] || {
        xCount: 1,
        yCount: 1,
        xInterval: 5,
        yInterval: 5,
      };

      // Calculate layer position
      const position = [0, 0, layerHeight * (i - (structure.length - 1) / 2)];

      return {
        ...layer,
        grid,
        position,
      };
    });
  }, [structure, model, layerHeight]);

  // Handle layer expansion states
  useEffect(() => {
    setLayersExpanded(new Array(layers.length).fill(false));
    const toggleInterval = setInterval(() => {
      setLayersExpanded((prev) => {
        const newExpanded = prev.map((val, idx) =>
          idx === (prev.lastToggledIndex + 1) % prev.length ? !val : val
        );
        newExpanded.lastToggledIndex =
          (prev.lastToggledIndex + 1) % prev.length;
        return newExpanded;
      });
    }, 2000);

    return () => clearInterval(toggleInterval);
  }, [layers.length]);

  return (
    <group>
      {layers.map((layer, i) => (
        <Sublayer
          key={`${model}-${i}`}
          position={layer.position}
          sublayer={layer}
          style={style}
          model={model}
          expanded={layersExpanded[i]}
        />
      ))}
      <Connections
        layersExpanded={layersExpanded}
        structure={layers}
        style={style}
      />
    </group>
  );
}
