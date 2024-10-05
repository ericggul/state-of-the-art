import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { useMemo, Suspense } from "react";

// BERT architecture uses 12 encoder layers (simplified)
const NUM_ENCODER_LAYERS = 12;

// BERT structure definition (encoder-only transformer)
const STRUCTURE = [];

// Define Embedding layers for BERT
STRUCTURE.push({ name: `Token Embeddings`, type: "input", stack: "encoder" }, { name: `Positional Embeddings`, type: "positional", stack: "encoder" });

// Add encoder blocks with balanced focus on both attention and feed-forward for BERT's bidirectional nature
for (let i = 1; i <= NUM_ENCODER_LAYERS; i++) {
  STRUCTURE.push({
    name: `Encoder Layer ${i}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Self-Attention ${i}`, type: "attention", dimensions: [768, 12, 12] }, // Attention used for bidirectional learning
      { name: `Feed Forward ${i}`, type: "ffn", dimensions: [3072, 12, 1] }, // Feed-forward layers are equally important
    ],
  });
}

// Final output layer
STRUCTURE.push({ name: "Final Projection", type: "output", stack: "encoder" });

// Define a green color scheme to reflect BERT's bidirectional flow
const COLORS = {
  attention: "hsl(240, 100%, 50%)", // Green for attention layers
  ffn: "hsl(240, 100%, 50%)", // Lighter green for feed-forward layers
  default: "hsl(240, 100%, 70%)",
};

export default function BERTVisualization() {
  const encoderLayers = STRUCTURE.filter((layer) => layer.stack === "encoder");

  const layerHeight = 10;

  return (
    <Canvas
      camera={{
        position: [0, NUM_ENCODER_LAYERS * layerHeight * 0.5, NUM_ENCODER_LAYERS * layerHeight * 1.2],
        fov: 50,
        near: 0.1,
        far: 5000,
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
        return <Layer key={`encoder-${i}`} position={[0, y, 0]} layer={layer} color={COLORS[layer.type] || COLORS.default} index={i} />;
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

const Layer = ({ position, layer, color }) => {
  const size = [30, 10, 10];
  const gap = 10;

  if (layer.sublayers) {
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer key={`${layer.name}-sublayer-${idx}`} position={[0, (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap), 0]} sublayer={sublayer} color={color} />
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <Node size={size} color={color} />
    </group>
  );
};

const Sublayer = ({ position, sublayer, color }) => {
  const size = [20, 8, 8];
  const gridConfig = {
    attention: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 }, // Balanced grid for attention
    ffn: { xCount: 24, yCount: 4, xInterval: 2, yInterval: 5 },
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
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} opacity={0.6} transparent={true} />
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
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} opacity={1} transparent={true} />
        {positions.map((position, i) => (
          <Instance key={i} position={position} />
        ))}
      </Instances>
    </group>
  );
};
