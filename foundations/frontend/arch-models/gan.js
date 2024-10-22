// Constants for model configurations
const NOISE_DIM = 100;
const IMAGE_DIM = [64, 64, 3]; // Output image size for most GANs
const LARGE_IMAGE_DIM = [1024, 1024, 3]; // For Progressive GAN and StyleGANs
const NUM_CHANNELS = 3;

// Basic GAN Structure
export const GENERATIVE_ADVERSARIAL_NETWORKS_GANS = {
  generator: [
    { name: "Noise Input", type: "input", dimensions: [NOISE_DIM, 1, 1] },
    { name: "Generator Hidden 1", type: "dense", dimensions: [256, 1, 1] },
    { name: "Generator Hidden 2", type: "dense", dimensions: [512, 1, 1] },
    { name: "Generator Output", type: "output", dimensions: IMAGE_DIM },
  ],
  discriminator: [
    { name: "Image Input", type: "input", dimensions: IMAGE_DIM },
    { name: "Discriminator Hidden 1", type: "dense", dimensions: [512, 1, 1] },
    { name: "Discriminator Hidden 2", type: "dense", dimensions: [256, 1, 1] },
    { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
  ],
};

// DCGAN Structure
export const DCGAN = {
  generator: [
    { name: "Noise Input", type: "input", dimensions: [NOISE_DIM, 1, 1] },
    {
      name: "Deconv Layer 1",
      type: "deconv",
      dimensions: [1024, 4, 4],
      stride: 1,
      padding: 0,
    },
    {
      name: "Deconv Layer 2",
      type: "deconv",
      dimensions: [512, 8, 8],
      stride: 2,
      padding: 1,
    },
    {
      name: "Deconv Layer 3",
      type: "deconv",
      dimensions: [256, 16, 16],
      stride: 2,
      padding: 1,
    },
    {
      name: "Deconv Layer 4",
      type: "deconv",
      dimensions: [NUM_CHANNELS, 32, 32],
      stride: 2,
      padding: 1,
    },
    { name: "Generator Output", type: "output", dimensions: IMAGE_DIM },
  ],
  discriminator: [
    { name: "Image Input", type: "input", dimensions: IMAGE_DIM },
    {
      name: "Conv Layer 1",
      type: "conv",
      dimensions: [128, 32, 32],
      stride: 2,
      padding: 1,
    },
    {
      name: "Conv Layer 2",
      type: "conv",
      dimensions: [256, 16, 16],
      stride: 2,
      padding: 1,
    },
    {
      name: "Conv Layer 3",
      type: "conv",
      dimensions: [512, 8, 8],
      stride: 2,
      padding: 1,
    },
    {
      name: "Conv Layer 4",
      type: "conv",
      dimensions: [1024, 4, 4],
      stride: 2,
      padding: 1,
    },
    { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
  ],
};

// WGAN Structure (Similar to DCGAN but with different loss and training)
export const WGAN = DCGAN;

// Progressive GAN Structure
export const PROGRESSIVE_GAN = {
  generator: [
    { name: "Noise Input", type: "input", dimensions: [NOISE_DIM, 1, 1] },
    // Starts with low resolution layers and progressively adds more
    ...Array.from({ length: 7 }, (_, i) => ({
      name: `Generator Layer ${i + 1}`,
      type: "progressive_block",
      dimensions: [
        512 / Math.pow(2, Math.floor(i / 2)),
        Math.pow(2, i + 2),
        Math.pow(2, i + 2),
      ],
    })),
    { name: "Generator Output", type: "output", dimensions: LARGE_IMAGE_DIM },
  ],
  discriminator: [
    { name: "Image Input", type: "input", dimensions: LARGE_IMAGE_DIM },
    // Starts with high resolution layers and progressively reduces
    ...Array.from({ length: 7 }, (_, i) => ({
      name: `Discriminator Layer ${i + 1}`,
      type: "progressive_block",
      dimensions: [
        512 / Math.pow(2, Math.floor((6 - i) / 2)),
        Math.pow(2, 9 - i),
        Math.pow(2, 9 - i),
      ],
    })),
    { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
  ],
};

// Conditional GAN Structure
export const CONDITIONAL_GAN = {
  generator: [
    { name: "Noise Input", type: "input", dimensions: [NOISE_DIM, 1, 1] },
    {
      name: "Class Embedding",
      type: "embedding",
      dimensions: [NOISE_DIM, 1, 1],
    },
    { name: "Concatenate Noise and Class", type: "concatenate" },
    { name: "Generator Hidden 1", type: "dense", dimensions: [256, 1, 1] },
    { name: "Generator Output", type: "output", dimensions: IMAGE_DIM },
  ],
  discriminator: [
    { name: "Image Input", type: "input", dimensions: IMAGE_DIM },
    {
      name: "Class Embedding",
      type: "embedding",
      dimensions: [IMAGE_DIM[0] * IMAGE_DIM[1], 1, 1],
    },
    { name: "Concatenate Image and Class", type: "concatenate" },
    { name: "Discriminator Hidden 1", type: "dense", dimensions: [256, 1, 1] },
    { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
  ],
};

// CycleGAN Structure (Two Generators and Two Discriminators)
export const CYCLEGAN = {
  generators: [
    {
      name: "Generator X to Y",
      structure: [
        { name: "Input X", type: "input", dimensions: IMAGE_DIM },
        { name: "Generator X->Y Layers", type: "resnet_blocks", count: 9 },
        { name: "Output Y", type: "output", dimensions: IMAGE_DIM },
      ],
    },
    {
      name: "Generator Y to X",
      structure: [
        { name: "Input Y", type: "input", dimensions: IMAGE_DIM },
        { name: "Generator Y->X Layers", type: "resnet_blocks", count: 9 },
        { name: "Output X", type: "output", dimensions: IMAGE_DIM },
      ],
    },
  ],
  discriminators: [
    {
      name: "Discriminator Y",
      structure: [
        { name: "Input Y", type: "input", dimensions: IMAGE_DIM },
        { name: "Discriminator Y Layers", type: "conv_blocks", count: 4 },
        { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
      ],
    },
    {
      name: "Discriminator X",
      structure: [
        { name: "Input X", type: "input", dimensions: IMAGE_DIM },
        { name: "Discriminator X Layers", type: "conv_blocks", count: 4 },
        { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
      ],
    },
  ],
};

// StyleGAN Structure
export const STYLEGAN = {
  generator: [
    { name: "Latent Vector (Z)", type: "input", dimensions: [512, 1, 1] },
    {
      name: "Mapping Network",
      type: "mlp",
      layers: 8,
      dimensions: [512, 1, 1],
    },
    { name: "Constant Input", type: "constant", dimensions: [512, 4, 4] },
    ...Array.from({ length: 9 }, (_, i) => ({
      name: `Generator Block ${i + 1}`,
      type: "style_block",
      dimensions: [
        512 / Math.pow(2, Math.floor(i / 2)),
        Math.pow(2, i + 2),
        Math.pow(2, i + 2),
      ],
    })),
    { name: "Generator Output", type: "output", dimensions: LARGE_IMAGE_DIM },
  ],
  discriminator: [
    { name: "Image Input", type: "input", dimensions: LARGE_IMAGE_DIM },
    ...Array.from({ length: 9 }, (_, i) => ({
      name: `Discriminator Block ${i + 1}`,
      type: "conv_block",
      dimensions: [
        512 / Math.pow(2, Math.floor((8 - i) / 2)),
        Math.pow(2, 9 - i),
        Math.pow(2, 9 - i),
      ],
    })),
    {
      name: "Mini-Batch StdDev",
      type: "minibatch_std",
      dimensions: [512, 4, 4],
    },
    { name: "Discriminator Output", type: "output", dimensions: [1, 1, 1] },
  ],
};

// StyleGAN2 Structure (Modifications over StyleGAN)
export const STYLEGAN2 = {
  generator: [
    { name: "Latent Vector (Z)", type: "input", dimensions: [512, 1, 1] },
    {
      name: "Mapping Network",
      type: "mlp",
      layers: 8,
      dimensions: [512, 1, 1],
    },
    { name: "Constant Input", type: "constant", dimensions: [512, 4, 4] },
    ...Array.from({ length: 9 }, (_, i) => ({
      name: `Generator Block ${i + 1}`,
      type: "style_block",
      dimensions: [
        512 / Math.pow(2, Math.floor(i / 2)),
        Math.pow(2, i + 2),
        Math.pow(2, i + 2),
      ],
      improvements: ["Weight Demodulation", "Path Length Regularization"],
    })),
    { name: "Generator Output", type: "output", dimensions: LARGE_IMAGE_DIM },
  ],
  discriminator: STYLEGAN.discriminator, // Similar discriminator with minor modifications
};

// StyleGAN3 Structure (Further Modifications)
export const STYLEGAN3 = {
  generator: STYLEGAN2.generator.map((layer) => {
    if (layer.type === "style_block") {
      return {
        ...layer,
        improvements: [...(layer.improvements || []), "Equivariance"],
      };
    }
    return layer;
  }),
  discriminator: STYLEGAN2.discriminator,
};

// Exporting Models
export const MODELS = {
  GENERATIVE_ADVERSARIAL_NETWORKS_GANS,
  DCGAN,
  WGAN,
  PROGRESSIVE_GAN,
  CONDITIONAL_GAN,
  CYCLEGAN,
  STYLEGAN,
  STYLEGAN2,
  STYLEGAN3,
};

// Layer Configurations
export const LAYER_CONFIGS = {
  GENERATIVE_ADVERSARIAL_NETWORKS_GANS: {
    layerHeight: 40,
    keyPrefix: "basicgan",
    type: "gan",
  },
  DCGAN: {
    layerHeight: 40,
    keyPrefix: "dcgan",
    type: "gan",
  },
  WGAN: {
    layerHeight: 40,
    keyPrefix: "wgan",
    type: "gan",
  },
  PROGRESSIVE_GAN: {
    layerHeight: 40,
    keyPrefix: "pgan",
    type: "gan",
  },
  CONDITIONAL_GAN: {
    layerHeight: 40,
    keyPrefix: "cgan",
    type: "gan",
  },
  CYCLEGAN: {
    layerHeight: 40,
    keyPrefix: "cyclegan",
    type: "gan",
  },
  STYLEGAN: {
    layerHeight: 40,
    keyPrefix: "stylegan",
    type: "gan",
  },
  STYLEGAN2: {
    layerHeight: 40,
    keyPrefix: "stylegan2",
    type: "gan",
  },
  STYLEGAN3: {
    layerHeight: 40,
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
    input: { xCount: NOISE_DIM, yCount: 1, xInterval: 1, yInterval: 1 },
    output: {
      xCount: IMAGE_DIM[0],
      yCount: IMAGE_DIM[1],
      xInterval: 1,
      yInterval: 1,
    },
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
  STYLEGAN3: {
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
};
