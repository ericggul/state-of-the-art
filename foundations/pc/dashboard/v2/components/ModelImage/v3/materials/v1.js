// src/components/ImageTransitionMaterial.js
import * as THREE from "three";

// Add a helper function to safely get window dimensions
const getWindowDimensions = () => {
  if (typeof window !== "undefined") {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return {
    width: 1920, // Default fallback values
    height: 1080,
  };
};

export const ImageTransitionMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTexture1: { value: null },
    uTexture2: { value: null },
    uProgress: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(
        getWindowDimensions().width,
        getWindowDimensions().height
      ),
    },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform float uProgress;
    varying vec2 vUv;
    void main() {
      vec4 texture1 = texture2D(uTexture1, vUv);
      vec4 texture2 = texture2D(uTexture2, vUv);
      gl_FragColor = mix(texture1, texture2, uProgress);
    }
  `,
});
