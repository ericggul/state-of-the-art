const NUM_ENCODER_LAYERS = 6;
const NUM_DECODER_LAYERS = 6;

const NUM_TRANSFORMER_LAYERS = 6;
const NUM_T5_LAYERS = 12;
const NUM_BART_LAYERS = 6;
const NUM_BERT_LAYERS = 24;
const NUM_ROBERTA_LAYERS = 24;
const NUM_GPT_LAYERS = 24;
const NUM_GPT_2_LAYERS = 24; // for GPT-2 small, adjust for other sizes
const NUM_GPT_3_LAYERS = 96; // for GPT-3 175B, adjust for other sizes
const NUM_GPT_4_LAYERS = 120; // This is an estimate, exact architecture is not public
const NUM_PALM_LAYERS = 118; // for PaLM 540B
const NUM_PALM_2_LAYERS = 150; // This is an estimate, exact architecture is not public
const NUM_LLAMA_LAYERS = 32; // for LLaMA 7B, adjust for other sizes
const NUM_FALCON_LLM_LAYERS = 60; // for Falcon 40B, adjust for other sizes

export const VIDEOGEN = [
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
        gridConfig: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 48, 1],
        gridConfig: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
      },
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

export const GPT = [
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
        gridConfig: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [5120, 16, 1],
        gridConfig: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
      },
    ],
  })),
  { name: "Final LayerNorm", type: "layernorm", stack: "decoder" },
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

export const TRANSFORMER_ARCHITECTURE = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
        gridConfig: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [2048, 8, 1],
        gridConfig: { xCount: 16, yCount: 4, xInterval: 3, yInterval: 5 },
      },
    ],
  })),
  { name: "Output Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [512, 8, 8],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
    ],
  })),
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

export const T5 = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  ...Array.from({ length: NUM_T5_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1 ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      { name: `Layer Norm 2 ${i + 1}`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
    ],
  })),
  { name: "Decoder Input", type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_T5_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1 ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      { name: `Layer Norm 2 ${i + 1}`, type: "layernorm" },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [512, 8, 8],
      },
      { name: `Layer Norm 3 ${i + 1}`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output Projection", type: "output", stack: "decoder" },
];

export const BART = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  ...Array.from({ length: NUM_BART_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Decoder Input", type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_BART_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [768, 12, 12],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Output Projection", type: "output", stack: "decoder" },
];

export const BERT = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  { name: "Segment Embeddings", type: "embedding", stack: "encoder" },
  ...Array.from({ length: NUM_BERT_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Pooler", type: "pooler", stack: "encoder" },
  { name: "Task-specific Outputs", type: "output", stack: "encoder" },
];

export const ROBERTA = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_ROBERTA_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1 ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      { name: `Layer Norm 2 ${i + 1}`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "encoder" },
  { name: "Task-specific Outputs", type: "output", stack: "encoder" },
];

export const GPT_2 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_2_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const GPT_3 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_3_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [12288, 96, 96],
        gridConfig: { xCount: 20, yCount: 12, xInterval: 1500, yInterval: 30 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [49152, 96, 1],
        gridConfig: { xCount: 24, yCount: 4, xInterval: 2000, yInterval: 50 },
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const GPT_4 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_4_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [16384, 128, 128],
        gridConfig: { xCount: 12, yCount: 12, xInterval: 300, yInterval: 300 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [65536, 128, 1],
        gridConfig: { xCount: 24, yCount: 4, xInterval: 200, yInterval: 500 },
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const PALM = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_PALM_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [18432, 128, 128],
        gridConfig: { xCount: 128, yCount: 128, xInterval: 1, yInterval: 1 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [73728, 128, 1],
        gridConfig: { xCount: 256, yCount: 8, xInterval: 1, yInterval: 3 },
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const PALM_2 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_PALM_2_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [20480, 160, 160],
        gridConfig: { xCount: 160, yCount: 160, xInterval: 1, yInterval: 1 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [81920, 160, 1],
        gridConfig: { xCount: 320, yCount: 8, xInterval: 1, yInterval: 3 },
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const LLAMA = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_LLAMA_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [4096, 32, 32],
        gridConfig: { xCount: 32, yCount: 32, xInterval: 2, yInterval: 2 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [11008, 32, 1],
        gridConfig: { xCount: 64, yCount: 6, xInterval: 1, yInterval: 4 },
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const FALCON_LLM = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_FALCON_LLM_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Multi-Query Attention ${i + 1}`,
        type: "attention",
        dimensions: [8192, 64, 64],
        gridConfig: { xCount: 64, yCount: 64, xInterval: 1, yInterval: 1 },
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [32768, 64, 1],
        gridConfig: { xCount: 128, yCount: 8, xInterval: 1, yInterval: 3 },
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const LAYER_CONFIGS = {
  VIDEOGEN: {
    layerHeight: 13,
    keyPrefix: "videogen",
    type: "transformer",
  },
  GPT: {
    layerHeight: 12,
    keyPrefix: "gpt",
    type: "transformer",
  },
  TRANSFORMER_ARCHITECTURE: {
    layerHeight: 5,
    keyPrefix: "transformer",
    type: "transformer",
  },
  T5: {
    layerHeight: 10,
    keyPrefix: "t5",
    type: "transformer",
  },
  BART: {
    layerHeight: 10,
    keyPrefix: "bart",
    type: "transformer",
  },
  BERT: {
    layerHeight: 8,
    keyPrefix: "bert",
    type: "transformer",
  },
  ROBERTA: {
    layerHeight: 8,
    keyPrefix: "roberta",
    type: "transformer",
  },
  GPT_2: {
    layerHeight: 8,
    keyPrefix: "gpt2",
    type: "transformer",
  },
  GPT_3: {
    layerHeight: 6,
    keyPrefix: "gpt3",
    type: "large_transformer",
  },
  GPT_4: {
    layerHeight: 5,
    keyPrefix: "gpt4",
    type: "large_transformer",
  },
  PALM: {
    layerHeight: 6,
    keyPrefix: "palm",
    type: "large_transformer",
  },
  PALM_2: {
    layerHeight: 5,
    keyPrefix: "palm2",
    type: "large_transformer",
  },
  LLAMA: {
    layerHeight: 7,
    keyPrefix: "llama",
    type: "transformer",
  },
  FALCON_LLM: {
    layerHeight: 7,
    keyPrefix: "falcon",
    type: "transformer",
  },
};
