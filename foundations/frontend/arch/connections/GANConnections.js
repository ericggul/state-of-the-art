import React, { useMemo, Suspense } from "react";
import * as THREE from "three";

function GANConnections({ layers, style }) {
  const connections = useMemo(() => {
    if (!layers) return [];

    const temp = [];
    const generatorLayers = layers.filter(
      (layer) => layer.stack === "generator"
    );
    const discriminatorLayers = layers.filter(
      (layer) => layer.stack === "discriminator"
    );

    // Connect layers within generator
    for (let i = 0; i < generatorLayers.length - 1; i++) {
      temp.push(
        ...createConnectionsBetweenLayers(
          generatorLayers[i],
          generatorLayers[i + 1]
        )
      );
    }

    // Connect layers within discriminator
    for (let i = 0; i < discriminatorLayers.length - 1; i++) {
      temp.push(
        ...createConnectionsBetweenLayers(
          discriminatorLayers[i],
          discriminatorLayers[i + 1]
        )
      );
    }

    // Connect generator output to discriminator input
    if (generatorLayers.length > 0 && discriminatorLayers.length > 0) {
      temp.push(
        ...createConnectionsBetweenLayers(
          generatorLayers[generatorLayers.length - 1],
          discriminatorLayers[0]
        )
      );
    }

    return temp;
  }, [layers]);

  return (
    <Suspense fallback={<div>Loading GAN Connections...</div>}>
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

function createConnectionsBetweenLayers(fromLayer, toLayer) {
  const connections = [];
  const fromGrid = { xCount: 3, yCount: 3 }; // Adjust as needed
  const toGrid = { xCount: 3, yCount: 3 }; // Adjust as needed

  const fromSize = fromLayer.dimensions || [20, 8, 8];
  const toSize = toLayer.dimensions || [20, 8, 8];

  const fromXInterval = (fromSize[0] / fromGrid.xCount) * 1.2;
  const fromYInterval = (fromSize[1] / fromGrid.yCount) * 1.5;

  const toXInterval = (toSize[0] / toGrid.xCount) * 1.2;
  const toYInterval = (toSize[1] / toGrid.yCount) * 1.5;

  for (let fromX = 0; fromX < fromGrid.xCount; fromX++) {
    for (let fromY = 0; fromY < fromGrid.yCount; fromY++) {
      const fromCenter = [
        fromLayer.position[0] +
          (fromX - (fromGrid.xCount - 1) / 2) * fromXInterval,
        fromLayer.position[1] +
          (fromY - (fromGrid.yCount - 1) / 2) * fromYInterval,
        fromLayer.position[2],
      ];

      for (let toX = 0; toX < toGrid.xCount; toX++) {
        for (let toY = 0; toY < toGrid.yCount; toY++) {
          const toCenter = [
            toLayer.position[0] + (toX - (toGrid.xCount - 1) / 2) * toXInterval,
            toLayer.position[1] + (toY - (toGrid.yCount - 1) / 2) * toYInterval,
            toLayer.position[2],
          ];

          connections.push({ from: fromCenter, to: toCenter });
        }
      }
    }
  }

  return connections;
}

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    if (!from || !to) return null;

    const start = new THREE.Vector3().fromArray(from);
    const end = new THREE.Vector3().fromArray(to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.z += 50; // Add some curvature

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  if (!geometry) return null;

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: style?.material?.opacity || 0.5,
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

export default GANConnections;
