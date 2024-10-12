import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";

// Constants defining the structure
const NUM_ENCODER_LAYERS = 6;
const NUM_DECODER_LAYERS = 6;

// Structure definition (simplified)
const STRUCTURE = [
  { name: `Input Image Frames`, type: "input", stack: "encoder" },
  { name: `TAE Encoder`, type: "encoder", stack: "encoder" },
  ...Array.from({ length: NUM_ENCODER_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [6144, 48, 48],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 48, 1] },
    ],
  })),
  {
    name: `Cross Attention (Text Embeddings)`,
    type: "cross_attention",
    stack: "encoder",
  },
  { name: `UL2 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `MetaCLIP Embeddings`, type: "embedding", stack: "encoder" },
  { name: `ByT5 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `Gaussian Noise Input`, type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_DECODER_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Diffusion Step ${i + 1}`,
        type: "diffusion",
        dimensions: [128, 8, 8],
      },
      {
        name: `Upsample Step ${i + 1}`,
        type: "upsample",
        dimensions: [64, 8, 8],
      },
    ],
  })),
  { name: `TAE Decoder`, type: "decoder", stack: "decoder" },
  { name: `Output Image/Video`, type: "output", stack: "decoder" },
];

// Expanded styling strategies
const STYLE_STRATEGIES = [
  {
    name: "Subtle Blue",
    colors: {
      outer: "hsl(230, 70%, 50%)",
      inner: "hsl(235, 60%, 40%)",
      plane: "hsl(240, 60%, 20%)",
    },
    material: {
      metalness: 0.9,
      roughness: 0.4,
      transparent: false,
    },
    lighting: {
      environment: "apartment",
      envIntensity: 1,
      pointLight: { position: [0, 200, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
  },
  {
    name: "Seagram Building",
    colors: {
      outer: "#7d7d7d",
      inner: "#1b1b1b",
      windowGlow: "hsl(240, 10%, 20%)",
    },
    material: {
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    },
    lighting: {
      environment: "apartment",
      envIntensity: 1,
      pointLight: { position: [0, 200, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    windowEffect: true,
  },
  {
    name: "Donald Judd",
    colors: {
      outer: "#b8860b",
      inner: "#b8860b",
      highlight: "#daa520",
    },
    material: {
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
    },
    lighting: {
      environment: "sunset",
      envIntensity: 0.5,
      directionalLight: { position: [5, 5, 5], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
  },
  {
    name: "Monochrome Blue",
    colors: {
      outer: "hsl(240, 100%, 50%)",
      inner: "hsl(240, 100%, 50%)",
      plane: "hsl(240, 100%, 20%)",
    },
    material: {
      metalness: 0.5,
      roughness: 0.5,
      transparent: false,
    },
    lighting: {
      environment: "city",
      envIntensity: 0.5,
      directionalLight: { position: [10, 20, 10], intensity: 1 },
      ambientLight: { intensity: 0.3 },
    },
  },
  {
    name: "Neon Nights",
    colors: {
      outer: "#ff00ff",
      inner: "#00ffff",
      highlight: "#ffff00",
    },
    material: {
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
    },
    lighting: {
      environment: "night",
      envIntensity: 0.1,
      pointLight: { position: [0, 50, 0], intensity: 2 },
      ambientLight: { intensity: 0.1 },
    },
    emissive: true,
  },

  {
    name: "AlexNet Monochrome",
    colors: {
      outer: "hsl(240, 100%, 50%)",
      inner: "hsl(240, 100%, 50%)",
    },
    material: {
      roughness: 0.5,
      metalness: 0.8,
      transparent: true,
      opacity: 0.4,
      depthTest: false,
      depthWrite: false,
    },
    lighting: {
      environment: "warehouse",
      pointLight: { position: [10, 10, 10], intensity: 1 },
      directionalLight1: { position: [0, 10, 10], intensity: 2 },
      directionalLight2: { position: [10, 0, 10], intensity: 2 },
      ambientLight: { intensity: 0.5 },
    },
    postprocessing: {
      bloom: {
        intensity: 3,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
    },
    camera: {
      position: [40, 30, 50],
      fov: 50,
      near: 0.1,
      far: 5000,
    },
    shadows: false,
  },
  {
    name: "Transformer Monochrome",
    colors: {
      outer: "hsl(240, 100%, 50%)",
      inner: "hsl(240, 100%, 50%)",
    },
    material: {
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.6,
      depthTest: false,
      depthWrite: false,
    },
    lighting: {
      environment: "warehouse",
      pointLight: { position: [0, 150, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    camera: {
      position: [0, 75, 200],
      fov: 50,
      near: 0.1,
      far: 1000,
    },
    layout: {
      layerHeight: 15,
      encoderPosition: -50,
      decoderPosition: 50,
      nodeSize: [10, 5, 1],
      unexpandedNodeSize: [20, 10, 10],
      gridInterval: { x: 12, y: 6 },
    },
  },
];

export default function VideoGenModelVisualization({ styleIndex = 6 }) {
  const style = STYLE_STRATEGIES[styleIndex];
  const encoderLayers = STRUCTURE.filter((layer) => layer.stack === "encoder");
  const decoderLayers = STRUCTURE.filter((layer) => layer.stack === "decoder");

  const layerHeight = 13;

  return (
    <Canvas
      shadows={style.shadows}
      camera={{
        position: [
          0,
          (NUM_ENCODER_LAYERS + NUM_DECODER_LAYERS) * layerHeight * 0.5,
          (NUM_ENCODER_LAYERS + NUM_DECODER_LAYERS) * layerHeight * 1.2,
        ],
        fov: 50,
        near: 0.1,
        far: 5000,
      }}
    >
      <Suspense fallback={null}>
        <Environment
          preset={style.lighting.environment}
          intensity={style.lighting.envIntensity}
        />
      </Suspense>
      {style.lighting.pointLight && (
        <pointLight {...style.lighting.pointLight} />
      )}
      {style.lighting.directionalLight && (
        <directionalLight {...style.lighting.directionalLight} />
      )}
      {style.lighting.ambientLight && (
        <ambientLight {...style.lighting.ambientLight} />
      )}
      {style.lighting.spotLight && <spotLight {...style.lighting.spotLight} />}

      {/* Encoder (TAE) Stack */}
      {encoderLayers.map((layer, i) => {
        const y =
          i * layerHeight -
          (encoderLayers.length * layerHeight) / 2 +
          layerHeight / 2;
        return (
          <Layer
            key={`encoder-${i}`}
            position={[-50, y, 0]}
            layer={layer}
            style={style}
          />
        );
      })}

      {/* Decoder (TAE) Stack */}
      {decoderLayers.map((layer, i) => {
        const y =
          i * layerHeight -
          (decoderLayers.length * layerHeight) / 2 +
          layerHeight / 2;
        return (
          <Layer
            key={`decoder-${i}`}
            position={[50, y, 0]}
            layer={layer}
            style={style}
          />
        );
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

const Layer = ({ position, layer, style }) => {
  const size = [30, 10, 10];
  const gap = 10;

  if (layer.sublayers) {
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Sublayer
            key={`${layer.name}-sublayer-${idx}`}
            position={[
              0,
              (idx - (layer.sublayers.length - 1) / 2) * (size[1] + gap),
              0,
            ]}
            sublayer={sublayer}
            style={style}
          />
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <Node size={size} style={style} color={style.colors.outer} />
    </group>
  );
};

const Sublayer = ({ position, sublayer, style }) => {
  const size = [20, 8, 8];
  const gridConfig = {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  };

  const grid = gridConfig[sublayer.type] || {
    xCount: 1,
    yCount: 1,
    xInterval: 10,
    yInterval: 10,
  };

  return (
    <group position={position}>
      <InstancedNodes
        xCount={grid.xCount}
        yCount={grid.yCount}
        xInterval={grid.xInterval}
        yInterval={grid.yInterval}
        nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        style={style}
        color={style.colors.inner}
      />
    </group>
  );
};

const Node = ({ size, style, color }) => {
  return (
    <mesh castShadow={style.shadows} receiveShadow={style.shadows}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        {...style.material}
        color={color}
        emissive={style.emissive ? style.colors.emissive : "black"}
        emissiveIntensity={style.emissive ? 0.5 : 0}
        wireframe={style.material.wireframe}
      />
    </mesh>
  );
};

const InstancedNodes = ({
  xCount,
  yCount,
  xInterval,
  yInterval,
  nodeSize,
  style,
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
    <group rotation={[Math.PI / 2, 0, 0]}>
      <Instances limit={xCount * yCount}>
        <boxGeometry args={nodeSize} />
        <meshStandardMaterial
          {...style.material}
          color={color}
          emissive={style.emissive ? style.colors.emissive : "black"}
          emissiveIntensity={style.emissive ? 0.5 : 0}
          wireframe={style.material.wireframe}
        />
        {positions.map((position, i) => (
          <Instance
            key={i}
            position={position}
            castShadow={style.shadows}
            receiveShadow={style.shadows}
          />
        ))}
      </Instances>
    </group>
  );
};
