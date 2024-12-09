import React, { useMemo, Suspense } from "react";
import * as THREE from "three";
import { DoubleSide } from "three";

function RNNConnections({ structure, style, expandedLayers }) {
  const connections = useMemo(() => {
    try {
      if (!structure || !expandedLayers) return [];

      const temp = [];

      // Forward connections
      try {
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
            toExpanded && toLayer.grid
              ? toLayer.grid
              : { xCount: 1, yCount: 1 };

          const fromSize = fromLayer.dimensions || [20, 20, 20];
          const toSize = toLayer.dimensions || [20, 20, 20];

          const fromXInterval = fromExpanded
            ? fromSize[0] / fromGrid.xCount
            : 0;
          const fromZInterval = fromExpanded
            ? fromSize[1] / fromGrid.yCount
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
      } catch (forwardError) {
        console.error("Error creating forward connections:", forwardError);
      }

      // Recurrent connections
      try {
        for (let i = 1; i < structure.length - 1; i++) {
          const layer = structure[i];
          if (
            layer.type.includes("rnn") ||
            layer.type.includes("lstm") ||
            layer.type.includes("gru")
          ) {
            const grid =
              expandedLayers[i] && layer.grid
                ? layer.grid
                : { xCount: 1, yCount: 1 };

            for (let x = 0; x < grid.xCount; x++) {
              for (let z = 0; z < grid.yCount; z++) {
                const center = [
                  layer.position[0],
                  layer.position[1],
                  layer.position[2],
                ];

                const radiusValues = [5, 10];
                const horizontalSpread = 2.5;

                const directions = [
                  { x: 1, y: 0, z: 0 }, // right
                  { x: -1, y: 0, z: 0 }, // left
                ];

                radiusValues.forEach((radius, idx) => {
                  directions.forEach((dir, dirIdx) => {
                    const points = [];
                    const segments = 60; // More segments for smoother loop

                    // Create an elongated closed loop
                    for (let i = 0; i <= segments; i++) {
                      const t = i / segments;
                      const angle = t * Math.PI * 2; // Full circle

                      // Create elongated ellipse shape
                      points.push(
                        new THREE.Vector3(
                          center[0] +
                            Math.cos(angle) *
                              radius *
                              dir.x *
                              horizontalSpread +
                            dir.z * 0.2,
                          center[1],
                          center[2] +
                            Math.sin(angle) * radius * 0.4 +
                            dir.z * 1.0
                        )
                      );
                    }

                    const geometry = new THREE.BufferGeometry().setFromPoints(
                      points
                    );

                    temp.push({
                      type: "recurrent",
                      geometry: geometry,
                      opacity: 0.8 - dirIdx * 0.2,
                    });
                  });
                });
              }
            }
          }
        }
      } catch (recurrentError) {
        console.error("Error creating recurrent connections:", recurrentError);
      }

      return temp;
    } catch (error) {
      console.error("Error in RNNConnections:", error);
      return [];
    }
  }, [structure, expandedLayers]);

  try {
    return (
      <Suspense fallback={<div>Loading RNN Connections...</div>}>
        {connections.map((connection, i) => {
          try {
            if (connection.type === "recurrent") {
              return (
                <RecurrentLine
                  key={`recurrent-${i}`}
                  geometry={connection.geometry}
                  style={style}
                  opacity={connection.opacity}
                />
              );
            }
            return (
              <SingleLine
                key={`forward-${i}`}
                from={connection.from}
                to={connection.to}
                style={style}
              />
            );
          } catch (renderError) {
            console.error(`Error rendering connection ${i}:`, renderError);
            return null;
          }
        })}
      </Suspense>
    );
  } catch (error) {
    console.error("Error rendering RNNConnections:", error);
    return null;
  }
}

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    if (!from || !to) return null;

    const start = new THREE.Vector3().fromArray(from);
    const end = new THREE.Vector3().fromArray(to);
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);

    const points = [start, mid, end];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  if (!geometry) return null;

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: style?.material?.opacity || 1,
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

function RecurrentLine({ geometry, style, opacity = 0.7 }) {
  const lineMaterialProps = {
    color: style?.colors?.recurrent || style?.colors?.inner || "green",
    transparent: true,
    opacity: (style?.material?.opacity || 1) * opacity,
    linewidth: 1.5,
    dashSize: 2,
    gapSize: 1.5,
  };

  return (
    <line geometry={geometry}>
      <lineDashedMaterial {...lineMaterialProps} />
    </line>
  );
}

export default RNNConnections;
