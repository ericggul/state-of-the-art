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

    // Noise functions
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    vec2 hash(vec2 p) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise(vec2 p) {
      const float K1 = 0.366025404;
      const float K2 = 0.211324865;
      
      vec2 i = floor(p + (p.x+p.y)*K1);
      vec2 a = p - i + (i.x+i.y)*K2;
      vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
      vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0*K2;
      
      vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
      vec3 n = h*h*h*h*vec3(dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
      
      return dot(n, vec3(70.0));
    }

    // Fluid dynamics simulation
    vec2 fluid(vec2 uv, float progress) {
      float time = progress * 2.0;
      
      // Create multiple layers of noise
      float n1 = noise(uv * 3.0 + time);
      float n2 = noise(uv * 6.0 - time * 0.5);
      float n3 = noise(uv * 9.0 + time * 0.7);
      
      // Combine noise layers for fluid-like movement
      vec2 distortion = vec2(
        n1 * 0.3 + n2 * 0.2 + n3 * 0.1,
        n2 * 0.3 + n3 * 0.2 + n1 * 0.1
      );
      
      // Add vortex effect
      vec2 center = vec2(0.5);
      vec2 toCenter = center - uv;
      float dist = length(toCenter);
      float angle = atan(toCenter.y, toCenter.x);
      
      // Create spiral movement
      float spiral = sin(dist * 10.0 - time * 3.0) * 0.1;
      vec2 spiralOffset = vec2(
        cos(angle + spiral) * dist,
        sin(angle + spiral) * dist
      );
      
      // Combine fluid and spiral effects
      vec2 finalOffset = mix(distortion, spiralOffset, progress);
      return uv + finalOffset * progress * (1.0 - progress) * 2.0;
    }

    // Particle effect
    float particles(vec2 uv, float progress) {
      float particles = 0.0;
      
      // Create multiple particle layers
      for(float i = 0.0; i < 3.0; i++) {
        vec2 particleUv = uv * (3.0 + i * 2.0);
        float time = progress * (1.0 + i * 0.5);
        
        // Animate particles
        particleUv += vec2(
          noise(particleUv + time),
          noise(particleUv - time)
        );
        
        // Add particles
        particles += smoothstep(0.8, 0.85, noise(particleUv));
      }
      
      return particles;
    }

    void main() {
      // Calculate transition progress with easing
      float p = smoothstep(0.0, 1.0, uProgress);
      
      // Apply fluid dynamics to UV coordinates
      vec2 fluidUv1 = fluid(vUv, 1.0 - p);
      vec2 fluidUv2 = fluid(vUv, p);
      
      // Sample textures with fluid distortion
      vec4 tex1 = texture2D(uTexture1, fluidUv1);
      vec4 tex2 = texture2D(uTexture2, fluidUv2);
      
      // Add particle effects
      float particleEffect = particles(vUv, p) * (1.0 - p) * p * 2.0;
      
      // Mix textures with artistic effects
      vec4 transition = mix(tex1, tex2, p);
      
      // Add glow and particles
      vec4 glow = vec4(0.1, 0.3, 0.6, 1.0) * particleEffect * 0.5;
      
      // Final composition
      vec4 result = transition + glow;
      
      // Ensure clean end state
      gl_FragColor = uProgress == 1.0 ? texture2D(uTexture2, vUv) : result;
    }
  `,
});
