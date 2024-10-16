const NUM_ENCODER_LAYERS = 6;
const NUM_DECODER_LAYERS = 6;
const NUM_GPT_LAYERS = 24;
const NUM_TRANSFORMER_LAYERS = 6;

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
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [5120, 16, 1] },
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
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
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
