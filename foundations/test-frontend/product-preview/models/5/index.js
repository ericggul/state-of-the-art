import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { useMemo, Suspense } from "react";

// Transformer structure definition including both encoder and decoder
const STRUCTURE = [
  // Encoder Stack
  { name: "Input Embeddings", dimensions: [512, 8, 1], type: "input", stack: "encoder" },
  { name: "Positional Encoding (Encoder)", dimensions: [512, 8, 1], type: "positional", stack: "encoder" },
  // Encoder blocks
  ...Array(6)
    .fill()
    .map((_, i) => [
      {
        name: `Encoder Layer ${i + 1}`,
        type: "encoder_layer",
        stack: "encoder",
        sublayers: [
          { name: `Self-Attention ${i + 1}`, type: "attention", dimensions: [512, 8, 8] },
          { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
        ],
      },
    ])
    .flat(),
  // Decoder Stack
  { name: "Output Embeddings", dimensions: [512, 8, 1], type: "input", stack: "decoder" },
  { name: "Positional Encoding (Decoder)", dimensions: [512, 8, 1], type: "positional", stack: "decoder" },
  // Decoder blocks
  ...Array(6)
    .fill()
    .map((_, i) => [
      {
        name: `Decoder Layer ${i + 1}`,
        type: "decoder_layer",
        stack: "decoder",
        sublayers: [
          { name: `Masked Self-Attention ${i + 1}`, type: "attention", dimensions: [512, 8, 8] },
          { name: `Cross-Attention ${i + 1}`, type: "attention", dimensions: [512, 8, 8] },
          { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
        ],
      },
    ])
    .flat(),
  // Final output layer
  { name: "Linear Projection", dimensions: [512, 8, 1], type: "output", stack: "decoder" },
];

// Uniform color scheme with hue 240
const COLORS = {
  default: "hsl(240, 100%, 50%)",
};

export default function Transformer3D() {
  const encoderLayers = STRUCTURE.filter((layer) => layer.stack === "encoder");
  const decoderLayers = STRUCTURE.filter((layer) => layer.stack === "decoder");

  const layerHeight = 20; // Vertical spacing between layers

  return (
    <Canvas
      camera={{
        position: [0, 100, 300],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <pointLight position={[0, 200, 0]} intensity={1} />
      <directionalLight position={[0, 150, 100]} intensity={1} />
      <ambientLight intensity={0.5} />

      {/* Encoder Stack */}
      {encoderLayers.map((layer, i) => {
        const y = i * layerHeight - (encoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <Layer key={`encoder-${i}`} position={[-80, y, 0]} layer={layer} color={COLORS.default} index={i} />;
      })}

      {/* Decoder Stack */}
      {decoderLayers.map((layer, i) => {
        const y = i * layerHeight - (decoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <Layer key={`decoder-${i}`} position={[80, y, 0]} layer={layer} color={COLORS.default} index={i} />;
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

const Layer = ({ position, layer, color, index }) => {
  const size = [30, 10, 10]; // Base size for layers
  const gap = 15; // Gap between sublayers

  // For layers that have sublayers (encoder_layer, decoder_layer)
  if (layer.sublayers) {
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer key={`${layer.name}-sublayer-${idx}`} position={[0, (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap), 0]} sublayer={sublayer} color={color} />
        ))}
      </group>
    );
  }

  // For layers without sublayers
  return (
    <group position={position}>
      <Node size={size} color={color} />
    </group>
  );
};

const Sublayer = ({ position, sublayer, color }) => {
  const size = [20, 8, 8]; // Size for sublayers
  const gridConfig = {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 5 },
    ffn: { xCount: 16, yCount: 4, xInterval: 4, yInterval: 6 },
  };

  const grid = gridConfig[sublayer.type] || { xCount: 1, yCount: 1, xInterval: 0, yInterval: 0 };

  return (
    <group position={position}>
      <InstancedNodes
        xCount={grid.xCount}
        yCount={grid.yCount}
        xInterval={grid.xInterval}
        yInterval={grid.yInterval}
        nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        color={color}
      />
    </group>
  );
};

const Node = ({ size, color }) => {
  return (
    <mesh>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.5}
        opacity={0.6}
        transparent={true}

        // depthTest={false} depthWrite={false}
      />
    </mesh>
  );
};

const InstancedNodes = ({ xCount, yCount, xInterval, yInterval, nodeSize, color }) => {
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
    <group rotation={[Math.PI / 2, 0, 0]}>
      <Instances limit={xCount * yCount}>
        <boxGeometry args={nodeSize} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.5}
          opacity={1}
          transparent={true}
          //  depthTest={false} depthWrite={false}
        />
        {positions.map((position, i) => (
          <Instance key={i} position={position} />
        ))}
      </Instances>
    </group>
  );
};
