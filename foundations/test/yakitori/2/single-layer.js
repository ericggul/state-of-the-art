import { useMemo, useState, Suspense } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Perf } from "r3f-perf";

import Connections from "../1/connections";
import { generateStructure } from "../1/structure";

import { X_LEN } from "./index";

export default function SingleLayer({ yIdx, zIdx, layerIdx, ...props }) {
  const localStructure = useMemo(() => generateStructure(X_LEN), [yIdx, zIdx]); // Generate the structure dynamically
  const layersExpanded = useMemo(() => new Array(X_LEN).fill(0).map((_, i) => Math.random() < 0.5), [layerIdx]);

  return (
    <group {...props}>
      {localStructure.map((structureEl, i) => (
        <Layer key={i} {...structureEl} expanded={layersExpanded[i]} setExpanded={() => {}} />
      ))}
      <Connections layersExpanded={layersExpanded} structure={localStructure} />
    </group>
  );
}

const Layer = (props) => {
  const { expanded, setExpanded } = props;

  function handleClick(e) {
    e.stopPropagation();
    setExpanded();
  }

  const [smoothedExpanded, setSmoothedExpanded] = useState(0);

  useSpring({
    from: { smoothedExpanded: 0 },
    to: { smoothedExpanded: expanded ? 1 : 0 },
    config: { mass: 1, tension: 120, friction: 13 },
    onChange: (value) => {
      setSmoothedExpanded(value.value.smoothedExpanded);
    },
  });

  return (
    <group position={props.position} onClick={handleClick}>
      {smoothedExpanded > 0 &&
        new Array(props.grid.xCount).fill(0).map((_, i) => (
          <animated.group key={i} position={[(props.grid.xInterval * i - ((props.grid.xCount - 1) * props.grid.xInterval) / 2) * smoothedExpanded, 0, 0]}>
            {new Array(props.grid.yCount).fill(0).map((_, j) => (
              <animated.group key={j} position={[0, (props.grid.yInterval * j - ((props.grid.yCount - 1) * props.grid.yInterval) / 2) * smoothedExpanded, 0]}>
                <Node {...props.node} color={props.color} key={j} opacity={smoothedExpanded} />
              </animated.group>
            ))}
          </animated.group>
        ))}

      {smoothedExpanded < 1 && (
        <>
          <Node {...props.unexpandedNode} color={props.color} position={[0, 0, 0]} scale={[1 - smoothedExpanded, 1 - smoothedExpanded, 1 - smoothedExpanded]} />
        </>
      )}
    </group>
  );
};

const Node = ({ position, size, color, opacity = 0.4, scale }) => {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[...size]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={1} opacity={opacity} transparent={true} />
    </mesh>
  );
};
