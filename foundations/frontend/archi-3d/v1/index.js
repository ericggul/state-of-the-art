// Visualization.js
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { Suspense, useMemo, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { VIDEO_GEN_STRUCTURE, ALEXNET_STRUCTURE } from "./structure";

export default function Visualization({ model = "alexNet", styleIndex = 3 }) {
  const style = STYLE_STRATEGIES[styleIndex];

  return (
    <Canvas camera={style.camera}>
      <CommonScene style={style}>
        {model === "alexNet" ? (
          <AlexNetLayers structure={ALEXNET_STRUCTURE} style={style} />
        ) : (
          <VideoGenLayers structure={VIDEO_GEN_STRUCTURE} style={style} />
        )}
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

function AlexNetLayers({ structure, style }) {
  return structure.map(({ dimensions, type, zSpan }, i) => (
    <Layer
      key={i}
      position={[0, 0, (i - (structure.length - 1) / 2) * 60]}
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
      color={style.colors.inner || "hsl(240, 100%, 50%)"}
      style={style}
    />
  ));
}

function VideoGenLayers({ structure, style }) {
  const layerHeight = 13;

  const encoderLayers = structure.filter((layer) => layer.stack === "encoder");
  const decoderLayers = structure.filter((layer) => layer.stack === "decoder");

  return (
    <>
      {encoderLayers.map((layer, i) => (
        <Layer
          key={`encoder-${i}`}
          position={[
            -50,
            calculateYPosition(i, encoderLayers.length, layerHeight),
            0,
          ]}
          layer={layer}
          style={style}
        />
      ))}
      {decoderLayers.map((layer, i) => (
        <Layer
          key={`decoder-${i}`}
          position={[
            50,
            calculateYPosition(i, decoderLayers.length, layerHeight),
            0,
          ]}
          layer={layer}
          style={style}
        />
      ))}
    </>
  );
}

function calculateYPosition(index, totalLayers, layerHeight) {
  return (
    index * layerHeight - (totalLayers * layerHeight) / 2 + layerHeight / 2
  );
}

const Layer = (props) => {
  if (props.layer) {
    return <VideoGenLayer {...props} />;
  } else {
    return <AlexNetLayer {...props} />;
  }
};

const VideoGenLayer = ({ position, layer, style }) => {
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

const AlexNetLayer = ({
  position,
  unexpandedNode,
  node,
  grid,
  color,
  style,
}) => {
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
        rotation={[Math.PI / 2, 0, 0]}
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
