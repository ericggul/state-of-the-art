import { Suspense } from "react";
import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./model";
import { Lights } from "./3d/Lights";
import { Stage } from "./3d/Stage";

export default function Wrapper() {
  return (
    <S.Container>
      <Suspense>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 80 }}
          gl={{ alpha: true, antialias: true }}
          shadows
        >
          <Lights />
          <Stage />

          <Model
            position={[0, -2.5, 0]}
            scale={[2, 2, 2]}
            rotation={[0, 0, 0]}
          />

          <OrbitControls
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enablePan={false}
          />
        </Canvas>
      </Suspense>
    </S.Container>
  );
}
