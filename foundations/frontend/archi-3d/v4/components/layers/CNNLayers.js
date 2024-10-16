import React, { useState, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "../Node";
import InstancedNodes from "../InstancedNodes";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../models";

const CNNLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model];
  const layerHeight = config.layerHeight;

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;

    // Handle composite layers with sublayers (e.g., inception modules)
    if (layer.sublayers) {
      return (
        <CompositeLayer
          key={`${config.keyPrefix}-${i}`}
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
        key={`${config.keyPrefix}-${i}`}
        position={[0, y, 0]}
        layer={layer}
        style={style}
        model={model}
      />
    );
  });
});

const CNNLayer = React.memo(({ position, layer, style, model }) => {
  const [expanded, setExpanded] = useState(false);

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
  const gridTypeConfig = gridConfig[layer.type] || {
    xCount: layer.zSpan[0],
    yCount: layer.zSpan[1],
    xInterval: layer.dimensions[0] * 0.55,
    yInterval: layer.dimensions[1] * 0.55,
  };

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
        <InstancedNodes {...grid} node={node} color={color} style={style} />
      </animated.group>
      <animated.group
        scale-x={smoothedExpanded.to((v) => 1 - v)}
        scale-y={smoothedExpanded.to((v) => 1 - v)}
        scale-z={smoothedExpanded.to((v) => 1 - v)}
      >
        <Node {...unexpandedNode} color={color} style={style} />
      </animated.group>
    </group>
  );
});

const CompositeLayer = React.memo(({ position, layer, style, model }) => {
  const sublayerGap = 10;
  const totalWidth =
    layer.sublayers.reduce((sum, sublayer) => sum + sublayer.dimensions[0], 0) +
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
