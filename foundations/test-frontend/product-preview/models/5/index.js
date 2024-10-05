import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useMemo, Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// GPT structure definition (Decoder-only architecture)
const GPT_STRUCTURE = [
  // GPT Stack
  { name: "Input Embeddings", dimensions: [512, 8, 1], type: "input", zSpan: [8, 1], stack: "gpt" },
  { name: "Positional Encoding", dimensions: [512, 8, 1], type: "positional", zSpan: [8, 1], stack: "gpt" },
  // GPT blocks
  ...Array(12)
    .fill()
    .map((_, i) => [
      { name: `Self-Attention ${i + 1}`, dimensions: [512, 8, 8], type: "attention", zSpan: [8, 8], stack: "gpt" },
      { name: `Feed Forward ${i + 1}`, dimensions: [2048, 8, 1], type: "ffn", zSpan: [8, 1], stack: "gpt" },
    ])
    .flat(),
  // Output layer
  { name: "Linear Projection", dimensions: [512, 8, 1], type: "output", zSpan: [8, 1], stack: "gpt" },
];

// Uniform color scheme with hue 240
const COLORS = {
  input: "hsl(240, 100%, 50%)",
  positional: "hsl(240, 100%, 50%)",
  attention: "hsl(240, 100%, 50%)",
  ffn: "hsl(240, 100%, 50%)",
  output: "hsl(240, 100%, 50%)",
};

export default function GPT3D() {
  const gptLayers = GPT_STRUCTURE.filter((layer) => layer.stack === "gpt");

  const layerHeight = 15; // Vertical spacing between layers

  return (
    <Canvas
      camera={{
        position: [0, 75, 200],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <pointLight position={[0, 150, 0]} intensity={1} />
      <directionalLight position={[0, 150, 100]} intensity={1} />
      <ambientLight intensity={0.5} />

      {/* GPT Stack */}
      {gptLayers.map((layer, i) => {
        const y = i * layerHeight - (gptLayers.length * layerHeight) / 2 + layerHeight / 2;
        return (
          <Layer
            key={`gpt-${i}`}
            position={[0, y, 0]} // Vertically aligned
            index={i}
            unexpandedNode={{
              size: [20, 10, 10],
              wireframeDivision: 1,
            }}
            node={{
              size: [10, 5, 1],
              wireframeDivision: 1,
            }}
            grid={{
              xCount: layer.zSpan[0],
              yCount: layer.zSpan[1],
              xInterval: 12,
              yInterval: 6,
            }}
            type={layer.type}
            name={layer.name}
            color={COLORS[layer.type]}
          />
        );
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}

const Layer = (props) => {
  const [hovered, setHovered] = useState(false);
  const [expanded] = useState(true); // Always expanded

  // Axis of expansion (either "x", "y", or "xz")
  const expansionAxis = "xz"; // Expands on XZ plane
  const axisMultiplier = expansionAxis === "xz" ? [1, 0, 1] : [1, 0, 0]; // XZ plane expansion

  const expandedOffset = props.index * 5;

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  return (
    <animated.group position={props.position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Render both components and control their visibility via scale */}
      <animated.group position={smoothedExpanded.to((se) => [expandedOffset * axisMultiplier[0] * se, expandedOffset * axisMultiplier[1] * se, expandedOffset * axisMultiplier[2] * se])}>
        <InstancedNodes {...props.grid} node={props.node} scale={smoothedExpanded} color={hovered ? "white" : props.color} />
      </animated.group>

      <Node {...props.unexpandedNode} color={hovered ? "white" : props.color} position={[0, 0, 0]} scale={smoothedExpanded.to((se) => [1 - se, 1 - se, 1 - se])} opacity={0.6} />
    </animated.group>
  );
};

const Node = ({ position, wireframeDivision = 10, size, color = "red", opacity = 0.6, scale }) => {
  return (
    <animated.group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[...size, wireframeDivision, wireframeDivision, 1]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} opacity={opacity} transparent={true} depthTest={false} depthWrite={false} />
      </mesh>
    </animated.group>
  );
};

const InstancedNodes = ({ xCount, yCount, xInterval, yInterval, node, scale, color }) => {
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < xCount; i++) {
      for (let j = 0; j < yCount; j++) {
        temp.push([xInterval * i - ((xCount - 1) * xInterval) / 2, yInterval * j - ((yCount - 1) * yInterval) / 2, 0]);
      }
    }
    return temp;
  }, [xCount, yCount, xInterval, yInterval]);

  return (
    <animated.group scale={scale} rotation={[Math.PI / 2, 0, 0]}>
      <Instances limit={xCount * yCount}>
        <boxGeometry args={[...node.size]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} opacity={1} transparent={true} depthTest={false} depthWrite={false} />
        {positions.map((position, i) => (
          <Instance key={i} position={position} />
        ))}
      </Instances>
    </animated.group>
  );
};
