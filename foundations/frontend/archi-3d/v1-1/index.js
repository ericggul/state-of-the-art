// Visualization.js
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { Suspense, useEffect, useState, useMemo } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useSpring, animated } from "@react-spring/three";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { VIDEO_GEN_STRUCTURE, ALEXNET_STRUCTURE, COLORS } from "./structure";

export default function Visualization({ model = "alexNet", styleIndex = 3 }) {
  const style = STYLE_STRATEGIES[styleIndex];
  const structure =
    model === "alexNet" ? ALEXNET_STRUCTURE : VIDEO_GEN_STRUCTURE;

  return (
    <Canvas camera={style.camera}>
      <CommonScene style={style}>
        <Layers structure={structure} style={style} />
      </CommonScene>
    </Canvas>
  );
}

function CommonScene({ style, children }) {
  return (
    <>
      <Suspense fallback={null}>
        <Environment
          preset={style.lighting.environment || "warehouse"}
          intensity={style.lighting.envIntensity || 1}
        />
      </Suspense>
      {style.lighting.pointLight && (
        <pointLight {...style.lighting.pointLight} />
      )}
      {style.lighting.directionalLight && (
        <directionalLight {...style.lighting.directionalLight} />
      )}
      {style.lighting.directionalLight1 && (
        <directionalLight {...style.lighting.directionalLight1} />
      )}
      {style.lighting.directionalLight2 && (
        <directionalLight {...style.lighting.directionalLight2} />
      )}
      {style.lighting.ambientLight && (
        <ambientLight {...style.lighting.ambientLight} />
      )}
      {children}
      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
      <EffectComposer>
        {style.postprocessing && style.postprocessing.bloom && (
          <Bloom {...style.postprocessing.bloom} />
        )}
      </EffectComposer>
    </>
  );
}

function Layers({ structure, style }) {
  const totalLayers = structure.length;
  const layerGap = 15; // Adjust gap between layers

  return (
    <>
      {structure.map((layer, index) => (
        <Layer
          key={index}
          layer={layer}
          style={style}
          position={[0, -index * layerGap, 0]}
        />
      ))}
    </>
  );
}

function Layer({ layer, style, position }) {
  const color = COLORS[layer.type] || "white";

  // If the layer has sublayers, render them recursively
  if (layer.sublayers && layer.sublayers.length > 0) {
    const sublayerGap = 12; // Adjust gap between sublayers
    return (
      <group position={position}>
        {layer.sublayers.map((sublayer, idx) => (
          <Layer
            key={`${layer.name}-sublayer-${idx}`}
            layer={sublayer}
            style={style}
            position={[0, idx * sublayerGap, 0]}
          />
        ))}
      </group>
    );
  }

  // Handle rendering based on layer type
  return (
    <group position={position}>
      <Node size={layer.dimensions} style={style} color={color} />
    </group>
  );
}

function Node({ size, style, color }) {
  // Scale down the size for visualization
  const scaleFactor = 0.05; // Adjust scale factor as needed
  const adjustedSize = size.map((dim) => dim * scaleFactor);

  return (
    <mesh castShadow={style.shadows} receiveShadow={style.shadows}>
      <boxGeometry args={adjustedSize} />
      <meshStandardMaterial
        {...style.material}
        color={color}
        emissive={style.emissive ? style.colors.emissive : "black"}
        emissiveIntensity={style.emissive ? 0.5 : 0}
        wireframe={style.material.wireframe}
      />
    </mesh>
  );
}
