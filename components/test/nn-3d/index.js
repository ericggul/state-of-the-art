"use client";

import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";

const WIREFRAME_DIVISION = 15;

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

        {new Array(50).fill(0).map((_, i) => (
          <Layer
            position={[0, 0, (i - 25) * 5]}
            node={{
              size: [2, 2, 0.3],
            }}
            grid={{
              xCount: 5,
              yCount: 5,
              xInterval: 3,
              yInterval: 3,
            }}
            color={"white"}
          />
        ))}

        <OrbitControls />
      </Canvas>
    </S.Container>
  );
}

const Layer = ({ position, node, grid, color }) => {
  return (
    <group position={position}>
      {new Array(grid.xCount).fill(0).map((_, i) => (
        <group key={i} position={[grid.xInterval * i - ((grid.xCount - 1) * grid.xInterval) / 2, 0, 0]}>
          {new Array(grid.yCount).fill(0).map((_, j) => (
            <Node {...node} color={color} key={j} position={[0, grid.yInterval * j - ((grid.yCount - 1) * grid.yInterval) / 2, 0]} />
          ))}
        </group>
      ))}
    </group>
  );
};

// Component to render each node as a box
const Node = ({ position, size, color }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[...size, WIREFRAME_DIVISION, WIREFRAME_DIVISION, 2]} />
      <meshStandardMaterial
        color={color}
        // roughness={0.2}
        // metalness={0.9}
        wireframe={true}
        wireframeLinewidth={3}
        //opacity

        // opacity={0.4}
        // transparent={true}
      />
    </mesh>
  );
};

// Component to render connections between nodes
const Connection = ({ from, to }) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);

  const ref = useMemo(() => new THREE.BufferGeometry(), [start, end]);
  ref.setFromPoints([start, mid, end]);

  return (
    <line geometry={ref}>
      <lineBasicMaterial color={"white"} linewidth={2} linecap="round" linejoin="round" />
    </line>
  );
};
