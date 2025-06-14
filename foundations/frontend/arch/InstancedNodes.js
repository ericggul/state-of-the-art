import React, { useMemo, memo, useRef, useEffect } from "react";
import {
  Instances,
  Instance,
  MeshTransmissionMaterial,
} from "@react-three/drei";

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
  const geometryRef = useRef(null);
  const materialRef = useRef(null);

  // Dispose geometry & material on unmount
  useEffect(() => {
    return () => {
      if (geometryRef.current) geometryRef.current.dispose();
      if (materialRef.current) materialRef.current.dispose();
    };
  }, []);

  try {
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
          <boxGeometry ref={geometryRef} args={instanceSize} />
          <meshStandardMaterial
            ref={materialRef}
            {...style.material}
            color={color}
            wireframe={!isProjector}
          />
          {positions.map((position, i) => (
            <Instance
              key={i}
              position={position}
              castShadow={false}
              receiveShadow={false}
            />
          ))}
        </Instances>
      </group>
    );
  } catch (error) {
    console.warn(
      "Buffer allocation or rendering failed; skipping layer.",
      error
    );
    return null;
  }
});

InstancedNodes.displayName = "InstancedNodes";
export default InstancedNodes;
