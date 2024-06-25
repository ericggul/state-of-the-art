"use client";

import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";

const WIREFRAME_DIVISION = 10;

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

        {new Array(25).fill(0).map((_, i) => (
          <Layer
            key={i}
            position={[0, 0, (i - 25) * 5]}
            node={{
              size: [2, 2, 0.3],
              wireframeDivision: 10,
            }}
            unexpandedNode={{
              size: [8, 8, 0.3],
              wireframeDivision: 50,
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

const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);

  const timeoutRef = useRef(null);

  function handleClick(e) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    e.stopPropagation();
    setExpanded(true);

    timeoutRef.current = setTimeout(() => {
      setExpanded(false);
    }, 2000);
  }

  return (
    <group position={props.position} onPointerEnter={handleClick} onPointerLeave={handleClick}>
      {expanded ? (
        new Array(props.grid.xCount).fill(0).map((_, i) => (
          <group key={i} position={[props.grid.xInterval * i - ((props.grid.xCount - 1) * props.grid.xInterval) / 2, 0, 0]}>
            {new Array(props.grid.yCount).fill(0).map((_, j) => (
              <Node {...props.node} color={props.color} key={j} position={[0, props.grid.yInterval * j - ((props.grid.yCount - 1) * props.grid.yInterval) / 2, 0]} />
            ))}
          </group>
        ))
      ) : (
        <>
          <Node {...props.unexpandedNode} color={props.color} position={[0, 0, 0]} />
        </>
      )}
    </group>
  );
};

// Component to render each node as a box
const Node = ({ position, wireframeDivision = 10, size, color = "white" }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[...size, wireframeDivision, wireframeDivision, 2]} />
      <meshStandardMaterial
        color={color}
        // roughness={0.2}
        // metalness={0.9}
        wireframe={true}
        wireframeLinewidth={3}
        //opacity

        opacity={0.4}
        transparent={true}
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
