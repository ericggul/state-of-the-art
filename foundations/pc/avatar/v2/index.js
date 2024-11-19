"use client";
import { Suspense } from "react";
import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./3d/Model";
import { Lights } from "./3d/Lights";
import { Stage } from "./3d/Stage";
import { useSceneControls } from "./controls/SceneControls";
import { Leva } from "leva";

import Frame from "@/foundations/pc/frame";

export default function Wrapper() {
  const { lightControls, stageControls, modelControls } = useSceneControls();

  return (
    <>
      <Leva collapsed />
      <S.Container>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 3], fov: 80 }}
            gl={{ alpha: true, antialias: true }}
            shadows
          >
            <Lights controls={lightControls} />
            <Stage controls={stageControls} />

            <ambientLight intensity={0.5} />

            <Model {...modelControls} />

            <OrbitControls
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              enableZoom={true}
              enablePan={false}
            />
          </Canvas>
        </Suspense>
        <Frame />
      </S.Container>
    </>
  );
}
