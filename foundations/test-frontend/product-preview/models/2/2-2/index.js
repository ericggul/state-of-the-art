import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useMemo, Suspense, useRef } from "react";
import { Perf } from "r3f-perf";
import { EffectComposer, Bloom } from "@react-three/postprocessing"; // Import Bloom
import * as THREE from "three";

// AlexNet structure definition
const STRUCTURE = [
  { dimensions: [227, 227, 3], zSpan: [3, 1], type: "input" },
  { dimensions: [55, 55, 96], zSpan: [12, 8], type: "conv" },
  { dimensions: [27, 27, 96], zSpan: [12, 8], type: "pool" },
  { dimensions: [27, 27, 256], zSpan: [16, 16], type: "conv" },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "pool" },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv" },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv" },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "conv" },
  { dimensions: [6, 6, 256], zSpan: [16, 16], type: "pool" },
  { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc" },
  { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc" },
  { dimensions: [1000, 1, 1], zSpan: [1, 1], type: "output" },
];

const COLORS = [
  { type: "input", color: "hsl(240, 100%, 50%)" }, // Green for input, symbolizing the start or entry point
  { type: "conv", color: "hsl(240, 100%, 50%)" }, // Blue for convolutional layers, representing processing and feature extraction
  { type: "pool", color: "hsl(240, 100%, 50%)" }, // Orange for pooling layers, indicating reduction and simplification
  { type: "fc", color: "hsl(240, 100%, 50%)" }, // Purple for fully connected layers, representing dense connections and high-level reasoning
  { type: "output", color: "hsl(240, 100%, 50%)" }, // Red for output, symbolizing the end result or classification
];

// Main component to render the neural network
export default function NN3D() {
  return (
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
      <ambientLight intensity={0.5} />

      {STRUCTURE.map(({ dimensions, type, zSpan }, i) => (
        <Layer
          key={i}
          position={[0, 0, (i - (STRUCTURE.length - 1) / 2) * 30]}
          unexpandedNode={{
            size: [dimensions[0], dimensions[1], dimensions[2] * 0.1],
            wireframeDivision: 1,
          }}
          node={{
            size: [dimensions[0] * 0.5, dimensions[1] * 0.5, 1],
            wireframeDivision: 1,
          }}
          grid={{
            xCount: zSpan[0],
            yCount: zSpan[1],
            xInterval: dimensions[0] * 0.55,
            yInterval: dimensions[1] * 0.55,
          }}
          type={type}
          color={COLORS.find((c) => c.type === type)?.color || "white"}
        />
      ))}

      <OrbitControls />

      {/* Add Bloom postprocessing effect */}
      <EffectComposer>
        <Bloom
          intensity={3}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}

const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);

  function handleClick(e) {
    if (props.type === "input" || props.type === "output") return;
    e.stopPropagation();
    setExpanded((b) => !b);
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
      <Node
        size={props.unexpandedNode.size}
        color={props.color}
        position={[0, 0, 0]}
        scale={[
          1 - smoothedExpanded,
          1 - smoothedExpanded,
          1 - smoothedExpanded,
        ]}
      />
    </group>
  );
};

// Optimized Node component using instancing
const Node = ({ position, size, color = "red", opacity = 0.4, scale }) => {
  const [width, height, depth] = size;
  const layerThickness = 0.1;
  const gap = 0.5;
  const totalDepth = depth * (layerThickness + gap);

  const instancedMeshRef = useRef();
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    for (let i = 0; i < depth; i++) {
      const z = (i - (depth - 1) / 2) * (layerThickness + gap);
      tempObject.position.set(0, 0, z);
      tempObject.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position} scale={scale}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[null, null, depth]}
        frustumCulled={false}
      >
        <boxGeometry args={[width, height, layerThickness]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.8}
          opacity={opacity}
          transparent={true}
          depthTest={true}
          depthWrite={true}
        />
      </instancedMesh>
    </group>
  );
};

// Component to render instances of nodes
const InstancedNodes = ({
  xCount,
  yCount,
  xInterval,
  yInterval,
  node,
  smoothedExpanded,
  color,
}) => {
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < xCount; i++) {
      for (let j = 0; j < yCount; j++) {
        temp.push([
          (xInterval * i - ((xCount - 1) * xInterval) / 2) * smoothedExpanded,
          (yInterval * j - ((yCount - 1) * yInterval) / 2) * smoothedExpanded,
          0,
        ]);
      }
    }
    return temp;
  }, [xCount, yCount, xInterval, yInterval, smoothedExpanded]);

  return (
    <Instances limit={xCount * yCount}>
      <boxGeometry args={[...node.size]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.8}
        opacity={1}
        transparent={true}
        depthTest={false}
        depthWrite={false}
      />
      {positions.map((position, i) => (
        <Instance key={i} position={position} />
      ))}
    </Instances>
  );
};
