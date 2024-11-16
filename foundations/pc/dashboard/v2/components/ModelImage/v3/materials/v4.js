// src/components/materials/v3/ImageTransitionMaterial.js
import * as THREE from "three";

// Helper function to get window dimensions
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
    uTime: { value: 0 }, // Time uniform for animations
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
    uniform float uTime;
    varying vec2 vUv;

    // Simplex Noise Functions
    vec3 mod289(vec3 x) {
      return x - floor(x / 289.0) * 289.0;
    }
    vec2 mod289(vec2 x) {
      return x - floor(x / 289.0) * 289.0;
    }
    vec3 permute(vec3 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }
    float snoise(vec2 v) {
      const vec4 C = vec4(
        0.211324865405187,  // (3.0 - sqrt(3.0)) / 6.0
        0.366025403784439,  // 0.5 * (sqrt(3.0) - 1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439   // 1.0 / 41.0
      );
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);

      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

      i = mod289(i);
      vec3 p = permute(
        permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0)
      );

      vec3 m = max(
        0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
        ),
        0.0
      );
      m = m * m;
      m = m * m;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Gradient function for vibrant colors
    vec3 colorGradient(float t) {
      return vec3(
        0.5 + 0.5 * cos(6.2831 * (t + 0.0)),
        0.5 + 0.5 * cos(6.2831 * (t + 0.33)),
        0.5 + 0.5 * cos(6.2831 * (t + 0.66))
      );
    }

    void main() {
      vec2 uv = vUv;

      // Time-based variables for animation
      float time = uTime * 0.1;

      // Calculate progress with smoothstep for smooth transitions
      float progress = smoothstep(0.0, 1.0, uProgress);

      // Apply easing to progress
      float easedProgress = progress * progress * (3.0 - 2.0 * progress);

      // Generate dynamic noise patterns
      float noiseFreq = 3.0;
      float noiseAmp = 0.1;
      vec2 noiseUV = uv * noiseFreq + vec2(time);
      float noise = snoise(noiseUV) * noiseAmp * (1.0 - easedProgress);

      // Apply noise to UV coordinates
      vec2 distortedUV = uv + noise;

      // Sample the textures
      vec4 tex1 = texture2D(uTexture1, distortedUV);
      vec4 tex2 = texture2D(uTexture2, distortedUV);

      // Compute color gradient for data stream effect
      float gradientPos = fract(uv.y + time);
      vec3 gradientColor = colorGradient(gradientPos);

      // Mix textures with easing
      vec4 mixedTexture = mix(tex1, tex2, easedProgress);

      // Apply gradient overlay
      mixedTexture.rgb += gradientColor * (1.0 - easedProgress) * 0.5;

      // Add glitch effect
      float glitch = step(0.95, fract(sin(dot(uv * 100.0, vec2(12.9898,78.233))) * 43758.5453 + time * 5.0));
      mixedTexture.rgb += glitch * vec3(1.0, 0.0, 0.0) * 0.1 * (1.0 - easedProgress);

      // Smoothly transition to the final image
      gl_FragColor = mixedTexture;
    }
  `,
  transparent: true,
});
