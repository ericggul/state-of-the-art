import React, { useMemo, Suspense } from "react";
import * as THREE from "three";

import { INTERLAYER_MARGIN_X, INTERLAYER_MARGIN_Y } from "../Sublayer";

function VAEConnections({ structure, style }) {
  const connections = useMemo(() => {
    if (!structure) return [];

    const temp = [];
    for (let i = 0; i < structure.length - 1; i++) {
      const fromLayer = structure[i];
      const toLayer = structure[i + 1];

      const fromGrid = fromLayer.grid;
      const toGrid = toLayer.grid;

      const fromSize = fromLayer.dimensions || [20, 8, 8];
      const toSize = toLayer.dimensions || [20, 8, 8];

      const fromXInterval =
        (fromSize[0] / fromGrid.xCount) * INTERLAYER_MARGIN_X;
      const fromYInterval =
        (fromSize[1] / fromGrid.yCount) * INTERLAYER_MARGIN_Y;

      const toXInterval = (toSize[0] / toGrid.xCount) * INTERLAYER_MARGIN_X;
      const toYInterval = (toSize[1] / toGrid.yCount) * INTERLAYER_MARGIN_Y;

      for (let fromX = 0; fromX < fromGrid.xCount; fromX++) {
        const fromCenter = [
          fromLayer.position[0] +
            (fromX - (fromGrid.xCount - 1) / 2) * fromXInterval,
          fromLayer.position[1],
          fromLayer.position[2],
        ];

        for (let toX = 0; toX < toGrid.xCount; toX++) {
          const toCenter = [
            toLayer.position[0] + (toX - (toGrid.xCount - 1) / 2) * toXInterval,
            toLayer.position[1],
            toLayer.position[2],
          ];

          temp.push({ from: fromCenter, to: toCenter });
        }
      }
    }
    return temp;
  }, [structure]);

  return (
    <Suspense fallback={<div>Loading VAE Connections...</div>}>
      {connections.map((connection, i) => (
        <SingleLine
          key={i}
          from={connection.from}
          to={connection.to}
          style={style}
        />
      ))}
    </Suspense>
  );
}

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    if (!from || !to) return null;

    const start = new THREE.Vector3().fromArray(from);
    const end = new THREE.Vector3().fromArray(to);
    const points = [start, end];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  if (!geometry) return null;

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: style?.material?.opacity || 1,
    linewidth: style?.connection?.linewidth || 1,
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

export default VAEConnections;
