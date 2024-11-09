import React from "react";
import { Text } from "@react-three/drei";
import BasePanel from "./BasePanel";
import { getFormattedValue } from "../utils/formatters";

export default function StatPanel({ stat, index, total, radius, height }) {
  const [key, value] = stat;
  // Calculate position on cylinder
  const angle = (index * (2 * Math.PI)) / total;
  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);
  const rotationY = angle + Math.PI;

  return (
    <BasePanel
      width={3}
      height={1.8}
      position={[x, height, z]}
      rotation={[0, rotationY, 0]}
    >
      <group>
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {getFormattedValue(value)}
        </Text>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.2}
          color="#0080ff"
          anchorX="center"
          anchorY="middle"
        >
          {key}
        </Text>
      </group>
    </BasePanel>
  );
}
