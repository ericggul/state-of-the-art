import { useState, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Background(props) {
  const [curve, setCurve] = useState(null);

  // Optimized curve creation
  useEffect(() => {
    const newCurve = createOptimizedCurve();
    setCurve(newCurve); // Set the curve once created
  }, []);

  // Optimized curve generation using more flexible parameters
  function createOptimizedCurve() {
    const points = new Array(100).fill().map((_, i) => {
      return new THREE.Vector3(0, 0, -(i - 50) * 4); // Z axis to create depth
    });
    return new THREE.CatmullRomCurve3(points); // Return a Catmull-Rom curve
  }

  return (
    <>
      <group position={[0, 0, 0]}>
        {/* Ambient light to give a subtle background glow */}
        <ambientLight intensity={3.0} color="#4169E1" />

        {/* Spotlights to create sharp, directional lighting */}
        <spotLight position={[4, 3, -15]} intensity={5.0} penumbra={1} color="hsl(0, 100%, 50%)" />
        <spotLight position={[-4, -3, 18]} intensity={4.0} penumbra={1} color="hsl(0, 100%, 50%)" />

        {/*  <ambientLight intensity={0.03} />
        <spotLight position={[0, 100, -200]} intensity={1.8} penumbra={1} color="hsl(200, 100%, 50%)" />
        <spotLight position={[0, -15, 300]} intensity={4} penumbra={1} color="hsl(350, 100%, 50%)" /> */}

        <mesh>
          <sphereGeometry args={[20, 32, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <EffectComposer>
        {/* <Bloom
          intensity={4} // Lowered for a subtle glow
        /> */}
      </EffectComposer>
    </>
  );
}

function TubeSet({ curve }) {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 2, 5, 25, false]} /> {/* Adjusted the tube radius */}
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.99} side={THREE.DoubleSide} />
      </mesh>

      {/* Add spheres for visual markers */}
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="white" roughness={0.5} metalness={1.0} />
      </mesh>
      <mesh position={[0, 0, 50]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="white" roughness={0.5} metalness={1.0} />
      </mesh>
    </group>
  );
}
