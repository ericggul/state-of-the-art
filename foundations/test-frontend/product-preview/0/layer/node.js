import React, { useMemo } from "react";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// Define the custom shader material using drei's shaderMaterial utility
const GradientMaterial = shaderMaterial(
  {
    uColor1: new THREE.Color(`hsl(240, 100%, 50%)`), // Start color (blue)
    uColor2: new THREE.Color(`hsl(240, 100%, 70%)`), // End color (red)
    opacity: 0.5, // Default opacity
  },
  // Vertex shader
  `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment shader
  `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float opacity;
  varying vec3 vPosition;

  void main() {
    float gradient = (vPosition.y + 1.0) / 2.0; // Normalize Y to [0, 1]
    vec3 color = mix(uColor1, uColor2, gradient);
    gl_FragColor = vec4(color, opacity); // Set alpha to the uniform opacity
  }
  `
);

extend({ GradientMaterial });

const Node = ({ position, size, scale, opacity = 0.5 }) => {
  const material = useMemo(
    () => (
      <gradientMaterial
        attach="material"
        transparent={true} // Enable transparency
        opacity={opacity} // Pass the opacity to the shader
      />
    ),
    [opacity]
  );

  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[...size]} />
      {material}
    </mesh>
  );
};

export default Node;
