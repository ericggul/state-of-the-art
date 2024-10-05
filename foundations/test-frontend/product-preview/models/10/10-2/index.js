import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { Suspense, useMemo } from "react";

// Constants defining the structure
const NUM_ENCODER_LAYERS = 6; // Number of encoder layers
const NUM_DECODER_LAYERS = 6; // Number of decoder layers

// Structure definition (simplified)
const STRUCTURE = [
  { name: `Input Image Frames`, type: "input", stack: "encoder" },
  { name: `TAE Encoder`, type: "encoder", stack: "encoder" },
  ...Array.from({ length: NUM_ENCODER_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Self-Attention ${i + 1}`, type: "attention", dimensions: [6144, 48, 48] },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 48, 1] },
    ],
  })),
  { name: `Cross Attention (Text Embeddings)`, type: "cross_attention", stack: "encoder" },
  { name: `UL2 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `MetaCLIP Embeddings`, type: "embedding", stack: "encoder" },
  { name: `ByT5 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `Gaussian Noise Input`, type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_DECODER_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Diffusion Step ${i + 1}`, type: "diffusion", dimensions: [128, 8, 8] },
      { name: `Upsample Step ${i + 1}`, type: "upsample", dimensions: [64, 8, 8] },
    ],
  })),
  { name: `TAE Decoder`, type: "decoder", stack: "decoder" },
  { name: `Output Image/Video`, type: "output", stack: "decoder" },
];

// Seagram Building-inspired colors
const COLORS = {
  outer: "#7d7d7d", // Darker bronze-like metallic tone
  inner: "#1b1b1b", // Dark reflective window-like material
  windowGlow: "hsl(240, 10%, 20%)", // Subtle yellowish light for window glow
};

// outer: "#7d7d7d", // Metallic gray for the outer parts, evoking industrial material
// inner: "hsl(240, 100%, 40%)", // Bold deep blue for the inner layers
// highlight: "#333333", // Darker metallic/industrial feel for borders or edges

export default function SeagramBuildingVisualization() {
  const encoderLayers = STRUCTURE.filter((layer) => layer.stack === "encoder");
  const decoderLayers = STRUCTURE.filter((layer) => layer.stack === "decoder");

  const layerHeight = 13; // Vertical spacing between layers

  return (
    <Canvas
      camera={{
        position: [0, (NUM_ENCODER_LAYERS + NUM_DECODER_LAYERS) * layerHeight * 0.5, (NUM_ENCODER_LAYERS + NUM_DECODER_LAYERS) * layerHeight * 1.2],
        fov: 50,
        near: 0.1,
        far: 5000,
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>
      <pointLight position={[0, 200, 0]} intensity={1} />
      <directionalLight position={[0, 150, 100]} intensity={1} />
      <ambientLight intensity={0.5} />

      {/* Encoder (TAE) Stack */}
      {encoderLayers.map((layer, i) => {
        const y = i * layerHeight - (encoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <Layer key={`encoder-${i}`} position={[-50, y, 0]} layer={layer} />;
      })}

      {/* Decoder (TAE) Stack */}
      {decoderLayers.map((layer, i) => {
        const y = i * layerHeight - (decoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <Layer key={`decoder-${i}`} position={[50, y, 0]} layer={layer} />;
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

const Layer = ({ position, layer }) => {
  const size = [30, 10, 10]; // Base size for layers
  const gap = 10; // Gap between sublayers

  if (layer.sublayers) {
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer key={`${layer.name}-sublayer-${idx}`} position={[0, (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap), 0]} sublayer={sublayer} />
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <Node size={size} />
    </group>
  );
};

const Sublayer = ({ position, sublayer }) => {
  const size = [20, 8, 8]; // Size for sublayers
  const gridConfig = {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  };

  const grid = gridConfig[sublayer.type] || { xCount: 1, yCount: 1, xInterval: 10, yInterval: 10 };

  return (
    <group position={position}>
      <InstancedNodes xCount={grid.xCount} yCount={grid.yCount} xInterval={grid.xInterval} yInterval={grid.yInterval} nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]} />
    </group>
  );
};

const Node = ({ size }) => {
  return (
    <mesh>
      <boxGeometry args={size} />
      {/* Outer bronze-like shell */}
      <meshStandardMaterial color={COLORS.outer} metalness={0.9} roughness={0.3} />
      {/* Inner window-like surface */}
      <meshStandardMaterial color={COLORS.inner} roughness={0.4} metalness={0.7} />
    </mesh>
  );
};

const InstancedNodes = ({ xCount, yCount, xInterval, yInterval, nodeSize }) => {
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
        {/* Window-like material with a soft glow */}
        <meshStandardMaterial color={COLORS.windowGlow} emissive={COLORS.windowGlow} emissiveIntensity={0.5} wireframe />
        {positions.map((position, i) => (
          <Instance key={i} position={position} />
        ))}
      </Instances>
    </group>
  );
};
