import { Suspense } from "react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./model";
import Background from "./background/index2";

export default function ThreeEl() {
  return (
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
        <Model position={[0, -3, 0]} scale={[2, 2, 2]} />
        {/* <Background /> */}
        <OrbitControls />
      </Canvas>
    </Suspense>
  );
}
