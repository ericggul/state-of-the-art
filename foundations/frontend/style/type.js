const BASE_STYLE = {
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
  basic_nn: {
    ...BASE_STYLE,
    name: "Basic Neural Network",
    colors: {
      outer: "hsl(230, 70%, 50%)",
      inner: "hsl(235, 60%, 40%)",
      plane: "hsl(240, 60%, 20%)",
    },
  },

  cnn: {
    ...BASE_STYLE,
    name: "Convolutional Network",
    colors: {
      outer: "hsl(180, 70%, 45%)", // Cyan-based theme
      inner: "hsl(180, 65%, 35%)",
      conv: "hsl(180, 80%, 55%)",
    },
    postprocessing: {
      bloom: {
        intensity: 1.5,
        luminanceThreshold: 0.4,
      },
    },
  },

  transformer: {
    ...BASE_STYLE,
    name: "Transformer",
    colors: {
      outer: "#7d7d7d", // Metallic gray for the outer parts
      inner: "hsl(240, 100%, 40%)", // Bold deep blue for inner layers
      highlight: "#333333", // Darker metallic tone for edges
    },
    material: {
      metalness: 0.8,
      roughness: 0.2,
      transparent: false,
    },
    shadows: true,
    emissive: false,
    lighting: {
      environment: "apartment",
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

  rnn: {
    ...BASE_STYLE,
    name: "Recurrent Network",
    colors: {
      outer: "hsl(120, 60%, 45%)", // Green theme
      inner: "hsl(120, 55%, 35%)",
      recurrent: "hsl(120, 70%, 55%)",
    },
  },

  vae: {
    ...BASE_STYLE,
    name: "Variational Autoencoder",
    colors: {
      outer: "hsl(30, 70%, 45%)", // Orange theme
      inner: "hsl(30, 65%, 35%)",
      latent: "hsl(30, 80%, 55%)",
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

  gan: {
    ...BASE_STYLE,
    name: "GAN",
    colors: {
      outer: "#ff00ff",
      inner: "#00ffff",
      highlight: "#ffff00",
    },
    material: {
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
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
        intensity: 3,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
    },
  },

  diffusion: {
    ...BASE_STYLE,
    name: "Diffusion Model",
    colors: {
      outer: "#c0c0c0", // Polished stainless steel
      inner: "#a0a0a0", // Slightly darker for depth
      environment: "#4a4a4a", // Urban environment reflection
    },
    material: {
      metalness: 1.0,
      roughness: 0.1,
      envMapIntensity: 1.5,
      transparent: false,
    },
    lighting: {
      environment: "city",
      envIntensity: 1.2,
      directionalLight: { position: [10, 20, 10], intensity: 0.8 },
      ambientLight: { intensity: 0.4 },
    },
    shadows: false,
    emissive: false,
    camera: {
      position: [0, 0, 100],
      fov: 35,
      near: 0.1,
    },
    postprocessing: {
      reflection: {
        intensity: 1.5,
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

  multi_modal: {
    ...BASE_STYLE,
    name: "Multi-Modal Network",
    colors: {
      outer: "#7d7d7d", // Darker bronze-like metallic tone
      inner: "#1b1b1b", // Dark reflective window-like material
      windowGlow: "hsl(240, 10%, 20%)", // Subtle dark glow
    },
    material: {
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    },
  },

  reinforcement: {
    ...BASE_STYLE,
    name: "Reinforcement Learning",
    colors: {
      outer: "hsl(60, 70%, 45%)", // Yellow theme
      inner: "hsl(60, 65%, 35%)",
      policy: "hsl(60, 80%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.7,
    },
  },

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
      outer: "hsl(45, 70%, 45%)", // Gold theme
      inner: "hsl(45, 65%, 35%)",
      energy: "hsl(45, 80%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.95,
    },
  },
};

// Default style for unknown types
export const DEFAULT_STYLE = {
  ...BASE_STYLE,
  name: "Default",
  colors: {
    outer: "hsl(240, 65%, 28%)",
    inner: "hsl(230, 70%, 52%)",
    plane: "hsl(240, 50%, 15%)",
  },
};
