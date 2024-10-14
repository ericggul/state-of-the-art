// Structure definition (simplified)

// Constants defining the structure
export const NUM_ENCODER_LAYERS = 6;
export const NUM_DECODER_LAYERS = 6;
export const NUM_GPT_LAYERS = 24;

export const VIDEO_GEN_STRUCTURE = [
  { name: `Input Image Frames`, type: "input", stack: "encoder" },
  { name: `TAE Encoder`, type: "encoder", stack: "encoder" },
  ...Array.from({ length: NUM_ENCODER_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [6144, 48, 48],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 48, 1] },
    ],
  })),
  {
    name: `Cross Attention (Text Embeddings)`,
    type: "cross_attention",
    stack: "encoder",
  },
  { name: `UL2 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `MetaCLIP Embeddings`, type: "embedding", stack: "encoder" },
  { name: `ByT5 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `Gaussian Noise Input`, type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_DECODER_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Diffusion Step ${i + 1}`,
        type: "diffusion",
        dimensions: [128, 8, 8],
      },
      {
        name: `Upsample Step ${i + 1}`,
        type: "upsample",
        dimensions: [64, 8, 8],
      },
    ],
  })),
  { name: `TAE Decoder`, type: "decoder", stack: "decoder" },
  { name: `Output Image/Video`, type: "output", stack: "decoder" },
];

// AlexNet structure definition
export const ALEXNET_STRUCTURE = [
  { dimensions: [227, 227, 3], zSpan: [3, 1], type: "input" },
  { dimensions: [55, 55, 96], zSpan: [12, 8], type: "conv" },
  { dimensions: [27, 27, 96], zSpan: [12, 8], type: "pool" },
  { dimensions: [27, 27, 256], zSpan: [16, 16], type: "conv" },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "pool" },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv" },
  { dimensions: [13, 13, 384], zSpan: [24, 16], type: "conv" },
  { dimensions: [13, 13, 256], zSpan: [16, 16], type: "conv" },
  { dimensions: [6, 6, 256], zSpan: [16, 16], type: "pool" },
  { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc" },
  { dimensions: [4096, 1, 1], zSpan: [1, 1], type: "fc" },
  { dimensions: [1000, 1, 1], zSpan: [1, 1], type: "output" },
];

export const GPT_STRUCTURE = [
  { name: `Input Embeddings`, type: "input", stack: "decoder" },
  { name: `Positional Encoding`, type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [1280, 16, 16],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [5120, 16, 1] },
    ],
  })),
  { name: "Final LayerNorm", type: "layernorm", stack: "decoder" },
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

const GRID_CONFIGS = {
  videoGen: {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  },
  gpt: {
    attention: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  vggnet: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
    fc: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
  },
  lenet: {
    conv: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
    pool: { xCount: 3, yCount: 3, xInterval: 4, yInterval: 4 },
    fc: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
  lenet5: {
    conv: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
    pool: { xCount: 3, yCount: 3, xInterval: 4, yInterval: 4 },
    fc: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
};

export const getGridConfig = (model) => {
  return GRID_CONFIGS[model] || GRID_CONFIGS.videoGen; // Default to videoGen if model not found
};

// ... (export other structures)

export const VGGNET_STRUCTURE = [
  { name: "Input", type: "input", dimensions: [224, 224, 3] },
  { name: "Conv1_1", type: "conv", dimensions: [224, 224, 64] },
  { name: "Conv1_2", type: "conv", dimensions: [224, 224, 64] },
  { name: "MaxPool1", type: "pool", dimensions: [112, 112, 64] },
  { name: "Conv2_1", type: "conv", dimensions: [112, 112, 128] },
  { name: "Conv2_2", type: "conv", dimensions: [112, 112, 128] },
  { name: "MaxPool2", type: "pool", dimensions: [56, 56, 128] },
  { name: "Conv3_1", type: "conv", dimensions: [56, 56, 256] },
  { name: "Conv3_2", type: "conv", dimensions: [56, 56, 256] },
  { name: "Conv3_3", type: "conv", dimensions: [56, 56, 256] },
  { name: "MaxPool3", type: "pool", dimensions: [28, 28, 256] },
  { name: "Conv4_1", type: "conv", dimensions: [28, 28, 512] },
  { name: "Conv4_2", type: "conv", dimensions: [28, 28, 512] },
  { name: "Conv4_3", type: "conv", dimensions: [28, 28, 512] },
  { name: "MaxPool4", type: "pool", dimensions: [14, 14, 512] },
  { name: "Conv5_1", type: "conv", dimensions: [14, 14, 512] },
  { name: "Conv5_2", type: "conv", dimensions: [14, 14, 512] },
  { name: "Conv5_3", type: "conv", dimensions: [14, 14, 512] },
  { name: "MaxPool5", type: "pool", dimensions: [7, 7, 512] },
  { name: "FC6", type: "fc", dimensions: [4096, 1, 1] },
  { name: "FC7", type: "fc", dimensions: [4096, 1, 1] },
  { name: "FC8", type: "output", dimensions: [1000, 1, 1] },
];

export const LENET_STRUCTURE = [
  { name: "Input", type: "input", dimensions: [32, 32, 1] },
  { name: "C1", type: "conv", dimensions: [28, 28, 6] },
  { name: "S2", type: "pool", dimensions: [14, 14, 6] },
  { name: "C3", type: "conv", dimensions: [10, 10, 16] },
  { name: "S4", type: "pool", dimensions: [5, 5, 16] },
  { name: "C5", type: "conv", dimensions: [1, 1, 120] },
  { name: "F6", type: "fc", dimensions: [84, 1, 1] },
  { name: "Output", type: "output", dimensions: [10, 1, 1] },
];

export const LENET5_STRUCTURE = [
  { name: "Input", type: "input", dimensions: [32, 32, 1] },
  { name: "C1", type: "conv", dimensions: [28, 28, 6] },
  { name: "S2", type: "pool", dimensions: [14, 14, 6] },
  { name: "C3", type: "conv", dimensions: [10, 10, 16] },
  { name: "S4", type: "pool", dimensions: [5, 5, 16] },
  { name: "C5", type: "conv", dimensions: [1, 1, 120] },
  { name: "F6", type: "fc", dimensions: [84, 1, 1] },
  { name: "F7", type: "fc", dimensions: [10, 1, 1] },
  { name: "Output", type: "output", dimensions: [10, 1, 1] },
];
