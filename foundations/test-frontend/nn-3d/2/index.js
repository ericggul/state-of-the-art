"use client";

import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Wireframe, Environment } from "@react-three/drei";
import { useSpring, animated, Globals } from "@react-spring/three";

import { useMemo, useState, useRef, Suspense } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";

const getRandomInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// Main component to render the neural network
export default function NN3D() {
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
          <Environment preset="warehouse" />
        </Suspense>

        {/* <ambientLight intensity={1} /> */}
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <directionalLight position={[10, 0, 10]} intensity={2} />

        {new Array(25).fill(0).map((_, i) => (
          <Layer
            key={i}
            position={[0, 0, (i - 12) * 4]}
            node={{
              size: [2, 2, 0.3],
              wireframeDivision: 10,
            }}
            unexpandedNode={{
              size: [8, 8, 0.3],
              wireframeDivision: 50,
            }}
            grid={{
              xCount: 5 + (i % 5),
              yCount: 5 + (i % 5),
              xInterval: 3,
              yInterval: 3,
            }}
            color={"blue"}
          />
        ))}

        <OrbitControls />
      </Canvas>
    </S.Container>
  );
}

const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);

  function handleClick(e) {
    e.stopPropagation();
    setExpanded((b) => !b);
  }

  const [smoothedExpanded, setSmoothedExpanded] = useState(0);

  useSpring({
    from: { smoothedExpanded: 0 },
    to: { smoothedExpanded: expanded ? 1 : 0 },
    config: { duration: 500 },
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
const Node = ({ position, wireframeDivision = 10, size, color = "red", opacity = 0.4, scale }) => {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[...size, wireframeDivision, wireframeDivision, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.9}
        //opacity
        opacity={opacity}
        transparent={true}
      />
      {/* <Wireframe fill="white" fillMix={0} fillOpacity={1} thickness={0.1} dash={false} squeeze={false} /> */}
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
