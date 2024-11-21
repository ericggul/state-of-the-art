"use client";

import {
  useMemo,
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
} from "react";
import * as S from "./styles";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

import Connections from "./connections";
import { STRUCTURE } from "./structure";
import DeviceOrientationControls from "./DeviceOrientationControls";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function FC3D({ enableDeviceControls = true }) {
  const [expandedLayers, setExpandedLayers] = useState(
    new Array(STRUCTURE.length).fill(true)
  );

  const toggleRandomLayer = useCallback(() => {
    const randomLayerIndex = Math.floor(Math.random() * STRUCTURE.length);
    setExpandedLayers((prev) => {
      const newExpanded = [...prev];
      newExpanded[randomLayerIndex] = !prev[randomLayerIndex];
      return newExpanded;
    });
  }, []);

  useRandomInterval(toggleRandomLayer, 500, 2000, true);

  return (
    <S.Container>
      <Canvas
        camera={{
          position: [-15, 0, 15],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
      >
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
            layerIdx={i}
            expanded={expandedLayers[i]}
            setExpanded={() => {
              setExpandedLayers((prev) => {
                const newExpanded = [...prev];
                newExpanded[i] = !prev[i];
                return newExpanded;
              });
            }}
            isFocusLayer={2 == i}
          />
        ))}

        <Connections
          layersExpanded={expandedLayers}
          structure={STRUCTURE}
          layerFrom={STRUCTURE[0]}
          layerTo={STRUCTURE[1]}
        />

        {enableDeviceControls && <DeviceOrientationControls />}
      </Canvas>
    </S.Container>
  );
}

const Layer = (props) => {
  const { expanded, setExpanded } = props;
  const [smoothedExpanded, setSmoothedExpanded] = useState(0);

  function handleClick(e) {
    e.stopPropagation();
    setExpanded();
  }

  useSpring({
    from: { smoothedExpanded: 0 },
    to: { smoothedExpanded: expanded ? 1 : 0 },
    config: {
      mass: 1.5,
      tension: 140,
      friction: 15,
      clamp: false,
    },
    onChange: (value) => {
      setSmoothedExpanded(value.value.smoothedExpanded);
    },
  });

  return (
    <group position={props.position} onClick={handleClick}>
      {smoothedExpanded > 0 &&
        new Array(props.grid.xCount).fill(0).map((_, i) => (
          <animated.group
            key={i}
            position={[
              (props.grid.xInterval * i -
                ((props.grid.xCount - 1) * props.grid.xInterval) / 2) *
                smoothedExpanded,
              0,
              0,
            ]}
          >
            {new Array(props.grid.yCount).fill(0).map((_, j) => (
              <animated.group
                key={j}
                position={[
                  0,
                  (props.grid.yInterval * j -
                    ((props.grid.yCount - 1) * props.grid.yInterval) / 2) *
                    smoothedExpanded,
                  0,
                ]}
              >
                <Node
                  {...props.node}
                  isFocusLayer={props.isFocusLayer}
                  wireframe={props.isFocusLayer ? 20 : 1}
                  color={props.color}
                  key={j}
                  opacity={smoothedExpanded}
                />
              </animated.group>
            ))}
          </animated.group>
        ))}

      {smoothedExpanded < 1 && (
        <Node
          isFocusLayer={props.isFocusLayer}
          wireframe={props.isFocusLayer ? 50 : 1}
          {...props.unexpandedNode}
          color={props.color}
          position={[0, 0, 0]}
          scale={[
            1 - smoothedExpanded,
            1 - smoothedExpanded,
            1 - smoothedExpanded,
          ]}
        />
      )}
    </group>
  );
};

const Node = ({
  position,
  size,
  color = "red",
  opacity = 0.4,
  scale,
  wireframe = 10,
  isFocusLayer,
}) => {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry
        args={[...size, wireframe, wireframe, Math.ceil(wireframe / 3)]}
      />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.9}
        opacity={opacity}
        transparent={true}
        wireframe={isFocusLayer}
        wireframeLinewidth={3}
      />
    </mesh>
  );
};
