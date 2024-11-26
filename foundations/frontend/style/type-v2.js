export const BASE_STYLE = {
  material: {
    metalness: 0.8,
    roughness: 0.4,
    transparent: true,
    opacity: 1,
  },
  shadows: true,
  emissive: false,
  camera: {
    position: [0, 0, 80],
    fov: 50,
    near: 0.1,
  },
  lighting: {
    environment: "apartment",
    envIntensity: 0.3,
    pointLight: { position: [0, 200, 0], intensity: 0.5 },
    directionalLight: { position: [0, 150, -100], intensity: 0.3 },
    ambientLight: { intensity: 0.2 },
  },
};

export const TYPE_STYLES = {
  // v1.x Foundation Models
  basic_nn: {
    ...BASE_STYLE,
    name: "Basic Neural Network",
    colors: {
      outer: "#ff00ff",
      inner: "hsl(350, 70%, 40%)",
      highlight: "#ffff00",
    },
    material: {
      metalness: 0.9,
      roughness: 0.1,
    },
    lighting: {
      environment: "beach",
      envIntensity: 0.1,
      pointLight: { position: [0, 50, 0], intensity: 0.2 },
      ambientLight: { intensity: 0.5 },
    },
    postprocessing: {
      // bloom: {
      //   intensity: 1,
      //   luminanceThreshold: 0.4,
      //   luminanceSmoothing: 0.9,
      // },
    },
  },

  // v2.x Memory-Based and Unsupervised Models
  hopfield: {
    ...BASE_STYLE,
    name: "Hopfield Network",
    colors: {
      outer: "hsl(90, 70%, 45%)", // Lime theme
      inner: "hsl(90, 65%, 35%)",
      memory: "hsl(90, 80%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.75,
    },
  },
  boltzmann: {
    ...BASE_STYLE,
    name: "Boltzmann Machine",
    colors: {
      outer: "#ff00ff",
      inner: "hsl(30, 70%, 80%)",
      highlight: "#ffff00",
    },
    material: {
      metalness: 1.0,
      roughness: 0.2,
    },
    shadows: true,
    emissive: true, // Important for neon effect
    lighting: {
      environment: "night",
      envIntensity: 1,
      pointLight: { position: [0, 50, 0], intensity: 2 },
      ambientLight: { intensity: 0.1 },
    },
    postprocessing: {
      bloom: {
        intensity: 10,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
    },
  },

  vae: {
    ...BASE_STYLE,
    name: "Variational Autoencoder",
    colors: {
      outer: "hsl(30, 70%, 45%)",
      inner: "hsl(20, 85%, 55%)",
      connection: "hsl(20, 75%, 20%)",
      latent: "hsl(30, 80%, 55%)",
    },
    material: {
      metalness: 1.0,
      roughness: 0.1,
    },
    shadows: true,
    emissive: true, // Important for neon effect
    lighting: {
      environment: "night",
      envIntensity: 0.5,
      pointLight: { position: [0, 50, 0], intensity: 3 },
      ambientLight: { intensity: 0.2 },
    },
    postprocessing: {
      bloom: {
        intensity: 1.3,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
    },
  },

  self_supervised: {
    ...BASE_STYLE,
    name: "Self-Supervised",
    colors: {
      outer: "hsl(200, 70%, 45%)", // Blue theme
      inner: "hsl(200, 65%, 35%)",
      self: "hsl(200, 80%, 55%)",
    },
  },

  // v3.x Convolutional Networks
  cnn: {
    ...BASE_STYLE,
    name: "Convolutional Network",
    colors: {
      outer: "hsl(180, 70%, 45%)",
      inner: "hsl(180, 65%, 35%)",
      conv: "hsl(180, 80%, 55%)",
    },
  },

  // v4.x Sequence Models and Transformers
  rnn: {
    ...BASE_STYLE,
    name: "Recurrent Network",
    colors: {
      outer: "hsl(300, 45%, 55%)", // Subtle steel blue
      inner: "hsl(300, 40%, 35%)", // Darker steel blue
      recurrent: "hsl(300, 70%, 65%)",
      connection: "hsl(300, 30%, 45%)", // Muted connection lines
    },
    material: {
      metalness: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.2,
    },
    connection: {
      linewidth: 1.8,
    },
    lighting: {
      environment: "sunset",
      envIntensity: 0.8,
      pointLight: {
        position: [0, 100, 50],
        intensity: 0.7,
      },
      directionalLight: {
        position: [50, 100, -50],
        intensity: 0.4,
      },
      ambientLight: {
        intensity: 0.3,
      },
    },
    postprocessing: {
      bloom: {
        intensity: 0.4,
        luminanceThreshold: 0.6,
        luminanceSmoothing: 0.8,
      },
      reflection: {
        intensity: 0.3,
        blur: 0.4,
      },
    },
    shadows: true,
    emissive: true,
  },

  transformer: {
    ...BASE_STYLE,
    name: "Transformer",
    colors: {
      outer: "#7d7d7d",
      inner: "hsl(250, 100%, 50%)",
      highlight: "#333333",
    },
    material: {
      metalness: 0.8,
      roughness: 0.2,
      transparent: false,
    },
    shadows: true,
    emissive: false,
    lighting: {
      environment: "sunset",
      pointLight: { position: [0, 200, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    camera: {
      position: [0, 0, 80],
      fov: 45,
      near: 0.1,
    },
  },

  // v5.x Generative Models
  gan: {
    ...BASE_STYLE,
    name: "GAN",
    colors: {
      outer: "#ff00ff",
      inner: "#00ffff",
      highlight: "#ffff00",
      connection: `hsl(180, 100%, 50%)`,
    },
    material: {
      metalness: 0.9,
      roughness: 0.2,
    },
    shadows: true,
    emissive: true, // Important for neon effect
    lighting: {
      environment: "night",
      envIntensity: 0.1,
      pointLight: { position: [0, 50, 0], intensity: 2 },
      ambientLight: { intensity: 0.1 },
    },
    postprocessing: {
      bloom: {
        intensity: 0.3,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
    },
  },

  diffusion: {
    ...BASE_STYLE,
    name: "Diffusion Model",
    colors: {
      outer: "#c0c0c0",
      // inner: "#a0a0a0",
      inner: "#bbb",
      environment: "#4a4a4a",
    },
    material: {
      metalness: 1.0,
      roughness: 0.05,
      envMapIntensity: 1.0,
      transparent: false,
    },
    lighting: {
      environment: "sky",
      envIntensity: 1.2,
      envMapBlurriness: 10.0,
      directionalLight: { position: [10, 20, 10], intensity: 0.8 },
      ambientLight: { intensity: 0.4 },
    },
    shadows: false,
    emissive: false,
    postprocessing: {
      reflection: {
        intensity: 2.0,
        blur: 0.5,
      },
      chromaticAberration: {
        offset: 0.005,
      },
    },
    layout: {
      layerHeight: 16,
      encoderPosition: -65,
      decoderPosition: 65,
    },
  },

  // v6.x Hybrid and Multimodal Models
  multi_modal: {
    ...BASE_STYLE,
    name: "Multi-Modal Network",
    colors: {
      outer: "hsl(0, 65%, 58%)",
      inner: "hsl(200, 90%, 50%)",
      plane: "hsl(355, 90%, 55%)",
      mlp: "hsl(200, 90%, 55%)",
    },
    material: {
      metalness: 1,
      roughness: 0.6,
      transparent: false,
    },
    lighting: {
      ambientLight: { intensity: 10.0 },
      environment: "sunset",
      envIntensity: 0,
    },
    emissive: false,
  },

  // Default style (keep at the end)
  nonProjector: {
    ...BASE_STYLE,
    colors: {
      outer: "white",
      inner: "white",
      plane: "white",
    },
    material: {
      ...BASE_STYLE.material,
      transparent: true,
      opacity: 0.8,
    },
  },

  reinforcement: {
    ...BASE_STYLE,
    name: "Reinforcement Learning",
    colors: {
      outer: "hsl(60, 70%, 45%)",
      inner: "hsl(60, 65%, 35%)",
      policy: "hsl(60, 80%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.7,
    },
  },
};

// Default style for unknown types
export const DEFAULT_STYLE = {
  ...BASE_STYLE,
  name: "Default",
  colors: {
    // outer: "#c0c0c0", // Polished stainless steel
    // inner: "#a0a0a0", // Slightly darker for depth
    // environment: "#4a4a4a", // Urban environment reflection
    outer: "white",
    inner: "white",
    plane: "white",
  },
  material: {
    metalness: 1.0,
    roughness: 0.1,
    envMapIntensity: 1.0,
    transparent: false,
  },
};
