"use client";
import { Suspense } from "react";
import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Model from "./3d/Model";
import { Stage } from "./3d/Stage";
import { useSceneControls } from "./controls/SceneControls";

import Frame from "@/foundations/pc/frame/simple";

export default function Wrapper() {
  const modelControls = useSceneControls();

  return (
    <S.Container>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 80 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

          <Environment preset="city" background={false} />

          <Stage />

          <Model
            position={modelControls.position}
            scale={[
              modelControls.scale,
              modelControls.scale,
              modelControls.scale,
            ]}
          />

          <OrbitControls
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enablePan={false}
          />
        </Canvas>
      </Suspense>
      <Frame middle={true} />
    </S.Container>
  );
}
