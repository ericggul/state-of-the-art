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
        {/* <meshStandardMaterial
          {...style.material}
          color={color}
          wireframe={!isProjector}
        /> */}
        <meshPhysicalMaterial
          {...style.material}
          color={color}
          wireframe={!isProjector}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          ior={1.6}
          reflectivity={0.4}
          transmission={0.1}
          thickness={2}
          iridescence={0.2}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[100, 500]}
          sheen={0.2}
          sheenRoughness={0.3}
          sheenColor={"#fafafa"}
          envMapIntensity={0}
          clearcoatNormalScale={0.1}
          normalScale={0.05}
          attenuationDistance={1.0}
          attenuationColor={"#efefef"}
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
