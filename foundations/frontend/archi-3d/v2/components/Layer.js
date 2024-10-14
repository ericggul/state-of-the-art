import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "./Node";
import InstancedNodes from "./InstancedNodes";

const Layer = React.memo((props) => {
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

  if (props.model === "gpt" || props.model === "videoGen") {
    return <ModularLayer {...props} />;
  } else {
    return (
      <AlexNetLayer
        {...props}
        expanded={expanded}
        smoothedExpanded={smoothedExpanded}
      />
    );
  }
});

const ModularLayer = ({ position, layer, style }) => {
  const size = [30, 10, 10];
  const gap = 10;

  if (layer.sublayers) {
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer
            key={`${layer.name}-sublayer-${idx}`}
            position={[
              0,
              (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap),
              0,
            ]}
            sublayer={sublayer}
            style={style}
          />
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <Node size={size} style={style} color={style.colors.outer} />
    </group>
  );
};

const AlexNetLayer = ({
  position,
  unexpandedNode,
  node,
  grid,
  color,
  style,
  expanded,
  smoothedExpanded,
}) => {
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
};

const Sublayer = ({ position, sublayer, style }) => {
  const size = [20, 8, 8];
  const gridConfig = {
    // attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    // ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    attention: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  };

  const grid = gridConfig[sublayer.type] || {
    xCount: 1,
    yCount: 1,
    xInterval: 10,
    yInterval: 10,
  };

  return (
    <group position={position}>
      <InstancedNodes
        xCount={grid.xCount}
        yCount={grid.yCount}
        xInterval={grid.xInterval}
        yInterval={grid.yInterval}
        nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        style={style}
        color={style.colors.inner}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

export default Layer;
