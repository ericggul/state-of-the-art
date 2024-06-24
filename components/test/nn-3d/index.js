"use client";

import * as S from "./styles";

import { Canvas } from "@react-three/fiber";

export default function NN3D() {
  return (
    <S.Container>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
    </S.Container>
  );
}
