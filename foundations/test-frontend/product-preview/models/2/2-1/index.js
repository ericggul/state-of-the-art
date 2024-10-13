import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useMemo, Suspense, useEffect } from "react";
import { Perf } from "r3f-perf";
import { EffectComposer, Bloom } from "@react-three/postprocessing"; // Import Bloom

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
          position={[0, 0, (i - (STRUCTURE.length - 1) / 2) * 60]}
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

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  useEffect(() => {
    const toggleExpanded = () => {
      setExpanded((prev) => !prev);
    };

    // Set up random interval for toggling
    const minInterval = 1000; // 2 seconds
    const maxInterval = 8000; // 8 seconds
    const randomInterval =
      Math.random() * (maxInterval - minInterval) + minInterval;

    const timer = setInterval(toggleExpanded, randomInterval);

    return () => clearInterval(timer);
  }, []);

  return (
    <group position={props.position}>
      <animated.group
        scale-x={smoothedExpanded}
        scale-y={smoothedExpanded}
        scale-z={smoothedExpanded}
      >
        <InstancedNodes {...props.grid} node={props.node} color={props.color} />
      </animated.group>
      <animated.group
        scale-x={smoothedExpanded.to((v) => 1 - v)}
        scale-y={smoothedExpanded.to((v) => 1 - v)}
        scale-z={smoothedExpanded.to((v) => 1 - v)}
      >
        <Node
          {...props.unexpandedNode}
          color={props.color}
          position={[0, 0, 0]}
        />
      </animated.group>
    </group>
  );
};

// Component to render each node as a box
const Node = ({
  position,
  wireframeDivision = 10,
  size,
  color = "red",
  opacity = 0.4,
  scale,
}) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry
          args={[...size, wireframeDivision, wireframeDivision, 1]}
        />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.8}
          opacity={opacity}
          transparent={true}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
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
  color,
}) => {
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < xCount; i++) {
      for (let j = 0; j < yCount; j++) {
        temp.push([
          xInterval * i - ((xCount - 1) * xInterval) / 2,
          yInterval * j - ((yCount - 1) * yInterval) / 2,
          0,
        ]);
      }
    }
    return temp;
  }, [xCount, yCount, xInterval, yInterval]);

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
