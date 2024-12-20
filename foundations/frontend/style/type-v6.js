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
  basic_nn: {
    ...BASE_STYLE,
    name: "Basic Neural Network",
    colors: {
      outer: "#ff00ff",
      inner: "hsl(350, 100%, 65%)",
      highlight: "#ffff00",
    },
    material: {
      metalness: 1,
      roughness: 0.15,
    },
    lighting: {
      environment: "beach",
      envIntensity: 0.1,
      pointLight: { position: [0, 50, 0], intensity: 3, color: "blue" },
      directionalLight: { position: [0, 100, 0], intensity: 3, color: "blue" },
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
      inner: "hsl(90, 85%, 35%)",
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
      outer: "hsl(20, 70%, 45%)",
      inner: "hsl(20, 100%, 80%)",
      connection: "hsl(20, 100%, 67%)",
      latent: "hsl(20, 80%, 55%)",
    },
    material: {
      metalness: 1.0,
      roughness: 0.2,
      envMapIntensity: 2.5,
    },
    shadows: true,
    emissive: true,
    lighting: {
      environment: "night",
      envIntensity: 1.5,
      pointLight: { position: [0, 50, 0], intensity: 5 },
      pointLight2: { position: [-50, 0, 0], intensity: 5 },
      pointLight3: { position: [10, 50, 30], intensity: 5 },
      pointLight4: { position: [-20, -50, -40], intensity: 5 },
      directionalLight: { position: [0, 100, -100], intensity: 2.5 },
      directionalLight2: { position: [50, 0, 0], intensity: 2.5 },
      directionalLight3: { position: [-50, 50, 50], intensity: 2.0 },
      ambientLight: { intensity: 0.3 },
    },
    postprocessing: {
      bloom: {
        intensity: 10.0,
        luminanceThreshold: 0.3,
        luminanceSmoothing: 0.9,
      },
      reflection: {
        intensity: 1.5,
        blur: 0.4,
      },
      chromaticAberration: {
        offset: 0.002,
      },
    },
  },

  self_supervised: {
    ...BASE_STYLE,
    name: "Self-Supervised",
    colors: {
      outer: "hsl(130, 70%, 45%)", // Blue theme
      inner: "hsl(80, 20%, 65%)",
      self: "hsl(130, 80%, 55%)",
    },
    material: {
      metalness: 1.0,
      roughness: 0.4,
      envMapIntensity: 2.5,
    },
  },

  // v3.x Convolutional Networks
  cnn: {
    ...BASE_STYLE,
    name: "Convolutional Network",
    colors: {
      outer: "hsl(180, 70%, 45%)",
      inner: "hsl(200, 100%, 55%)",
      conv: "hsl(180, 80%, 55%)",
    },
    material: {
      metalness: 1,
      roughness: 0.5,
    },
    lighting: {
      environment: "sunset",
      envIntensity: 0.8,
      pointLight: {
        position: [0, 200, -10],
        intensity: 15,
        color: "hsl(150, 100%, 50%)",
      },
      // pointLight2: {
      //   position: [50, -200, 10],
      //   intensity: 10,
      //   color: "hsl(140, 100%, 70%)",
      // },
      // pointLight3: {
      //   position: [-350, 100, 100],
      //   intensity: 10,
      //   color: "hsl(160, 100%, 70%)",
      // },
      // pointLight4: {
      //   position: [300, -100, -100],
      //   intensity: 10,
      //   color: "hsl(230s, 100%, 70%)",
      // },
      directionalLight: {
        position: [-80, 150, 100],
        intensity: 2,
        color: "hsl(250, 100%, 70%)",
      },
      directionalLight2: {
        position: [50, 0, -100],
        intensity: 2,
        color: "hsl(160, 100%, 50%)",
      },
      directionalLight3: {
        position: [-50, -100, -10],
        intensity: 2,
        color: "hsl(0, 100%, 50%)",
      },
      ambientLight: { intensity: 30, color: "hsl(160, 100%, 50%)" },
    },
    postprocessing: {
      bloom: {
        intensity: 0.15,
        luminanceThreshold: 0.3,
        luminanceSmoothing: 0.9,
      },
      reflection: {
        intensity: 1.5,
        blur: 0.4,
      },
      chromaticAberration: {
        offset: 0.002,
      },
    },
  },

  // v4.x Sequence Models and
  rnn: {
    ...BASE_STYLE,
    name: "Recurrent Network",
    colors: {
      outer: "hsl(300, 45%, 55%)", // Subtle steel blue
      inner: "hsl(300, 100%, 35%)", // Darker steel blue
      recurrent: "hsl(300, 80%, 70%)",
      connection: "hsl(300, 100%, 20%)", // Muted connection lines
    },
    material: {
      metalness: 0.98,
      roughness: 0.12,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.2,
    },

    lighting: {
      environment: "sunset",
      envIntensity: 0.8,
      pointLight: {
        position: [0, 100, 50],
        intensity: 3,
      },
      directionalLight: {
        position: [50, 100, -50],
        intensity: 3,
      },
      ambientLight: {
        intensity: 1,
      },
    },
    postprocessing: {
      bloom: {
        intensity: 3,
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
    colors: {
      outer: "hsl(250, 50%, 90%)",
      // inner: "hsl(260, 100%, 78%)",
      inner: "hsl(250, 100%, 76%)",
      highlight: "hsl(250, 100%, 70%)",
    },
    material: {
      metalness: 1.0,
      roughness: 0.15,
      transparent: false,
    },
    shadows: true,
    emissive: false,
    lighting: {
      environment: "sunset",
      pointLight: {
        position: [0, 200, 0],
        intensity: 3,
        color: "hsl(250, 100%, 80%)",
      },
      pointLight2: {
        position: [100, -200, -100],
        intensity: 3,
        color: "hsl(300, 100%, 80%)",
      },
      pointLight3: {
        position: [-200, -100, 100],
        intensity: 3,
        color: "hsl(150, 100%, 50%)",
      },
      pointLight4: {
        position: [200, 100, -100],
        intensity: 3,
        color: "hsl(180, 100%, 80%)",
      },

      directionalLight: {
        position: [0, 150, 0],
        intensity: 1,
        color: "hsl(180, 100%, 50%)",
      },
      directionalLight1: {
        position: [-50, 0, 0],
        intensity: 1,
        color: "hsl(180, 100%, 50%)",
      },
      directionalLight2: {
        position: [50, 0, 0],
        intensity: 1,
        color: "hsl(180, 100%, 50%)",
      },
      ambientLight: { intensity: 20, color: `hsl(210, 100%, 50%)` },
    },

    postprocessing: {
      bloom: {
        intensity: 0.1,
        luminanceThreshold: 1.0,
        luminanceSmoothing: 13,
      },
    },
  },

  // v5.x Generative Models
  gan: {
    ...BASE_STYLE,
    name: "GAN",
    colors: {
      outer: "hsl(300, 70%, 45%)", // Refined magenta
      inner: "hsl(180, 100%, 30%)",
      highlight: "hsl(270, 100%, 65%)", // Bright purple highlight
      connection: "hsl(180, 100%, 60%)",
    },
    material: {
      metalness: 0.9,
      roughness: 0.2,
    },
    shadows: true,
    emissive: true, // Important for neon effect
    lighting: {
      environment: "night",
      envIntensity: 1,
      pointLight: { position: [0, 50, 0], intensity: 2 },
      pointLight2: { position: [0, -50, 0], intensity: 2 },
      ambientLight: { intensity: 0.1, color: `hsl(100, 100%, 50%)` },
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
      inner: "#eee", // Slightly darker for depth
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

    // colors: {
    //   outer: "#c0c0c0", // Polished stainless steel
    //   inner: `hsl(240, 30%, 99%)`,
    //   environment: "#4a4a4a", // Urban environment reflection
    // },
    // material: {
    //   metalness: 1.0,
    //   roughness: 0.13,
    //   envMapIntensity: 1.0,
    //   transparent: false,
    // },
    // lighting: {
    //   environment: "city",
    //   envIntensity: 1.2,
    //   envMapBlurriness: 10000.0,
    //   directionalLight: { position: [10, 20, 10], intensity: 10 },
    //   directionalLight2: { position: [-10, -20, 10], intensity: 10 },
    //   directionalLight3: { position: [-10, 20, -10], intensity: 10 },
    //   directionalLight4: { position: [10, -20, -10], intensity: 10 },
    //   pointLight: { position: [0, 100, 0], intensity: 1 },
    //   pointLight2: { position: [0, -100, 0], intensity: 1 },
    //   pointLight3: { position: [0, 0, 100], intensity: 1 },
    //   pointLight4: { position: [0, 0, -100], intensity: 1 },
    //   ambientLight: { intensity: 1 },
    // },
    // shadows: false,
    // emissive: false,
    // postprocessing: {
    //   // bloom: {
    //   //   intensity: 1.0,
    //   //   luminanceThreshold: 0.4,
    //   //   luminanceSmoothing: 0.9,
    //   // },
    //   reflection: {
    //     intensity: 2.0,
    //     blur: 0.5,
    //   },
    //   chromaticAberration: {
    //     offset: 0.005,
    //   },
    // },
  },

  // v6.x Hybrid and Multimodal Models
  multi_modal: {
    ...BASE_STYLE,
    name: "Multi-Modal Network",
    colors: {
      outer: "hsl(0, 65%, 58%)",
      // inner: "hsl(200, 100%, 50%)",
      // plane: "hsl(355, 100%, 55%)",
      // mlp: "hsl(200, 100%, 65%)",

      inner: "hsl(270, 100%, 60%)",
      plane: "hsl(355, 100%, 55%)",
      mlp: "hsl(275, 100%, 65%)",
    },
    material: {
      metalness: 1,
      roughness: 0.1,
      transparent: false,
    },
    lighting: {
      ambientLight: { intensity: 10.0, color: "hsl(200, 100%, 50%)" },
      environment: "sky",
      envIntensity: 0,
      directionalLight: {
        position: [10, 20, 10],
        intensity: 5.0,
        color: "hsl(240, 100%, 50%)",
      },
      directionalLight2: {
        position: [-10, -20, 10],
        intensity: 5.0,
        color: "hsl(270, 100%, 50%)",
      },
      pointLight: {
        position: [0, 20, 0],
        intensity: 5.0,
        color: "hsl(300, 100%, 50%)",
      },
      pointLight2: {
        position: [0, -20, 0],
        intensity: 5.0,
        color: "hsl(300, 100%, 50%)",
      },
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
      outer: "hsl(60, 100%, 45%)",
      inner: "hsl(50, 100%, 70%)",
      policy: "hsl(60, 100%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.95,
      roughness: 0.2,
    },
    lighting: {
      ambientLight: { intensity: 10.0, color: "hsl(30, 100%, 50%)" },
      environment: "beach",
      envIntensity: 0,
      directionalLight: {
        position: [10, 20, 10],
        intensity: 5.0,
        color: "hsl(50, 100%, 50%)",
      },
      directionalLight2: {
        position: [-10, -20, 10],
        intensity: 2.0,
        color: "hsl(30, 100%, 50%)",
      },
      pointLight: {
        position: [0, 20, 0],
        intensity: 5.0,
        color: "hsl(50, 100%, 50%)",
      },
    },
    // postprocessing: {
    //   bloom: {
    //     intensity: 0.2,
    //     luminanceThreshold: 0.4,
    //     luminanceSmoothing: 0.9,
    //   },
    // },
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
