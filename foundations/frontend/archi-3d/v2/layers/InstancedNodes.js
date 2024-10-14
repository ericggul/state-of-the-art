import React, { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";

const InstancedNodes = React.memo(
  ({
    xCount,
    yCount,
    xInterval,
    yInterval,
    nodeSize,
    node,
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

    const instanceSize = node ? node.size : nodeSize;

    return (
      <group rotation={rotation}>
        <Instances limit={xCount * yCount}>
          <boxGeometry args={instanceSize} />
          <meshStandardMaterial
            {...style.material}
            color={color}
            emissive={style.emissive ? style.colors.emissive : "black"}
            emissiveIntensity={style.emissive ? 0.5 : 0}
            wireframe={style.material.wireframe}
            transparent={true}
            depthTest={false}
            depthWrite={false}
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
  }
);

export default InstancedNodes;
