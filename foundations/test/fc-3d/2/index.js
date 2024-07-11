"use client";

import { useMemo, useState, useRef, Suspense } from "react";
import * as S from "./styles";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Wireframe, Environment } from "@react-three/drei";
import DeviceOrientationControls from "@/utils/comps/orientation/device-orientation-controls";
import { useSpring, animated, Globals } from "@react-spring/three";
import * as THREE from "three";
import { Perf } from "r3f-perf";

import useDeviceOrientationSupported from "@/utils/hooks/orientation/useDeviceOrientationSupported";

import Connections from "./connections";
import { STRUCTURE } from "./structure";

// Main component to render the neural network
export default function NN3D() {
  const [layersExpanded, setLayersExpanded] = useState(new Array(STRUCTURE.length).fill(false));

  const [requestPermission, setReq] = useState(false);
  const { supports, permission } = useDeviceOrientationSupported({ requestPermission });

  return (
    <S.Container>
      <Canvas
        camera={{
          position: [40, 30, 50],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <Perf position="top-left" />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <directionalLight position={[10, 0, 10]} intensity={2} />

        {STRUCTURE.map((structureEl, i) => (
          <Layer
            key={i}
            {...structureEl}
            expanded={layersExpanded[i]}
            setExpanded={() => {
              setLayersExpanded((prev) => {
                const newExpanded = [...prev];
                newExpanded[i] = !prev[i];
                return newExpanded;
              });
            }}
          />
        ))}

        <Connections layersExpanded={layersExpanded} structure={STRUCTURE} layerFrom={STRUCTURE[0]} layerTo={STRUCTURE[1]} />

        <OrbitControls />
        {supports && permission && <DeviceOrientationControls />}
      </Canvas>

      {supports && !requestPermission && <S.OrientationPermissionModal onClick={() => setReq(true)}>Ask for device orientation</S.OrientationPermissionModal>}
    </S.Container>
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

// Component to render each node as a box
const Node = ({ position, size, color = "red", opacity = 0.4, scale }) => {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[...size, 50, 50, 2]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.9}
        //opacity
        opacity={opacity}
        transparent={true}
        //wireframe
        wireframe={true}
        wireframeLinewidth={3}
      />
    </mesh>
  );
};
