import { Suspense } from "react";

import * as S from "./styles";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "../model";
import { AvatarOrientationCamera } from "../utils/AvatarOrientationCamera";

export default function AvatarWrapper() {
  return (
    <S.Container>
      <Suspense>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 80 }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          {/* Reduced ambient light further */}
          <ambientLight intensity={3} />

          {/* Softer Stage Lights */}
          <spotLight
            position={[-4, 4, -4]}
            angle={0.3}
            penumbra={1}
            intensity={0.4}
            color="#4facfe"
            castShadow
          />
          <spotLight
            position={[4, 4, -4]}
            angle={0.3}
            penumbra={1}
            intensity={0.4}
            color="#00f2fe"
            castShadow
          />

          <spotLight
            position={[0, 1, 2]}
            angle={0.5}
            penumbra={1}
            intensity={0.5}
            color="white"
          />

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
            <meshPhysicalMaterial
              color="#000"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* Rest remains the same */}
          <Model
            position={[0, -2.5, 0]}
            scale={[2, 2, 2]}
            rotation={[0, 0, 0]}
          />

          {/* <OrbitControls
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enablePan={false}
          /> */}
          <AvatarOrientationCamera cameraDistance={3} />
        </Canvas>
      </Suspense>
    </S.Container>
  );
}
