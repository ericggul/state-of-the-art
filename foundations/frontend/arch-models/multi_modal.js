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

// Constants for multi-modal models
const NUM_LAYERS_FLAMINGO = 24;
const NUM_LAYERS_BLIP2_LM = 24;
const NUM_LAYERS_LLAVA_LM = 32;
const NUM_LAYERS_PALME_LM = 64;
const NUM_LAYERS_GPT4V_LM = 96;
const NUM_VISION_LAYERS = 12;

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

/** FLAMINGO **/
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
  // Vision Encoder (CLIP ViT-L/14)
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "CLIP Vision Encoder",
    type: "vision_transformer",
    dimensions: [1, 257, 1024], // 256 patches + 1 CLS token
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

  // Projection Layer
  {
    name: "Projection Layer",
    type: "dense",
    dimensions: [1, 257, 4096], // Match LLaMA dimension
    stream: "fusion",
  },

  // Language Model (e.g., LLaMA)
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
      ...Array.from({ length: NUM_LAYERS_LLAVA_LM }, (_, i) => ({
        name: `LM Transformer Layer ${i + 1}`,
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
            inputs: ["Projection Layer Output"],
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

// Layer configurations for multi_modal models
export const LAYER_CONFIGS = {
  SHOW_AND_TELL: {
    layerHeight: 10,
    type: "multi_modal",
  },
  VISUAL_QUESTION_ANSWERING_VQA: {
    layerHeight: 80,
    type: "multi_modal",
  },
  CLIP: {
    layerHeight: 15,
    keyPrefix: "clip",
    type: "multi_modal",
  },
  DALL_E: {
    layerHeight: 300,
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
    layerHeight: 300,
    keyPrefix: "blip2",
    type: "multi_modal",
  },
  LLAVA: {
    layerHeight: 180,
    keyPrefix: "llava",
    type: "multi_modal",
  },
  PALM_E: {
    layerHeight: 150,
    keyPrefix: "palme",
    type: "multi_modal",
  },
  GPT_4V: {
    layerHeight: 150,
    keyPrefix: "gpt4v",
    type: "multi_modal",
  },
};

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
    mlp: { xCount: 768, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 768, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    decoder_diffusion: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    unet: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    resnet_block: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
    cross_attention: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
    time_embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    conv: { xCount: 3, yCount: 1, xInterval: 1, yInterval: 1 },
    output: { xCount: 96, yCount: 96, xInterval: 1, yInterval: 1 },
  },

  FLAMINGO: {
    input: { xCount: 96, yCount: 96, xInterval: 1, yInterval: 1 },
    cnn_encoder: { xCount: 14, yCount: 14, xInterval: 2, yInterval: 2 },
    perceiver_resampler: {
      xCount: 512,
      yCount: 1,
      xInterval: 3,
      yInterval: 3,
    },
    transformer_decoder: {
      xCount: NUM_LAYERS_FLAMINGO,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  BLIP_2: {
    input: { xCount: 40, yCount: 40, xInterval: 2, yInterval: 2 },
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
    mlp: { xCount: 768, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  LLAVA: {
    input: { xCount: 40, yCount: 40, xInterval: 1, yInterval: 1 },
    vision_transformer: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_decoder: {
      xCount: NUM_LAYERS_LLAVA_LM,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    cross_attention: { xCount: 4, yCount: 4, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },

  PALM_E: {
    input: { xCount: 48, yCount: 48, xInterval: 1, yInterval: 1 },
    vision_transformer: {
      xCount: NUM_VISION_LAYERS,
      yCount: 1,
      xInterval: 4,
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
    input: { xCount: 40, yCount: 40, xInterval: 1, yInterval: 1 },
    vision_transformer: { xCount: 24, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_decoder: {
      xCount: NUM_LAYERS_GPT4V_LM * 0.5,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    cross_attention: { xCount: 12, yCount: 12, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 256, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },
};
