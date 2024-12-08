"use client";
import { Suspense } from "react";
import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Stage } from "./3d/Stage";

import Frame from "@/foundations/pc/frame/simple-avatar";
import { AvatarOrientationCamera } from "./utils/AvatarOrientationCamera";

import Model from "./3d/Model";

export default function Wrapper() {
  return (
    <S.Container>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 80 }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Set background color */}
          <Environment files={`/3d/environment/sky.hdr`} />
          <Stage />
          <Model />
          {/* <OrbitControls
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enablePan={false}
          /> */}
          <AvatarOrientationCamera cameraDistance={3} />
        </Canvas>
      </Suspense>
      <Frame middle={true} />
    </S.Container>
  );
}
