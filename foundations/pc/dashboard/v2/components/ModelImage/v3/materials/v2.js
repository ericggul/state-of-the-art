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
    uniform vec2 uResolution;
    varying vec2 vUv;

    const float PI = 3.141592653589793;

    vec2 distort(vec2 uv, float progress) {
      float distortStrength = sin(progress * PI);
      
      vec2 center = vec2(0.5);
      vec2 dir = uv - center;
      float dist = length(dir);
      
      float angle = atan(dir.y, dir.x) + sin(dist * 10.0) * progress * 0.5 * distortStrength;
      float radius = dist + sin(angle * 4.0) * progress * 0.1 * distortStrength;
      
      vec2 distorted = center + vec2(cos(angle), sin(angle)) * radius;
      return mix(uv, distorted, distortStrength);
    }

    void main() {
      float wave = (sin(vUv.x * 10.0 + uProgress * 2.0 * PI) + 1.0) * 0.5;
      float morphProgress = smoothstep(0.0, 1.0, (uProgress * 1.4 - vUv.x * wave * 0.3));

      vec2 uv1 = distort(vUv, 1.0 - morphProgress);
      vec2 uv2 = distort(vUv, morphProgress);

      vec4 texture1 = texture2D(uTexture1, uv1);
      vec4 texture2 = texture2D(uTexture2, uv2);

      float offset = morphProgress * 0.02 * (1.0 - uProgress);
      vec4 texture1R = texture2D(uTexture1, uv1 + vec2(offset, 0.0));
      vec4 texture1B = texture2D(uTexture1, uv1 - vec2(offset, 0.0));
      vec4 texture2R = texture2D(uTexture2, uv2 + vec2(offset, 0.0));
      vec4 texture2B = texture2D(uTexture2, uv2 - vec2(offset, 0.0));

      vec4 final1 = vec4(texture1R.r, texture1.g, texture1B.b, texture1.a);
      vec4 final2 = vec4(texture2R.r, texture2.g, texture2B.b, texture2.a);
      
      float glow = sin(morphProgress * PI) * (1.0 - uProgress);
      vec4 result = mix(final1, final2, morphProgress);
      result += glow * 0.1;

      gl_FragColor = uProgress == 1.0 ? texture2D(uTexture2, vUv) : result;
    }
  `,
});
