import React, { useMemo, memo } from "react";
import { Instances, Instance } from "@react-three/drei";

const InstancedNodes = memo(function InstancedNodes({
  xCount,
  yCount,
  xInterval,
  yInterval,
  nodeSize,
  node,
  style,
  color,
  rotation = [Math.PI / 2, 0, 0],
  sublayer,
  isProjector,
}) {
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

  const instanceSize = node ? node.size : nodeSize;
  const instanceCount = positions.length;

  if (instanceCount === 0) return null;

  return (
    <group rotation={rotation}>
      <Instances limit={instanceCount}>
        <boxGeometry args={instanceSize} />
        <meshPhysicalMaterial
          {...style.material}
          color={color}
          wireframe={!isProjector}
          clearcoat={0.6}
          clearcoatRoughness={0.05}
          ior={2.5}
          reflectivity={0.8}
          transmission={0.15}
          thickness={2}
          iridescence={0.4}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[200, 1000]}
          sheen={0.3}
          sheenRoughness={0.2}
          sheenColor={"#fafafa"}
          attenuationDistance={0.5}
          attenuationColor={"#ffffff"}
        />
        {positions.map((position, i) => (
          <Instance
            key={i}
            position={position}
            // castShadow={style.shadows}
            // receiveShadow={style.shadows}
            castShadow={false}
            receiveShadow={false}
          />
        ))}
      </Instances>
    </group>
  );
});

InstancedNodes.displayName = "InstancedNodes";
export default InstancedNodes;
