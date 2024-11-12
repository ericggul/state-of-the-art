import * as THREE from "three";
import { useMemo } from "react";

export function Stage({ controls }) {
  console.log("Stage controls:", controls);

  if (!controls) {
    console.warn("No stage controls provided");
    return null;
  }

  const { floor = {}, platform = {} } = controls;

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.6, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial
          color={floor.floorColor || "#303030"}
          metalness={floor.floorMetalness || 0.2}
          roughness={floor.floorRoughness || 0.8}
          opacity={floor.floorOpacity || 1}
          transparent
          reflectivity={floor.floorReflectivity || 0.5}
          clearcoat={floor.floorClearcoat || 0.1}
        />
      </mesh>
      <mesh position={[0, -2.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshPhysicalMaterial
          color={platform.platformColor || "#1a1a1a"}
          metalness={platform.platformMetalness || 0.5}
          roughness={platform.platformRoughness || 0.5}
        />
      </mesh>
    </>
  );
}
