import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { useMemo, Suspense } from "react";
import { useSpring, animated, config } from "@react-spring/three";

// Number of decoder layers (adjustable, set to 24 for performance)
const NUM_LAYERS = 24;

// GPT-3 structure definition (decoder-only transformer)
const STRUCTURE = [];

// Generate decoder layers
STRUCTURE.push(
  // Input Embeddings
  { name: `Input Embeddings`, type: "input", stack: "decoder" },
  // Positional Encoding
  { name: `Positional Encoding`, type: "positional", stack: "decoder" }
);

// Decoder blocks
for (let i = 1; i <= NUM_LAYERS; i++) {
  STRUCTURE.push({
    name: `Decoder Layer ${i}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Self-Attention ${i}`, type: "attention", dimensions: [1280, 16, 16] },
      { name: `Feed Forward ${i}`, type: "ffn", dimensions: [5120, 16, 1] },
    ],
  });
}

// Final LayerNorm and Output Layer
STRUCTURE.push({ name: "Final LayerNorm", type: "layernorm", stack: "decoder" }, { name: "Linear Projection", type: "output", stack: "decoder" });

// Uniform color scheme with hue 240
const COLORS = {
  default: "hsl(240, 100%, 50%)",
};

export default function GPT3Visualization() {
  const decoderLayers = STRUCTURE.filter((layer) => layer.stack === "decoder");

  const layerHeight = 10; // Vertical spacing between layers

  return (
    <Canvas
      camera={{
        position: [0, NUM_LAYERS * layerHeight * 0.5, NUM_LAYERS * layerHeight * 1.2],
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

      {/* Decoder Stack */}
      {decoderLayers.map((layer, i) => {
        const y = i * layerHeight - (decoderLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <AnimatedLayer key={`decoder-${i}`} position={[0, y, 0]} layer={layer} color={COLORS.default} index={i} delay={i * 100} />;
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

const AnimatedLayer = ({ position, layer, color, delay }) => {
  // Automatically animated expansion and contraction using react-spring, with delay for accumulative animation
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    loop: { reverse: true }, // Loop animation
    config: { duration: 1000, ...config.slow }, // Adjust the speed of expansion and contraction
    delay: delay, // Delay for accumulative animation
  });

  const size = [30, 10, 10]; // Base size for layers
  const gap = 10; // Gap between sublayers

  // For layers that have sublayers (decoder_layer)
  if (layer.sublayers) {
    return (
      <animated.group position={position} scale={scale}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer key={`${layer.name}-sublayer-${idx}`} position={[0, (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap), 0]} sublayer={sublayer} color={color} />
        ))}
      </animated.group>
    );
  }

  // For layers without sublayers
  return (
    <animated.group position={position} scale={scale}>
      <Node size={size} color={color} />
    </animated.group>
  );
};

const Sublayer = ({ position, sublayer, color }) => {
  const size = [20, 8, 8]; // Size for sublayers
  const gridConfig = {
    attention: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
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
