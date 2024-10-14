// Visualization.js
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { Suspense, useMemo, useEffect, useState } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import { useSpring, animated } from "@react-spring/three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { STRUCTURE as VIDEO_GEN_STRUCTURE } from "./structure";

// AlexNet structure definition
const ALEXNET_STRUCTURE = [
  { dimensions: [227, 227, 3], zSpan: [3, 1], type: "input" },
  { dimensions: [55, 55, 96], zSpan: [12, 8], type: "conv" },
  { dimensions: [27, 27, 96], zSpan: [12, 8], type: "pool" },
  { dimensions: [27, 27, 256], zSpan: [16, 16], type: "conv" },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "pool" },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv" },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv" },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "conv" },
  { dimensions: [6, 6, 256], zSpan: [16, 16], type: "pool" },
  { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc" },
  { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc" },
  { dimensions: [1000, 1, 1], zSpan: [1, 1], type: "output" },
];

const COLORS = [
  { type: "input", color: "hsl(240, 100%, 50%)" },
  { type: "conv", color: "hsl(240, 100%, 50%)" },
  { type: "pool", color: "hsl(240, 100%, 50%)" },
  { type: "fc", color: "hsl(240, 100%, 50%)" },
  { type: "output", color: "hsl(240, 100%, 50%)" },
];

export default function Visualization({ model = "alexNet", styleIndex = 6 }) {
  return (
    <>
      {model === "alexNet" ? <AlexNet /> : <VideoGen styleIndex={styleIndex} />}
    </>
  );
}

function AlexNet() {
  const styleIndex = 5; // Style index for AlexNet Monochrome
  const style = STYLE_STRATEGIES[styleIndex];

  return (
    <Canvas camera={style.camera}>
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <pointLight {...style.lighting.pointLight} />
      <directionalLight {...style.lighting.directionalLight1} />
      <directionalLight {...style.lighting.directionalLight2} />
      <ambientLight {...style.lighting.ambientLight} />

      {ALEXNET_STRUCTURE.map(({ dimensions, type, zSpan }, i) => (
        <Layer
          key={i}
          position={[0, 0, (i - (ALEXNET_STRUCTURE.length - 1) / 2) * 60]}
          unexpandedNode={{
            size: [dimensions[0], dimensions[1], dimensions[2] * 0.1],
            wireframeDivision: 1,
          }}
          node={{
            size: [dimensions[0] * 0.5, dimensions[1] * 0.5, 1],
            wireframeDivision: 1,
          }}
          grid={{
            xCount: zSpan[0],
            yCount: zSpan[1],
            xInterval: dimensions[0] * 0.55,
            yInterval: dimensions[1] * 0.55,
          }}
          type={type}
          color={COLORS.find((c) => c.type === type)?.color || "white"}
          style={style}
        />
      ))}

      <OrbitControls />

      <EffectComposer>
        <Bloom {...style.postprocessing.bloom} />
      </EffectComposer>
    </Canvas>
  );
}

function VideoGen({ styleIndex = 6 }) {
  const style = STYLE_STRATEGIES[styleIndex];
  const encoderLayers = VIDEO_GEN_STRUCTURE.filter(
    (layer) => layer.stack === "encoder"
  );
  const decoderLayers = VIDEO_GEN_STRUCTURE.filter(
    (layer) => layer.stack === "decoder"
  );

  const layerHeight = 13;

  const [isCollapsing, setIsCollapsing] = useState(false);

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
              envMapIntensity={0}
              emissive="#000"
              emissiveIntensity={0}
              reflectivity={0}
              transparent={true}
              opacity={0}
            />
          </mesh>
        </RigidBody>
        {/* Encoder Stack */}
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
        {/* Decoder Stack */}
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

const Layer = (props) => {
  const {
    position,
    layer,
    style,
    isCollapsing,
    unexpandedNode,
    node,
    grid,
    color,
  } = props;

  if (layer) {
    // VideoGen's Layer
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
  } else {
    // AlexNet's Layer
    const [expanded, setExpanded] = useState(false);

    const { smoothedExpanded } = useSpring({
      smoothedExpanded: expanded ? 1 : 0,
      config: { mass: 1, tension: 120, friction: 13 },
    });

    useEffect(() => {
      const toggleExpanded = () => {
        setExpanded((prev) => !prev);
      };

      // Set up random interval for toggling
      const minInterval = 1000; // 1 second
      const maxInterval = 8000; // 8 seconds
      const randomInterval =
        Math.random() * (maxInterval - minInterval) + minInterval;

      const timer = setInterval(toggleExpanded, randomInterval);

      return () => clearInterval(timer);
    }, []);

    return (
      <group position={position}>
        <animated.group
          scale-x={smoothedExpanded}
          scale-y={smoothedExpanded}
          scale-z={smoothedExpanded}
        >
          <InstancedNodes {...grid} node={node} color={color} style={style} />
        </animated.group>
        <animated.group
          scale-x={smoothedExpanded.to((v) => 1 - v)}
          scale-y={smoothedExpanded.to((v) => 1 - v)}
          scale-z={smoothedExpanded.to((v) => 1 - v)}
        >
          <Node {...unexpandedNode} color={color} style={style} />
        </animated.group>
      </group>
    );
  }
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
        rotation={[Math.PI / 2, 0, 0]}
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
  rotation = [0, 0, 0],
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
    <group rotation={rotation}>
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
