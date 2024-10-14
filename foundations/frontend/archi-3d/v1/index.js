import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Instances,
  Instance,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Suspense, useMemo, useEffect, useState } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { STYLE_STRATEGIES } from "./style";
import { MODELS } from "./models";

export default function NeuralNetworkVisualization({
  modelType = "videoGen",
  styleIndex = 0,
}) {
  const model = MODELS[modelType];
  const style = STYLE_STRATEGIES[styleIndex];
  const layerSpacing = model.layerSpacing || 60;

  return (
    <Canvas
      camera={{
        position: model.cameraPosition || [40, 30, 50],
        fov: 50,
        near: 0.1,
        far: 5000,
      }}
    >
      <Physics gravity={[0, -22, 0]}>
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
        {style.lighting.ambientLight && (
          <ambientLight {...style.lighting.ambientLight} />
        )}

        {/* Invisible floor */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -100, 0]} visible={false}>
            <boxGeometry args={[200, 1, 200]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>
        </RigidBody>

        {model.structure.map((layer, i) => (
          <Layer
            key={i}
            position={[
              0,
              0,
              (i - (model.structure.length - 1) / 2) * layerSpacing,
            ]}
            layer={layer}
            style={style}
          />
        ))}

        <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
      </Physics>

      <EffectComposer>
        <Bloom
          intensity={3}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}

const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  useEffect(() => {
    const toggleExpanded = () => {
      setExpanded((prev) => !prev);
    };

    const minInterval = 1000;
    const maxInterval = 8000;
    const randomInterval =
      Math.random() * (maxInterval - minInterval) + minInterval;

    const timer = setInterval(toggleExpanded, randomInterval);

    return () => clearTimeout(timer);
  }, []);

  return (
    <group position={props.position}>
      <animated.group
        scale-x={smoothedExpanded}
        scale-y={smoothedExpanded}
        scale-z={smoothedExpanded}
      >
        <InstancedNodes
          {...props.layer.grid}
          node={props.layer.node}
          color={props.layer.color || props.style.colors.default}
        />
      </animated.group>
      <animated.group
        scale-x={smoothedExpanded.to((v) => 1 - v)}
        scale-y={smoothedExpanded.to((v) => 1 - v)}
        scale-z={smoothedExpanded.to((v) => 1 - v)}
      >
        <Node
          {...props.layer.unexpandedNode}
          color={props.layer.color || props.style.colors.default}
          position={[0, 0, 0]}
        />
      </animated.group>
    </group>
  );
};

const Node = ({
  position,
  wireframeDivision = 10,
  size,
  color = "red",
  opacity = 0.4,
  scale,
}) => {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <boxGeometry
          args={[...size, wireframeDivision, wireframeDivision, 1]}
        />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.8}
          opacity={opacity}
          transparent={true}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const InstancedNodes = ({
  xCount,
  yCount,
  xInterval,
  yInterval,
  node,
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
    <Instances limit={xCount * yCount}>
      <boxGeometry args={[...node.size]} />
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.8}
        opacity={1}
        transparent={true}
        depthTest={false}
        depthWrite={false}
      />
      {positions.map((position, i) => (
        <Instance key={i} position={position} />
      ))}
    </Instances>
  );
};
