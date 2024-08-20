// index.js
"use client";

import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import DeviceOrientationControls from "@/foundations/test/yakitori/utils/device-orientation-controls";
import { useSpring, animated } from "@react-spring/three";
import { Perf } from "r3f-perf";

import Connections from "./connections";
import { generateStructure } from "./structure";

const INTERVAL = 25;

const X_LEN = 20;
const Y_LEN = 3;

// Main component to render the neural network
export default function Yakitori({ layerIdx = 4, layersExpanded = [true, true, true, true, true], enableDeviceControls = true }) {
  const structure = useMemo(() => generateStructure(X_LEN), []); // Generate the structure dynamically

  const editedExpanded = useMemo(() => new Array(X_LEN).fill(0).map((_, i) => Math.random() < 0.5), [layerIdx, layersExpanded]);

  return (
    <S.Container>
      <Canvas
        camera={{
          position: [-60, 0, structure[layerIdx].position[2]],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <CameraLookAt layerIdx={layerIdx} structure={structure} />
        <Perf position="top-left" />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <directionalLight position={[10, 0, 10]} intensity={2} />
        {new Array(Y_LEN).fill(0).map((_, y) =>
          new Array(Y_LEN).fill(0).map((_, z) => (
            <SingleLayer
              key={`${y}-${z}`}
              position={[
                INTERVAL * (y - (Y_LEN - 1) / 2), // Y-axis position
                INTERVAL * (z - (Y_LEN - 1) / 2), // Z-axis position
                0, // X-axis remains the same
              ]}
              layersExpanded={editedExpanded}
              structure={structure}
            />
          ))
        )}

        <OrbitControls />
        {enableDeviceControls && <DeviceOrientationControls layerIdx={layerIdx} />}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
      </Canvas>
    </S.Container>
  );
}

function CameraLookAt({ layerIdx, structure }) {
  useFrame((state) => {
    state.camera.lookAt(0, 0, structure[layerIdx].position[2]);
  });

  return null;
}

function SingleLayer({ structure, ...props }) {
  return (
    <group {...props}>
      {structure.map((structureEl, i) => (
        <Layer key={i} {...structureEl} expanded={props.layersExpanded[i]} setExpanded={() => {}} />
      ))}
      <Connections layersExpanded={props.layersExpanded} structure={structure} />
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
