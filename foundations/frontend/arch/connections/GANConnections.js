import React, { useMemo, Suspense } from "react";
import * as THREE from "three";
import { GRID_CONFIGS } from "../../arch-models";
import { INTERLAYER_MARGIN_X, INTERLAYER_MARGIN_Y } from "../Sublayer";

function GANConnections({ layers, style, model }) {
  const connections = useMemo(() => {
    if (!layers) return [];

    const temp = [];
    const generators = layers.filter((layer) =>
      layer.stack.includes("generator")
    );
    const discriminators = layers.filter((layer) =>
      layer.stack.includes("discriminator")
    );

    const generatorGroups = groupLayersByStack(generators);
    const discriminatorGroups = groupLayersByStack(discriminators);

    Object.values(generatorGroups).forEach((group) => {
      temp.push(...createMultipleConnections(group, model));
    });

    Object.values(discriminatorGroups).forEach((group) => {
      temp.push(...createMultipleConnections(group, model));
    });

    connectGeneratorsToDiscriminators(
      generatorGroups,
      discriminatorGroups,
      temp,
      model
    );

    return temp;
  }, [layers, model]);

  return (
    <Suspense fallback={null}>
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

function groupLayersByStack(layers) {
  return layers.reduce((acc, layer) => {
    if (!acc[layer.stack]) {
      acc[layer.stack] = [];
    }
    acc[layer.stack].push(layer);
    return acc;
  }, {});
}

function createMultipleConnections(layerGroup, model) {
  const connections = [];
  for (let i = 0; i < layerGroup.length - 1; i++) {
    const fromLayer = layerGroup[i];
    const toLayer = layerGroup[i + 1];

    const fromPoints = getLayerPoints(fromLayer, model);
    const toPoints = getLayerPoints(toLayer, model);

    for (let j = 0; j < fromPoints.length; j++) {
      connections.push({ from: fromPoints[j], to: toPoints[j] });
    }
  }
  return connections;
}

function connectGeneratorsToDiscriminators(
  generatorGroups,
  discriminatorGroups,
  temp,
  model
) {
  Object.keys(generatorGroups).forEach((genKey) => {
    const genLayers = generatorGroups[genKey];
    const lastGenLayer = genLayers[genLayers.length - 1];

    let discriminatorKey = genKey.replace("generator", "discriminator");
    if (!discriminatorGroups[discriminatorKey]) {
      discriminatorKey = Object.keys(discriminatorGroups)[0];
    }
    const discLayers = discriminatorGroups[discriminatorKey];
    const firstDiscLayer = discLayers[0];

    if (lastGenLayer && firstDiscLayer) {
      const fromPoints = getLayerPoints(lastGenLayer, model);
      const toPoints = getLayerPoints(firstDiscLayer, model);

      for (let i = 0; i < fromPoints.length; i++) {
        temp.push({ from: fromPoints[i], to: toPoints[i] });
      }
    }
  });
}

function getLayerPoints(layer, model) {
  const position = layer.position || [0, 0, 0];
  const dimensions = layer.dimensions || [1, 1, 1];
  const gridConfig = GRID_CONFIGS[model] || {};
  const grid = gridConfig[layer.type] || { xCount: 8, yCount: 8 };

  const points = [];
  const xCount = grid.xCount;
  const yCount = grid.yCount;

  // Calculate the size of each node
  const nodeWidth = dimensions[0] / xCount;
  const nodeHeight = dimensions[1] / yCount;

  // Calculate intervals based on the Sublayer component logic
  const xInterval = (dimensions[0] / xCount) * INTERLAYER_MARGIN_X;
  const yInterval = (dimensions[1] / yCount) * INTERLAYER_MARGIN_Y;

  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      const pointX = position[0] + (x - (xCount - 1) / 2) * xInterval;
      const pointY = position[1];
      const pointZ = position[2] + (y - (yCount - 1) / 2) * yInterval;
      points.push([pointX, pointY, pointZ]);
    }
  }

  return points;
}

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    if (!from || !to) return null;

    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);

    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += 25; // Adjust curvature along Y-axis

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
      <lineBasicMaterial attach="material" {...lineMaterialProps} />
    </line>
  );
}

export default GANConnections;
