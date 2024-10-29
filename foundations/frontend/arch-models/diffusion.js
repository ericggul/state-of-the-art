// Constants for model configurations
const IMAGE_DIM = [64, 64, 3]; // Input image dimensions for DDPM and GLIDE
const LATENT_DIM = [8, 8, 4]; // Latent space dimensions for Stable Diffusion
const HIGH_RES_IMAGE_DIM = [256, 256, 3]; // Higher resolution for Imagen
const NUM_UNET_BLOCKS = 4; // Number of downsampling/upsampling blocks
const NUM_GLIDE_BLOCKS = 4; // Similar structure for GLIDE
const NUM_IMAGEN_UNET_BLOCKS = 4; // Number of UNet blocks in Imagen
const TEXT_EMBED_DIM_CLIP = 768; // Text embedding dimension for CLIP in GLIDE
const TEXT_EMBED_DIM_T5 = 1024; // Text embedding dimension for T5 in Imagen
const NUM_T5_ENCODER_BLOCKS = 24; // Number of T5 encoder layers in Imagen

// Add constant for Improved DDPM
const NUM_IMPROVED_DDPM_BLOCKS = 4;

// Add constants for SDXL
const SDXL_IMAGE_DIM = [1024, 1024, 3];
const SDXL_LATENT_DIM = [128, 128, 4];
const NUM_SDXL_BLOCKS = 6; // More blocks than base SD
const TEXT_EMBED_DIM_SDXL = 2048; // Larger text embedding

// Add constant for IP-Adapter
const IMAGE_ENCODER_DIM = 1024; // CLIP ViT-L image encoder dimension

// Add constants for SVD
const NUM_FRAMES = 14; // Default number of frames to generate
const TEMPORAL_ENCODER_DIM = 1024;
const MOTION_BUCKET_SIZE = 127;

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

// GLIDE Model Structure
export const GLIDE = [
  { name: "Input Noise", type: "input", dimensions: IMAGE_DIM },
  {
    name: "Text Encoder (CLIP)",
    type: "text_encoder",
    sublayers: [
      {
        name: "Embedding Layer",
        type: "embedding",
        dimensions: [77, TEXT_EMBED_DIM_CLIP],
      },
      // CLIP Transformer layers
      ...Array.from({ length: 12 }, (_, i) => ({
        name: `CLIP Transformer Block ${i + 1}`,
        type: "transformer_block",
        sublayers: [
          {
            name: `Self-Attention ${i + 1}`,
            type: "attention",
            dimensions: [77, TEXT_EMBED_DIM_CLIP],
          },
          {
            name: `Feed Forward ${i + 1}`,
            type: "ffn",
            dimensions: [77, TEXT_EMBED_DIM_CLIP * 4],
          },
        ],
      })),
    ],
  },
  { name: "Time Embedding", type: "time_embedding", dimensions: [1, 1, 256] },
  {
    name: "UNet",
    type: "unet_glide",
    sublayers: [
      // Downsampling path
      ...Array.from({ length: NUM_GLIDE_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `ResNet ${i + 1}.1`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** i,
              IMAGE_DIM[1] / 2 ** i,
              64 * 2 ** i,
            ],
          },
          {
            name: `Cross Attention ${i + 1}`,
            type: "cross_attention",
            dimensions: [
              IMAGE_DIM[0] / 2 ** i,
              IMAGE_DIM[1] / 2 ** i,
              TEXT_EMBED_DIM_CLIP,
            ],
          },
          {
            name: `ResNet ${i + 1}.2`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** i,
              IMAGE_DIM[1] / 2 ** i,
              64 * 2 ** i,
            ],
          },
          {
            name: `Downsample ${i + 1}`,
            type: "downsample",
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
        type: "resnet_block",
        dimensions: [IMAGE_DIM[0] / 16, IMAGE_DIM[1] / 16, 1024],
      },
      // Upsampling path
      ...Array.from({ length: NUM_GLIDE_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_GLIDE_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `ResNet ${NUM_GLIDE_BLOCKS - i}.1`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_GLIDE_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_GLIDE_BLOCKS - i - 1),
              64 * 2 ** (NUM_GLIDE_BLOCKS - i - 1),
            ],
          },
          {
            name: `Cross Attention ${NUM_GLIDE_BLOCKS - i}`,
            type: "cross_attention",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_GLIDE_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_GLIDE_BLOCKS - i - 1),
              TEXT_EMBED_DIM_CLIP,
            ],
          },
          {
            name: `ResNet ${NUM_GLIDE_BLOCKS - i}.2`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_GLIDE_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_GLIDE_BLOCKS - i - 1),
              64 * 2 ** (NUM_GLIDE_BLOCKS - i - 1),
            ],
          },
          {
            name: `Upsample ${NUM_GLIDE_BLOCKS - i}`,
            type: "upsample",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_GLIDE_BLOCKS - i - 2),
              IMAGE_DIM[1] / 2 ** (NUM_GLIDE_BLOCKS - i - 2),
              64 * 2 ** (NUM_GLIDE_BLOCKS - i - 1),
            ],
          },
        ],
      })),
    ],
  },
  { name: "Output Convolution", type: "conv", dimensions: IMAGE_DIM },
  { name: "Output Image", type: "output", dimensions: IMAGE_DIM },
];

// Imagen Model Structure
export const IMAGEN = [
  { name: "Input Noise", type: "input", dimensions: [64, 64, 3] },
  {
    name: "Text Encoder (T5-XXL)",
    type: "text_encoder",
    sublayers: [
      {
        name: "Input Embedding",
        type: "embedding",
        dimensions: [77, TEXT_EMBED_DIM_T5],
      },
      // T5 Encoder layers
      ...Array.from({ length: NUM_T5_ENCODER_BLOCKS }, (_, i) => ({
        name: `T5 Encoder Block ${i + 1}`,
        type: "t5_encoder_block",
        sublayers: [
          {
            name: `Self-Attention ${i + 1}`,
            type: "attention",
            dimensions: [77, TEXT_EMBED_DIM_T5],
          },
          {
            name: `Feed Forward ${i + 1}`,
            type: "ffn",
            dimensions: [77, TEXT_EMBED_DIM_T5 * 4],
          },
        ],
      })),
    ],
  },
  { name: "Time Embedding", type: "time_embedding", dimensions: [1, 1, 512] },
  {
    name: "UNet (64x64)",
    type: "unet_imagen",
    sublayers: createUNetBlocks(64, TEXT_EMBED_DIM_T5),
  },
  { name: "Output (64x64)", type: "output", dimensions: [64, 64, 3] },
  {
    name: "Super-Resolution UNet (256x256)",
    type: "unet_imagen_sr",
    sublayers: createSuperResolutionUNetBlocks(64, 256, TEXT_EMBED_DIM_T5),
  },
  { name: "Output (256x256)", type: "output", dimensions: [256, 256, 3] },
];

function createUNetBlocks(resolution, textEmbedDim) {
  return [
    // Downsampling path
    ...Array.from({ length: NUM_IMAGEN_UNET_BLOCKS }, (_, i) => ({
      name: `Down Block ${i + 1}`,
      type: "down_block",
      sublayers: [
        {
          name: `ResNet ${i + 1}.1`,
          type: "resnet_block",
          dimensions: [resolution / 2 ** i, resolution / 2 ** i, 256 * 2 ** i],
        },
        {
          name: `Attention ${i + 1}`,
          type: "attention",
          dimensions: [resolution / 2 ** i, resolution / 2 ** i, 256 * 2 ** i],
        },
        {
          name: `Cross Attention ${i + 1}`,
          type: "cross_attention",
          dimensions: [resolution / 2 ** i, resolution / 2 ** i, textEmbedDim],
        },
        {
          name: `ResNet ${i + 1}.2`,
          type: "resnet_block",
          dimensions: [resolution / 2 ** i, resolution / 2 ** i, 256 * 2 ** i],
        },
        {
          name: `Downsample ${i + 1}`,
          type: "downsample",
          dimensions: [
            resolution / 2 ** (i + 1),
            resolution / 2 ** (i + 1),
            256 * 2 ** i,
          ],
        },
      ],
    })),
    // Bottleneck
    {
      name: "Bottleneck",
      type: "resnet_block",
      dimensions: [resolution / 16, resolution / 16, 256 * 16],
    },
    {
      name: "Bottleneck Attention",
      type: "attention",
      dimensions: [resolution / 16, resolution / 16, 256 * 16],
    },
    {
      name: "Bottleneck Cross Attention",
      type: "cross_attention",
      dimensions: [resolution / 16, resolution / 16, textEmbedDim],
    },
    // Upsampling path
    ...Array.from({ length: NUM_IMAGEN_UNET_BLOCKS }, (_, i) => ({
      name: `Up Block ${NUM_IMAGEN_UNET_BLOCKS - i}`,
      type: "up_block",
      sublayers: [
        {
          name: `ResNet ${NUM_IMAGEN_UNET_BLOCKS - i}.1`,
          type: "resnet_block",
          dimensions: [
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            256 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
        {
          name: `Attention ${NUM_IMAGEN_UNET_BLOCKS - i}`,
          type: "attention",
          dimensions: [
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            256 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
        {
          name: `Cross Attention ${NUM_IMAGEN_UNET_BLOCKS - i}`,
          type: "cross_attention",
          dimensions: [
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            textEmbedDim,
          ],
        },
        {
          name: `ResNet ${NUM_IMAGEN_UNET_BLOCKS - i}.2`,
          type: "resnet_block",
          dimensions: [
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            256 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
        {
          name: `Upsample ${NUM_IMAGEN_UNET_BLOCKS - i}`,
          type: "upsample",
          dimensions: [
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 2),
            resolution / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 2),
            256 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
      ],
    })),
    {
      name: "Output Convolution",
      type: "conv",
      dimensions: [resolution, resolution, 3],
    },
  ];
}

function createSuperResolutionUNetBlocks(inputRes, outputRes, textEmbedDim) {
  const scaleFactor = outputRes / inputRes;
  return [
    // Downsampling path
    ...Array.from({ length: NUM_IMAGEN_UNET_BLOCKS }, (_, i) => ({
      name: `SR Down Block ${i + 1}`,
      type: "down_block",
      sublayers: [
        {
          name: `SR ResNet ${i + 1}.1`,
          type: "resnet_block",
          dimensions: [outputRes / 2 ** i, outputRes / 2 ** i, 128 * 2 ** i],
        },
        {
          name: `SR Attention ${i + 1}`,
          type: "attention",
          dimensions: [outputRes / 2 ** i, outputRes / 2 ** i, 128 * 2 ** i],
        },
        {
          name: `SR Cross Attention ${i + 1}`,
          type: "cross_attention",
          dimensions: [outputRes / 2 ** i, outputRes / 2 ** i, textEmbedDim],
        },
        {
          name: `SR ResNet ${i + 1}.2`,
          type: "resnet_block",
          dimensions: [outputRes / 2 ** i, outputRes / 2 ** i, 128 * 2 ** i],
        },
        {
          name: `SR Downsample ${i + 1}`,
          type: "downsample",
          dimensions: [
            outputRes / 2 ** (i + 1),
            outputRes / 2 ** (i + 1),
            128 * 2 ** i,
          ],
        },
      ],
    })),
    // Bottleneck
    {
      name: "SR Bottleneck",
      type: "resnet_block",
      dimensions: [outputRes / 16, outputRes / 16, 128 * 16],
    },
    {
      name: "SR Bottleneck Attention",
      type: "attention",
      dimensions: [outputRes / 16, outputRes / 16, 128 * 16],
    },
    {
      name: "SR Bottleneck Cross Attention",
      type: "cross_attention",
      dimensions: [outputRes / 16, outputRes / 16, textEmbedDim],
    },
    // Upsampling path
    ...Array.from({ length: NUM_IMAGEN_UNET_BLOCKS }, (_, i) => ({
      name: `SR Up Block ${NUM_IMAGEN_UNET_BLOCKS - i}`,
      type: "up_block",
      sublayers: [
        {
          name: `SR ResNet ${NUM_IMAGEN_UNET_BLOCKS - i}.1`,
          type: "resnet_block",
          dimensions: [
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            128 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
        {
          name: `SR Attention ${NUM_IMAGEN_UNET_BLOCKS - i}`,
          type: "attention",
          dimensions: [
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            128 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
        {
          name: `SR Cross Attention ${NUM_IMAGEN_UNET_BLOCKS - i}`,
          type: "cross_attention",
          dimensions: [
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            textEmbedDim,
          ],
        },
        {
          name: `SR ResNet ${NUM_IMAGEN_UNET_BLOCKS - i}.2`,
          type: "resnet_block",
          dimensions: [
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
            128 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
        {
          name: `SR Upsample ${NUM_IMAGEN_UNET_BLOCKS - i}`,
          type: "upsample",
          dimensions: [
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 2),
            outputRes / 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 2),
            128 * 2 ** (NUM_IMAGEN_UNET_BLOCKS - i - 1),
          ],
        },
      ],
    })),
    {
      name: "SR Output Convolution",
      type: "conv",
      dimensions: [outputRes, outputRes, 3],
    },
  ];
}

// Consistency Models Structure
export const CONSISTENCY_MODELS = [
  { name: "Input Noise", type: "input", dimensions: IMAGE_DIM },
  {
    name: "UNet Generator",
    type: "unet_consistency",
    sublayers: [
      // Downsampling path
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `ResNet ${i + 1}`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** i,
              IMAGE_DIM[1] / 2 ** i,
              64 * 2 ** i,
            ],
          },
          {
            name: `Downsample ${i + 1}`,
            type: "downsample",
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
        type: "resnet_block",
        dimensions: [IMAGE_DIM[0] / 16, IMAGE_DIM[1] / 16, 512],
      },
      // Upsampling path
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_UNET_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `ResNet ${NUM_UNET_BLOCKS - i}`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
          {
            name: `Upsample ${NUM_UNET_BLOCKS - i}`,
            type: "upsample",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 2),
              IMAGE_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 2),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
        ],
      })),
    ],
  },
  { name: "Output Convolution", type: "conv", dimensions: IMAGE_DIM },
  { name: "Output Image", type: "output", dimensions: IMAGE_DIM },
];

// Improved DDPM Implementation
export const IMPROVED_DDPM = [
  { name: "Input Noise", type: "input", dimensions: IMAGE_DIM },
  {
    name: "Time Embedding",
    type: "time_embedding",
    dimensions: [1, 1, 256],
  },
  {
    name: "Improved UNet",
    type: "unet",
    sublayers: [
      // Encoder (Downsampling Path) with ResNet blocks and attention
      ...Array.from({ length: NUM_IMPROVED_DDPM_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `ResNet ${i + 1}.1`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (i + 1),
              IMAGE_DIM[1] / 2 ** (i + 1),
              64 * 2 ** i,
            ],
          },
          {
            name: `Attention ${i + 1}`,
            type: "attention",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (i + 1),
              IMAGE_DIM[1] / 2 ** (i + 1),
              64 * 2 ** i,
            ],
          },
          {
            name: `ResNet ${i + 1}.2`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (i + 1),
              IMAGE_DIM[1] / 2 ** (i + 1),
              64 * 2 ** i,
            ],
          },
        ],
      })),
      // Bottleneck with attention
      {
        name: "Bottleneck",
        type: "bottleneck",
        sublayers: [
          {
            name: "Bottleneck ResNet",
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** NUM_IMPROVED_DDPM_BLOCKS,
              IMAGE_DIM[1] / 2 ** NUM_IMPROVED_DDPM_BLOCKS,
              512,
            ],
          },
          {
            name: "Bottleneck Attention",
            type: "attention",
            dimensions: [
              IMAGE_DIM[0] / 2 ** NUM_IMPROVED_DDPM_BLOCKS,
              IMAGE_DIM[1] / 2 ** NUM_IMPROVED_DDPM_BLOCKS,
              512,
            ],
          },
        ],
      },
      // Decoder (Upsampling Path) with skip connections
      ...Array.from({ length: NUM_IMPROVED_DDPM_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_IMPROVED_DDPM_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `ResNet ${NUM_IMPROVED_DDPM_BLOCKS - i}.1`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
              64 * 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
            ],
          },
          {
            name: `Attention ${NUM_IMPROVED_DDPM_BLOCKS - i}`,
            type: "attention",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
              64 * 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
            ],
          },
          {
            name: `ResNet ${NUM_IMPROVED_DDPM_BLOCKS - i}.2`,
            type: "resnet_block",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
              IMAGE_DIM[1] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
              64 * 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
            ],
          },
          {
            name: `Upsample ${NUM_IMPROVED_DDPM_BLOCKS - i}`,
            type: "upsample",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 2),
              IMAGE_DIM[1] / 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 2),
              64 * 2 ** (NUM_IMPROVED_DDPM_BLOCKS - i - 1),
            ],
          },
        ],
      })),
    ],
  },
  { name: "Output Image", type: "output", dimensions: IMAGE_DIM },
];

// SDXL Implementation
export const STABLE_DIFFUSION_XL = [
  { name: "Input Image", type: "input", dimensions: SDXL_IMAGE_DIM },
  {
    name: "VAE Encoder",
    type: "vae_encoder",
    sublayers: [
      { name: "Conv 1", type: "conv", dimensions: [512, 512, 128] },
      { name: "ResBlock 1", type: "resnet_block", dimensions: [256, 256, 256] },
      { name: "ResBlock 2", type: "resnet_block", dimensions: [128, 128, 512] },
      { name: "Latent Space", type: "dense", dimensions: SDXL_LATENT_DIM },
    ],
  },
  {
    name: "Dual Text Encoders",
    type: "text_encoder",
    sublayers: [
      {
        name: "OpenCLIP ViT-H",
        type: "transformer_block",
        dimensions: [77, 1, 1280],
      },
      {
        name: "CLIP ViT-L",
        type: "transformer_block",
        dimensions: [77, 1, 768],
      },
    ],
  },
  {
    name: "Condition Processor",
    type: "condition",
    sublayers: [
      {
        name: "Size Conditioning",
        type: "embedding",
        dimensions: [2, 1, 256],
      },
      {
        name: "Crop Conditioning",
        type: "embedding",
        dimensions: [2, 1, 256],
      },
    ],
  },
  {
    name: "UNet",
    type: "unet",
    sublayers: [
      ...Array.from({ length: NUM_SDXL_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `ResNet ${i + 1}.1`,
            type: "resnet_block",
            dimensions: [
              SDXL_LATENT_DIM[0] / 2 ** i,
              SDXL_LATENT_DIM[1] / 2 ** i,
              320 * 2 ** i,
            ],
          },
          {
            name: `Cross Attention ${i + 1}`,
            type: "cross_attention",
            dimensions: [TEXT_EMBED_DIM_SDXL, 77, 2048],
          },
          {
            name: `Self Attention ${i + 1}`,
            type: "self_attention",
            dimensions: [
              SDXL_LATENT_DIM[0] / 2 ** i,
              SDXL_LATENT_DIM[1] / 2 ** i,
              320 * 2 ** i,
            ],
          },
        ],
      })),
      // Bottleneck
      {
        name: "Bottleneck",
        type: "bottleneck",
        dimensions: [
          SDXL_LATENT_DIM[0] / 2 ** NUM_SDXL_BLOCKS,
          SDXL_LATENT_DIM[1] / 2 ** NUM_SDXL_BLOCKS,
          320 * 2 ** NUM_SDXL_BLOCKS,
        ],
      },
      // Upsampling path
      ...Array.from({ length: NUM_SDXL_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_SDXL_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `ResNet ${NUM_SDXL_BLOCKS - i}.1`,
            type: "resnet_block",
            dimensions: [
              SDXL_LATENT_DIM[0] / 2 ** (NUM_SDXL_BLOCKS - i - 1),
              SDXL_LATENT_DIM[1] / 2 ** (NUM_SDXL_BLOCKS - i - 1),
              320 * 2 ** (NUM_SDXL_BLOCKS - i - 1),
            ],
          },
          {
            name: `Cross Attention ${NUM_SDXL_BLOCKS - i}`,
            type: "cross_attention",
            dimensions: [TEXT_EMBED_DIM_SDXL, 77, 2048],
          },
          {
            name: `Self Attention ${NUM_SDXL_BLOCKS - i}`,
            type: "self_attention",
            dimensions: [
              SDXL_LATENT_DIM[0] / 2 ** (NUM_SDXL_BLOCKS - i - 1),
              SDXL_LATENT_DIM[1] / 2 ** (NUM_SDXL_BLOCKS - i - 1),
              320 * 2 ** (NUM_SDXL_BLOCKS - i - 1),
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
      { name: "Dense Layer", type: "dense", dimensions: [2048, 1, 1] },
      { name: "ResBlock 1", type: "resnet_block", dimensions: [256, 256, 512] },
      { name: "ResBlock 2", type: "resnet_block", dimensions: [512, 512, 256] },
      { name: "Output Conv", type: "conv", dimensions: SDXL_IMAGE_DIM },
    ],
  },
  { name: "Output Image", type: "output", dimensions: SDXL_IMAGE_DIM },
];

// SDXL Turbo Implementation
export const SDXL_TURBO = [
  { name: "Input Image", type: "input", dimensions: SDXL_IMAGE_DIM },
  {
    name: "VAE Encoder",
    type: "vae_encoder",
    sublayers: [
      { name: "Conv 1", type: "conv", dimensions: [512, 512, 128] },
      { name: "ResBlock 1", type: "resnet_block", dimensions: [256, 256, 256] },
      { name: "Latent Space", type: "dense", dimensions: SDXL_LATENT_DIM },
    ],
  },
  {
    name: "Turbo UNet",
    type: "unet",
    sublayers: [
      ...Array.from({ length: 4 }, (_, i) => ({
        name: `Turbo Block ${i + 1}`,
        type: "turbo_block",
        sublayers: [
          {
            name: `Fast ResNet ${i + 1}`,
            type: "resnet_block",
            dimensions: [
              SDXL_LATENT_DIM[0] / 2 ** i,
              SDXL_LATENT_DIM[1] / 2 ** i,
              320 * 2 ** i,
            ],
          },
          {
            name: `Efficient Attention ${i + 1}`,
            type: "efficient_attention",
            dimensions: [TEXT_EMBED_DIM_SDXL, 77, 1024],
          },
        ],
      })),
      {
        name: "Turbo Bottleneck",
        type: "bottleneck",
        dimensions: [SDXL_LATENT_DIM[0] / 16, SDXL_LATENT_DIM[1] / 16, 1280],
      },
    ],
  },
  {
    name: "VAE Decoder",
    type: "vae_decoder",
    sublayers: [
      { name: "Dense Layer", type: "dense", dimensions: [1024, 1, 1] },
      {
        name: "Fast ResBlock",
        type: "resnet_block",
        dimensions: [256, 256, 256],
      },
      { name: "Output Conv", type: "conv", dimensions: SDXL_IMAGE_DIM },
    ],
  },
  { name: "Output Image", type: "output", dimensions: SDXL_IMAGE_DIM },
];

// Layer configurations for diffusion models
export const LAYER_CONFIGS = {
  DDPM: { layerHeight: 60, keyPrefix: "ddpm", type: "diffusion" },
  STABLE_DIFFUSION: {
    layerHeight: 5,
    keyPrefix: "stable_diffusion",
    type: "diffusion",
  },
  GLIDE: { layerHeight: 60, keyPrefix: "glide", type: "diffusion" },
  IMAGEN: { layerHeight: 80, keyPrefix: "imagen", type: "diffusion" },
  CONSISTENCY_MODELS: {
    layerHeight: 60,
    keyPrefix: "consistency_models",
    type: "diffusion",
  },
  IMPROVED_DDPM: {
    layerHeight: 60,
    keyPrefix: "improved_ddpm",
    type: "diffusion",
  },
  STABLE_DIFFUSION_XL: {
    layerHeight: 5,
    keyPrefix: "sdxl",
    type: "diffusion",
  },
  SDXL_TURBO: {
    layerHeight: 5,
    keyPrefix: "sdxl_turbo",
    type: "diffusion",
  },
  IP_ADAPTER: {
    layerHeight: 60,
    keyPrefix: "ip_adapter",
    type: "diffusion",
  },
  STABLE_VIDEO_DIFFUSION: {
    layerHeight: 5,
    keyPrefix: "svd",
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
  GLIDE: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    text_encoder: { xCount: 77, yCount: 1, xInterval: 1, yInterval: 1 },
    transformer_block: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    resnet_block: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    cross_attention: { xCount: 4, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  IMAGEN: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    // output: { xCount: 256, yCount: 256, xInterval: 0.25, yInterval: 0.25 },
    output: { xCount: 64, yCount: 64, xInterval: 0.25, yInterval: 0.25 },
    text_encoder: { xCount: 77, yCount: 1, xInterval: 1, yInterval: 1 },
    t5_encoder_block: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    resnet_block: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
    attention: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
    cross_attention: { xCount: 8, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  CONSISTENCY_MODELS: {
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
    resnet_block: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
  IMPROVED_DDPM: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    resnet_block: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    attention: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    upsample: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    time_embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    down_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    up_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    bottleneck: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
  },
  STABLE_DIFFUSION_XL: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    vae_encoder: { xCount: 16, yCount: 16, xInterval: 4, yInterval: 4 },
    text_encoder: { xCount: 77, yCount: 2, xInterval: 2, yInterval: 4 },
    condition: { xCount: 4, yCount: 1, xInterval: 2, yInterval: 2 },
    cross_attention: { xCount: 16, yCount: 2, xInterval: 2, yInterval: 2 },
    self_attention: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
    down_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    up_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    resnet_block: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
  SDXL_TURBO: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    vae_encoder: { xCount: 16, yCount: 16, xInterval: 4, yInterval: 4 },
    vae_decoder: { xCount: 16, yCount: 16, xInterval: 4, yInterval: 4 },
    turbo_block: { xCount: 12, yCount: 12, xInterval: 2, yInterval: 2 },
    efficient_attention: { xCount: 12, yCount: 12, xInterval: 1, yInterval: 1 },
    resnet_block: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
  IP_ADAPTER: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    image_encoder: { xCount: 24, yCount: 24, xInterval: 2, yInterval: 2 },
    vit: { xCount: 24, yCount: 24, xInterval: 2, yInterval: 2 },
    ip_adapter: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
    ip_cross_attention: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    resnet_block: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    down_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    up_block: { xCount: 4, yCount: 4, xInterval: 8, yInterval: 8 },
    bottleneck: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
  },
  STABLE_VIDEO_DIFFUSION: {
    input: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    output: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
    vae_encoder: { xCount: 16, yCount: 16, xInterval: 4, yInterval: 4 },
    vae_decoder: { xCount: 16, yCount: 16, xInterval: 4, yInterval: 4 },
    temporal_encoder: {
      xCount: NUM_FRAMES,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    frame_condition: {
      xCount: NUM_FRAMES,
      yCount: NUM_FRAMES,
      xInterval: 2,
      yInterval: 2,
    },
    temporal_attention: {
      xCount: NUM_FRAMES,
      yCount: NUM_FRAMES,
      xInterval: 2,
      yInterval: 2,
    },
    temporal_resnet: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
    temporal_cross_attention: {
      xCount: NUM_FRAMES,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    motion_modulation: {
      xCount: NUM_FRAMES,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    down_block: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    up_block: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    bottleneck: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
  },
};

// Continuing IP-Adapter with complete structure
export const IP_ADAPTER = [
  { name: "Input Image", type: "input", dimensions: IMAGE_DIM },
  {
    name: "Image Encoder (CLIP ViT-L)",
    type: "image_encoder",
    sublayers: [
      {
        name: "Patch Embedding",
        type: "patch_embed",
        dimensions: [50, 50, 1024],
      },
      ...Array.from({ length: 24 }, (_, i) => ({
        name: `Transformer Block ${i + 1}`,
        type: "transformer_block",
        sublayers: [
          {
            name: `Self Attention ${i + 1}`,
            type: "self_attention",
            dimensions: [577, 1024],
          },
          {
            name: `MLP ${i + 1}`,
            type: "mlp",
            dimensions: [577, 4096],
          },
          {
            name: `LayerNorm ${i + 1}`,
            type: "norm",
            dimensions: [577, 1024],
          },
        ],
      })),
      { name: "Image Features", type: "features", dimensions: [577, 1024] },
    ],
  },
  {
    name: "IP-Adapter",
    type: "ip_adapter",
    sublayers: [
      {
        name: "Feature Projection",
        type: "projection",
        sublayers: [
          { name: "Key Projection", type: "linear", dimensions: [577, 768] },
          { name: "Value Projection", type: "linear", dimensions: [577, 768] },
        ],
      },
      { name: "Scale Layer", type: "scale", dimensions: [768] },
    ],
  },
  {
    name: "UNet",
    type: "unet",
    sublayers: [
      // Time embedding
      {
        name: "Time Embedding",
        type: "time_embedding",
        sublayers: [
          { name: "SinCos Embedding", type: "sincos", dimensions: [320] },
          { name: "Linear 1", type: "linear", dimensions: [1280] },
          { name: "SiLU", type: "activation" },
          { name: "Linear 2", type: "linear", dimensions: [1280] },
        ],
      },
      // Downsampling path
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Down Block ${i + 1}`,
        type: "down_block",
        sublayers: [
          {
            name: `ResNet ${i + 1}.1`,
            type: "resnet_block",
            sublayers: [
              { name: "GroupNorm", type: "norm", dimensions: [64 * 2 ** i] },
              { name: "SiLU", type: "activation" },
              { name: "Conv1", type: "conv", dimensions: [64 * 2 ** i] },
              { name: "GroupNorm", type: "norm", dimensions: [64 * 2 ** i] },
              { name: "SiLU", type: "activation" },
              { name: "Conv2", type: "conv", dimensions: [64 * 2 ** i] },
            ],
          },
          {
            name: `IP Cross Attention ${i + 1}`,
            type: "ip_cross_attention",
            sublayers: [
              { name: "LayerNorm 1", type: "norm", dimensions: [768] },
              {
                name: "Cross Attention",
                type: "attention",
                sublayers: [
                  {
                    name: "Query Projection",
                    type: "linear",
                    dimensions: [768, 768],
                  },
                  {
                    name: "Cross Attention",
                    type: "attention",
                    dimensions: [768, 577, 768],
                  },
                  {
                    name: "Output Projection",
                    type: "linear",
                    dimensions: [768, 768],
                  },
                ],
              },
              { name: "LayerNorm 2", type: "norm", dimensions: [768] },
              {
                name: "Feed Forward",
                type: "mlp",
                sublayers: [
                  { name: "Linear 1", type: "linear", dimensions: [3072] },
                  { name: "GELU", type: "activation" },
                  { name: "Linear 2", type: "linear", dimensions: [768] },
                ],
              },
            ],
          },
          {
            name: `Downsample ${i + 1}`,
            type: "downsample",
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
        type: "bottleneck",
        sublayers: [
          {
            name: "ResNet Bottleneck",
            type: "resnet_block",
            dimensions: [IMAGE_DIM[0] / 16, IMAGE_DIM[1] / 16, 1280],
          },
          {
            name: "IP Cross Attention Bottleneck",
            type: "ip_cross_attention",
            sublayers: [
              { name: "LayerNorm", type: "norm", dimensions: [1280] },
              {
                name: "Cross Attention",
                type: "attention",
                dimensions: [1280, 577, 1280],
              },
              {
                name: "Feed Forward",
                type: "mlp",
                dimensions: [5120, 1280],
              },
            ],
          },
        ],
      },
      // Upsampling path
      ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
        name: `Up Block ${NUM_UNET_BLOCKS - i}`,
        type: "up_block",
        sublayers: [
          {
            name: `ResNet ${NUM_UNET_BLOCKS - i}.1`,
            type: "resnet_block",
            sublayers: [
              {
                name: "GroupNorm",
                type: "norm",
                dimensions: [64 * 2 ** (NUM_UNET_BLOCKS - i - 1)],
              },
              { name: "SiLU", type: "activation" },
              {
                name: "Conv1",
                type: "conv",
                dimensions: [64 * 2 ** (NUM_UNET_BLOCKS - i - 1)],
              },
              {
                name: "GroupNorm",
                type: "norm",
                dimensions: [64 * 2 ** (NUM_UNET_BLOCKS - i - 1)],
              },
              { name: "SiLU", type: "activation" },
              {
                name: "Conv2",
                type: "conv",
                dimensions: [64 * 2 ** (NUM_UNET_BLOCKS - i - 1)],
              },
            ],
          },
          {
            name: `IP Cross Attention ${NUM_UNET_BLOCKS - i}`,
            type: "ip_cross_attention",
            sublayers: [
              { name: "LayerNorm 1", type: "norm", dimensions: [768] },
              {
                name: "Cross Attention",
                type: "attention",
                sublayers: [
                  {
                    name: "Query Projection",
                    type: "linear",
                    dimensions: [768, 768],
                  },
                  {
                    name: "Cross Attention",
                    type: "attention",
                    dimensions: [768, 577, 768],
                  },
                  {
                    name: "Output Projection",
                    type: "linear",
                    dimensions: [768, 768],
                  },
                ],
              },
              { name: "LayerNorm 2", type: "norm", dimensions: [768] },
              {
                name: "Feed Forward",
                type: "mlp",
                sublayers: [
                  { name: "Linear 1", type: "linear", dimensions: [3072] },
                  { name: "GELU", type: "activation" },
                  { name: "Linear 2", type: "linear", dimensions: [768] },
                ],
              },
            ],
          },
          {
            name: `Upsample ${NUM_UNET_BLOCKS - i}`,
            type: "upsample",
            dimensions: [
              IMAGE_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 2),
              IMAGE_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 2),
              64 * 2 ** (NUM_UNET_BLOCKS - i - 1),
            ],
          },
        ],
      })),
    ],
  },
  { name: "Output Image", type: "output", dimensions: IMAGE_DIM },
];

// STABLE_VIDEO_DIFFUSION Implementation
export const STABLE_VIDEO_DIFFUSION = [
  { name: "Input Image", type: "input", dimensions: SDXL_IMAGE_DIM },
  {
    name: "VAE Encoder",
    type: "vae_encoder",
    sublayers: [
      { name: "Conv 1", type: "conv", dimensions: [512, 512, 128] },
      { name: "ResBlock", type: "resnet_block", dimensions: [256, 256, 256] },
      { name: "Latent Space", type: "dense", dimensions: SDXL_LATENT_DIM },
    ],
  },
  {
    name: "Temporal Encoder",
    type: "temporal_encoder",
    sublayers: [
      {
        name: "Frame Sequence",
        type: "frame_condition",
        dimensions: [NUM_FRAMES * 8, NUM_FRAMES * 8, 3],
      },
      {
        name: "Motion Processing",
        type: "motion_bucket",
        dimensions: [NUM_FRAMES * 4, MOTION_BUCKET_SIZE, 64],
      },
      {
        name: "Temporal Features",
        type: "temporal_attention",
        dimensions: [NUM_FRAMES * 4, TEMPORAL_ENCODER_DIM, 64],
      },
    ],
  },
  // ... continuing with the rest of the structure
];
