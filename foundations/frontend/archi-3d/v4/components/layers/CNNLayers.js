import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "../Node";
import InstancedNodes from "../InstancedNodes";
import { LAYER_CONFIGS } from "../../structure";

const CNNLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model];
  const layerHeight = config.layerHeight;

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;
    return (
      <CNNLayer
        key={`${config.keyPrefix}-${i}`}
        position={[0, y, 0]}
        unexpandedNode={{
          size: [
            layer.dimensions[0],
            layer.dimensions[1],
            layer.dimensions[2] * 0.1,
          ],
          wireframeDivision: 1,
        }}
        node={{
          size: [layer.dimensions[0] * 0.5, layer.dimensions[1] * 0.5, 1],
          wireframeDivision: 1,
        }}
        grid={{
          xCount: layer.zSpan[0],
          yCount: layer.zSpan[1],
          xInterval: layer.dimensions[0] * 0.55,
          yInterval: layer.dimensions[1] * 0.55,
        }}
        type={layer.type}
        color={
          style.colors[layer.type] ||
          style.colors.inner ||
          `hsl(240, 100%, 50%)`
        }
        style={style}
        model={model}
      />
    );
  });
});

const CNNLayer = React.memo((props) => {
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

  const { position, unexpandedNode, node, grid, color, style } = props;

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

export default CNNLayers;
