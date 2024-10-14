import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
  MeshPhysicalMaterial,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { Suspense, useMemo, useEffect, useState } from "react";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";

import { STYLE_STRATEGIES } from "./style";
import { STRUCTURE, NUM_ENCODER_LAYERS, NUM_DECODER_LAYERS } from "./structure";

export default function VideoGenModelVisualization({ model, styleIndex = 6 }) {
  const style = STYLE_STRATEGIES[styleIndex];
  const encoderLayers = STRUCTURE.filter((layer) => layer.stack === "encoder");
  const decoderLayers = STRUCTURE.filter((layer) => layer.stack === "decoder");

  const layerHeight = 13;

  const [isCollapsing, setIsCollapsing] = useState(false);

  //TIMER: TO IMPLEMENT
  // useEffect(() => {
  //   const timer = setTimeout(() => setIsCollapsing(true), 3000); // Start collapsing after 3 seconds (reduced from 5)
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <Canvas
      camera={{
        position: [-100, 50, 150],
        fov: 50,
        near: 0.1,
        far: 5000,
      }}
    >
      <Physics gravity={[0, -22, 0]}>
        {" "}
        <Suspense fallback={null}>
          <Environment
            preset={style.lighting.environment || "apartment"}
            intensity={style.lighting.envIntensity || 1}
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
        {/* Invisible floor */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -100, 0]} visible={true}>
            <boxGeometry args={[200, 1, 200]} />
            <meshStandardMaterial
              color="#000"
              roughness={0.5}
              metalness={0.1}
              mirror={0.1}
              envMapIntensity={0} // This will disable environment map reflection
              metalnessMap={null}
              reflectivityMap={null}
              emissive="#000"
              emissiveIntensity={0}
              //also do not reflect light
              reflectivity={0}
              transparent={true}
              opacity={0}
            />
          </mesh>
        </RigidBody>
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
              isCollapsing={isCollapsing}
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
              isCollapsing={isCollapsing}
            />
          );
        })}
        <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
      </Physics>
    </Canvas>
  );
}

const Layer = ({ position, layer, style, isCollapsing }) => {
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
            isCollapsing={isCollapsing}
          />
        ))}
      </group>
    );
  }

  return (
    <RigidBody
      position={position}
      colliders="cuboid"
      type={isCollapsing ? "dynamic" : "fixed"}
    >
      <Node size={size} style={style} color={style.colors.outer} />
    </RigidBody>
  );
};

const Sublayer = ({ position, sublayer, style, isCollapsing }) => {
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
    <RigidBody
      position={position}
      colliders="cuboid"
      type={isCollapsing ? "dynamic" : "fixed"}
    >
      <InstancedNodes
        xCount={grid.xCount}
        yCount={grid.yCount}
        xInterval={grid.xInterval}
        yInterval={grid.yInterval}
        nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
        style={style}
        color={style.colors.inner}
      />
    </RigidBody>
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
