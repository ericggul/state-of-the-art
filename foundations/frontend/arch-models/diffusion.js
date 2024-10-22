// Constants for model configurations
const IMAGE_DIM = [64, 64, 3]; // Input image dimensions
const LATENT_DIM = [8, 8, 4]; // Latent space dimensions for Stable Diffusion
const NUM_UNET_BLOCKS = 4; // Number of downsampling/upsampling blocks

// Diffusion Model Structures
export const DDPM = [
  { name: "Input Noise", type: "input", dimensions: IMAGE_DIM },
  { name: "Time Embedding", type: "time_embedding", dimensions: [1, 1, 256] },
  {
    name: "UNet",
    type: "unet",
    sublayers: [
      // Encoder (Downsampling Path)
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `Conv ${i + 1}.1`,
            type: "conv",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (i + 1),
              IMAGE_DIM[1] / 2 ** (i + 1),
              64 * 2 ** i,
            ],
          },
          {
            name: `Conv ${i + 1}.2`,
            type: "conv",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (i + 1),
              IMAGE_DIM[1] / 2 ** (i + 1),
              64 * 2 ** i,
            ],
          },
        ],
      })),
      // Bottleneck
      {
        name: "Bottleneck",
        type: "conv",
        dimensions: [
          IMAGE_DIM[0] / 2 ** NUM_UNET_BLOCKS,
          IMAGE_DIM[1] / 2 ** NUM_UNET_BLOCKS,
          512,
        ],
      },
      // Decoder (Upsampling Path)
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_UNET_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `Upsample ${NUM_UNET_BLOCKS - i}`,
            type: "deconv",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
          {
            name: `Conv ${NUM_UNET_BLOCKS - i}.1`,
            type: "conv",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
          {
            name: `Conv ${NUM_UNET_BLOCKS - i}.2`,
            type: "conv",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
        ],
      })),
    ],
  },
  { name: "Output Image", type: "output", dimensions: IMAGE_DIM },
];

export const STABLE_DIFFUSION = [
  { name: "Input Image", type: "input", dimensions: IMAGE_DIM },
  {
    name: "VAE Encoder",
    type: "vae_encoder",
    sublayers: [
      // Similar to a CNN encoder
      { name: "Conv 1", type: "conv", dimensions: [32, 32, 64] },
      { name: "ReLU 1", type: "activation", activation: "ReLU" },
      // Additional conv layers...
      { name: "Latent Space", type: "dense", dimensions: LATENT_DIM },
    ],
  },
  { name: "Latent Space", type: "latent", dimensions: LATENT_DIM },
  {
    name: "Time Embedding",
    type: "time_embedding",
    dimensions: [1, 1, 256],
  },
  {
    name: "Text Encoder (Transformer)",
    type: "text_encoder",
    sublayers: [
      { name: "Embedding Layer", type: "embedding", dimensions: [77, 768] },
      ...Array.from({ length: 12 }, (_, i) => ({
        name: `Transformer Block ${i + 1}`,
        type: "transformer_block",
        sublayers: [
          {
            name: `Multi-Head Attention ${i + 1}`,
            type: "attention",
            dimensions: [1, 77, 768],
          },
          {
            name: `Feed Forward ${i + 1}`,
            type: "ffn",
            dimensions: [1, 77, 3072],
          },
        ],
      })),
    ],
  },
  {
    name: "UNet with Attention",
    type: "unet_attention",
    sublayers: [
      // Downsampling path
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `ResNet ${i + 1}.1`,
            type: "resnet_block",
            dimensions: [
              LATENT_DIM[0] / 2 ** i,
              LATENT_DIM[1] / 2 ** i,
              64 * 2 ** i,
            ],
          },
          {
            name: `ResNet ${i + 1}.2`,
            type: "resnet_block",
            dimensions: [
              LATENT_DIM[0] / 2 ** i,
              LATENT_DIM[1] / 2 ** i,
              64 * 2 ** i,
            ],
          },
          {
            name: `Cross Attention ${i + 1}`,
            type: "cross_attention",
            dimensions: [1, LATENT_DIM[0] / 2 ** i, 768],
          },
        ],
      })),
      // Bottleneck
      {
        name: "Bottleneck",
        type: "resnet_block",
        dimensions: [LATENT_DIM[0] / 16, LATENT_DIM[1] / 16, 1024],
      },
      // Upsampling path
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_UNET_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `ResNet ${NUM_UNET_BLOCKS - i}.1`,
            type: "resnet_block",
            dimensions: [
              LATENT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              LATENT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
          {
            name: `ResNet ${NUM_UNET_BLOCKS - i}.2`,
            type: "resnet_block",
            dimensions: [
              LATENT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              LATENT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
          {
            name: `Cross Attention ${NUM_UNET_BLOCKS - i}`,
            type: "cross_attention",
            dimensions: [
              1,
              LATENT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              768,
            ],
          },
        ],
      })),
    ],
  },
  {
    name: "VAE Decoder",
    type: "vae_decoder",
    sublayers: [
      // Similar to a CNN decoder
      { name: "Dense Layer", type: "dense", dimensions: [1024, 1, 1] },
      { name: "ReLU", type: "activation", activation: "ReLU" },
      { name: "Deconv 1", type: "deconv", dimensions: [32, 32, 64] },
      // Additional deconv layers...
      { name: "Output Image", type: "output", dimensions: IMAGE_DIM },
    ],
  },
];

// Layer configurations for diffusion models
export const LAYER_CONFIGS = {
  DDPM: {
    layerHeight: 60,
    keyPrefix: "ddpm",
    type: "diffusion",
  },
  STABLE_DIFFUSION: {
    layerHeight: 60,
    keyPrefix: "stable_diffusion",
    type: "diffusion",
  },
};

// Grid configurations for diffusion models
export const GRID_CONFIGS = {
  DDPM: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    deconv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    time_embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    down_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    up_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    resnet_block: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
  },
  STABLE_DIFFUSION: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    vae_encoder: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    vae_decoder: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    unet_attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    transformer_block: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    cross_attention: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    down_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    up_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    resnet_block: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
  },
};
