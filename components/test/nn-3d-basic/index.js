"use client";

import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";

// Define nodes and their positions
const nodes = [
  { position: [-4, 4, 0] },
  { position: [0, 4, 0] },
  { position: [4, 4, 0] }, // Input layer
  { position: [-4, 0, 0] },
  { position: [0, 0, 0] },
  { position: [4, 0, 0] }, // Hidden layer
  { position: [0, -4, 0] }, // Output layer
];

// Define connections between nodes
const connections = [
  { from: 0, to: 3 },
  { from: 0, to: 4 },
  { from: 0, to: 5 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
  { from: 4, to: 6 },
  { from: 5, to: 6 },
];

// Component to render each node as a box
const Node = ({ position }) => (
  <mesh position={position}>
    <boxGeometry args={[2, 2, 1, 10, 10, 10]} />
    <meshStandardMaterial
      color="red"
      // roughness={0.2}
      // metalness={1}
      wireframe={true}
      //wierframelinewidth
      wireframeLinewidth={3}
    />
  </mesh>
);

// Component to render connections between nodes
const Connection = ({ from, to }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);

  const ref = useMemo(() => new THREE.BufferGeometry(), [start, end]);
  ref.setFromPoints([start, mid, end]);

  return (
    <line geometry={ref}>
      <lineBasicMaterial color={Math.random() < 0.3 ? "hsl(180, 100%, 70%)" : "white"} linewidth={2} linecap="round" linejoin="round" />
    </line>
  );
};

// Main component to render the neural network
export default function NN3D() {
  return (
    <S.Container>
      <Canvas>
        <Perf position="top-left" />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <directionalLight position={[10, 0, 10]} intensity={2} />
        {new Array(10).fill(0).map((_, i) => (
          <group key={i} position={[0, 0, 3 * i]}>
            {nodes.map((node, index) => (
              <Node key={index} position={node.position} />
            ))}
            {connections.map((connection, index) => (
              <Connection key={index} from={nodes[connection.from].position} to={nodes[connection.to].position} />
            ))}
          </group>
        ))}

        <OrbitControls />
      </Canvas>
    </S.Container>
  );
}
