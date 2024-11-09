import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import BasePanel from "./BasePanel";

export default function PerformancePanel({ data, radius, height }) {
  const angle = 0; // Position at front
  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);
  const rotationY = angle + Math.PI;

  const points = useMemo(() => {
    if (!data?.labels || !data?.data) return [];
    return data.labels.map((label, i) => ({
      label,
      value: data.data[i],
    }));
  }, [data]);

  const maxValue = Math.max(...(data?.data || [1]));

  return (
    <BasePanel
      title={data?.metric || "Performance Metrics"}
      width={4}
      height={2.4}
      position={[x, height, z]}
      rotation={[0, rotationY, 0]}
    >
      {/* Graph Container */}
      <group position={[-1.5, -0.3, 0]}>
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((level) => (
          <group key={level} position={[0, level * 1.2, 0]}>
            <mesh>
              <planeGeometry args={[3, 0.002]} />
              <meshBasicMaterial color="#0080ff" opacity={0.3} transparent />
            </mesh>
            <Text
              position={[-0.2, 0, 0]}
              fontSize={0.15}
              color="#0080ff"
              anchorX="right"
              anchorY="middle"
            >
              {`${(level * 100).toFixed(0)}%`}
            </Text>
          </group>
        ))}

        {/* Data Points and Lines */}
        {points.map((point, index) => {
          const x = (index * 3) / (points.length - 1);
          const y = (point.value / maxValue) * 1.2;

          return (
            <group key={index} position={[x, 0, 0]}>
              {/* Data Point */}
              <mesh position={[0, y, 0]}>
                <sphereGeometry args={[0.06]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>

              {/* Label */}
              <Text
                position={[0, -0.3, 0]}
                fontSize={0.15}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {point.label}
              </Text>

              {/* Connection Line */}
              {index < points.length - 1 && (
                <mesh position={[0.75, y / 2, -0.01]}>
                  <planeGeometry args={[1.5, 0.02]} />
                  <meshBasicMaterial
                    color="#00ffff"
                    opacity={0.7}
                    transparent
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </BasePanel>
  );
}
