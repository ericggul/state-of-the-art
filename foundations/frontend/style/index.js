// Expanded styling strategies
export const STYLE_STRATEGIES = [
  {
    name: "Wireframe Blue with HAL",
    colors: {
      outer: "hsl(240, 65%, 28%)", // Deep, rich blue
      inner: "hsl(240, 70%, 35%)", // Slightly brighter blue
      plane: "hsl(240, 50%, 15%)", // Dark, muted blue
    },
    material: {
      metalness: 0.6,
      roughness: 0.4,
      transparent: true,
      opacity: 1,
    },
    lighting: {
      environment: "apartment",
      envIntensity: 0.3, // Reduced to make the red light more prominent
      pointLight: { position: [0, 200, 0], intensity: 0.5 }, // Reduced intensity
      directionalLight: { position: [0, 150, -100], intensity: 0.3 }, // Reduced intensity
      ambientLight: { intensity: 0.2 }, // Reduced intensity
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
  },
  {
    name: "Subtle Red",
    colors: {
      outer: "hsl(355, 65%, 28%)", // Deep, rich red
      inner: "hsl(355, 70%, 35%)", // Slightly brighter red
      plane: "hsl(355, 50%, 15%)", // Dark, muted red
    },
    material: {
      metalness: 0.6, // Kept the same
      roughness: 0.4, // Kept the same
      transparent: false,
    },
    lighting: {
      environment: "studio", // Kept 'studio' for the gallery-like feel
      envIntensity: 0.5, // Further reduced for a more subdued look
      pointLight: { position: [0, 200, 0], intensity: 0.7 },
      directionalLight: { position: [0, 150, -100], intensity: 0.5 },
      ambientLight: { intensity: 0.3 },
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
  },
  {
    name: "Judd Red",
    colors: {
      outer: "hsl(0, 65%, 30%)", // Deep, rich red
      inner: "hsl(0, 70%, 25%)", // Slightly darker red for inner parts
      highlight: "hsl(0, 80%, 40%)", // Brighter red for highlights
    },
    material: {
      metalness: 0.4,
      roughness: 0.6,
      transparent: false,
    },
    lighting: {
      environment: "studio",
      envIntensity: 0.6,
      pointLight: { position: [0, 200, 0], intensity: 0.8 },
      directionalLight: { position: [0, 150, 100], intensity: 0.7 },
      ambientLight: { intensity: 0.4 },
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 0, 80],
      fov: 45,
      near: 0.1,
    },
  },
  {
    name: "Seagram Green",
    colors: {
      outer: "hsl(140, 20%, 35%)", // Stronger green with a metallic tinge
      inner: "hsl(140, 25%, 20%)", // Deeper, more saturated green for inner parts
      windowGlow: "hsl(140, 30%, 15%)", // Subtle but noticeable green glow
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
  },
  {
    name: "Subtle Green",
    colors: {
      outer: "hsl(170, 60%, 15%)",
      inner: "hsl(165, 60%, 15%)",
      plane: "hsl(160, 70%, 10%)",
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
  },
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
  },
  {
    name: "Anish Kapoor Reflection",
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
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
      position: [0, 0, 80],
      fov: 45,
      near: 0.1,
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
      metalness: 0.8,
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
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
    layout: {
      layerHeight: 10,
    },
  },
  {
    name: "Wireframe Blue with HAL",
    colors: {
      outer: "hsl(240, 65%, 28%)", // Deep, rich blue
      inner: "hsl(240, 70%, 35%)", // Slightly brighter blue
      plane: "hsl(240, 50%, 15%)", // Dark, muted blue
    },
    material: {
      metalness: 0.6,
      roughness: 0.4,
      transparent: true,
      opacity: 1,
    },
    lighting: {
      environment: "apartment",
      envIntensity: 0.3, // Reduced to make the red light more prominent
      pointLight: { position: [0, 200, 0], intensity: 0.5 }, // Reduced intensity
      directionalLight: { position: [0, 150, -100], intensity: 0.3 }, // Reduced intensity
      ambientLight: { intensity: 0.2 }, // Reduced intensity
      halLight: {
        // New HAL-9000 inspired light
        position: [0, 0, 0], // Center of the scene
        color: 0xff0000, // Bright red
        intensity: 2, // Strong intensity
        distance: 100, // Adjust based on your scene size
        decay: 2, // Quadratic light falloff
      },
    },
    shadows: true,
    emissive: false,
    camera: {
      position: [0, 0, 80],
      fov: 50,
      near: 0.1,
    },
  },
];
