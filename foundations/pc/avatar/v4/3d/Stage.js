import * as THREE from "three";

const DEFAULT_FLOOR = {
  floorColor: "#303030",
  floorMetalness: 0.2,
  floorRoughness: 0.8,
  floorOpacity: 1,
  floorReflectivity: 0.5,
  floorClearcoat: 0.1,
};

const DEFAULT_PLATFORM = {
  platformColor: "#1a1a1a",
  platformMetalness: 0.5,
  platformRoughness: 0.5,
};

export function Stage({ controls = {} }) {
  const { floor = DEFAULT_FLOOR, platform = DEFAULT_PLATFORM } = controls;

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.6, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshPhysicalMaterial
          color={floor.floorColor}
          metalness={floor.floorMetalness}
          roughness={floor.floorRoughness}
          opacity={floor.floorOpacity}
          transparent
          reflectivity={floor.floorReflectivity}
          clearcoat={floor.floorClearcoat}
        />
      </mesh>
      {/* <mesh position={[0, -2.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshPhysicalMaterial
          color={platform.platformColor}
          metalness={platform.platformMetalness}
          roughness={platform.platformRoughness}
        />
      </mesh> */}
    </>
  );
}
