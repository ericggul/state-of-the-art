// Constants for model configurations
const NOISE_DIM = 100;
const IMAGE_DIM = [64, 64, 3]; // Output image size for most GANs
// const LARGE_IMAGE_DIM = [1024, 1024, 3]; // For Progressive GAN and StyleGANs
const LARGE_IMAGE_DIM = [128, 128, 3]; // For Progressive GAN and StyleGANs
const NUM_CHANNELS = 3;

// Basic GAN Structure
export const GENERATIVE_ADVERSARIAL_NETWORKS_GANS = [
  {
    name: "Noise Input",
    type: "input",
    stack: "generator",
    dimensions: [NOISE_DIM, 1, 1],
  },
  {
    name: "Generator Hidden 1",
    type: "dense",
    stack: "generator",
    dimensions: [256, 1, 1],
  },
  {
    name: "Generator Hidden 2",
    type: "dense",
    stack: "generator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Image Input",
    type: "input",
    stack: "discriminator",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Discriminator Hidden 1",
    type: "dense",
    stack: "discriminator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Discriminator Hidden 2",
    type: "dense",
    stack: "discriminator",
    dimensions: [256, 1, 1],
  },
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// DCGAN Structure
export const DCGAN = [
  {
    name: "Noise Input",
    type: "input",
    stack: "generator",
    dimensions: [NOISE_DIM, 1, 1],
  },
  {
    name: "Deconv Layer 1",
    type: "deconv",
    stack: "generator",
    dimensions: [1024, 4, 4],
    stride: 1,
  },
  {
    name: "Deconv Layer 2",
    type: "deconv",
    stack: "generator",
    dimensions: [512, 8, 8],
    stride: 2,
  },
  {
    name: "Deconv Layer 3",
    type: "deconv",
    stack: "generator",
    dimensions: [256, 16, 16],
    stride: 2,
  },
  {
    name: "Deconv Layer 4",
    type: "deconv",
    stack: "generator",
    dimensions: [128, 32, 32],
    stride: 2,
  },
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: IMAGE_DIM,
    stride: 2,
  },
  {
    name: "Image Input",
    type: "input",
    stack: "discriminator",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Conv Layer 1",
    type: "conv",
    stack: "discriminator",
    dimensions: [128, 32, 32],
    stride: 2,
  },
  {
    name: "Conv Layer 2",
    type: "conv",
    stack: "discriminator",
    dimensions: [256, 16, 16],
    stride: 2,
  },
  {
    name: "Conv Layer 3",
    type: "conv",
    stack: "discriminator",
    dimensions: [512, 8, 8],
    stride: 2,
  },
  {
    name: "Conv Layer 4",
    type: "conv",
    stack: "discriminator",
    dimensions: [1024, 4, 4],
    stride: 2,
  },
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// WGAN Structure
export const WGAN = [
  {
    name: "Noise Input",
    type: "input",
    stack: "generator",
    dimensions: [NOISE_DIM, 1, 1],
  },
  {
    name: "Dense Layer",
    type: "dense",
    stack: "generator",
    dimensions: [8192, 1, 1],
  },
  {
    name: "Reshape",
    type: "reshape",
    stack: "generator",
    dimensions: [512, 4, 4],
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    name: `Deconv Layer ${i + 1}`,
    type: "deconv",
    stack: "generator",
    dimensions: [256 / 2 ** i, 8 * 2 ** i, 8 * 2 ** i],
  })),
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Image Input",
    type: "input",
    stack: "discriminator",
    dimensions: IMAGE_DIM,
  },
  ...Array.from({ length: 4 }, (_, i) => ({
    name: `Conv Layer ${i + 1}`,
    type: "conv",
    stack: "discriminator",
    dimensions: [64 * 2 ** i, 32 / 2 ** i, 32 / 2 ** i],
  })),
  {
    name: "Dense Layer",
    type: "dense",
    stack: "discriminator",
    dimensions: [1024, 1, 1],
  },
  {
    name: "Critic Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// Progressive GAN Structure
export const PROGRESSIVE_GAN = [
  {
    name: "Noise Input",
    type: "input",
    stack: "generator",
    dimensions: [NOISE_DIM, 1, 1],
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    name: `Progressive Block ${i + 1}`,
    type: "progressive_block",
    stack: "generator",
    dimensions: [512 / 2 ** Math.min(i, 3), 2 ** (i + 2), 2 ** (i + 2)],
  })),
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: LARGE_IMAGE_DIM,
  },
  {
    name: "Image Input",
    type: "input",
    stack: "discriminator",
    dimensions: LARGE_IMAGE_DIM,
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    name: `Progressive Block ${7 - i}`,
    type: "progressive_block",
    stack: "discriminator",
    dimensions: [512 / 2 ** Math.min(6 - i, 3), 2 ** (8 - i), 2 ** (8 - i)],
  })),
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// Conditional GAN Structure
export const CONDITIONAL_GAN = [
  {
    name: "Noise Input",
    type: "input",
    stack: "generator",
    dimensions: [NOISE_DIM, 1, 1],
  },
  {
    name: "Condition Input",
    type: "input",
    stack: "generator",
    dimensions: [10, 1, 1],
  },
  {
    name: "Generator Hidden 1",
    type: "dense",
    stack: "generator",
    dimensions: [256, 1, 1],
  },
  {
    name: "Generator Hidden 2",
    type: "dense",
    stack: "generator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Image Input",
    type: "input",
    stack: "discriminator",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Condition Input",
    type: "input",
    stack: "discriminator",
    dimensions: [10, 1, 1],
  },
  {
    name: "Discriminator Hidden 1",
    type: "dense",
    stack: "discriminator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Discriminator Hidden 2",
    type: "dense",
    stack: "discriminator",
    dimensions: [256, 1, 1],
  },
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// CycleGAN Structure
export const CYCLEGAN = [
  {
    name: "Domain A Input",
    type: "input",
    stack: "generator_A",
    dimensions: IMAGE_DIM,
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Residual Block ${i + 1}`,
    type: "residual",
    stack: "generator_A",
    dimensions: [256, 64, 64],
  })),
  {
    name: "Generator A Output",
    type: "output",
    stack: "generator_A",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Domain B Input",
    type: "input",
    stack: "generator_B",
    dimensions: IMAGE_DIM,
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Residual Block ${i + 1}`,
    type: "residual",
    stack: "generator_B",
    dimensions: [256, 64, 64],
  })),
  {
    name: "Generator B Output",
    type: "output",
    stack: "generator_B",
    dimensions: IMAGE_DIM,
  },
  {
    name: "Discriminator A Input",
    type: "input",
    stack: "discriminator_A",
    dimensions: IMAGE_DIM,
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Conv Layer ${i + 1}`,
    type: "conv",
    stack: "discriminator_A",
    dimensions: [64 * 2 ** i, 32 / 2 ** i, 32 / 2 ** i],
  })),
  {
    name: "Discriminator A Output",
    type: "output",
    stack: "discriminator_A",
    dimensions: [1, 1, 1],
  },
  {
    name: "Discriminator B Input",
    type: "input",
    stack: "discriminator_B",
    dimensions: IMAGE_DIM,
  },
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Conv Layer ${i + 1}`,
    type: "conv",
    stack: "discriminator_B",
    dimensions: [64 * 2 ** i, 32 / 2 ** i, 32 / 2 ** i],
  })),
  {
    name: "Discriminator B Output",
    type: "output",
    stack: "discriminator_B",
    dimensions: [1, 1, 1],
  },
];

// StyleGAN Structure
export const STYLEGAN = [
  {
    name: "Latent Input",
    type: "input",
    stack: "generator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Mapping Network",
    type: "mapping_network",
    stack: "generator",
    dimensions: [512, 8, 1],
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    name: `Style Block ${i + 1}`,
    type: "style_block",
    stack: "generator",
    dimensions: [512 / 2 ** Math.min(i, 5), 2 ** (i + 2), 2 ** (i + 2)],
  })),
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: LARGE_IMAGE_DIM,
  },
  {
    name: "Discriminator Input",
    type: "input",
    stack: "discriminator",
    dimensions: LARGE_IMAGE_DIM,
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    name: `Conv Block ${9 - i}`,
    type: "conv",
    stack: "discriminator",
    dimensions: [512 / 2 ** Math.min(8 - i, 5), 2 ** (10 - i), 2 ** (10 - i)],
  })),
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// StyleGAN2 Structure
export const STYLEGAN2 = [
  {
    name: "Latent Input",
    type: "input",
    stack: "generator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Mapping Network",
    type: "mapping_network",
    stack: "generator",
    dimensions: [512, 8, 1],
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    name: `Style Block ${i + 1}`,
    type: "style_block",
    stack: "generator",
    dimensions: [512 / 2 ** Math.min(i, 5), 2 ** (i + 2), 2 ** (i + 2)],
  })),
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: LARGE_IMAGE_DIM,
  },
  {
    name: "Discriminator Input",
    type: "input",
    stack: "discriminator",
    dimensions: LARGE_IMAGE_DIM,
  },
  ...Array.from({ length: 9 }, (_, i) => ({
    name: `Residual Block ${9 - i}`,
    type: "residual",
    stack: "discriminator",
    dimensions: [512 / 2 ** Math.min(8 - i, 5), 2 ** (10 - i), 2 ** (10 - i)],
  })),
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// StyleGAN3 Structure
export const STYLEGAN3 = [
  {
    name: "Latent Input",
    type: "input",
    stack: "generator",
    dimensions: [512, 1, 1],
  },
  {
    name: "Mapping Network",
    type: "mapping_network",
    stack: "generator",
    dimensions: [512, 14, 1],
  },
  {
    name: "Constant Input",
    type: "input",
    stack: "generator",
    dimensions: [512, 4, 4],
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    name: `Synthesis Layer ${i + 1}`,
    type: "synthesis_layer",
    stack: "generator",
    dimensions: [
      512 / 2 ** Math.min(i, 7),
      2 ** (Math.floor(i / 2) + 2),
      2 ** (Math.floor(i / 2) + 2),
    ],
  })),
  {
    name: "Generator Output",
    type: "output",
    stack: "generator",
    dimensions: LARGE_IMAGE_DIM,
  },
  {
    name: "Discriminator Input",
    type: "input",
    stack: "discriminator",
    dimensions: LARGE_IMAGE_DIM,
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    name: `Fourier Features ${14 - i}`,
    type: "fourier_features",
    stack: "discriminator",
    dimensions: [
      512 / 2 ** Math.min(13 - i, 7),
      2 ** (Math.floor((13 - i) / 2) + 2),
      2 ** (Math.floor((13 - i) / 2) + 2),
    ],
  })),
  {
    name: "Discriminator Output",
    type: "output",
    stack: "discriminator",
    dimensions: [1, 1, 1],
  },
];

// Layer Configurations
export const LAYER_CONFIGS = {
  GENERATIVE_ADVERSARIAL_NETWORKS_GANS: {
    layerHeight: 10,
    keyPrefix: "gan",
    type: "gan",
  },
  DCGAN: {
    layerHeight: 10,
    keyPrefix: "dcgan",
    type: "gan",
  },
  WGAN: {
    layerHeight: 10,
    keyPrefix: "wgan",
    type: "gan",
  },
  PROGRESSIVE_GAN: {
    layerHeight: 20,
    keyPrefix: "progressive_gan",
    type: "gan",
  },
  CONDITIONAL_GAN: {
    layerHeight: 5,
    keyPrefix: "conditional_gan",
    type: "gan",
  },
  CYCLEGAN: {
    layerHeight: 30,
    keyPrefix: "cyclegan",
    type: "gan",
  },
  STYLEGAN: {
    layerHeight: 100,
    keyPrefix: "stylegan",
    type: "gan",
  },
  STYLEGAN2: {
    layerHeight: 100,
    keyPrefix: "stylegan2",
    type: "gan",
  },
  STYLEGAN3: {
    layerHeight: 100,
    keyPrefix: "stylegan3",
    type: "gan",
  },
};

// Grid Configurations
export const GRID_CONFIGS = {
  GENERATIVE_ADVERSARIAL_NETWORKS_GANS: {
    dense: { xCount: 10, yCount: 10, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
  },
  DCGAN: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    deconv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
  },
  WGAN: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    deconv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    dense: { xCount: 10, yCount: 10, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
    reshape: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
  },
  PROGRESSIVE_GAN: {
    progressive_block: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: LARGE_IMAGE_DIM[0],
      yCount: LARGE_IMAGE_DIM[1],
      xInterval: 0.1,
      yInterval: 0.1,
    },
  },
  CONDITIONAL_GAN: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    deconv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
    condition: { xCount: 10, yCount: 1, xInterval: 2, yInterval: 2 },
  },
  CYCLEGAN: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    deconv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    residual: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    input: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
    output: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
    residual_block: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
  },
  STYLEGAN: {
    mapping_network: { xCount: 8, yCount: 1, xInterval: 4, yInterval: 4 },
    style_block: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: LARGE_IMAGE_DIM[0],
      yCount: LARGE_IMAGE_DIM[1],
      xInterval: 0.1,
      yInterval: 0.1,
    },
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
  },
  STYLEGAN2: {
    mapping_network: { xCount: 8, yCount: 1, xInterval: 4, yInterval: 4 },
    style_block: { xCount: 4, yCount: 8, xInterval: 4, yInterval: 4 },
    residual: { xCount: 4, yCount: 8, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: LARGE_IMAGE_DIM[0],
      yCount: LARGE_IMAGE_DIM[1],
      xInterval: 0.1,
      yInterval: 0.1,
    },
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
  },
  STYLEGAN3: {
    mapping_network: { xCount: 8, yCount: 1, xInterval: 4, yInterval: 4 },
    style_block: { xCount: 2, yCount: 8, xInterval: 4, yInterval: 4 },
    synthesis_layer: { xCount: 2, yCount: 8, xInterval: 4, yInterval: 4 },
    fourier_features: { xCount: 2, yCount: 8, xInterval: 4, yInterval: 4 },
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: LARGE_IMAGE_DIM[0],
      yCount: LARGE_IMAGE_DIM[1],
      xInterval: 0.1,
      yInterval: 0.1,
    },
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
  },
};
