import { Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./model";

export default function ThreeEl() {
  return (
    <Suspense>
      <Canvas>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Model />
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
}
