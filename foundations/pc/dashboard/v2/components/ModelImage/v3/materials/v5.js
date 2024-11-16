// src/components/materials/v3/ImageTransitionMaterial.js
import * as THREE from "three";

export const ImageTransitionMaterial = () => {
  // Create a unique random seed for this instance
  const randomSeed = Math.random() * 1000;

  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture1: { value: null },
      uTexture2: { value: null },
      uProgress: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uTime: { value: 0 },
      uRandomSeed: { value: randomSeed },
      uRandomVec: { value: new THREE.Vector2(Math.random(), Math.random()) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      #ifdef GL_ES
      precision highp float;
      #endif

      uniform sampler2D uTexture1;
      uniform sampler2D uTexture2;
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uRandomSeed;
      uniform vec2 uRandomVec;
      varying vec2 vUv;

      // Random function based on hash
      float rand(vec2 co){
        return fract(sin(dot(co.xy, vec2(12.9898,78.233) + uRandomSeed)) * 43758.5453);
      }

      // 2D rotation matrix
      mat2 getRotationMatrix(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      // FBM function for fractal noise
      float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0, 100.0) + uRandomVec * 100.0;
        // Randomize rotation
        float rotation = rand(x + uRandomSeed) * 6.2831; // Random angle between 0 and 2PI
        mat2 rot = getRotationMatrix(rotation);
        for (int i = 0; i < 5; ++i) {
          v += a * (rand(rot * x) * 2.0 - 1.0);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        float time = uTime * 0.5;
        float progress = smoothstep(0.0, 1.0, uProgress);
        float easedProgress = progress * progress * (3.0 - 2.0 * progress);

        // Random factors
        float rand1 = rand(uv + time);
        float rand2 = rand(uv * 2.0 - time);
        float randDir = rand(vec2(uRandomSeed, time));

        // Random direction vector
        vec2 dir = normalize(vec2(cos(randDir * 6.2831), sin(randDir * 6.2831)));

        // Enhanced noise patterns with randomness
        float noiseScale = mix(5.0, 15.0, rand1);
        float noiseStrength = mix(0.1, 0.4, rand2);
        float distortion = fbm(uv * noiseScale + time * rand1) * noiseStrength * (1.0 - easedProgress);

        // Apply distortion in random direction
        vec2 distortedUV = uv + dir * distortion;

        // Random wave effect with varying direction and frequency
        float waveFrequency = mix(5.0, 20.0, rand1);
        float waveAmplitude = mix(0.005, 0.02, rand2);
        float angle = randDir * 6.2831;
        vec2 waveDir = vec2(cos(angle), sin(angle));
        float wave = sin(dot(uv * waveFrequency, waveDir) + time * rand2 * 5.0) * waveAmplitude * (1.0 - easedProgress);
        distortedUV += waveDir * wave;

        // Color Aberration with randomness
        float aberrationStrength = mix(0.01, 0.03, rand2) * (1.0 - easedProgress);
        vec2 redOffset = dir * aberrationStrength;
        vec2 greenOffset = vec2(0.0);
        vec2 blueOffset = -dir * aberrationStrength;

        // Sample textures with color aberration
        vec4 tex1Red = texture2D(uTexture1, distortedUV + redOffset);
        vec4 tex1Green = texture2D(uTexture1, distortedUV + greenOffset);
        vec4 tex1Blue = texture2D(uTexture1, distortedUV + blueOffset);
        vec4 tex1 = vec4(tex1Red.r, tex1Green.g, tex1Blue.b, 1.0);

        vec4 tex2Red = texture2D(uTexture2, distortedUV + redOffset);
        vec4 tex2Green = texture2D(uTexture2, distortedUV + greenOffset);
        vec4 tex2Blue = texture2D(uTexture2, distortedUV + blueOffset);
        vec4 tex2 = vec4(tex2Red.r, tex2Green.g, tex2Blue.b, 1.0);

        // Random fractal pattern overlay
        float fractalFreq = mix(50.0, 200.0, rand1);
        float fractal = abs(fbm(uv * fractalFreq + time * rand2)) * (1.0 - easedProgress);

        // Mix textures with progress
        vec4 mixedTexture = mix(tex1, tex2, easedProgress);

        // Apply fractal as an alpha mask for dramatic effect
        mixedTexture.rgb = mix(mixedTexture.rgb, vec3(1.0), fractal * 0.5);

        // Additional color effects with randomness
        vec3 colorOverlay = vec3(
          sin(time * rand1 + uv.x * rand2 * 10.0) * 0.5 + 0.5,
          cos(time * rand2 + uv.y * rand1 * 10.0) * 0.5 + 0.5,
          sin(time * rand1 + uv.x * uv.y * rand2 * 20.0) * 0.5 + 0.5
        );
        mixedTexture.rgb += colorOverlay * 0.3 * (1.0 - easedProgress);

        // Final output
        gl_FragColor = mixedTexture;
      }
    `,
    transparent: true,
  });
};
