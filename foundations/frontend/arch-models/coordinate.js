// Constants for coordinate-based models
const INPUT_DIM = [1, 1, 5]; // (x, y, z, theta, phi)
const ENCODED_DIM = [1, 1, 63]; // After positional encoding
const MLP_HIDDEN_DIM = [1, 1, 256]; // Hidden layer size
const NUM_MLP_LAYERS = 8;

// NeRF Model Structure
export const NEURAL_RADIANCE_FIELDS_NERF = [
  { name: "Coordinate Input", type: "input", dimensions: INPUT_DIM },
  {
    name: "Positional Encoding",
    type: "positional_encoding",
    dimensions: ENCODED_DIM,
  },
  ...Array.from({ length: NUM_MLP_LAYERS }, (_, i) => ({
    name: `Dense Layer ${i + 1}`,
    type: "dense",
    dimensions: MLP_HIDDEN_DIM,
  })),
  {
    name: "Output Layer",
    type: "output",
    dimensions: [1, 1, 4], // RGB + Density
  },
];

// Layer configurations for coordinate-based models
export const LAYER_CONFIGS = {
  NEURAL_RADIANCE_FIELDS_NERF: {
    layerHeight: 30,
    keyPrefix: "nerf",
    type: "coordinate_based",
  },
};

// Grid configurations for coordinate-based models
export const GRID_CONFIGS = {
  NEURAL_RADIANCE_FIELDS_NERF: {
    input: { xCount: 5, yCount: 1, xInterval: 2, yInterval: 2 },
    positional_encoding: {
      xCount: 63,
      yCount: 1,
      xInterval: 1,
      yInterval: 1,
    },
    dense: {
      xCount: 256,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    output: { xCount: 4, yCount: 1, xInterval: 2, yInterval: 2 },
  },
};
