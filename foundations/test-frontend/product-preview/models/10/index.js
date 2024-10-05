import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance } from "@react-three/drei";
import { useState, useMemo, Suspense } from "react";

// Number of generator and discriminator layers
const NUM_GENERATOR_LAYERS = 4;
const NUM_DISCRIMINATOR_LAYERS = 4;

// DCGAN structure definition with detailed sub-layers
const STRUCTURE = [];

// Generate Generator structure (input -> transposed conv -> batch norm -> output)
STRUCTURE.push({ name: `Input Noise Vector`, type: "input", stack: "generator" });

for (let i = 1; i <= NUM_GENERATOR_LAYERS; i++) {
  STRUCTURE.push({
    name: `Generator Layer ${i}`,
    type: "generator_layer",
    stack: "generator",
    sublayers: [
      // Transposed convolution layers (filter, stride, etc.)
      {
        name: `Transposed Convolution ${i}`,
        type: "conv_transpose",
        dimensions: [256, 4, 4],
        subcomponents: [
          { name: `Filter Bank`, type: "filters", count: 256, kernelSize: [4, 4] },
          { name: `Stride`, type: "stride", value: [2, 2] },
          { name: `Padding`, type: "padding", value: "same" },
        ],
      },
      // Batch normalization
      {
        name: `Batch Normalization ${i}`,
        type: "batchnorm",
        dimensions: [256, 4, 4],
        subcomponents: [
          { name: `Mean/Variance Scaling`, type: "scaling" },
          { name: `Normalization Factors`, type: "factors" },
        ],
      },
    ],
  });
}

// Final Generator layer (to generate the image)
STRUCTURE.push({ name: "Generated Image", type: "output", stack: "generator" });

// Discriminator structure
STRUCTURE.push({ name: "Input Image", type: "input", stack: "discriminator" });

for (let i = 1; i <= NUM_DISCRIMINATOR_LAYERS; i++) {
  STRUCTURE.push({
    name: `Discriminator Layer ${i}`,
    type: "discriminator_layer",
    stack: "discriminator",
    sublayers: [
      // Convolution layers (filter, stride, etc.)
      {
        name: `Convolution ${i}`,
        type: "conv",
        dimensions: [256, 4, 4],
        subcomponents: [
          { name: `Filter Bank`, type: "filters", count: 256, kernelSize: [4, 4] },
          { name: `Stride`, type: "stride", value: [2, 2] },
          { name: `Padding`, type: "padding", value: "same" },
        ],
      },
      // Batch normalization
      {
        name: `Batch Normalization ${i}`,
        type: "batchnorm",
        dimensions: [256, 4, 4],
        subcomponents: [
          { name: `Mean/Variance Scaling`, type: "scaling" },
          { name: `Normalization Factors`, type: "factors" },
        ],
      },
    ],
  });
}

// Final layer of discriminator (classification output)
STRUCTURE.push({ name: "Real/Fake Output", type: "output", stack: "discriminator" });

// Color scheme to distinguish between generator and discriminator
const COLORS = {
  generator: "hsl(240, 100%, 50%)", // Blue for the generator
  discriminator: "hsl(240, 100%, 70%)", // Lighter blue for the discriminator
  default: "hsl(240, 100%, 90%)", // Near-white for outputs
};

export default function DCGANVisualization() {
  const generatorLayers = STRUCTURE.filter((layer) => layer.stack === "generator");
  const discriminatorLayers = STRUCTURE.filter((layer) => layer.stack === "discriminator");

  const layerHeight = 15; // Increase vertical spacing between layers for more space
  const stackSpacing = 30; // Increase horizontal spacing between generator and discriminator for clarity

  return (
    <Canvas
      camera={{
        position: [0, NUM_GENERATOR_LAYERS * layerHeight * 0.5, NUM_GENERATOR_LAYERS * layerHeight * 1.5],
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

      {/* Generator Stack */}
      {generatorLayers.map((layer, i) => {
        const y = i * layerHeight - (generatorLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <Layer key={`generator-${i}`} position={[-stackSpacing, y, 0]} layer={layer} color={COLORS.generator} index={i} />;
      })}

      {/* Discriminator Stack */}
      {discriminatorLayers.map((layer, i) => {
        const y = i * layerHeight - (discriminatorLayers.length * layerHeight) / 2 + layerHeight / 2;
        return <Layer key={`discriminator-${i}`} position={[stackSpacing, y, 0]} layer={layer} color={COLORS.discriminator} index={i} />;
      })}

      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}

const layerHeight = 30; // Increase the vertical spacing between layers
const stackSpacing = 120; // Increase the horizontal spacing between generator and discriminator

// Update the Layer component to ensure larger gaps and clearer sublayer divisions
const Layer = ({ position, layer, color }) => {
  const size = [40, 15, 15]; // Increase the base size for layers
  const gap = 30; // Increase the gap between sublayers

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

// Adjust the grid and spacing within sublayers for clarity
const Sublayer = ({ position, sublayer, color }) => {
  const size = [25, 12, 12]; // Size for sublayers
  const gridConfig = {
    conv: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 5 }, // Larger grid for convolutional layers
    conv_transpose: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 }, // Larger grid for transposed convolution
    batchnorm: { xCount: 2, yCount: 1, xInterval: 5, yInterval: 5 }, // BatchNorm remains smaller
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
