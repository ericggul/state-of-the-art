import React, { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import { Text } from "@react-three/drei";
import useScreenStore from "@/components/screen/store";

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
    rotation = [Math.PI / 2, 0, 0],
    sublayer,
  }) => {
    const { isProjector } = useScreenStore();

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
        {isProjector && (
          <Instances limit={instanceCount}>
            <boxGeometry args={instanceSize} />
            <meshStandardMaterial {...style.material} color={color} wireframe />
            {positions.map((position, i) => (
              <Instance
                key={i}
                position={position}
                castShadow={style.shadows}
                receiveShadow={style.shadows}
              />
            ))}
          </Instances>
        )}

        {!isProjector &&
          sublayer &&
          positions.map((position, i) => (
            <group
              key={`text-${i}`}
              position={position}
              rotation={[-Math.PI / 2, 0, 0]} // Counter-rotate to face camera
            >
              <Text
                position={[0, instanceSize[1] * 0.6, 0]}
                fontSize={instanceSize[0] * 0.1}
                color={"white"}
                anchorX="center"
                anchorY="middle"
                textAlign="center"
                maxWidth={instanceSize[0]}
              >
                {`${sublayer.name}\n(${sublayer.type})`}
              </Text>
            </group>
          ))}
      </group>
    );
  }
);

export default InstancedNodes;
