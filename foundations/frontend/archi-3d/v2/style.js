// Expanded styling strategies
export const STYLE_STRATEGIES = [
  {
    name: "Subtle Blue",
    colors: {
      outer: "hsl(230, 70%, 50%)",
      inner: "hsl(235, 60%, 40%)",
      plane: "hsl(240, 60%, 20%)",
    },
    material: {
      metalness: 0.9,
      roughness: 0.4,
      transparent: false,
    },
    lighting: {
      environment: "apartment",
      envIntensity: 1,
      pointLight: { position: [0, 200, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 50, 150],
      fov: 50,
      near: 0.1,
      far: 1000,
    },
  },
  {
    name: "Seagram Building",
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
    lighting: {
      environment: "apartment",
      envIntensity: 1,
      pointLight: { position: [0, 200, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    shadows: true,
    windowEffect: true,
    camera: {
      position: [0, 75, 200],
      fov: 50,
      near: 0.1,
      far: 1000,
    },
  },
  {
    name: "Donald Judd",
    colors: {
      outer: "#b8860b",
      inner: "#b8860b",
      highlight: "#daa520",
    },
    material: {
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
    },
    lighting: {
      environment: "sunset",
      envIntensity: 0.5,
      directionalLight: { position: [5, 5, 5], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 75, 200],
      fov: 50,
      near: 0.1,
      far: 1000,
    },
  },
  {
    name: "Monochrome Blue",
    colors: {
      outer: "hsl(240, 100%, 50%)",
      inner: "hsl(240, 100%, 50%)",
      plane: "hsl(240, 100%, 20%)",
    },
    material: {
      metalness: 0.5,
      roughness: 0.5,
      transparent: false,
    },
    lighting: {
      environment: "city",
      envIntensity: 0.5,
      directionalLight: { position: [10, 20, 10], intensity: 1 },
      ambientLight: { intensity: 0.3 },
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 50, 150],
      fov: 50,
      near: 0.1,
      far: 1000,
    },
  },
  {
    name: "Neon Nights",
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
    emissive: true,
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
    camera: {
      position: [0, 50, 150],
      fov: 50,
      near: 0.1,
      far: 1000,
    },
  },
  {
    name: "AlexNet Monochrome",
    colors: {
      outer: "hsl(240, 100%, 50%)",
      inner: "hsl(240, 100%, 50%)",
      emissive: "hsl(240, 100%, 50%)",
    },
    material: {
      roughness: 0.5,
      metalness: 0.8,
      transparent: true,
      opacity: 0.4,
      depthTest: false,
      depthWrite: false,
    },
    shadows: true,
    emissive: true,
    lighting: {
      environment: "warehouse",
      pointLight: { position: [10, 10, 10], intensity: 1 },
      directionalLight1: { position: [0, 10, 10], intensity: 2 },
      directionalLight2: { position: [10, 0, 10], intensity: 2 },
      ambientLight: { intensity: 0.5 },
    },
    postprocessing: {
      bloom: {
        intensity: 3,
        luminanceThreshold: 0.4,
        luminanceSmoothing: 0.9,
      },
    },
    camera: {
      position: [40, 30, 50],
      fov: 50,
      near: 0.1,
      far: 5000,
    },
  },
  {
    name: "VideoGen Judd-inspired",
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
      position: [0, 75, 200],
      fov: 45,
      near: 0.1,
      far: 5000,
    },
    layout: {
      layerHeight: 13,
      encoderPosition: -50,
      decoderPosition: 50,
    },
  },
  {
    name: "GPT-3 Visualization",
    colors: {
      outer: "hsl(240, 100%, 50%)",
      inner: "hsl(240, 100%, 50%)",
    },
    material: {
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.6,
    },
    lighting: {
      environment: "warehouse",
      pointLight: { position: [0, 200, 0], intensity: 1 },
      directionalLight: { position: [0, 150, 100], intensity: 1 },
      ambientLight: { intensity: 0.5 },
    },
    shadows: false,
    emissive: false,
    camera: {
      position: [0, 24 * 5, 24 * 6],
      fov: 50,
      near: 0.1,
      far: 5000,
    },
    layout: {
      layerHeight: 10,
    },
  },
];
