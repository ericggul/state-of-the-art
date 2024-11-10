import React, { useState, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "../Node";
import InstancedNodes from "../InstancedNodes";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";
import RNNConnections from "../connections/RNNConnections";
import useScreenStore from "@/components/screen/store";

const RNNLayers = React.memo(({ structure, style, model }) => {
  const [expandedLayers, setExpandedLayers] = useState({});

  const layers = useMemo(() => {
    let cumulativeHeight = 0;
    const layerGap = 10;
    const gridConfig = GRID_CONFIGS[model] || {};

    return structure.map((layer, i) => {
      const height = layer.dimensions[1];
      const y = cumulativeHeight + height / 2;
      cumulativeHeight += height + layerGap;

      const gridTypeConfig = gridConfig[layer.type] || {
        xCount: 4,
        yCount: 4,
        xInterval: 5,
        yInterval: 5,
      };

      const grid = {
        xCount: layer.zSpan ? layer.zSpan[0] : gridTypeConfig.xCount,
        yCount: layer.zSpan ? layer.zSpan[1] : gridTypeConfig.yCount,
        xInterval: gridTypeConfig.xInterval,
        yInterval: gridTypeConfig.yInterval,
      };

      return {
        ...layer,
        position: [0, y, 0],
        grid,
      };
    });
  }, [structure, model]);

  const totalHeight =
    layers[layers.length - 1].position[1] +
    layers[layers.length - 1].dimensions[1] / 2;
  const centerOffset = totalHeight / 2;

  const handleLayerExpand = (index, isExpanded) => {
    setExpandedLayers((prev) => ({ ...prev, [index]: isExpanded }));
  };

  return (
    <group position={[0, -centerOffset, 0]}>
      <RNNConnections
        structure={layers}
        style={style}
        expandedLayers={expandedLayers}
      />
      {layers.map((layer, i) => (
        <RNNLayer
          key={`${model}-layer-${i}`}
          layer={layer}
          style={style}
          model={model}
          onExpand={(isExpanded) => handleLayerExpand(i, isExpanded)}
        />
      ))}
    </group>
  );
});

const RNNLayer = React.memo(({ layer, style, model, onExpand }) => {
  const [expanded, setExpanded] = useState(false);

  const { isProjector } = useScreenStore();

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  useEffect(() => {
    const toggleExpanded = () => {
      const newExpanded = !expanded;
      setExpanded(newExpanded);
      onExpand(newExpanded);
    };
    const interval = Math.random() * 2000 + 500;
    const timer = setInterval(toggleExpanded, interval);
    return () => clearInterval(timer);
  }, [onExpand]);

  const gridConfig = GRID_CONFIGS[model] || {};
  const gridTypeConfig = gridConfig[layer.type] || {
    xCount: 4,
    yCount: 4,
    xInterval: 5,
    yInterval: 5,
  };

  const grid = {
    xCount: layer.zSpan ? layer.zSpan[0] : gridTypeConfig.xCount,
    yCount: layer.zSpan ? layer.zSpan[1] : gridTypeConfig.yCount,
    xInterval: gridTypeConfig.xInterval,
    yInterval: gridTypeConfig.yInterval,
  };

  const expandedNode = {
    size: [1, 1, 1],
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

  const color = style.colors.inner;

  return (
    <group position={layer.position}>
      <animated.group
        scale-x={smoothedExpanded}
        scale-y={smoothedExpanded}
        scale-z={1}
      >
        <InstancedNodes
          {...grid}
          node={expandedNode}
          color={color}
          style={style}
          isProjector={isProjector}
        />
      </animated.group>
      <animated.group
        scale-x={smoothedExpanded.to((v) => 1 - v)}
        scale-y={smoothedExpanded.to((v) => 1 - v)}
        scale-z={1}
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

export default RNNLayers;
