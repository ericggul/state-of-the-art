//multi-modal here // Constants for multi_modal models
const IMAGE_INPUT_DIM = [96, 96, 3]; // Typical image input dimensions
const TEXT_INPUT_DIM = [77, 1, 1]; // Tokenized text length
const VISUAL_EMBED_DIM = [1, 1, 512];
const TEXT_EMBED_DIM = [1, 1, 512];
const NUM_VIT_LAYERS = 12; // For ViT-B/32
const NUM_TEXT_TRANSFORMER_LAYERS = 12;
const NUM_TRANSFORMER_LAYERS = 12;
const NUM_PRIOR_TRANSFORMER_LAYERS = 12;
const NUM_UNET_BLOCKS = 8;
const NUM_UNET_ATTENTION_LAYERS = 4;
const IMAGE_EMBED_DIM = [1, 1, 16384];

const SDXL_IMAGE_DIM = [1024, 1024, 3];

// Constants for multi-modal models
const NUM_LAYERS_FLAMINGO = 24;
const NUM_LAYERS_BLIP2_LM = 24;
const NUM_LAYERS_LLAVA_LM = 32;
const NUM_LAYERS_PALME_LM = 64;
const NUM_LAYERS_GPT4V_LM = 96;
const NUM_VISION_LAYERS = 12;

// Add Florence-specific constants
const NUM_FLORENCE_VISION_LAYERS = 24;
const NUM_FLORENCE_TEXT_LAYERS = 12;
const FLORENCE_EMBED_DIM = 1024;

// Add DALL-E 3 specific constants
const NUM_DALLE3_TRANSFORMER_LAYERS = 24;
const DALLE3_EMBED_DIM = 2048;
const DALLE3_DIFFUSION_DIM = 2048;

// Add CogVLM specific constants
const NUM_COGVLM_VISION_LAYERS = 32;
const NUM_COGVLM_LLM_LAYERS = 40;
const COGVLM_EMBED_DIM = 4096;
const COGVLM_VISION_DIM = 1024;

// Add LLaVA specific constants
const NUM_LLAVA_VISION_LAYERS = 32;
const NUM_LLAVA_LLM_LAYERS = 32;
const LLAVA_EMBED_DIM = 4096;
const LLAVA_VISION_DIM = 1024;
const LLAVA_PROJECTOR_DIM = 5120;

// Add Claude 3 Vision specific constants
const NUM_CLAUDE_3_VISION_LAYERS = 48; // Deeper vision processing
const NUM_CLAUDE3_LLM_LAYERS = 64; // Large language model capacity
const CLAUDE3_EMBED_DIM = 8192; // Significantly larger embedding dimension
const CLAUDE_3_VISION_DIM = 2048;
const NUM_CLAUDE3_EXPERTS = 4; // MoE experts

// Add Gemini Vision specific constants
const NUM_GEMINI_VISION_LAYERS = 56;
const NUM_GEMINI_LLM_LAYERS = 80;
const GEMINI_EMBED_DIM = 12288; // Larger embedding for Gemini Ultra
const GEMINI_VISION_DIM = 2560;
const NUM_GEMINI_EXPERTS = 8; // More experts than Claude
const NUM_VISUAL_SCALES = 4; // Multi-scale processing

// Model definitions

export const SHOW_AND_TELL = [
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
  },
  {
    name: "CNN Encoder",
    type: "cnn_encoder",
    dimensions: [7, 7, 512],
  },
  {
    name: "Flatten",
    type: "flatten",
    dimensions: [1, 1, 25088], // 7 * 7 * 512
  },
  {
    name: "Dense Layer",
    type: "dense",
    dimensions: TEXT_EMBED_DIM,
  },
  {
    name: "RNN Decoder",
    type: "rnn_decoder",
    dimensions: TEXT_INPUT_DIM,
  },
  {
    name: "Output Caption",
    type: "output",
    dimensions: TEXT_INPUT_DIM,
  },
];

export const VISUAL_QUESTION_ANSWERING_VQA = [
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
  },
  {
    name: "CNN Encoder",
    type: "cnn_encoder",
    dimensions: [7, 7, 512],
  },
  {
    name: "Flatten Image Features",
    type: "flatten",
    dimensions: [1, 1, 25088],
  },
  {
    name: "Question Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
  },
  {
    name: "Text Encoder",
    type: "text_encoder",
    dimensions: TEXT_EMBED_DIM,
  },
  {
    name: "Feature Fusion",
    type: "fusion",
    dimensions: [1, 1, 512],
  },
  {
    name: "Classifier",
    type: "dense",
    dimensions: [1, 1, 1000], // Assume 1000 possible answers
  },
  {
    name: "Output Answer",
    type: "output",
    dimensions: [1, 1, 1000],
  },
];

export const CLIP = [
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Patch Embedding",
    type: "embedding",
    dimensions: [14, 14, 768],
    stream: "image",
  },
  {
    name: "Vision Transformer",
    type: "vision_transformer",
    stream: "image",
    sublayers: Array.from({ length: NUM_VIT_LAYERS }, (_, i) => ({
      name: `ViT Layer ${i + 1}`,
      type: "transformer_layer",
      sublayers: [
        {
          name: `Self-Attention ${i + 1}`,
          type: "attention",
          dimensions: [14, 14, 768],
        },
        {
          name: `Feed Forward ${i + 1}`,
          type: "ffn",
          dimensions: [14, 14, 3072],
        },
      ],
    })),
  },
  {
    name: "Image Projection",
    type: "dense",
    dimensions: VISUAL_EMBED_DIM,
    stream: "image",
  },
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "Text Embedding",
    type: "embedding",
    dimensions: [77, 512],
    stream: "text",
  },
  {
    name: "Text Transformer",
    type: "text_transformer",
    stream: "text",
    sublayers: Array.from({ length: NUM_TEXT_TRANSFORMER_LAYERS }, (_, i) => ({
      name: `Text Layer ${i + 1}`,
      type: "transformer_layer",
      sublayers: [
        {
          name: `Self-Attention ${i + 1}`,
          type: "attention",
          dimensions: [77, 512],
        },
        {
          name: `Feed Forward ${i + 1}`,
          type: "ffn",
          dimensions: [77, 2048],
        },
      ],
    })),
  },
  {
    name: "Text Projection",
    type: "dense",
    dimensions: TEXT_EMBED_DIM,
    stream: "text",
  },
  {
    name: "Contrastive Loss",
    type: "loss",
    dimensions: [1, 1, 1],
    stream: "fusion",
  },
];

export const DALL_E = [
  // Text Input and Processing
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "Text Embeddings",
    type: "embedding",
    dimensions: [1, 77, 512],
    stream: "text",
  },
  {
    name: "Positional Embeddings",
    type: "embedding",
    dimensions: [1, 77, 512],
    stream: "text",
  },
  {
    name: "Text + Positional",
    type: "add",
    dimensions: [1, 77, 512],
    stream: "text",
  },

  // Image Input (for training)
  {
    name: "Image Tokens",
    type: "input",
    dimensions: [1, 1024],
    stream: "image",
  },
  {
    name: "Image Token Embeddings",
    type: "embedding",
    dimensions: [1, 1024, 512],
    stream: "image",
  },

  // Concatenate Text and Image Tokens
  {
    name: "Concatenation",
    type: "concat",
    dimensions: [1, 1101, 512],
    stream: "fusion",
  },

  // Transformer Layers
  ...Array.from({ length: NUM_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Transformer Layer ${i + 1}`,
    type: "transformer_layer",
    dimensions: [1, 1101, 512],
    stream: "fusion",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [1, 1101, 512] },
      {
        name: `Masked Self-Attention`,
        type: "attention",
        dimensions: [1, 1101, 512],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [1, 1101, 512] },
      { name: `MLP`, type: "mlp", dimensions: [1, 1101, 512] },
    ],
  })),

  // Output Processing
  {
    name: "Final Layer Norm",
    type: "layernorm",
    dimensions: [1, 1101, 512],
    stream: "fusion",
  },
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [1, 1101, 16384],
    stream: "fusion",
  },
  {
    name: "Softmax",
    type: "softmax",
    dimensions: [1, 1101, 16384],
    stream: "fusion",
  },

  // Output Image Tokens
  {
    name: "Generated Image Tokens",
    type: "output",
    dimensions: [1, 1024],
    stream: "image",
  },
];

export const DALL_E_2 = [
  // Text Input and CLIP Encoding
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "CLIP Text Encoder",
    type: "clip_text_encoder",
    dimensions: TEXT_EMBED_DIM,
    stream: "text",
    sublayers: Array.from({ length: NUM_TEXT_TRANSFORMER_LAYERS }, (_, i) => ({
      name: `CLIP Text Layer ${i + 1}`,
      type: "transformer_layer",
      dimensions: TEXT_EMBED_DIM,
      sublayers: [
        { name: `Layer Norm`, type: "layernorm", dimensions: TEXT_EMBED_DIM },
        {
          name: `Self-Attention`,
          type: "attention",
          dimensions: TEXT_EMBED_DIM,
        },
        { name: `MLP`, type: "mlp", dimensions: TEXT_EMBED_DIM },
      ],
    })),
  },

  // Diffusion Prior
  {
    name: "Diffusion Prior",
    type: "diffusion_prior",
    stream: "fusion",
    sublayers: [
      {
        name: "Time Embedding",
        type: "time_embedding",
        dimensions: [1, 1, 1280],
      },
      ...Array.from({ length: NUM_PRIOR_TRANSFORMER_LAYERS }, (_, i) => ({
        name: `Prior Transformer Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: TEXT_EMBED_DIM,
        sublayers: [
          {
            name: `Layer Norm 1`,
            type: "layernorm",
            dimensions: TEXT_EMBED_DIM,
          },
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: TEXT_EMBED_DIM,
          },
          {
            name: `Layer Norm 2`,
            type: "layernorm",
            dimensions: TEXT_EMBED_DIM,
          },
          { name: `MLP`, type: "mlp", dimensions: TEXT_EMBED_DIM },
        ],
      })),
      {
        name: "Predicted Image Embedding",
        type: "dense",
        dimensions: IMAGE_EMBED_DIM,
      },
    ],
  },

  // Decoder Diffusion Model
  {
    name: "Decoder Diffusion Model",
    type: "decoder_diffusion",
    stream: "image",
    sublayers: [
      {
        name: "Image Embedding Input",
        type: "input",
        dimensions: IMAGE_EMBED_DIM,
      },
      {
        name: "Time Embedding",
        type: "time_embedding",
        dimensions: [1, 1, 1280],
      },
      {
        name: "UNet with Cross-Attention",
        type: "unet",
        sublayers: [
          // Downsampling Path
          ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
            name: `Down Block ${i + 1}`,
            type: "down_block",
            sublayers: [
              {
                name: `ResNet Block ${i + 1}.1`,
                type: "resnet_block",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (i + 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (i + 1),
                  128 * 2 ** i,
                ],
              },
              {
                name: `ResNet Block ${i + 1}.2`,
                type: "resnet_block",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (i + 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (i + 1),
                  128 * 2 ** i,
                ],
              },
              ...Array.from({ length: NUM_UNET_ATTENTION_LAYERS }, (_, j) => ({
                name: `Cross-Attention Layer ${i + 1}.${j + 1}`,
                type: "cross_attention",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (i + 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (i + 1),
                  128 * 2 ** i,
                ],
              })),
              {
                name: `Downsample ${i + 1}`,
                type: "conv",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (i + 2),
                  IMAGE_INPUT_DIM[1] / 2 ** (i + 2),
                  128 * 2 ** (i + 1),
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
                name: "ResNet Block 1",
                type: "resnet_block",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** NUM_UNET_BLOCKS,
                  IMAGE_INPUT_DIM[1] / 2 ** NUM_UNET_BLOCKS,
                  1024,
                ],
              },
              {
                name: "Cross-Attention",
                type: "cross_attention",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** NUM_UNET_BLOCKS,
                  IMAGE_INPUT_DIM[1] / 2 ** NUM_UNET_BLOCKS,
                  1024,
                ],
              },
              {
                name: "ResNet Block 2",
                type: "resnet_block",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** NUM_UNET_BLOCKS,
                  IMAGE_INPUT_DIM[1] / 2 ** NUM_UNET_BLOCKS,
                  1024,
                ],
              },
            ],
          },
          // Upsampling Path
          ...Array.from({ length: NUM_UNET_BLOCKS }, (_, i) => ({
            name: `Up Block ${NUM_UNET_BLOCKS - i}`,
            type: "up_block",
            sublayers: [
              {
                name: `ResNet Block ${NUM_UNET_BLOCKS - i}.1`,
                type: "resnet_block",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  128 * 2 ** (NUM_UNET_BLOCKS - i - 1),
                ],
              },
              {
                name: `ResNet Block ${NUM_UNET_BLOCKS - i}.2`,
                type: "resnet_block",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  128 * 2 ** (NUM_UNET_BLOCKS - i - 1),
                ],
              },
              ...Array.from({ length: NUM_UNET_ATTENTION_LAYERS }, (_, j) => ({
                name: `Cross-Attention Layer ${NUM_UNET_BLOCKS - i}.${j + 1}`,
                type: "cross_attention",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  128 * 2 ** (NUM_UNET_BLOCKS - i - 1),
                ],
              })),
              {
                name: `Upsample ${NUM_UNET_BLOCKS - i}`,
                type: "conv_transpose",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 2),
                  IMAGE_INPUT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 2),
                  128 * 2 ** (NUM_UNET_BLOCKS - i - 2),
                ],
              },
            ],
          })),
        ],
      },
      { name: "Output Projection", type: "conv", dimensions: IMAGE_INPUT_DIM },
    ],
  },

  // Generated Image Output
  {
    name: "Generated Image",
    type: "output",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
];

/** DALL-E 3 **/
export const DALL_E_3 = [
  // Text Processing Stream
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },

  // CLIP Text Encoder
  {
    name: "CLIP Text Encoder",
    type: "text_encoder",
    dimensions: [77, 1, DALLE3_EMBED_DIM],
    stream: "text",
    sublayers: Array.from(
      { length: NUM_DALLE3_TRANSFORMER_LAYERS },
      (_, i) => ({
        name: `CLIP Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [77, 1, DALLE3_EMBED_DIM],
        sublayers: [
          {
            name: "Layer Norm 1",
            type: "layernorm",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Layer Norm 2",
            type: "layernorm",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
        ],
      })
    ),
  },

  // T5 Text Encoder
  {
    name: "T5 Text Encoder",
    type: "t5_encoder",
    dimensions: [77, 1, DALLE3_EMBED_DIM],
    stream: "text",
    sublayers: Array.from(
      { length: NUM_DALLE3_TRANSFORMER_LAYERS },
      (_, i) => ({
        name: `T5 Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [77, 1, DALLE3_EMBED_DIM],
        sublayers: [
          {
            name: "Layer Norm 1",
            type: "layernorm",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Layer Norm 2",
            type: "layernorm",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Cross-Attention",
            type: "cross_attention",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Layer Norm 3",
            type: "layernorm",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [77, 1, DALLE3_EMBED_DIM],
          },
        ],
      })
    ),
  },

  // Prior Network
  {
    name: "Diffusion Prior Network",
    type: "diffusion_prior",
    dimensions: [DALLE3_EMBED_DIM],
    stream: "fusion",
    sublayers: [
      {
        name: "Time Embedding",
        type: "time_embedding",
        dimensions: [1, 1, DALLE3_EMBED_DIM],
      },
      ...Array.from({ length: NUM_PRIOR_TRANSFORMER_LAYERS }, (_, i) => ({
        name: `Prior Transformer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 77, DALLE3_EMBED_DIM],
        sublayers: [
          {
            name: "Layer Norm 1",
            type: "layernorm",
            dimensions: [1, 77, DALLE3_EMBED_DIM],
          },
          {
            name: "Cross-Attention",
            type: "cross_attention",
            dimensions: [1, 77, DALLE3_EMBED_DIM],
          },
          {
            name: "Layer Norm 2",
            type: "layernorm",
            dimensions: [1, 77, DALLE3_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [1, 77, DALLE3_EMBED_DIM],
          },
        ],
      })),
    ],
  },

  // Base Diffusion Model
  {
    name: "Base Diffusion Model",
    type: "base_diffusion",
    dimensions: [256, 256, DALLE3_DIFFUSION_DIM],
    stream: "image",
    sublayers: [
      {
        name: "Base UNet",
        type: "unet",
        sublayers: [
          // Down blocks
          ...Array.from({ length: 4 }, (_, i) => ({
            name: `Down Block ${i + 1}`,
            type: "down_block",
            dimensions: [
              256 / Math.pow(2, i),
              256 / Math.pow(2, i),
              DALLE3_DIFFUSION_DIM * Math.pow(2, i),
            ],
            sublayers: [
              {
                name: `ResNet Block ${i + 1}.1`,
                type: "resnet_block",
                dimensions: [
                  256 / Math.pow(2, i),
                  256 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `Cross-Attention ${i + 1}`,
                type: "cross_attention",
                dimensions: [
                  256 / Math.pow(2, i),
                  256 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `ResNet Block ${i + 1}.2`,
                type: "resnet_block",
                dimensions: [
                  256 / Math.pow(2, i),
                  256 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `Downsample ${i + 1}`,
                type: "conv",
                dimensions: [
                  256 / Math.pow(2, i + 1),
                  256 / Math.pow(2, i + 1),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i + 1),
                ],
              },
            ],
          })),

          // Bottleneck
          {
            name: "Bottleneck",
            type: "bottleneck",
            dimensions: [16, 16, DALLE3_DIFFUSION_DIM * 16],
            sublayers: [
              {
                name: "ResNet Block",
                type: "resnet_block",
                dimensions: [16, 16, DALLE3_DIFFUSION_DIM * 16],
              },
              {
                name: "Cross-Attention",
                type: "cross_attention",
                dimensions: [16, 16, DALLE3_DIFFUSION_DIM * 16],
              },
              {
                name: "ResNet Block 2",
                type: "resnet_block",
                dimensions: [16, 16, DALLE3_DIFFUSION_DIM * 16],
              },
            ],
          },

          // Up blocks
          ...Array.from({ length: 4 }, (_, i) => ({
            name: `Up Block ${4 - i}`,
            type: "up_block",
            dimensions: [
              256 / Math.pow(2, 3 - i),
              256 / Math.pow(2, 3 - i),
              DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
            ],
            sublayers: [
              {
                name: `ResNet Block ${4 - i}.1`,
                type: "resnet_block",
                dimensions: [
                  256 / Math.pow(2, 3 - i),
                  256 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Cross-Attention ${4 - i}`,
                type: "cross_attention",
                dimensions: [
                  256 / Math.pow(2, 3 - i),
                  256 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `ResNet Block ${4 - i}.2`,
                type: "resnet_block",
                dimensions: [
                  256 / Math.pow(2, 3 - i),
                  256 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Upsample ${4 - i}`,
                type: "conv_transpose",
                dimensions: [
                  256 / Math.pow(2, 2 - i),
                  256 / Math.pow(2, 2 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 2 - i),
                ],
              },
            ],
          })),
        ],
      },
    ],
  },

  // Upscaler Diffusion Model (256x256 → 1024x1024)
  {
    name: "Upscaler Diffusion",
    type: "upscaler_diffusion",
    dimensions: [1024, 1024, DALLE3_DIFFUSION_DIM],
    stream: "image",
    sublayers: [
      {
        name: "Upscaler UNet",
        type: "unet",
        sublayers: [
          // Condition Encoding
          {
            name: "Low-Res Condition Encoder",
            type: "condition_encoder",
            dimensions: [256, 256, DALLE3_DIFFUSION_DIM],
            sublayers: [
              {
                name: "Condition Conv",
                type: "conv",
                dimensions: [256, 256, DALLE3_DIFFUSION_DIM],
              },
            ],
          },

          // Down blocks with skip connections
          ...Array.from({ length: 4 }, (_, i) => ({
            name: `Upscaler Down Block ${i + 1}`,
            type: "down_block",
            dimensions: [
              1024 / Math.pow(2, i),
              1024 / Math.pow(2, i),
              DALLE3_DIFFUSION_DIM * Math.pow(2, i),
            ],
            sublayers: [
              {
                name: `ResNet Block ${i + 1}.1`,
                type: "resnet_block",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `Cross-Attention ${i + 1}`,
                type: "cross_attention",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `Condition Cross-Attention ${i + 1}`,
                type: "cross_attention",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `ResNet Block ${i + 1}.2`,
                type: "resnet_block",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `Downsample ${i + 1}`,
                type: "conv",
                dimensions: [
                  1024 / Math.pow(2, i + 1),
                  1024 / Math.pow(2, i + 1),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i + 1),
                ],
              },
            ],
          })),

          // Bottleneck with additional conditioning
          {
            name: "Upscaler Bottleneck",
            type: "bottleneck",
            dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
            sublayers: [
              {
                name: "ResNet Block",
                type: "resnet_block",
                dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
              },
              {
                name: "Global Context Attention",
                type: "attention",
                dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
              },
              {
                name: "Condition Cross-Attention",
                type: "cross_attention",
                dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
              },
            ],
          },

          // Up blocks with skip connections
          ...Array.from({ length: 4 }, (_, i) => ({
            name: `Upscaler Up Block ${4 - i}`,
            type: "up_block",
            dimensions: [
              1024 / Math.pow(2, 3 - i),
              1024 / Math.pow(2, 3 - i),
              DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
            ],
            sublayers: [
              {
                name: `ResNet Block ${4 - i}.1`,
                type: "resnet_block",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Cross-Attention ${4 - i}`,
                type: "cross_attention",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Condition Cross-Attention ${4 - i}`,
                type: "cross_attention",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `ResNet Block ${4 - i}.2`,
                type: "resnet_block",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Upsample ${4 - i}`,
                type: "conv_transpose",
                dimensions: [
                  1024 / Math.pow(2, 2 - i),
                  1024 / Math.pow(2, 2 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 2 - i),
                ],
              },
            ],
          })),
        ],
      },
    ],
  },

  // Refiner Diffusion Model (Final Details at 1024x1024)
  {
    name: "Refiner Diffusion",
    type: "refiner_diffusion",
    dimensions: [1024, 1024, DALLE3_DIFFUSION_DIM],
    stream: "image",
    sublayers: [
      {
        name: "Refiner UNet",
        type: "unet",
        sublayers: [
          // Similar structure to upscaler but with specialized layers for refinement
          // Down blocks
          ...Array.from({ length: 4 }, (_, i) => ({
            name: `Refiner Down Block ${i + 1}`,
            type: "down_block",
            dimensions: [
              1024 / Math.pow(2, i),
              1024 / Math.pow(2, i),
              DALLE3_DIFFUSION_DIM * Math.pow(2, i),
            ],
            sublayers: [
              {
                name: `Detail Enhancement ${i + 1}.1`,
                type: "detail_enhancement",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `ResNet Block ${i + 1}`,
                type: "resnet_block",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
              {
                name: `Fine-Detail Attention ${i + 1}`,
                type: "attention",
                dimensions: [
                  1024 / Math.pow(2, i),
                  1024 / Math.pow(2, i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, i),
                ],
              },
            ],
          })),

          // Specialized refinement bottleneck
          {
            name: "Refinement Bottleneck",
            type: "bottleneck",
            dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
            sublayers: [
              {
                name: "Global Context Processing",
                type: "attention",
                dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
              },
              {
                name: "Detail Enhancement",
                type: "detail_enhancement",
                dimensions: [64, 64, DALLE3_DIFFUSION_DIM * 16],
              },
            ],
          },

          // Up blocks with detail enhancement
          ...Array.from({ length: 4 }, (_, i) => ({
            name: `Refiner Up Block ${4 - i}`,
            type: "up_block",
            dimensions: [
              1024 / Math.pow(2, 3 - i),
              1024 / Math.pow(2, 3 - i),
              DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
            ],
            sublayers: [
              {
                name: `Detail Enhancement ${4 - i}`,
                type: "detail_enhancement",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Fine-Detail Attention ${4 - i}`,
                type: "attention",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
              {
                name: `Quality Enhancement ${4 - i}`,
                type: "quality_enhancement",
                dimensions: [
                  1024 / Math.pow(2, 3 - i),
                  1024 / Math.pow(2, 3 - i),
                  DALLE3_DIFFUSION_DIM * Math.pow(2, 3 - i),
                ],
              },
            ],
          })),
        ],
      },
    ],
  },

  // Final Output
  {
    name: "Generated Image",
    type: "output",
    dimensions: [1024, 1024, 3],
    stream: "image",
  },
];

export const FLAMINGO = [
  // Visual Backbone (Perceiver ResNet)
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Visual Backbone",
    type: "cnn_encoder",
    dimensions: [14, 14, 1024],
    stream: "image",
  },
  {
    name: "Perceiver Resampler",
    type: "perceiver_resampler",
    dimensions: [1, 1, 512],
    stream: "image",
  },

  // Language Model (Pretrained LM like Chinchilla)
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "Token Embeddings",
    type: "embedding",
    dimensions: [1, 77, 512],
    stream: "text",
  },
  {
    name: "Language Model",
    type: "transformer_decoder",
    dimensions: [1, 77, 512],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_LAYERS_FLAMINGO }, (_, i) => ({
        name: `LM Transformer Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 77, 512],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 77, 512],
          },
          {
            name: `Cross-Attention`,
            type: "cross_attention",
            dimensions: [1, 77, 512],
            inputs: ["Perceiver Resampler Output"],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 77, 512] },
        ],
      })),
    ],
  },

  // Output Layer
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [1, 77, "vocab_size"], // Define vocab_size accordingly
    stream: "text",
  },
];

/** BLIP-2 **/
export const BLIP_2 = [
  // Vision Encoder (e.g., ViT or Swin Transformer)
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Vision Encoder",
    type: "vision_transformer",
    dimensions: [1, 197, 768], // For ViT-B/16
    stream: "image",
    sublayers: [
      ...Array.from({ length: NUM_VISION_LAYERS }, (_, i) => ({
        name: `Vision Transformer Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 197, 768],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 197, 768],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 197, 768] },
        ],
      })),
    ],
  },

  // Querying Transformer (Q-Former)
  {
    name: "Q-Former",
    type: "q_former",
    dimensions: [32, 768], // 32 query tokens
    stream: "fusion",
    sublayers: [
      ...Array.from({ length: 6 }, (_, i) => ({
        name: `Q-Former Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [32, 768],
        sublayers: [
          { name: `Self-Attention`, type: "attention", dimensions: [32, 768] },
          {
            name: `Cross-Attention`,
            type: "cross_attention",
            dimensions: [32, 768],
            inputs: ["Vision Encoder Output"],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [32, 768] },
        ],
      })),
    ],
  },

  // Language Model (e.g., OPT or GPT-NeoX)
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "Language Model",
    type: "transformer_decoder",
    dimensions: [1, 77, 2048],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_LAYERS_BLIP2_LM }, (_, i) => ({
        name: `LM Transformer Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 77, 2048],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 77, 2048],
          },
          {
            name: `Cross-Attention`,
            type: "cross_attention",
            dimensions: [1, 77, 2048],
            inputs: ["Q-Former Output"],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 77, 2048] },
        ],
      })),
    ],
  },

  // Output Layer
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [1, 77, "vocab_size"], // Define vocab_size accordingly
    stream: "text",
  },
];

/** LLaVA **/
export const LLAVA = [
  // Vision Stream
  {
    name: "Image Input",
    type: "input",
    dimensions: SDXL_IMAGE_DIM,
    stream: "image",
  },
  {
    name: "CLIP Vision Encoder",
    type: "vision_transformer",
    dimensions: [576, 1, LLAVA_VISION_DIM], // 24x24 patches
    stream: "image",
    sublayers: [
      ...Array.from({ length: NUM_LLAVA_VISION_LAYERS }, (_, i) => ({
        name: `Vision Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [576, 1, LLAVA_VISION_DIM],
        sublayers: [
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [576, 1, LLAVA_VISION_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [576, 1, LLAVA_VISION_DIM],
          },
        ],
      })),
    ],
  },

  // Vision-Language Projector
  {
    name: "Vision-Language Projector",
    type: "projector",
    dimensions: [576, 1, LLAVA_PROJECTOR_DIM],
    stream: "fusion",
    sublayers: [
      {
        name: "Linear Projection",
        type: "mlp",
        dimensions: [576, 1, LLAVA_PROJECTOR_DIM],
      },
      {
        name: "LayerNorm",
        type: "layernorm",
        dimensions: [576, 1, LLAVA_PROJECTOR_DIM],
      },
    ],
  },

  // Language Model Stream
  {
    name: "Text Input",
    type: "input",
    dimensions: [2048, 1, LLAVA_EMBED_DIM],
    stream: "text",
  },
  {
    name: "LLaMA Decoder",
    type: "transformer_decoder",
    dimensions: [2048, 1, LLAVA_EMBED_DIM],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_LLAVA_LLM_LAYERS }, (_, i) => ({
        name: `LLM Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [2048, 1, LLAVA_EMBED_DIM],
        sublayers: [
          {
            name: "RoPE Self-Attention",
            type: "attention",
            dimensions: [2048, 1, LLAVA_EMBED_DIM],
          },
          {
            name: "Cross-Attention",
            type: "cross_attention",
            dimensions: [2048, 576, LLAVA_EMBED_DIM],
          },
          {
            name: "SwiGLU FFN",
            type: "mlp",
            dimensions: [2048, 1, LLAVA_EMBED_DIM],
          },
        ],
      })),
    ],
  },

  // Output Head
  {
    name: "Output Layer",
    type: "output",
    dimensions: [2048, 1, 32000], // Vocabulary size
    stream: "text",
    sublayers: [
      {
        name: "Language Model Head",
        type: "mlp",
        dimensions: [2048, 1, 32000],
      },
    ],
  },
];

/** PaLM-E **/
export const PALM_E = [
  // Vision Encoder (e.g., ViT)
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Vision Encoder",
    type: "vision_transformer",
    dimensions: [1, 197, 768], // For ViT-B/16
    stream: "image",
    sublayers: [
      ...Array.from({ length: NUM_VISION_LAYERS }, (_, i) => ({
        name: `Vision Transformer Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 197, 768],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 197, 768],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 197, 768] },
        ],
      })),
    ],
  },

  // Language Model (PaLM)
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "Language Model",
    type: "transformer_decoder",
    dimensions: [1, 77, 4096],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_LAYERS_PALME_LM }, (_, i) => ({
        name: `PaLM Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 77, 4096],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 77, 4096],
          },
          {
            name: `Cross-Attention`,
            type: "cross_attention",
            dimensions: [1, 77, 4096],
            inputs: ["Vision Encoder Output"],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 77, 4096] },
        ],
      })),
    ],
  },

  // Output Layer
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [1, 77, "vocab_size"], // Define vocab_size accordingly
    stream: "text",
  },
];

/** GPT-4V **/
export const GPT_4V = [
  // Vision Input
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Vision Transformer Encoder",
    type: "vision_transformer",
    dimensions: [1, 257, 1024], // Adjusted for GPT-4V
    stream: "image",
    sublayers: [
      ...Array.from({ length: 24 }, (_, i) => ({
        name: `Vision Transformer Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 257, 1024],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 257, 1024],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 257, 1024] },
        ],
      })),
    ],
  },

  // Language Model (GPT-4)
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
    stream: "text",
  },
  {
    name: "Language Model",
    type: "transformer_decoder",
    dimensions: [1, 77, 16384],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_LAYERS_GPT4V_LM }, (_, i) => ({
        name: `GPT-4 Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 77, 16384],
        sublayers: [
          {
            name: `Self-Attention`,
            type: "attention",
            dimensions: [1, 77, 16384],
          },
          {
            name: `Cross-Attention`,
            type: "cross_attention",
            dimensions: [1, 77, 16384],
            inputs: ["Vision Transformer Output"],
          },
          { name: `Feed Forward`, type: "mlp", dimensions: [1, 77, 16384] },
        ],
      })),
    ],
  },

  // Output Layer
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [1, 77, "vocab_size"], // Define vocab_size accordingly
    stream: "text",
  },
];

/** FLORENCE **/
export const FLORENCE = [
  // Vision Stream
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Vision Encoder",
    type: "vision_transformer",
    dimensions: [1, 197, FLORENCE_EMBED_DIM],
    stream: "image",
    sublayers: [
      ...Array.from({ length: NUM_FLORENCE_VISION_LAYERS }, (_, i) => ({
        name: `Vision Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [1, 197, FLORENCE_EMBED_DIM],
        sublayers: [
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [1, 197, FLORENCE_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [1, 197, FLORENCE_EMBED_DIM],
          },
        ],
      })),
    ],
  },
  // Text Stream
  {
    name: "Text Input",
    type: "input",
    dimensions: [77, 1, FLORENCE_EMBED_DIM],
    stream: "text",
  },
  {
    name: "Text Encoder",
    type: "text_encoder",
    dimensions: [77, 1, FLORENCE_EMBED_DIM],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_FLORENCE_TEXT_LAYERS }, (_, i) => ({
        name: `Text Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [77, 1, FLORENCE_EMBED_DIM],
        sublayers: [
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [77, 1, FLORENCE_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [77, 1, FLORENCE_EMBED_DIM],
          },
        ],
      })),
    ],
  },
  // Fusion/Contrastive Learning
  {
    name: "Contrastive Head",
    type: "contrastive",
    dimensions: [1, 1, FLORENCE_EMBED_DIM],
    stream: "fusion",
    sublayers: [
      {
        name: "Image Projection",
        type: "mlp",
        dimensions: [1, 1, FLORENCE_EMBED_DIM],
      },
      {
        name: "Text Projection",
        type: "mlp",
        dimensions: [1, 1, FLORENCE_EMBED_DIM],
      },
      {
        name: "Temperature Parameter",
        type: "learnable_temp",
        dimensions: [1, 1, 1],
      },
    ],
  },
];

/** COGVLM **/
export const COGVLM = [
  // Vision Stream
  {
    name: "Image Input",
    type: "input",
    dimensions: SDXL_IMAGE_DIM,
    stream: "image",
  },
  {
    name: "Vision Encoder",
    type: "vision_transformer",
    dimensions: [196, 1, COGVLM_VISION_DIM],
    stream: "image",
    sublayers: [
      ...Array.from({ length: NUM_COGVLM_VISION_LAYERS }, (_, i) => ({
        name: `Vision Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [196, 1, COGVLM_VISION_DIM],
        sublayers: [
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [196, 1, COGVLM_VISION_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [196, 1, COGVLM_VISION_DIM],
          },
        ],
      })),
    ],
  },

  // Text Stream
  {
    name: "Text Input",
    type: "input",
    dimensions: [2048, 1, COGVLM_EMBED_DIM], // Longer sequence length
    stream: "text",
  },
  {
    name: "Language Model",
    type: "transformer_decoder",
    dimensions: [2048, 1, COGVLM_EMBED_DIM],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_COGVLM_LLM_LAYERS }, (_, i) => ({
        name: `LLM Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [2048, 1, COGVLM_EMBED_DIM],
        sublayers: [
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [2048, 1, COGVLM_EMBED_DIM],
          },
          {
            name: "Cross-Attention",
            type: "cross_attention",
            dimensions: [2048, 196, COGVLM_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [2048, 1, COGVLM_EMBED_DIM],
          },
        ],
      })),
    ],
  },

  // Fusion/Output
  {
    name: "Output Projection",
    type: "fusion",
    dimensions: [2048, 1, COGVLM_EMBED_DIM],
    stream: "fusion",
    sublayers: [
      {
        name: "Vision-Language Fusion",
        type: "cross_attention",
        dimensions: [2048, 196, COGVLM_EMBED_DIM],
      },
      {
        name: "Output Layer",
        type: "mlp",
        dimensions: [2048, 1, 32000], // Vocabulary size
      },
    ],
  },
];

/** CLAUDE_3_VISION **/
export const CLAUDE_3_VISION = [
  // Vision Stream with Hierarchical Processing
  {
    name: "Image Input",
    type: "input",
    dimensions: [1024, 1024, 3],
    stream: "image",
  },
  {
    name: "Hierarchical Vision Encoder",
    type: "hierarchical_vit",
    dimensions: [256, 1, CLAUDE_3_VISION_DIM],
    stream: "image",
    sublayers: [
      {
        name: "Patch Embedding",
        type: "patch_embed",
        dimensions: [256, 1, CLAUDE_3_VISION_DIM],
      },
      ...Array.from({ length: 4 }, (_, stage) => ({
        name: `Vision Stage ${stage + 1}`,
        type: "vision_stage",
        dimensions: [256 >> stage, 1, CLAUDE_3_VISION_DIM << stage],
        sublayers: Array.from(
          { length: NUM_CLAUDE_3_VISION_LAYERS / 4 },
          (_, i) => ({
            name: `Vision Block ${stage}_${i + 1}`,
            type: "transformer_layer",
            dimensions: [256 >> stage, 1, CLAUDE_3_VISION_DIM << stage],
            sublayers: [
              {
                name: "Window Attention",
                type: "window_attention",
                dimensions: [256 >> stage, 1, CLAUDE_3_VISION_DIM << stage],
              },
              {
                name: "MoE FFN",
                type: "moe_ffn",
                dimensions: [256 >> stage, 1, CLAUDE_3_VISION_DIM << stage],
              },
            ],
          })
        ),
      })),
    ],
  },

  // Language Model Stream with MoE
  {
    name: "Text Input",
    type: "input",
    dimensions: [4096, 1, CLAUDE3_EMBED_DIM], // Extra long context
    stream: "text",
  },
  {
    name: "Claude 3 LLM",
    type: "moe_transformer",
    dimensions: [4096, 1, CLAUDE3_EMBED_DIM],
    stream: "text",
    sublayers: [
      ...Array.from({ length: NUM_CLAUDE3_LLM_LAYERS }, (_, i) => ({
        name: `LLM Layer ${i + 1}`,
        type: "moe_layer",
        dimensions: [4096, 1, CLAUDE3_EMBED_DIM],
        sublayers: [
          {
            name: "Multi-Query Attention",
            type: "mq_attention",
            dimensions: [4096, 1, CLAUDE3_EMBED_DIM],
          },
          {
            name: "Hierarchical Expert FFN",
            type: "hierarchical_moe",
            dimensions: [4096, 1, CLAUDE3_EMBED_DIM * 4],
            experts: NUM_CLAUDE3_EXPERTS,
          },
          {
            name: "Multi-Modal Gating",
            type: "modal_gate",
            dimensions: [4096, 384, CLAUDE3_EMBED_DIM],
          },
        ],
      })),
    ],
  },

  // Advanced Fusion System
  {
    name: "Pathways Router",
    type: "pathways_router",
    dimensions: [4096, 1, CLAUDE3_EMBED_DIM],
    stream: "fusion",
    sublayers: [
      {
        name: "Task-Specific Routing",
        type: "task_router",
        dimensions: [NUM_CLAUDE3_EXPERTS, CLAUDE3_EMBED_DIM],
      },
      {
        name: "Multi-Modal Pathways",
        type: "modal_pathways",
        dimensions: [4096, 1, CLAUDE3_EMBED_DIM],
        sublayers: [
          {
            name: "Cross-Modal Experts",
            type: "cross_modal_experts",
            dimensions: [NUM_CLAUDE3_EXPERTS, CLAUDE3_EMBED_DIM],
          },
          {
            name: "Pathway Integration",
            type: "pathway_integration",
            dimensions: [4096, 1, CLAUDE3_EMBED_DIM],
          },
        ],
      },
    ],
  },
];

export const GEMINI_VISION = [
  // Multi-Scale Vision Stream
  {
    name: "Image Input",
    type: "input",
    dimensions: [1536, 1536, 3], // Higher resolution input
    stream: "image",
  },
  {
    name: "Multi-Scale Vision Processor",
    type: "multiscale_vision",
    dimensions: [384, 1, GEMINI_VISION_DIM],
    stream: "image",
    sublayers: Array.from({ length: NUM_VISUAL_SCALES }, (_, scale) => ({
      name: `Vision Scale ${scale + 1}`,
      type: "vision_scale",
      dimensions: [384 >> scale, 1, GEMINI_VISION_DIM << scale],
      sublayers: [
        {
          name: `Vision Encoder ${scale + 1}`,
          type: "vision_encoder",
          dimensions: [384 >> scale, 1, GEMINI_VISION_DIM << scale],
          sublayers: Array.from(
            { length: NUM_GEMINI_VISION_LAYERS / 4 },
            (_, i) => ({
              name: `Vision Block ${scale}_${i + 1}`,
              type: "transformer_layer",
              dimensions: [384 >> scale, 1, GEMINI_VISION_DIM << scale],
              sublayers: [
                {
                  name: "Global-Local Attention",
                  type: "global_local_attention",
                  dimensions: [384 >> scale, 1, GEMINI_VISION_DIM << scale],
                },
                {
                  name: "Scale-Specific MoE",
                  type: "scale_moe",
                  dimensions: [384 >> scale, 1, GEMINI_VISION_DIM << scale],
                },
              ],
            })
          ),
        },
      ],
    })),
  },

  // Language Model Stream with MoE
  {
    name: "Text Input",
    type: "input",
    dimensions: [8192, 1, GEMINI_EMBED_DIM], // Extra long context
    stream: "text",
  },
  {
    name: "Gemini LLM",
    type: "gemini_transformer",
    dimensions: [8192, 1, GEMINI_EMBED_DIM],
    stream: "text",
    sublayers: Array.from({ length: NUM_GEMINI_LLM_LAYERS }, (_, i) => ({
      name: `LLM Layer ${i + 1}`,
      type: "gemini_layer",
      dimensions: [8192, 1, GEMINI_EMBED_DIM],
      sublayers: [
        {
          name: "Multi-Query Attention",
          type: "mq_attention",
          dimensions: [8192, 1, GEMINI_EMBED_DIM],
        },
        {
          name: "Hierarchical MoE",
          type: "hierarchical_moe",
          dimensions: [8192, 1, GEMINI_EMBED_DIM * 4],
          experts: NUM_GEMINI_EXPERTS,
        },
        {
          name: "Modal Gate",
          type: "modal_gate",
          dimensions: [8192, 384, GEMINI_EMBED_DIM],
        },
      ],
    })),
  },

  // Advanced Fusion System
  {
    name: "Multi-Modal Router",
    type: "pathways_router",
    dimensions: [8192, 1, GEMINI_EMBED_DIM],
    stream: "fusion",
    sublayers: [
      {
        name: "Task Router",
        type: "task_router",
        dimensions: [NUM_GEMINI_EXPERTS, GEMINI_EMBED_DIM],
      },
      {
        name: "Modal Pathways",
        type: "modal_pathways",
        dimensions: [8192, 1, GEMINI_EMBED_DIM],
        sublayers: [
          {
            name: "Cross-Modal Experts",
            type: "cross_modal_experts",
            dimensions: [NUM_GEMINI_EXPERTS, GEMINI_EMBED_DIM],
          },
          {
            name: "Pathway Integration",
            type: "pathway_integration",
            dimensions: [8192, 1, GEMINI_EMBED_DIM],
          },
        ],
      },
    ],
  },
];

// Add Whisper-specific constants
const NUM_WHISPER_ENCODER_LAYERS = 6;
const NUM_WHISPER_DECODER_LAYERS = 6;
const WHISPER_EMBED_DIM = 512;
const WHISPER_AUDIO_DIM = 1500; // For 30-second context
const WHISPER_MEL_BINS = 80;

export const WHISPER = [
  // Audio Encoder Stream
  {
    name: "Audio Input",
    type: "input",
    dimensions: [WHISPER_AUDIO_DIM, WHISPER_MEL_BINS], // Mel spectrogram
    stream: "audio",
  },
  {
    name: "Audio Encoder",
    type: "audio_encoder",
    dimensions: [WHISPER_AUDIO_DIM, 1, WHISPER_EMBED_DIM],
    stream: "audio",
    sublayers: [
      {
        name: "Convolution Patches",
        type: "conv_patches",
        dimensions: [WHISPER_AUDIO_DIM / 2, 1, WHISPER_EMBED_DIM],
      },
      ...Array.from({ length: NUM_WHISPER_ENCODER_LAYERS }, (_, i) => ({
        name: `Encoder Layer ${i + 1}`,
        type: "transformer_layer",
        dimensions: [WHISPER_AUDIO_DIM / 2, 1, WHISPER_EMBED_DIM],
        sublayers: [
          {
            name: "Self-Attention",
            type: "attention",
            dimensions: [WHISPER_AUDIO_DIM / 2, 1, WHISPER_EMBED_DIM],
          },
          {
            name: "Feed Forward",
            type: "mlp",
            dimensions: [WHISPER_AUDIO_DIM / 2, 1, WHISPER_EMBED_DIM],
          },
        ],
      })),
    ],
  },

  // Text Decoder Stream
  {
    name: "Text Input",
    type: "input",
    dimensions: [256, 1, WHISPER_EMBED_DIM], // Token sequence
    stream: "text",
  },
  {
    name: "Text Decoder",
    type: "transformer_decoder",
    dimensions: [256, 1, WHISPER_EMBED_DIM],
    stream: "text",
    sublayers: Array.from({ length: NUM_WHISPER_DECODER_LAYERS }, (_, i) => ({
      name: `Decoder Layer ${i + 1}`,
      type: "transformer_layer",
      dimensions: [256, 1, WHISPER_EMBED_DIM],
      sublayers: [
        {
          name: "Self-Attention",
          type: "attention",
          dimensions: [256, 1, WHISPER_EMBED_DIM],
        },
        {
          name: "Cross-Attention",
          type: "cross_attention",
          dimensions: [256, 1, WHISPER_EMBED_DIM],
          inputs: ["Audio Encoder Output"],
        },
        {
          name: "Feed Forward",
          type: "mlp",
          dimensions: [256, 1, WHISPER_EMBED_DIM],
        },
      ],
    })),
  },

  // Output Layer
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [256, 1, 51865], // Whisper multilingual vocabulary size
    stream: "text",
  },
];

// Add AudioCraft specific constants
const NUM_AUDIOCRAFT_ENCODER_LAYERS = 12;
const NUM_AUDIOCRAFT_DECODER_LAYERS = 12;
const NUM_AUDIOCRAFT_LM_LAYERS = 24;
const AUDIOCRAFT_EMBED_DIM = 1024;
const AUDIOCRAFT_CODEBOOK_SIZE = 2048;
const AUDIOCRAFT_RVQ_LEVELS = 4;

export const AUDIOCRAFT = [
  // Audio Encoder (EnCodec)
  {
    name: "Audio Input",
    type: "input",
    dimensions: [32000, 1, 1], // 1 second of audio at 32kHz
    stream: "audio",
  },
  {
    name: "EnCodec Encoder",
    type: "encodec_encoder",
    dimensions: [2048, 1, AUDIOCRAFT_EMBED_DIM],
    stream: "audio",
    sublayers: [
      {
        name: "Multi-Scale Encoder",
        type: "multiscale_conv",
        dimensions: [2048, 1, AUDIOCRAFT_EMBED_DIM],
        sublayers: Array.from(
          { length: NUM_AUDIOCRAFT_ENCODER_LAYERS },
          (_, i) => ({
            name: `Encoder Block ${i + 1}`,
            type: "conv_block",
            dimensions: [2048 >> i, 1, AUDIOCRAFT_EMBED_DIM],
          })
        ),
      },
      {
        name: "RVQ Quantizer",
        type: "residual_quantizer",
        dimensions: [AUDIOCRAFT_CODEBOOK_SIZE, AUDIOCRAFT_RVQ_LEVELS],
        sublayers: Array.from({ length: AUDIOCRAFT_RVQ_LEVELS }, (_, i) => ({
          name: `Quantizer Level ${i + 1}`,
          type: "vector_quantizer",
          dimensions: [AUDIOCRAFT_CODEBOOK_SIZE, 1],
        })),
      },
    ],
  },

  // Language Model for Audio Generation
  {
    name: "Audio LM",
    type: "transformer_decoder",
    dimensions: [2048, 1, AUDIOCRAFT_EMBED_DIM],
    stream: "generation",
    sublayers: Array.from({ length: NUM_AUDIOCRAFT_LM_LAYERS }, (_, i) => ({
      name: `LM Layer ${i + 1}`,
      type: "transformer_layer",
      dimensions: [2048, 1, AUDIOCRAFT_EMBED_DIM],
      sublayers: [
        {
          name: "Causal Self-Attention",
          type: "causal_attention",
          dimensions: [2048, 1, AUDIOCRAFT_EMBED_DIM],
        },
        {
          name: "Feed Forward",
          type: "mlp",
          dimensions: [2048, 1, AUDIOCRAFT_EMBED_DIM * 4],
        },
      ],
    })),
  },

  // Audio Decoder (EnCodec)
  {
    name: "EnCodec Decoder",
    type: "encodec_decoder",
    dimensions: [32000, 1, 1],
    stream: "audio",
    sublayers: [
      {
        name: "Multi-Scale Decoder",
        type: "multiscale_deconv",
        dimensions: [32000, 1, 1],
        sublayers: Array.from(
          { length: NUM_AUDIOCRAFT_DECODER_LAYERS },
          (_, i) => ({
            name: `Decoder Block ${i + 1}`,
            type: "deconv_block",
            dimensions: [
              32000 >> (NUM_AUDIOCRAFT_DECODER_LAYERS - i - 1),
              1,
              AUDIOCRAFT_EMBED_DIM >> i,
            ],
          })
        ),
      },
    ],
  },
];

// Grid configurations for multi_modal models
export const GRID_CONFIGS = {
  SHOW_AND_TELL: {
    input: { xCount: 96, yCount: 96, xInterval: 1.5, yInterval: 1.5 },
    cnn_encoder: { xCount: 7, yCount: 7, xInterval: 2, yInterval: 2 },
    rnn_decoder: { xCount: 30, yCount: 1, xInterval: 1, yInterval: 1 },
    output: { xCount: 512, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },
  VISUAL_QUESTION_ANSWERING_VQA: {
    input: { xCount: 96, yCount: 96, xInterval: 1.5, yInterval: 1.5 },
    cnn_encoder: { xCount: 7, yCount: 7, xInterval: 2, yInterval: 2 },
    text_encoder: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    fusion: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    dense: { xCount: 1000, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    output: { xCount: 1000, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },
  CLIP: {
    input: { xCount: 96, yCount: 96, xInterval: 1.5, yInterval: 1.5 },
    embedding: { xCount: 14, yCount: 14, xInterval: 2, yInterval: 2 },
    vision_transformer: { xCount: 12, yCount: 1, xInterval: 25, yInterval: 2 },
    text_transformer: { xCount: 12, yCount: 1, xInterval: 20, yInterval: 2 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 15, yInterval: 10 },
    attention: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 15 },
    ffn: { xCount: 24, yCount: 4, xInterval: 6, yInterval: 6 },
    dense: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    loss: { xCount: 5, yCount: 5, xInterval: 4, yInterval: 4 },
  },
  DALL_E: {
    input: { xCount: 77, yCount: 1, xInterval: 1, yInterval: 1 },
    embedding: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 12, yCount: 12, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    layernorm: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    concat: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 512, yCount: 1, xInterval: 0.1, yInterval: 0.1 },
    output: { xCount: 32, yCount: 32, xInterval: 1, yInterval: 1 },
  },
  DALL_E_2: {
    input: { xCount: 77, yCount: 1, xInterval: 1, yInterval: 1 },
    layernorm: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },

    clip_text_encoder: {
      xCount: NUM_TEXT_TRANSFORMER_LAYERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    diffusion_prior: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    transformer_layer: {
      xCount: NUM_PRIOR_TRANSFORMER_LAYERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    attention: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    mlp: { xCount: 380, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 380, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    decoder_diffusion: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    unet: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    resnet_block: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
    cross_attention: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
    time_embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    output: { xCount: 48, yCount: 48, xInterval: 1, yInterval: 1 },
  },

  FLAMINGO: {
    input: { xCount: 48, yCount: 48, xInterval: 1, yInterval: 1 },
    cnn_encoder: { xCount: 14, yCount: 14, xInterval: 2, yInterval: 2 },
    perceiver_resampler: {
      xCount: 128,
      yCount: 1,
      xInterval: 3,
      yInterval: 3,
    },
    transformer_decoder: {
      xCount: 12,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 128, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  BLIP_2: {
    input: { xCount: 20, yCount: 20, xInterval: 2, yInterval: 2 },
    vision_transformer: {
      xCount: NUM_VISION_LAYERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    q_former: { xCount: 6, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_decoder: {
      xCount: NUM_LAYERS_BLIP2_LM,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    cross_attention: { xCount: 4, yCount: 4, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 100, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  LLAVA: {
    input: { xCount: 32, yCount: 16, xInterval: 1, yInterval: 1 },
    vision_transformer: { xCount: 32, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 16, yCount: 16, xInterval: 1, yInterval: 1 },
    cross_attention: { xCount: 16, yCount: 4, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 32, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    projector: { xCount: 16, yCount: 4, xInterval: 2, yInterval: 2 },
    transformer_decoder: { xCount: 32, yCount: 1, xInterval: 2, yInterval: 2 },
    layernorm: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    output: { xCount: 32, yCount: 1, xInterval: 1, yInterval: 1 },
  },

  PALM_E: {
    input: { xCount: 48, yCount: 48, xInterval: 1, yInterval: 1 },
    vision_transformer: {
      xCount: NUM_VISION_LAYERS,
      yCount: 1,
      xInterval: 10,
      yInterval: 2,
    },
    transformer_decoder: {
      xCount: 24,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 256, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  GPT_4V: {
    input: { xCount: 20, yCount: 20, xInterval: 1, yInterval: 1 },
    vision_transformer: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_decoder: {
      xCount: NUM_LAYERS_GPT4V_LM * 0.5,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    cross_attention: { xCount: 12, yCount: 12, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 64, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  FLORENCE: {
    input: { xCount: 20, yCount: 20, xInterval: 1, yInterval: 1 },
    vision_transformer: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    text_encoder: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_layer: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 128, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    contrastive: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    learnable_temp: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },

  DALL_E_3: {
    // Text Input and Encoders
    input: { xCount: 38, yCount: 1, xInterval: 1, yInterval: 1 },

    // CLIP Text Encoder
    clip_text_encoder: { xCount: 12, yCount: 1, xInterval: 2.5, yInterval: 2 },

    // T5 Text Encoder
    t5_encoder: { xCount: 12, yCount: 1, xInterval: 2.5, yInterval: 2 },

    // Common transformer components
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 8, yCount: 8, xInterval: 1.5, yInterval: 1.5 },
    mlp: { xCount: 64, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    layernorm: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },

    // Prior Network
    diffusion_prior: { xCount: 12, yCount: 12, xInterval: 2.5, yInterval: 2.5 },
    prior_transformer: { xCount: 12, yCount: 1, xInterval: 2.5, yInterval: 2 },

    // Base Diffusion (64x64 → 256x256)
    base_diffusion: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 3 },

    // Upscaler (256x256 → 1024x1024)
    upscaler_diffusion: { xCount: 16, yCount: 8, xInterval: 3, yInterval: 3 },
    condition_encoder: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },

    // Refiner (1024x1024 detail enhancement)
    refiner_diffusion: { xCount: 16, yCount: 8, xInterval: 3, yInterval: 3 },
    detail_enhancement: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },

    // Common diffusion components
    unet: { xCount: 12, yCount: 12, xInterval: 4, yInterval: 4 },
    resnet_block: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
    cross_attention: { xCount: 12, yCount: 8, xInterval: 2, yInterval: 2 },
    time_embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },

    // Output
    output: { xCount: 64, yCount: 4, xInterval: 0.1, yInterval: 0.1 },
  },
  COGVLM: {
    input: { xCount: 64, yCount: 16, xInterval: 1, yInterval: 1 },
    vision_transformer: { xCount: 32, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_decoder: { xCount: 40, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 16, yCount: 4, xInterval: 1, yInterval: 1 },
    cross_attention: { xCount: 16, yCount: 4, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 128, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    fusion: { xCount: 16, yCount: 4, xInterval: 2, yInterval: 2 },
  },
  CLAUDE_3_VISION: {
    input: { xCount: 32, yCount: 16, xInterval: 1, yInterval: 1 },
    hierarchical_vit: { xCount: 48, yCount: 1, xInterval: 3, yInterval: 3 },
    vision_stage: { xCount: 12, yCount: 3, xInterval: 2, yInterval: 2 },
    window_attention: {
      xCount: 16,
      yCount: 4,
      xInterval: 1.5,
      yInterval: 1.5,
    },
    moe_ffn: {
      xCount: 8,
      yCount: NUM_CLAUDE3_EXPERTS,
      xInterval: 2,
      yInterval: 2,
    },
    moe_transformer: { xCount: 32, yCount: 1, xInterval: 2.5, yInterval: 2.5 },
    moe_layer: { xCount: 16, yCount: 1, xInterval: 2, yInterval: 2 },
    rotary_attention: { xCount: 24, yCount: 8, xInterval: 1, yInterval: 1 },
    expert_ffn: {
      xCount: 8,
      yCount: NUM_CLAUDE3_EXPERTS,
      xInterval: 2,
      yInterval: 2,
    },
    cross_modal_moe: { xCount: 16, yCount: 4, xInterval: 1.5, yInterval: 1.5 },
    modal_router: {
      xCount: 16,
      yCount: NUM_CLAUDE3_EXPERTS,
      xInterval: 2,
      yInterval: 2.5,
    },
    task_router: {
      xCount: NUM_CLAUDE3_EXPERTS,
      yCount: 6,
      xInterval: 2,
      yInterval: 2,
    },
    modal_pathways: { xCount: 16, yCount: 16, xInterval: 1.5, yInterval: 1.5 },
    cross_modal_experts: {
      xCount: NUM_CLAUDE3_EXPERTS,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    pathway_integration: { xCount: 16, yCount: 16, xInterval: 1, yInterval: 1 },
  },
  GEMINI_VISION: {
    input: { xCount: 64, yCount: 16, xInterval: 1, yInterval: 1 },
    multiscale_vision: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 3 },
    vision_scale: { xCount: 14, yCount: 7, xInterval: 2, yInterval: 2 },
    vision_encoder: { xCount: 16, yCount: 8, xInterval: 2, yInterval: 2 },

    // Attention mechanisms
    global_local_attention: {
      xCount: 16,
      yCount: 8,
      xInterval: 1.5,
      yInterval: 1.5,
    },
    mq_attention: { xCount: 16, yCount: 8, xInterval: 1, yInterval: 1 },

    // Expert layers - adjusted for visibility
    scale_moe: {
      xCount: 8,
      yCount: NUM_GEMINI_EXPERTS,
      xInterval: 3, // Increased spacing
      yInterval: 3, // Increased spacing
    },
    hierarchical_moe: {
      xCount: 8,
      yCount: NUM_GEMINI_EXPERTS,
      xInterval: 3, // Increased spacing
      yInterval: 3, // Increased spacing
    },

    // Transformer and processing layers
    scale_fusion: { xCount: 16, yCount: 8, xInterval: 1.5, yInterval: 1.5 },
    gemini_transformer: { xCount: 40, yCount: 1, xInterval: 2, yInterval: 2 }, // Reduced count
    gemini_layer: { xCount: 16, yCount: 1, xInterval: 2, yInterval: 2 },

    // Routing and pathway layers - adjusted for clarity
    modal_gate: { xCount: 12, yCount: 6, xInterval: 2, yInterval: 2 },
    pathways_router: {
      xCount: 12,
      yCount: NUM_GEMINI_EXPERTS,
      xInterval: 3, // Increased spacing
      yInterval: 3, // Increased spacing
    },
    task_router: {
      xCount: NUM_GEMINI_EXPERTS,
      yCount: 4,
      xInterval: 3, // Increased spacing
      yInterval: 3, // Increased spacing
    },

    // Integration layers
    modal_pathways: { xCount: 16, yCount: 8, xInterval: 1.5, yInterval: 1.5 },
    cross_modal_experts: {
      xCount: NUM_GEMINI_EXPERTS,
      yCount: 6,
      xInterval: 3, // Increased spacing
      yInterval: 3, // Increased spacing
    },
    pathway_integration: {
      xCount: 16,
      yCount: 8,
      xInterval: 1.5,
      yInterval: 1.5,
    },
  },
  WHISPER: {
    input: { xCount: 80, yCount: 16, xInterval: 1, yInterval: 1 },
    audio_encoder: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    conv_patches: { xCount: 16, yCount: 8, xInterval: 1.5, yInterval: 1.5 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 256, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    transformer_decoder: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    dense: { xCount: 256, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },
  AUDIOCRAFT: {
    input: { xCount: 64, yCount: 8, xInterval: 1, yInterval: 1 },
    encodec_encoder: { xCount: 32, yCount: 1, xInterval: 2, yInterval: 2 },
    multiscale_conv: { xCount: 24, yCount: 8, xInterval: 1.5, yInterval: 1.5 },
    conv_block: { xCount: 16, yCount: 4, xInterval: 1, yInterval: 1 },
    residual_quantizer: {
      xCount: AUDIOCRAFT_RVQ_LEVELS,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    vector_quantizer: { xCount: 16, yCount: 4, xInterval: 1.5, yInterval: 1.5 },
    transformer_decoder: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    causal_attention: { xCount: 16, yCount: 16, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 256, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    encodec_decoder: { xCount: 32, yCount: 1, xInterval: 2, yInterval: 2 },
    multiscale_deconv: {
      xCount: 24,
      yCount: 8,
      xInterval: 1.5,
      yInterval: 1.5,
    },
    deconv_block: { xCount: 16, yCount: 4, xInterval: 1, yInterval: 1 },
  },
};

// Layer configurations for multi_modal models
export const LAYER_CONFIGS = {
  SHOW_AND_TELL: {
    layerHeight: 10,
    type: "multi_modal",
  },
  VISUAL_QUESTION_ANSWERING_VQA: {
    layerHeight: 10,
    type: "multi_modal",
  },
  CLIP: {
    layerHeight: 15,
    keyPrefix: "clip",
    type: "multi_modal",
  },
  DALL_E: {
    layerHeight: 400,
    keyPrefix: "dalle",
    type: "multi_modal",
  },
  DALL_E_2: {
    layerHeight: 10,
    keyPrefix: "dalle2",
    type: "multi_modal",
  },
  FLAMINGO: {
    layerHeight: 100,
    keyPrefix: "flamingo",
    type: "multi_modal",
  },
  BLIP_2: {
    layerHeight: 10,
    keyPrefix: "blip2",
    type: "multi_modal",
  },
  LLAVA: {
    layerHeight: 0,
    keyPrefix: "llava",
    type: "multi_modal",
  },
  PALM_E: {
    layerHeight: 10,
    keyPrefix: "palme",
    type: "multi_modal",
  },
  GPT_4V: {
    layerHeight: 150,
    keyPrefix: "gpt4v",
    type: "multi_modal",
  },
  FLORENCE: {
    layerHeight: 20,
    keyPrefix: "florence",
    type: "multi_modal",
  },
  DALL_E_3: {
    layerHeight: 120,
    keyPrefix: "dalle3",
    type: "multi_modal",
  },
  COGVLM: {
    layerHeight: 120,
    keyPrefix: "cogvlm",
    type: "multi_modal",
  },
  CLAUDE_3_VISION: {
    layerHeight: 1000, // Increased height for better visualization
    keyPrefix: "claude3v",
    type: "multi_modal",
  },
  GEMINI_VISION: {
    layerHeight: 1000, // Even larger for complex visualization
    keyPrefix: "geminiv",
    type: "multi_modal",
  },
  WHISPER: {
    layerHeight: 100,
    keyPrefix: "whisper",
    type: "multi_modal",
  },
  AUDIOCRAFT: {
    layerHeight: 10,
    keyPrefix: "audiocraft",
    type: "multi_modal",
  },
};
