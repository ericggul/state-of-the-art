"use client";

import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance, Line } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { Perf } from "r3f-perf";
import * as THREE from "three";

import Connections from "./connections";

// AlexNet structure definition
export const STRUCTURE = [
  { dimensions: [227, 227, 3], zSpan: [3, 1], type: "input", kernel: { size: 11, number: 55 } },
  { dimensions: [55, 55, 96], zSpan: [12, 8], type: "conv", kernel: { size: 3, number: 27 } },
  { dimensions: [27, 27, 96], zSpan: [12, 8], type: "pool", kernel: { size: 5, number: 27 } },
  { dimensions: [27, 27, 256], zSpan: [16, 16], type: "conv", kernel: { size: 3, number: 13 } },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "pool", kernel: { size: 3, number: 13 } },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv", kernel: { size: 3, number: 13 } },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv", kernel: { size: 3, number: 13 } },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "conv", kernel: { size: 3, number: 6 } },
  { dimensions: [6, 6, 256], zSpan: [16, 16], type: "pool", kernel: { size: 1, number: 30 } },
  // { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc", kernel: { size: 1, number: 30 } },
  // { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc", kernel: { size: 1, number: 30 } },
  { dimensions: [1000, 1, 1], zSpan: [1, 1], type: "output", kernel: { size: 1, number: 30 } },
  // { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc", kernel: { size: 1, number: 30 } },
  // { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc", kernel: { size: 1, number: 30 } },
  { dimensions: [6, 6, 256], zSpan: [16, 16], type: "pool", kernel: { size: 1, number: 30 } },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "conv", kernel: { size: 3, number: 6 } },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv", kernel: { size: 3, number: 13 } },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv", kernel: { size: 3, number: 13 } },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "pool", kernel: { size: 3, number: 13 } },
  { dimensions: [27, 27, 256], zSpan: [16, 16], type: "conv", kernel: { size: 3, number: 13 } },
  { dimensions: [27, 27, 96], zSpan: [12, 8], type: "pool", kernel: { size: 5, number: 27 } },
  { dimensions: [55, 55, 96], zSpan: [12, 8], type: "conv", kernel: { size: 3, number: 27 } },
  { dimensions: [227, 227, 3], zSpan: [3, 1], type: "input", kernel: { size: 11, number: 55 } },
];

export const NODE_SCALE = 1;

const COLORS = [
  { type: "input", color: "hsl(120, 100%, 50%)" }, // Green for input, symbolizing the start or entry point
  { type: "conv", color: "hsl(240, 100%, 50%)" }, // Blue for convolutional layers, representing processing and feature extraction
  { type: "pool", color: "hsl(330, 100%, 50%)" }, // Orange for pooling layers, indicating reduction and simplification
  { type: "fc", color: "hsl(291, 100%, 50%)" }, // Purple for fully connected layers, representing dense connections and high-level reasoning
  { type: "output", color: "hsl(0, 100%, 50%)" }, // Red for output, symbolizing the end result or classification
];

// Main component to render the neural network
export default function NN3D() {
  const [expandedIdx, setExpandedIdx] = useState(-2);
  const directionRef = useRef(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpandedIdx((idx) => {
        let newIdx = idx + directionRef.current;
        if (newIdx > STRUCTURE.length - 1 || newIdx < -5) {
          directionRef.current *= -1;
          console.log("49", newIdx, directionRef.current);
        }
        return newIdx;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <S.Container>
      <Canvas
        camera={{
          position: [40, 30, 50],
          fov: 50,
          near: 0.1,
          far: 5000,
        }}
      >
        <Perf position="top-left" />
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
        </Suspense>
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <directionalLight position={[10, 0, 10]} intensity={2} />

        {STRUCTURE.map(({ dimensions, type, zSpan, kernel }, i) => (
          <Layer
            key={i}
            position={[0, 0, (i - (STRUCTURE.length - 1) / 2) * 100]}
            unexpandedNode={{
              size: [dimensions[0] * 2, dimensions[1] * 2, dimensions[2] * 0.2],
              wireframeDivision: 1,
            }}
            node={{
              size: [kernel.size, kernel.size, dimensions[2] * 0.2],
              wireframeDivision: 1,
            }}
            grid={{
              xCount: kernel.number,
              yCount: kernel.number,
              zCount: dimensions[2],
              xInterval: kernel.size * 2,
              yInterval: kernel.size * 2,
            }}
            type={type}
            color={COLORS.find((c) => c.type === type)?.color || "white"}
            isExpanded={expandedIdx === i}
          />
        ))}

        {/* <Connections layerFrom={STRUCTURE[2]} layerTo={STRUCTURE[3]} /> */}
        <OrbitControls />
      </Canvas>
    </S.Container>
  );
}

const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);

  function handleClick(e) {
    if (props.type === "input" || props.type === "output") return;
    e.stopPropagation();
    setExpanded((b) => !b);
  }

  useEffect(() => {
    if (props.isExpanded) {
      setExpanded(props.isExpanded);
    } else {
      //timeout 500ms
      const timeout = setTimeout(() => {
        setExpanded(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [props.isExpanded]);

  const [smoothedExpanded, setSmoothedExpanded] = useState(0);

  useSpring({
    from: { smoothedExpanded: 0 },
    to: { smoothedExpanded: expanded ? 1 : 0 },
    config: {
      mass: 1,
      tension: 120,
      friction: 13,
    },

    onChange: (value) => {
      setSmoothedExpanded(value.value.smoothedExpanded);
    },
  });

  return (
    <group position={props.position} onClick={handleClick}>
      {smoothedExpanded > 0 && <InstancedNodes {...props.grid} node={props.node} smoothedExpanded={smoothedExpanded} color={props.color} />}
      {smoothedExpanded < 1 && <Node {...props.unexpandedNode} color={props.color} position={[0, 0, 0]} scale={[1 - smoothedExpanded, 1 - smoothedExpanded, 1 - smoothedExpanded]} />}
    </group>
  );
};

// Component to render each node as a box
const Node = ({ position, wireframeDivision = 1, size, color = "red", opacity = 0.4, scale }) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[...size]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} opacity={opacity} transparent={true} />
      </mesh>
    </group>
  );
};

// Component to render instances of nodes
const InstancedNodes = ({ xCount, yCount, zCount, xInterval, yInterval, node, smoothedExpanded, color }) => {
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < xCount; i++) {
      for (let j = 0; j < yCount; j++) {
        temp.push([(xInterval * i - ((xCount - 1) * xInterval) / 2) * smoothedExpanded, (yInterval * j - ((yCount - 1) * yInterval) / 2) * smoothedExpanded, 0]);
      }
    }

    return temp;
  }, [xCount, yCount, xInterval, yInterval, smoothedExpanded]);

  return (
    <Instances limit={xCount * yCount}>
      <boxGeometry args={[...node.size]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={1} opacity={1} transparent={true} />
      {positions.map((position, i) => (
        <Instance key={i} position={position} />
      ))}
    </Instances>
  );
};
