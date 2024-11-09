import React from "react";
import { Text } from "@react-three/drei";

export default function BasePanel({
  title,
  width = 4,
  height = 2.4,
  position,
  rotation,
  children,
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Panel Background */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#000000"
          opacity={0.9}
          transparent
          metalness={0.8}
          roughness={0.2}
          side={2}
        />
      </mesh>

      {/* Border Glow */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[width + 0.05, height + 0.05]} />
        <meshBasicMaterial color="#00ffff" opacity={0.2} transparent side={2} />
      </mesh>

      {/* Title */}
      {title && (
        <Text
          position={[0, height / 2 - 0.3, 0.01]}
          fontSize={0.25}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          //
          outlineWidth={0.02}
          outlineColor="#000066"
        >
          {title}
        </Text>
      )}

      {/* Content Container */}
      <group position={[0, 0, 0.01]}>{children}</group>
    </group>
  );
}
