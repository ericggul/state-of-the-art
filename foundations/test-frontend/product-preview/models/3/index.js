import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Instances, Instance, Html } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useMemo, Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Transformer structure definition
const STRUCTURE = [
  { name: "Input Embeddings", dimensions: [512, 8, 1], type: "input", zSpan: [8, 1] },
  { name: "Positional Encoding", dimensions: [512, 8, 1], type: "positional", zSpan: [8, 1] },
  // Encoder blocks
  ...Array(6)
    .fill()
    .map((_, i) => [
      { name: `Self Attention ${i + 1}`, dimensions: [512, 8, 8], type: "attention", zSpan: [8, 8] },
      { name: `Layer Norm ${i + 1}a`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1] },
      { name: `Feed Forward ${i + 1}`, dimensions: [2048, 8, 1], type: "ffn", zSpan: [8, 1] },
      { name: `Layer Norm ${i + 1}b`, dimensions: [512, 8, 1], type: "norm", zSpan: [8, 1] },
    ])
    .flat(),
  { name: "Output Projection", dimensions: [512, 8, 1], type: "output", zSpan: [8, 1] },
];

const COLORS = {
  input: "hsl(240, 100%, 40%)",
  positional: "hsl(240, 100%, 50%)",
  attention: "hsl(240, 100%, 60%)",
  norm: "hsl(240, 100%, 40%)",
  ffn: "hsl(240, 100%, 50%)",
  output: "hsl(240, 100%, 60%)",
};

export default function Transformer3D() {
  return (
    <Canvas
      camera={{
        position: [100, 50, 100],
        fov: 50,
        near: 0.1,
        far: 5000,
      }}
    >
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[0, 10, 10]} intensity={2} />
      <directionalLight position={[10, 0, 10]} intensity={2} />
      <ambientLight intensity={0.5} />

      {STRUCTURE.map(({ dimensions, type, name, zSpan }, i) => (
        <Layer
          key={i}
          position={[0, 0, (i - (STRUCTURE.length - 1) / 2) * 30]}
          unexpandedNode={{
            size: [dimensions[0] * 0.1, dimensions[1], dimensions[2]],
            wireframeDivision: 1,
          }}
          node={{
            size: [dimensions[0] * 0.05, dimensions[1] * 0.5, 1],
            wireframeDivision: 1,
          }}
          grid={{
            xCount: zSpan[0],
            yCount: zSpan[1],
            xInterval: dimensions[0] * 0.06,
            yInterval: dimensions[1] * 0.55,
          }}
          type={type}
          name={name}
          color={COLORS[type]}
        />
      ))}

      <OrbitControls />

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  );
}

const Layer = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setExpanded((b) => !b);
  };

  const { smoothedExpanded } = useSpring({
    smoothedExpanded: expanded ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 13 },
  });

  return (
    <animated.group position={props.position} onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      {/* Render both components and control their visibility via scale */}
      <InstancedNodes {...props.grid} node={props.node} scale={smoothedExpanded} color={hovered ? "white" : props.color} />

      <Node {...props.unexpandedNode} color={hovered ? "white" : props.color} position={[0, 0, 0]} scale={smoothedExpanded.to((se) => [1 - se, 1 - se, 1 - se])} />

      {/* Layer label */}
      <Html position={[0, props.unexpandedNode.size[1] + 2, 0]}>
        <div
          style={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "5px",
            borderRadius: "3px",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          {props.name}
        </div>
      </Html>
    </animated.group>
  );
};

// Component to render each node as a box
const Node = ({ position, wireframeDivision = 10, size, color = "red", opacity = 0.4, scale }) => {
  return (
    <animated.group position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[...size, wireframeDivision, wireframeDivision, 1]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.8} opacity={opacity} transparent={true} depthTest={false} depthWrite={false} />
      </mesh>
    </animated.group>
  );
};

// Component to render instances of nodes
const InstancedNodes = ({ xCount, yCount, xInterval, yInterval, node, scale, color }) => {
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
    <animated.group scale={scale}>
      <Instances limit={xCount * yCount}>
        <boxGeometry args={[...node.size]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.8} opacity={1} transparent={true} depthTest={false} depthWrite={false} />
        {positions.map((position, i) => (
          <Instance key={i} position={position} />
        ))}
      </Instances>
    </animated.group>
  );
};
