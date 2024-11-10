import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "../Node";
import InstancedNodes from "../InstancedNodes";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";
import useScreenStore from "@/components/screen/store";

const CNNLayers = React.memo(({ structure, style, model }) => {
  // Add spring animation for initial scale
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: {
      mass: 4,
      tension: 120,
      friction: 30,
      clamp: false,
    },
  });

  // Pre-calculate the cumulative heights of layers
  const layerPositions = [];
  let cumulativeHeight = 0;

  // First, calculate the heights of all layers
  const layerHeights = structure.map((layer) => {
    // For composite layers, take the maximum height among sublayers
    if (layer.sublayers) {
      const sublayerHeights = layer.sublayers.map(
        (sublayer) => sublayer.dimensions[1]
      );
      return Math.max(...sublayerHeights);
    } else {
      return layer.dimensions[1];
    }
  });

  // Next, calculate the cumulative positions
  for (let i = 0; i < layerHeights.length; i++) {
    const layerHeight = layerHeights[i];
    // Add a gap between layers if desired, let's use a multiplier
    const gap = 10; // Adjust the gap as needed
    cumulativeHeight +=
      i === 0 ? 0 : layerHeights[i - 1] / 2 + layerHeight / 2 + gap;
    layerPositions.push(cumulativeHeight);
  }

  // Center the model vertically
  const totalHeight =
    cumulativeHeight + layerHeights[layerHeights.length - 1] / 2;
  const centerOffset = totalHeight / 2;

  return (
    <animated.group scale={scale}>
      {structure.map((layer, i) => {
        const y = layerPositions[i] - centerOffset;

        // Handle composite layers with sublayers (e.g., inception modules)
        if (layer.sublayers) {
          return (
            <CompositeLayer
              key={`${model}-layer-${i}`}
              position={[0, y, 0]}
              layer={layer}
              style={style}
              model={model}
            />
          );
        }

        // Handle regular layers
        return (
          <CNNLayer
            key={`${model}-layer-${i}`}
            position={[0, y, 0]}
            layer={layer}
            style={style}
            model={model}
          />
        );
      })}
    </animated.group>
  );
});

const CNNLayer = React.memo(({ position, layer, style, model }) => {
  // ... (same as before)

  const [expanded, setExpanded] = useState(false);
  const { isProjector } = useScreenStore();

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  useEffect(() => {
    const toggleExpanded = () => {
      setExpanded((prev) => !prev);
    };

    const minInterval = 1000;
    const maxInterval = 8000;
    const randomInterval =
      Math.random() * (maxInterval - minInterval) + minInterval;

    const timer = setInterval(toggleExpanded, randomInterval);

    return () => clearInterval(timer);
  }, []);

  const gridConfig = GRID_CONFIGS[model] || {};
  let gridTypeConfig = gridConfig[layer.type] || {
    xCount: layer.zSpan[0],
    yCount: layer.zSpan[1],
    xInterval: layer.dimensions[0] * 0.6,
    yInterval: layer.dimensions[1] * 0.6,
  };

  gridTypeConfig.xInterval = layer.dimensions[0] * 0.54;
  gridTypeConfig.yInterval = layer.dimensions[1] * 0.54;

  const grid = {
    xCount: gridTypeConfig.xCount,
    yCount: gridTypeConfig.yCount,
    xInterval: gridTypeConfig.xInterval,
    yInterval: gridTypeConfig.yInterval,
  };

  const node = {
    size: [layer.dimensions[0] * 0.5, layer.dimensions[1] * 0.5, 1],
    wireframeDivision: 1,
  };

  const unexpandedNode = {
    size: [
      layer.dimensions[0],
      layer.dimensions[1],
      Math.max(layer.dimensions[2] * 0.1, 0.5),
    ],
    wireframeDivision: 1,
  };

  const color = style.colors.inner; // Using style.colors.inner as per your request

  return (
    <group position={position}>
      <animated.group
        scale-x={smoothedExpanded}
        scale-y={smoothedExpanded}
        scale-z={smoothedExpanded}
      >
        <InstancedNodes
          {...grid}
          node={node}
          color={color}
          style={style}
          isProjector={isProjector}
        />
      </animated.group>
      <animated.group
        scale-x={smoothedExpanded.to((v) => 1 - v)}
        scale-y={smoothedExpanded.to((v) => 1 - v)}
        scale-z={smoothedExpanded.to((v) => 1 - v)}
      >
        <Node
          {...unexpandedNode}
          color={color}
          style={style}
          isProjector={isProjector}
        />
      </animated.group>
    </group>
  );
});

const CompositeLayer = React.memo(({ position, layer, style, model }) => {
  const sublayerGap = 10;

  // Calculate the total width of sublayers
  const sublayerWidths = layer.sublayers.map(
    (sublayer) => sublayer.dimensions[0]
  );
  const totalWidth =
    sublayerWidths.reduce((sum, width) => sum + width, 0) +
    (layer.sublayers.length - 1) * sublayerGap;

  let accumulatedWidth = -totalWidth / 2;

  return (
    <group position={position}>
      {layer.sublayers.map((sublayer, idx) => {
        const x =
          accumulatedWidth +
          sublayer.dimensions[0] / 2 +
          (idx > 0 ? sublayerGap : 0);
        accumulatedWidth += sublayer.dimensions[0] + sublayerGap;

        return (
          <CNNLayer
            key={`${layer.name}-sublayer-${idx}`}
            position={[x, 0, 0]}
            layer={sublayer}
            style={style}
            model={model}
          />
        );
      })}
    </group>
  );
});

export default CNNLayers;
