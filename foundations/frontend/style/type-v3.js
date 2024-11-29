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
      inner: "hsl(350, 100%, 40%)",
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
      inner: "hsl(90, 85%, 35%)",
      memory: "hsl(90, 80%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.75,
    },
  },
  // boltzmann: {
  //   ...BASE_STYLE,
  //   name: "Boltzmann Machine",
  //   colors: {
  //     outer: "#ff00ff",
  //     inner: "hsl(30, 70%, 80%)",
  //     highlight: "#ffff00",
  //   },
  //   material: {
  //     metalness: 1.0,
  //     roughness: 0.2,
  //   },
  //   shadows: true,
  //   emissive: true, // Important for neon effect
  //   lighting: {
  //     environment: "night",
  //     envIntensity: 1,
  //     pointLight: { position: [0, 50, 0], intensity: 2 },
  //     ambientLight: { intensity: 0.1 },
  //   },
  //   postprocessing: {
  //     bloom: {
  //       intensity: 10,
  //       luminanceThreshold: 0.4,
  //       luminanceSmoothing: 0.9,
  //     },
  //   },
  // },
  boltzmann: {
    ...BASE_STYLE,
    name: "Boltzmann Machine",
    colors: {
      outer: "#ff00ff",
      inner: "hsl(30, 70%,80%)",
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
      inner: "hsl(20, 95%, 55%)",
      connection: "hsl(20, 65%, 43%)",
      latent: "hsl(30, 80%, 55%)",
    },
    material: {
      metalness: 1.0,
      roughness: 0.05,
      envMapIntensity: 1.5,
    },
    shadows: true,
    emissive: true,
    lighting: {
      environment: "night",
      envIntensity: 1.0,
      pointLight: { position: [0, 50, 0], intensity: 2.5 },
      pointLight2: { position: [-50, 0, 0], intensity: 2.5 },
      directionalLight: { position: [0, 100, -100], intensity: 2.5 },
      directionalLight2: { position: [50, 0, 0], intensity: 2.5 },
      directionalLight3: { position: [-50, 50, 50], intensity: 2.0 },
      ambientLight: { intensity: 0.3 },
    },
    postprocessing: {
      bloom: {
        intensity: 3.0,
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
      outer: "hsl(200, 70%, 45%)", // Blue theme
      inner: "hsl(200, 100%, 35%)",
      self: "hsl(200, 80%, 55%)",
    },
  },

  // v3.x Convolutional Networks
  cnn: {
    ...BASE_STYLE,
    name: "Convolutional Network",
    colors: {
      outer: "hsl(180, 70%, 45%)",
      inner: "hsl(200, 100%, 50%)",
      conv: "hsl(180, 80%, 55%)",
    },
    material: {
      metalness: 0.95,
      roughness: 0.2,
    },
    lighting: {
      pointLight: {
        position: [0, 200, 0],
        intensity: 5,
        color: "hsl(250, 100%, 80%)",
      },
      directionalLight: {
        position: [0, 150, 100],
        intensity: 5,
        color: "hsl(0, 100%, 90%)",
      },
      directionalLight2: {
        position: [50, 0, -100],
        intensity: 5,
        color: "hsl(30, 100%, 80%)",
      },
      ambientLight: { intensity: 3 },
    },
  },

  // v4.x Sequence Models and Transformers
  rnn: {
    ...BASE_STYLE,
    name: "Recurrent Network",
    colors: {
      outer: "hsl(300, 45%, 55%)", // Subtle steel blue
      inner: "hsl(300, 100%, 35%)", // Darker steel blue
      recurrent: "hsl(300, 70%, 65%)",
      connection: "hsl(300, 30%, 30%)", // Muted connection lines
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
        intensity: 4,
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
      //255
      inner: "hsl(245, 100%, 67%)",
      highlight: "#333333",
    },
    material: {
      metalness: 0.95,
      roughness: 0.2,
      transparent: false,
    },
    shadows: true,
    emissive: false,
    lighting: {
      environment: "sunset",
      pointLight: {
        position: [0, 200, 0],
        intensity: 5,
        color: "hsl(0, 100%, 80%)",
      },
      pointLight2: {
        position: [0, -200, -100],
        intensity: 5,
        color: "hsl(250, 100%, 80%)",
      },
      directionalLight: {
        position: [0, 150, 100],
        intensity: 5,
        color: "hsl(150, 100%, 80%)",
      },
      directionalLight2: {
        position: [50, 0, -100],
        intensity: 5,
        color: "hsl(250, 100%, 80%)",
      },
      ambientLight: { intensity: 3 },
    },
    postprocessing: {
      bloom: {
        intensity: 0.2,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
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
      outer: "#c0c0c0", // Polished stainless steel
      inner: "#aaa", // Slightly darker for depth
      environment: "#4a4a4a", // Urban environment reflection
    },
    material: {
      metalness: 1.0,
      roughness: 0.1,
      envMapIntensity: 1.0,
      transparent: false,
    },
    lighting: {
      environment: "city",
      envIntensity: 1.2,
      envMapBlurriness: 1000.0,
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

    // colors: {
    //   outer: "#c0c0c0", // Metallic silver
    //   inner: `hsl(0, 10%, 90%)`,
    //   environment: "#4a4a4a",
    // },
    // material: {
    //   metalness: 1.0,
    //   roughness: 0.15, // Decreased roughness for more shine
    //   envMapIntensity: 2.0, // Increased environment map intensity
    //   transparent: false,
    //   clearcoat: 1.0, // Add clearcoat for extra shine
    //   clearcoatRoughness: 0.1,
    // },
    // lighting: {
    //   environment: "city", // Changed to studio for more professional loo
    //   envMapBlurriness: 0.0, // Crisp reflections
    //   directionalLight: {
    //     position: [10, 20, 10],
    //     intensity: 1.2,
    //   },
    //   pointLight: {
    //     position: [-10, -20, 10],
    //     intensity: 0.8,
    //   },
    //   ambientLight: {
    //     intensity: 0.3,
    //   },
    // },
    // shadows: true, // Enable shadows
    // emissive: false,
    // postprocessing: {
    //   reflection: {
    //     intensity: 2.5, // Increased reflection
    //     blur: 0.2, // Sharper reflections
    //   },
    //   chromaticAberration: {
    //     offset: 0.002, // Subtle chromatic aberration
    //   },
    // },
  },

  // v6.x Hybrid and Multimodal Models
  multi_modal: {
    ...BASE_STYLE,
    name: "Multi-Modal Network",
    colors: {
      outer: "hsl(0, 65%, 58%)",
      inner: "hsl(200, 100%, 50%)",
      plane: "hsl(355, 100%, 55%)",
      mlp: "hsl(200, 100%, 65%)",
    },
    material: {
      metalness: 1,
      roughness: 0.8,
      transparent: false,
    },
    lighting: {
      ambientLight: { intensity: 10.0, color: "hsl(200, 100%, 50%)" },
      environment: "sunset",
      envIntensity: 0,
      directionalLight: {
        position: [10, 20, 10],
        intensity: 5.0,
        color: "hsl(200, 100%, 50%)",
      },
      directionalLight2: {
        position: [-10, -20, 10],
        intensity: 5.0,
        color: "hsl(200, 100%, 50%)",
      },
      pointLight: {
        position: [0, 20, 0],
        intensity: 5.0,
        color: "hsl(200, 100%, 50%)",
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
      inner: "hsl(60, 100%, 35%)",
      policy: "hsl(60, 100%, 55%)",
    },
    material: {
      ...BASE_STYLE.material,
      metalness: 0.9,
    },
    lighting: {
      ambientLight: { intensity: 10.0, color: "hsl(200, 100%, 50%)" },
      environment: "sunset",
      envIntensity: 0,
      directionalLight: {
        position: [10, 20, 10],
        intensity: 5.0,
        color: "hsl(0, 100%, 50%)",
      },
      // directionalLight2: {
      //   position: [-10, -20, 10],
      //   intensity: 2.0,
      //   color: "hsl(150, 100%, 50%)",
      // },
      pointLight: {
        position: [0, 20, 0],
        intensity: 5.0,
        color: "hsl(100, 100%, 50%)",
      },
    },
    postprocessing: {
      bloom: {
        intensity: 0.3,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
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
