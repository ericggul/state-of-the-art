import React, { useMemo } from "react";
import * as THREE from "three";
import { GRID_CONFIGS } from "../../arch-models";

// SingleLine component definition
function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [from, to]);

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: (style?.material?.opacity || 1) * 0.5, // Increased opacity
    linewidth: 0.3, // Increased line width
  };

  if (style?.material?.emissive) {
    lineMaterialProps.emissive = style.material.emissive;
    lineMaterialProps.emissiveIntensity = 0.5;
  }

  return (
    <line geometry={geometry}>
      <lineBasicMaterial {...lineMaterialProps} />
    </line>
  );
}

export default function HopfieldConnections({
  structure,
  style,
  model = "HOPFIELD_NETWORK",
}) {
  const gridConfig = GRID_CONFIGS[model]?.hopfield_layer;

  if (!gridConfig) {
    console.error("Missing grid config for Hopfield network");
    return null;
  }

  const { nodeCount, radius } = gridConfig;
  const angleStep = (2 * Math.PI) / nodeCount;
  const connections = [];

  // Generate ALL possible connections between nodes (fully connected)
  for (let i = 0; i < nodeCount; i++) {
    const x1 = radius * 2 * Math.cos(i * angleStep);
    const z1 = radius * 2 * Math.sin(i * angleStep);

    for (let j = 0; j < nodeCount; j++) {
      // Changed condition to connect all nodes
      if (i !== j) {
        // Skip self-connections
        const x2 = radius * 2 * Math.cos(j * angleStep);
        const z2 = radius * 2 * Math.sin(j * angleStep);

        // Create main connection
        connections.push(
          <SingleLine
            key={`connection-${i}-${j}`}
            from={[x1, 0, z1]}
            to={[x2, 0, z2]}
            style={style}
          />
        );

        // Optional: Add curved connections for better visualization
        const midPoint = getMidPoint([x1, 0, z1], [x2, 0, z2]);
        const controlPoint = getControlPoint(midPoint, 5); // Adjust curve height

        connections.push(
          <CurvedLine
            key={`curved-connection-${i}-${j}`}
            start={[x1, 0, z1]}
            end={[x2, 0, z2]}
            controlPoint={controlPoint}
            style={style}
          />
        );
      }
    }
  }

  return <group>{connections}</group>;
}

// Helper function to create curved connections
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
    linewidth: 0.3,
  };

  return (
    <line geometry={geometry}>
      <lineBasicMaterial {...lineMaterialProps} />
    </line>
  );
}

// Helper functions for curved connections
function getMidPoint(start, end) {
  return [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];
}

function getControlPoint(midPoint, height) {
  return [midPoint[0], midPoint[1] + height, midPoint[2]];
}
