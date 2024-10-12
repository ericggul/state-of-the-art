// Structure definition (simplified)

// Constants defining the structure
export const NUM_ENCODER_LAYERS = 6;
export const NUM_DECODER_LAYERS = 6;

export const STRUCTURE = [
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
