import React, { useMemo } from "react";
import * as THREE from "three";

function RNNConnections({ structure, style, expandedLayers }) {
  const connections = useMemo(() => {
    const temp = [];
    for (let i = 0; i < structure.length - 1; i++) {
      const fromLayer = structure[i];
      const toLayer = structure[i + 1];

      const fromExpanded = expandedLayers[i];
      const toExpanded = expandedLayers[i + 1];

      const fromGrid =
        fromExpanded && fromLayer.grid
          ? fromLayer.grid
          : { xCount: 1, yCount: 1 };
      const toGrid =
        toExpanded && toLayer.grid ? toLayer.grid : { xCount: 1, yCount: 1 };

      const fromSize = fromLayer.dimensions || [20, 20, 20];
      const toSize = toLayer.dimensions || [20, 20, 20];

      const fromXInterval = fromExpanded
        ? fromSize[0] / (fromGrid.xCount - 0)
        : 0;
      const fromZInterval = fromExpanded
        ? fromSize[1] / (fromGrid.yCount - 0)
        : 0;

      const toXInterval = toExpanded ? toSize[0] / toGrid.xCount : 0;
      const toZInterval = toExpanded ? toSize[1] / toGrid.yCount : 0;

      for (let fromX = 0; fromX < fromGrid.xCount; fromX++) {
        for (let fromZ = 0; fromZ < fromGrid.yCount; fromZ++) {
          const fromCenter = [
            fromLayer.position[0] +
              (fromX - (fromGrid.xCount - 1) / 2) * fromXInterval,
            fromLayer.position[1],
            fromLayer.position[2] +
              (fromZ - (fromGrid.yCount - 1) / 2) * fromZInterval,
          ];

          for (let toX = 0; toX < toGrid.xCount; toX++) {
            for (let toZ = 0; toZ < toGrid.yCount; toZ++) {
              const toCenter = [
                toLayer.position[0] +
                  (toX - (toGrid.xCount - 1) / 2) * toXInterval,
                toLayer.position[1],
                toLayer.position[2] +
                  (toZ - (toGrid.yCount - 1) / 2) * toZInterval,
              ];

              temp.push({ from: fromCenter, to: toCenter });
            }
          }
        }
      }
    }
    return temp;
  }, [structure, expandedLayers]);

  console.log(connections);

  return (
    <>
      {connections.map((connection, i) => (
        <SingleLine
          key={i}
          from={connection.from}
          to={connection.to}
          style={style}
        />
      ))}
    </>
  );
}

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    const start = new THREE.Vector3().fromArray(from);
    const end = new THREE.Vector3().fromArray(to);
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);

    const points = [start, mid, end];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: style?.material?.opacity * 0.7 || 0.7,
    linewidth: style?.connection?.linewidth || 1,
    linecap: "round",
    linejoin: "round",
  };

  if (style?.material?.emissive) {
    lineMaterialProps.emissive = style.material.emissive;
    lineMaterialProps.emissiveIntensity = style.material.emissiveIntensity || 1;
  }

  return (
    <line geometry={geometry}>
      <lineBasicMaterial {...lineMaterialProps} />
    </line>
  );
}

export default RNNConnections;
