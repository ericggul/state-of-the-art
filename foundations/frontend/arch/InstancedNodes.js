import React, { useMemo, memo } from "react";
import { Instances, Instance } from "@react-three/drei";

const InstancedNodes = memo(
  function InstancedNodes({
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

    const uniqueXPositions = useMemo(() => {
      return Array.from(
        { length: xCount },
        (_, i) => xInterval * i - ((xCount - 1) * xInterval) / 2
      );
    }, [xCount, xInterval]);

    const instanceSize = node ? node.size : nodeSize;
    const instanceCount = positions.length;

    if (instanceCount === 0) return null;

    return (
      <group rotation={rotation}>
        <Instances limit={instanceCount}>
          <boxGeometry args={instanceSize} />
          <meshStandardMaterial
            {...style.material}
            color={color}
            wireframe={!isProjector}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.xCount === nextProps.xCount &&
      prevProps.yCount === nextProps.yCount &&
      prevProps.xInterval === nextProps.xInterval &&
      prevProps.yInterval === nextProps.yInterval &&
      JSON.stringify(prevProps.nodeSize) ===
        JSON.stringify(nextProps.nodeSize) &&
      JSON.stringify(prevProps.node) === JSON.stringify(nextProps.node) &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style) &&
      prevProps.color === nextProps.color &&
      JSON.stringify(prevProps.rotation) ===
        JSON.stringify(nextProps.rotation) &&
      JSON.stringify(prevProps.sublayer) ===
        JSON.stringify(nextProps.sublayer) &&
      prevProps.isProjector === nextProps.isProjector
    );
  }
);

InstancedNodes.displayName = "InstancedNodes";
export default InstancedNodes;
