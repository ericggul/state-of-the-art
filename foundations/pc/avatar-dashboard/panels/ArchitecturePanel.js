import React from "react";
import { Text } from "@react-three/drei";
import BasePanel from "./BasePanel";

export default function ArchitecturePanel({ data, radius, height }) {
  const angle = Math.PI; // Position at back
  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);
  const rotationY = angle + Math.PI;

  return (
    <BasePanel
      title="Architecture"
      width={4}
      height={2.4}
      position={[x, height, z]}
      rotation={[0, rotationY, 0]}
    >
      {/* Architecture Layers */}
      <group position={[0, -0.3, 0]}>
        {data.map((layer, index) => (
          <group key={index} position={[0, 0.5 - index * 0.4, 0]}>
            {/* Layer Box */}
            <mesh>
              <planeGeometry args={[2.5, 0.3]} />
              <meshStandardMaterial
                color="#000033"
                opacity={0.9}
                transparent
                metalness={0.8}
                roughness={0.2}
                side={2}
              />
            </mesh>

            {/* Layer Border Glow */}
            <mesh position={[0, 0, -0.001]}>
              <planeGeometry args={[2.55, 0.35]} />
              <meshBasicMaterial
                color="#00ffff"
                opacity={0.2}
                transparent
                side={2}
              />
            </mesh>

            {/* Layer Text */}
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {layer}
            </Text>

            {/* Connection Line */}
            {index < data.length - 1 && (
              <mesh position={[0, -0.2, 0]}>
                <planeGeometry args={[0.04, 0.2]} />
                <meshBasicMaterial color="#00ffff" opacity={0.7} transparent />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </BasePanel>
  );
}
