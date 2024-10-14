import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "./Node";
import InstancedNodes from "./InstancedNodes";
import Sublayer from "./Sublayer";

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

  if (["gpt", "videoGen", "vggnet", "lenet", "lenet5"].includes(props.model)) {
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

const ModularLayer = ({ position, layer, style, model }) => {
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
            model={model}
          />
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <Node
        size={layer.dimensions || size}
        style={style}
        color={style.colors[layer.type] || style.colors.outer}
      />
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

export default Layer;
