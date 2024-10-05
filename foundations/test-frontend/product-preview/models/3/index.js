import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { useState, useMemo, Suspense } from "react";

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
      { name: `Encoder Feed Forward ${i + 1}`, dimensions: [2048, 8, 1], type: "ffn", zSpan: [8, 1], stack: "encoder" },
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
      { name: `Decoder Masked Self-Attention ${i + 1}`, dimensions: [512, 8, 8], type: "attention", zSpan: [8, 8], stack: "decoder" },
      // Cross-Attention
      { name: `Decoder Cross-Attention ${i + 1}`, dimensions: [512, 8, 8], type: "attention", zSpan: [8, 8], stack: "decoder" },
      // Feed Forward
      { name: `Decoder Feed Forward ${i + 1}`, dimensions: [2048, 8, 1], type: "ffn", zSpan: [8, 1], stack: "decoder" },
    ])
    .flat(),
  // Final output layer
  { name: "Linear Projection", dimensions: [512, 8, 1], type: "output", zSpan: [8, 1], stack: "decoder" },
];

// Uniform color scheme with hue 240
const COLORS = {
  input: "hsl(240, 100%, 50%)",
  positional: "hsl(240, 100%, 50%)",
  attention: "hsl(240, 100%, 50%)",
  ffn: "hsl(240, 100%, 50%)",
  output: "hsl(240, 100%, 50%)",
};

export default function Transformer3D() {
  const encoderLayers = STRUCTURE.filter((layer) => layer.stack === "encoder");
  const decoderLayers = STRUCTURE.filter((layer) => layer.stack === "decoder");

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

      {/* Encoder Stack */}
      {encoderLayers.map((layer, i) => {
        const y = i * layerHeight - (encoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return (
          <Layer
            key={`encoder-${i}`}
            position={[-50, y, 0]} // Vertically aligned
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

      {/* Decoder Stack */}
      {decoderLayers.map((layer, i) => {
        const y = i * layerHeight - (decoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return (
          <Layer
            key={`decoder-${i}`}
            position={[50, y, 0]} // Vertically aligned
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
    </Canvas>
  );
}

const Layer = (props) => {
  const [hovered, setHovered] = useState(false);

  // Axis of expansion (either "x", "y", or "z")
  const expansionAxis = props.axis || "y";
  const axisMultiplier = expansionAxis === "x" ? [1, 0, 0] : expansionAxis === "y" ? [0, 1, 0] : [0, 0, 1];

  // Adjust position of expanded layers along the axis perpendicular to the stack
  const expandedOffset = props.index * 5;

  return (
    <group position={props.position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} rotation={[0, 0, 0]}>
      {/* Render both components and control their visibility via scale */}
      <group position={[expandedOffset * axisMultiplier[0], expandedOffset * axisMultiplier[1], expandedOffset * axisMultiplier[2]]}>
        <InstancedNodes {...props.grid} node={props.node} scale={[1, 1, 1]} color={hovered ? "white" : props.color} />
      </group>

      <Node
        {...props.unexpandedNode}
        color={hovered ? "white" : props.color}
        position={[0, 0, 0]}
        scale={[0, 0, 0]} // Hidden since layers are always expanded
        opacity={0.6}
      />
    </group>
  );
};

const Node = ({ position, wireframeDivision = 10, size, color = "red", opacity = 0.6, scale }) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[...size, wireframeDivision, wireframeDivision, 1]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} opacity={opacity} transparent={true} depthTest={false} depthWrite={false} />
      </mesh>
    </group>
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
    <group scale={scale} rotation={[Math.PI / 2, 0, 0]}>
      <Instances limit={xCount * yCount}>
        <boxGeometry args={[...node.size]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} opacity={1} transparent={true} depthTest={false} depthWrite={false} />
        {positions.map((position, i) => (
          <Instance key={i} position={position} />
        ))}
      </Instances>
    </group>
  );
};
