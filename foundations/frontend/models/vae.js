// Constants for model configurations
const INPUT_DIM = 784; // for MNIST (28x28 pixels)
const LATENT_DIM = 32; // Increased from 2 to 32
const HIDDEN_DIM = 256; // Slightly reduced from 400

export const BASIC_AUTOENCODER = [
  { name: "Input", type: "input", dimensions: [INPUT_DIM, 1, 1] },
  { name: "Encoder Hidden", type: "dense", dimensions: [HIDDEN_DIM, 1, 1] },
  { name: "Latent", type: "dense", dimensions: [LATENT_DIM, 1, 1] },
  { name: "Decoder Hidden", type: "dense", dimensions: [HIDDEN_DIM, 1, 1] },
  { name: "Output", type: "output", dimensions: [INPUT_DIM, 1, 1] },
];

export const VARIATIONAL_AUTOENCODER_VAE = [
  { name: "Input", type: "input", dimensions: [INPUT_DIM, 1, 1] },
  { name: "Encoder Hidden", type: "dense", dimensions: [HIDDEN_DIM, 1, 1] },
  { name: "Mean", type: "dense", dimensions: [LATENT_DIM, 1, 1] },
  { name: "Log Variance", type: "dense", dimensions: [LATENT_DIM, 1, 1] },
  { name: "Sampling", type: "sampling", dimensions: [LATENT_DIM, 1, 1] },
  { name: "Decoder Hidden", type: "dense", dimensions: [HIDDEN_DIM, 1, 1] },
  { name: "Output", type: "output", dimensions: [INPUT_DIM, 1, 1] },
];

export const BETA_VAE = [
  { name: "Input", type: "input", dimensions: [INPUT_DIM, 1, 1] },
  { name: "Encoder Hidden 1", type: "dense", dimensions: [HIDDEN_DIM, 1, 1] },
  {
    name: "Encoder Hidden 2",
    type: "dense",
    dimensions: [HIDDEN_DIM / 2, 1, 1],
  },
  { name: "Mean", type: "dense", dimensions: [LATENT_DIM, 1, 1] },
  { name: "Log Variance", type: "dense", dimensions: [LATENT_DIM, 1, 1] },
  { name: "Sampling", type: "sampling", dimensions: [LATENT_DIM, 1, 1] },
  {
    name: "Decoder Hidden 1",
    type: "dense",
    dimensions: [HIDDEN_DIM / 2, 1, 1],
  },
  { name: "Decoder Hidden 2", type: "dense", dimensions: [HIDDEN_DIM, 1, 1] },
  { name: "Output", type: "output", dimensions: [INPUT_DIM, 1, 1] },
];

export const MODELS = {
  BASIC_AUTOENCODER,
  VARIATIONAL_AUTOENCODER_VAE,
  BETA_VAE,
};

export const LAYER_CONFIGS = {
  BASIC_AUTOENCODER: {
    layerHeight: 60,
    keyPrefix: "basicae",
    type: "vae",
  },
  VARIATIONAL_AUTOENCODER_VAE: {
    layerHeight: 60,
    keyPrefix: "vae",
    type: "vae",
  },
  BETA_VAE: {
    layerHeight: 60,
    keyPrefix: "betavae",
    type: "vae",
  },
};

export const GRID_CONFIGS = {
  BASIC_AUTOENCODER: {
    dense: { xCount: 10, yCount: 10, xInterval: 5, yInterval: 5 },
    input: { xCount: 28, yCount: 28, xInterval: 2, yInterval: 2 },
    output: { xCount: 28, yCount: 28, xInterval: 2, yInterval: 2 },
  },
  VARIATIONAL_AUTOENCODER_VAE: {
    dense: { xCount: 10, yCount: 10, xInterval: 5, yInterval: 5 },
    input: { xCount: 28, yCount: 28, xInterval: 1, yInterval: 1 },
    output: { xCount: 28, yCount: 28, xInterval: 1, yInterval: 1 },
    sampling: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  BETA_VAE: {
    dense: { xCount: 10, yCount: 10, xInterval: 5, yInterval: 5 },
    input: { xCount: 28, yCount: 28, xInterval: 1, yInterval: 1 },
    output: { xCount: 28, yCount: 28, xInterval: 1, yInterval: 1 },
    sampling: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
};
