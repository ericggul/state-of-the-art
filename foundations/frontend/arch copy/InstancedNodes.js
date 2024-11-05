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
    // rotation = [0, 0, 0],
    rotation = [Math.PI / 2, 0, 0],
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
    const instanceCount = positions.length;

    if (instanceCount === 0) {
      return null; // Return null if there are no instances to render
    }

    return (
      <group rotation={rotation}>
        <Instances limit={instanceCount}>
          <boxGeometry args={instanceSize} />
          <meshStandardMaterial {...style.material} color={color} />
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
