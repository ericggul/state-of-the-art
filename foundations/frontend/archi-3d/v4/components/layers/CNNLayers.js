import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import Layer from "../Layer";
import { LAYER_CONFIGS } from "../../structure";

const CNNLayers = React.memo(({ structure, style, model }) => {
  const config = LAYER_CONFIGS[model];
  const layerHeight = config.layerHeight;

  return structure.map((layer, i) => {
    const y =
      i * layerHeight - (structure.length * layerHeight) / 2 + layerHeight / 2;
    return (
      <AnimatedLayer
        key={`${config.keyPrefix}-${i}`}
        position={[0, y, 0]}
        layer={layer}
        style={style}
        model={model}
        delay={i * 100}
      />
    );
  });
});

const AnimatedLayer = ({ position, layer, style, model, delay }) => {
  const [expanded, setExpanded] = useState(false);

  const { scale } = useSpring({
    scale: expanded ? 1 : 0.5,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  useEffect(() => {
    const toggleExpanded = () => setExpanded((prev) => !prev);
    const timer = setInterval(toggleExpanded, 2000 + delay);
    return () => clearInterval(timer);
  }, [delay]);

  return (
    <animated.group position={position} scale={scale}>
      <Layer layer={layer} style={style} model={model} />
    </animated.group>
  );
};

export default CNNLayers;
