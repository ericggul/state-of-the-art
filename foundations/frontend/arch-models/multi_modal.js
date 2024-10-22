//multi-modal here // Constants for multimodal models
const IMAGE_INPUT_DIM = [224, 224, 3]; // Typical image input dimensions
const TEXT_INPUT_DIM = [77]; // Tokenized text length
const VISUAL_EMBED_DIM = [1, 1, 512];
const TEXT_EMBED_DIM = [1, 1, 512];
const NUM_VIT_LAYERS = 12; // For ViT-B/32
const NUM_TEXT_TRANSFORMER_LAYERS = 12;

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

export const VQA = [
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
  // Image Encoder Path
  {
    name: "Image Input",
    type: "input",
    dimensions: IMAGE_INPUT_DIM,
    stream: "image",
  },
  {
    name: "Patch Embedding",
    type: "patch_embedding",
    dimensions: [1, 49, 768],
    stream: "image",
  },
  ...Array.from({ length: NUM_VIT_LAYERS }, (_, i) => ({
    name: `Visual Transformer Layer ${i + 1}`,
    type: "transformer_layer",
    dimensions: [1, 49, 768],
    stream: "image",
    sublayers: [
      { name: `Layer Norm`, type: "layernorm", dimensions: [1, 49, 768] },
      { name: `Self-Attention`, type: "attention", dimensions: [1, 49, 768] },
      { name: `MLP`, type: "mlp", dimensions: [1, 49, 768] },
    ],
  })),
  {
    name: "Visual Embedding",
    type: "embedding",
    dimensions: VISUAL_EMBED_DIM,
    stream: "image",
  },

  // Text Encoder Path
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
    name: "Positional Embeddings",
    type: "embedding",
    dimensions: [1, 77, 512],
    stream: "text",
  },
  ...Array.from({ length: NUM_TEXT_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Text Transformer Layer ${i + 1}`,
    type: "transformer_layer",
    dimensions: [1, 77, 512],
    stream: "text",
    sublayers: [
      { name: `Layer Norm`, type: "layernorm", dimensions: [1, 77, 512] },
      { name: `Self-Attention`, type: "attention", dimensions: [1, 77, 512] },
      { name: `MLP`, type: "mlp", dimensions: [1, 77, 512] },
    ],
  })),
  {
    name: "Text Embedding",
    type: "embedding",
    dimensions: TEXT_EMBED_DIM,
    stream: "text",
  },

  // Contrastive Loss
  { name: "Contrastive Loss", type: "loss", dimensions: [1, 1, 1] },
];

export const DALL_E = [
  // Text Input
  { name: "Text Input", type: "input", dimensions: TEXT_INPUT_DIM },
  { name: "Text Embeddings", type: "embedding", dimensions: [1, 77, 512] },
  {
    name: "Positional Embeddings",
    type: "embedding",
    dimensions: [1, 77, 512],
  },

  // Image Input (for training with teacher forcing)
  { name: "Image Tokens", type: "input", dimensions: [1, 1024] }, // 32x32 tokens
  {
    name: "Image Token Embeddings",
    type: "embedding",
    dimensions: [1, 1024, 512],
  },

  // Concatenate Text and Image Tokens
  { name: "Concatenation", type: "concat", dimensions: [1, 77 + 1024, 512] },

  // Transformer Layers
  ...Array.from({ length: NUM_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Transformer Layer ${i + 1}`,
    type: "transformer_layer",
    dimensions: [1, 77 + 1024, 512],
    sublayers: [
      {
        name: `Layer Norm`,
        type: "layernorm",
        dimensions: [1, 77 + 1024, 512],
      },
      {
        name: `Masked Self-Attention`,
        type: "attention",
        dimensions: [1, 77 + 1024, 512],
      },
      { name: `MLP`, type: "mlp", dimensions: [1, 77 + 1024, 512] },
    ],
  })),

  // Output Projection
  {
    name: "Output Projection",
    type: "dense",
    dimensions: [1, 77 + 1024, 16384],
  }, // Vocabulary size
  { name: "Softmax", type: "softmax", dimensions: [1, 77 + 1024, 16384] },

  // Output Image Tokens
  { name: "Generated Image Tokens", type: "output", dimensions: [1, 1024] },
];

export const DALL_E_2 = [
  // **Text Input and Encoding**
  {
    name: "Text Input",
    type: "input",
    dimensions: TEXT_INPUT_DIM,
  },
  {
    name: "CLIP Text Encoder",
    type: "clip_text_encoder",
    dimensions: TEXT_EMBED_DIM,
  },

  // **Diffusion Prior**
  {
    name: "Diffusion Prior",
    type: "diffusion_prior",
    sublayers: [
      // **Transformer Layers in the Diffusion Prior**
      ...Array.from({ length: NUM_PRIOR_TRANSFORMER_LAYERS }, (_, i) => ({
        name: `Prior Transformer Layer ${i + 1}`,
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
      // **Output Image Embedding**
      {
        name: "Predicted Image Embedding",
        type: "dense",
        dimensions: IMAGE_EMBED_DIM,
      },
    ],
  },

  // **Decoder Diffusion Model**
  {
    name: "Decoder Diffusion Model",
    type: "decoder_diffusion",
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
          // **Downsampling Path**
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
              ...Array.from({ length: NUM_UNET_ATTENTION_LAYERS }, (_, j) => ({
                name: `Cross-Attention Layer ${i + 1}.${j + 1}`,
                type: "cross_attention",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (i + 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (i + 1),
                  128 * 2 ** i,
                ],
              })),
            ],
          })),
          // **Bottleneck**
          {
            name: "Bottleneck",
            type: "resnet_block",
            dimensions: [
              IMAGE_INPUT_DIM[0] / 2 ** NUM_UNET_BLOCKS,
              IMAGE_INPUT_DIM[1] / 2 ** NUM_UNET_BLOCKS,
              1024,
            ],
          },
          // **Upsampling Path**
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
              ...Array.from({ length: NUM_UNET_ATTENTION_LAYERS }, (_, j) => ({
                name: `Cross-Attention Layer ${NUM_UNET_BLOCKS - i}.${j + 1}`,
                type: "cross_attention",
                dimensions: [
                  IMAGE_INPUT_DIM[0] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  IMAGE_INPUT_DIM[1] / 2 ** (NUM_UNET_BLOCKS - i - 1),
                  128 * 2 ** (NUM_UNET_BLOCKS - i - 1),
                ],
              })),
            ],
          })),
        ],
      },
      {
        name: "Output Projection",
        type: "conv",
        dimensions: IMAGE_INPUT_DIM,
      },
    ],
  },

  // **Generated Image Output**
  {
    name: "Generated Image",
    type: "output",
    dimensions: IMAGE_INPUT_DIM,
  },
];

// Layer configurations for multimodal models
export const LAYER_CONFIGS = {
  SHOW_AND_TELL: {
    layerHeight: 40,
    type: "multimodal",
  },
  VQA: {
    layerHeight: 40,
    type: "multimodal",
  },
  CLIP: {
    layerHeight: 50,
    keyPrefix: "clip",
    type: "multimodal",
  },
  DALL_E: {
    layerHeight: 60,
    keyPrefix: "dalle",
    type: "multimodal",
  },
  DALL_E_2: {
    layerHeight: 60,
    keyPrefix: "dalle2",
    type: "multimodal",
  },
};

// Grid configurations for multimodal models
export const GRID_CONFIGS = {
  SHOW_AND_TELL: {
    input: { xCount: 224, yCount: 224, xInterval: 1, yInterval: 1 },
    cnn_encoder: { xCount: 7, yCount: 7, xInterval: 2, yInterval: 2 },
    rnn_decoder: { xCount: 30, yCount: 1, xInterval: 1, yInterval: 1 },
    output: { xCount: 30, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },
  VQA: {
    input: { xCount: 224, yCount: 224, xInterval: 1, yInterval: 1 },
    cnn_encoder: { xCount: 7, yCount: 7, xInterval: 2, yInterval: 2 },
    text_encoder: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    fusion: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    dense: { xCount: 1000, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    output: { xCount: 1000, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
  },
  CLIP: {
    input: { xCount: 224, yCount: 224, xInterval: 1, yInterval: 1 },
    embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    mlp: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    layernorm: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    loss: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  DALL_E: {
    input: { xCount: 77, yCount: 1, xInterval: 1, yInterval: 1 },
    embedding: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    attention: { xCount: 12, yCount: 12, xInterval: 1, yInterval: 1 },
    mlp: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    layernorm: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    concat: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 16384, yCount: 1, xInterval: 0.1, yInterval: 0.1 },
    output: { xCount: 32, yCount: 32, xInterval: 1, yInterval: 1 },
  },
  DALL_E_2: {
    input: { xCount: 77, yCount: 1, xInterval: 1, yInterval: 1 },
    clip_text_encoder: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    diffusion_prior: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    transformer_layer: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    layernorm: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    attention: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    mlp: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    dense: { xCount: 768, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    decoder_diffusion: { xCount: 12, yCount: 1, xInterval: 2, yInterval: 2 },
    unet: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    resnet_block: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
    cross_attention: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
    time_embedding: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
    conv: { xCount: 3, yCount: 1, xInterval: 1, yInterval: 1 },
    output: { xCount: 256, yCount: 256, xInterval: 1, yInterval: 1 },
  },
};
