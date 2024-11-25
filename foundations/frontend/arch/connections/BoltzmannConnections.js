import React, { useMemo } from "react";
import * as THREE from "three";
import { GRID_CONFIGS } from "../../arch-models";

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [from, to]);

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: (style?.material?.opacity || 1) * 0.5,
    linewidth: 3,
  };

  return (
    <line geometry={geometry}>
      <lineBasicMaterial {...lineMaterialProps} />
    </line>
  );
}

export default function BoltzmannConnections({
  structure,
  style,
  model = "BOLTZMANN_MACHINE",
}) {
  const gridConfig = GRID_CONFIGS[model];

  if (!gridConfig) {
    console.error("Missing grid config for Boltzmann Machine");
    return null;
  }

  const visibleConfig = gridConfig.visible_units;
  const hiddenConfig = gridConfig.hidden_units;

  // Calculate positions for visible and hidden units
  const getNodePositions = (config) => {
    const { nodeCount, radius, layerPosition } = config;
    const angleStep = (2 * Math.PI) / nodeCount;

    return Array.from({ length: nodeCount }, (_, i) => ({
      x: radius * 2 * Math.cos(i * angleStep),
      y: layerPosition,
      z: radius * 2 * Math.sin(i * angleStep),
    }));
  };

  const visibleNodes = getNodePositions(visibleConfig);
  const hiddenNodes = getNodePositions(hiddenConfig);
  const connections = [];

  // Connect each visible unit to each hidden unit
  visibleNodes.forEach((visible, i) => {
    hiddenNodes.forEach((hidden, j) => {
      // Create main connection
      connections.push(
        <SingleLine
          key={`connection-${i}-${j}`}
          from={[visible.x, visible.y, visible.z]}
          to={[hidden.x, hidden.y, hidden.z]}
          style={style}
        />
      );

      // Add curved connection for better visualization
      const midPoint = [
        (visible.x + hidden.x) / 2,
        (visible.y + hidden.y) / 2,
        (visible.z + hidden.z) / 2,
      ];

      const controlPoint = [
        midPoint[0],
        midPoint[1],
        midPoint[2] + 5, // Add some curve
      ];

      connections.push(
        <CurvedLine
          key={`curved-connection-${i}-${j}`}
          start={[visible.x, visible.y, visible.z]}
          end={[hidden.x, hidden.y, hidden.z]}
          controlPoint={controlPoint}
          style={style}
        />
      );
    });
  });

  return <group>{connections}</group>;
}

// Helper component for curved connections
function CurvedLine({ start, end, controlPoint, style }) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3(...controlPoint),
    new THREE.Vector3(...end)
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: (style?.material?.opacity || 1) * 0.3,
    linewidth: 1,
  };

  return (
    <line geometry={geometry}>
      <lineBasicMaterial {...lineMaterialProps} />
    </line>
  );
}
