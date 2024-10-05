import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance, Html } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useMemo, Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Transformer structure definition including both encoder and decoder
const STRUCTURE = [
  // Encoder Stack
  { name: "Input Embeddings", dimensions: [512, 8, 1], type: "input", zSpan: [8, 1], stack: "encoder" },
  { name: "Positional Encoding (Encoder)", dimensions: [512, 8, 1], type: "positional", zSpan: [8, 1], stack: "encoder" },
  // Encoder blocks
  ...Array(6)
    .fill()
    .map((_, i) => [
      { name: `Encoder Self-Attention ${i + 1}`, dimensions: [512, 8, 8], type: "attention", zSpan: [8, 8], stack: "encoder" },
      { name: `Encoder Layer Norm ${i + 1}a`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1], stack: "encoder" },
      { name: `Encoder Feed Forward ${i + 1}`, dimensions: [2048, 8, 1], type: "ffn", zSpan: [8, 1], stack: "encoder" },
      { name: `Encoder Layer Norm ${i + 1}b`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1], stack: "encoder" },
    ])
    .flat(),

  // Decoder Stack
  { name: "Output Embeddings", dimensions: [512, 8, 1], type: "input", zSpan: [8, 1], stack: "decoder" },
  { name: "Positional Encoding (Decoder)", dimensions: [512, 8, 1], type: "positional", zSpan: [8, 1], stack: "decoder" },
  // Decoder blocks
  ...Array(6)
    .fill()
    .map((_, i) => [
      // Masked Self-Attention
      { name: `Decoder Masked Self-Attention ${i + 1}`, dimensions: [512, 8, 8], type: "masked_attention", zSpan: [8, 8], stack: "decoder" },
      { name: `Decoder Layer Norm ${i + 1}a`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1], stack: "decoder" },
      // Cross-Attention
      { name: `Decoder Cross-Attention ${i + 1}`, dimensions: [512, 8, 8], type: "cross_attention", zSpan: [8, 8], stack: "decoder" },
      { name: `Decoder Layer Norm ${i + 1}b`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1], stack: "decoder" },
      // Feed Forward
      { name: `Decoder Feed Forward ${i + 1}`, dimensions: [2048, 8, 1], type: "ffn", zSpan: [8, 1], stack: "decoder" },
      { name: `Decoder Layer Norm ${i + 1}c`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1], stack: "decoder" },
    ])
    .flat(),

  // Final output layer
  { name: "Linear Projection", dimensions: [512, 8, 1], type: "output", zSpan: [8, 1], stack: "decoder" },
];

// Extended color scheme to include decoder-specific components
const COLORS = {
  input: "hsl(240, 100%, 50%)", // Blue for inputs
  positional: "hsl(240, 100%, 50%)", // Teal for positional encoding
  attention: "hsl(240, 100%, 50%)", // Green for attention
  masked_attention: "hsl(240, 100%, 60%)", // Purple for masked attention
  cross_attention: "hsl(240, 100%, 60%)", // Pink for cross attention
  norm: "hsl(240, 100%, 50%)", // Yellow for normalization
  ffn: "hsl(240, 100%, 50%)", // Orange for feed-forward networks
  output: "hsl(240, 100%, 50%)", // Red for output
};

export default function Transformer3D() {
  // Calculate total number of layers to determine angle increments
  const totalLayers = STRUCTURE.length;
  const radius = 100; // Radius of the circle
  const verticalSpacing = 10; // Vertical spacing between layers
  const angleIncrement = (2 * Math.PI) / totalLayers;

  return (
    <Canvas
      camera={{
        position: [0, 150, 300],
        fov: 50,
        near: 0.1,
        far: 5000,
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <pointLight position={[0, 150, 0]} intensity={1} />
      <directionalLight position={[0, 150, 100]} intensity={1} />
      <ambientLight intensity={0.5} />

      {STRUCTURE.map(({ dimensions, type, name, zSpan, stack }, i) => {
        // Calculate angle and position for each layer
        const angle = i * angleIncrement;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = i * verticalSpacing - (totalLayers * verticalSpacing) / 2;

        return (
          <Layer
            key={i}
            position={[x, y, z]}
            rotation={[0, -angle, 0]} // Rotate each layer to face outward
            unexpandedNode={{
              size: [dimensions[0] * 0.1, dimensions[1], dimensions[2]],
              wireframeDivision: 1,
            }}
            node={{
              size: [dimensions[0] * 0.05, dimensions[1] * 0.5, 1],
              wireframeDivision: 1,
            }}
            grid={{
              xCount: zSpan[0],
              yCount: zSpan[1],
              xInterval: dimensions[0] * 0.06,
              yInterval: dimensions[1] * 0.55,
            }}
            type={type}
            name={name}
            color={COLORS[type]}
          />
        );
      })}
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}

// Rest of the components (Layer, Node, InstancedNodes) remain the same
const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setExpanded((b) => !b);
  };

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  return (
    <animated.group position={props.position} rotation={props.rotation} onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Render both components and control their visibility via scale */}
      <InstancedNodes {...props.grid} node={props.node} scale={smoothedExpanded} color={hovered ? "white" : props.color} />

      <Node {...props.unexpandedNode} color={hovered ? "white" : props.color} position={[0, 0, 0]} scale={smoothedExpanded.to((se) => [1 - se, 1 - se, 1 - se])} />

      {/* Layer label */}
      {/* <Html position={[0, props.unexpandedNode.size[1] / 2 + 5, 0]} rotation={[0, Math.PI, 0]}>
        <div
          style={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {props.name}
        </div>
      </Html> */}
    </animated.group>
  );
};

// Component to render each node as a box
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

// Component to render instances of nodes
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
    <animated.group scale={scale}>
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
