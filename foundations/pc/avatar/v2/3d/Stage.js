import * as THREE from "three";

export function Stage() {
  return (
    <>
      {/* Floor - highly reflective material */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshPhysicalMaterial
          color="#aaa"
          metalness={0.9}
          roughness={0.1}
          opacity={0.8}
          transparent
          envMapIntensity={1}
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Circular Platform - keep as is for contrast */}
      <mesh
        position={[0, -2.49, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[3, 64]} />
        <meshPhysicalMaterial color="#000" metalness={0.7} roughness={0.3} />
      </mesh>
    </>
  );
}
