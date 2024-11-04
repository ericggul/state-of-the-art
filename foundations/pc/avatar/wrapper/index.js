import { Suspense } from "react";

import * as S from "./styles";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "../model";

export default function AvatarWrapper() {
  return (
    <S.Container>
      <Suspense>
        <Canvas
          camera={{ position: [0, 0, 3] }}
          gl={{ alpha: true, antialias: false }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <ambientLight intensity={3} color="white" />
          <pointLight position={[0, 0, 20]} intensity={3} color="white" />
          <pointLight position={[0, 0, -20]} intensity={3} color="white" />
          <Model
            position={[0, -2.5, 0]}
            scale={[2, 2, 2]}
            rotation={[0, 0, 0]}
          />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </S.Container>
  );
}
