// Unified structure definition

const createLayer = (name, type, dimensions, sublayers = null) => ({
  name,
  type,
  dimensions,
  sublayers,
});

export const VIDEO_GEN_STRUCTURE = [
  createLayer("Input Image Frames", "input", [224, 224, 3]),
  createLayer("TAE Encoder", "encoder", [112, 112, 64]),
  ...Array.from({ length: 6 }, (_, i) =>
    createLayer(
      `Encoder Layer ${i + 1}`,
      "encoder_layer",
      [56, 56, 128],
      [
        createLayer(`Self-Attention ${i + 1}`, "attention", [6144, 48, 48]),
        createLayer(`Feed Forward ${i + 1}`, "ffn", [3072, 48, 1]),
      ]
    )
  ),
  createLayer(
    "Cross Attention (Text Embeddings)",
    "cross_attention",
    [28, 28, 256]
  ),
  createLayer("UL2 Embeddings", "embedding", [14, 14, 512]),
  createLayer("MetaCLIP Embeddings", "embedding", [14, 14, 512]),
  createLayer("ByT5 Embeddings", "embedding", [14, 14, 512]),
  createLayer("Gaussian Noise Input", "input", [7, 7, 1024]),
  ...Array.from({ length: 6 }, (_, i) =>
    createLayer(
      `Decoder Layer ${i + 1}`,
      "decoder_layer",
      [14, 14, 512],
      [
        createLayer(`Diffusion Step ${i + 1}`, "diffusion", [128, 8, 8]),
        createLayer(`Upsample Step ${i + 1}`, "upsample", [64, 8, 8]),
      ]
    )
  ),
  createLayer("TAE Decoder", "decoder", [112, 112, 64]),
  createLayer("Output Image/Video", "output", [224, 224, 3]),
];

export const ALEXNET_STRUCTURE = [
  createLayer("Input", "input", [227, 227, 3]),
  createLayer("Conv1", "conv", [55, 55, 96]),
  createLayer("Pool1", "pool", [27, 27, 96]),
  createLayer("Conv2", "conv", [27, 27, 256]),
  createLayer("Pool2", "pool", [13, 13, 256]),
  createLayer("Conv3", "conv", [13, 13, 384]),
  createLayer("Conv4", "conv", [13, 13, 384]),
  createLayer("Conv5", "conv", [13, 13, 256]),
  createLayer("Pool5", "pool", [6, 6, 256]),
  createLayer("FC6", "fc", [4096, 1, 1]),
  createLayer("FC7", "fc", [4096, 1, 1]),
  createLayer("Output", "output", [1000, 1, 1]),
];

export const COLORS = {
  input: "hsl(200, 100%, 50%)",
  encoder: "hsl(150, 100%, 50%)",
  encoder_layer: "hsl(120, 100%, 50%)",
  attention: "hsl(90, 100%, 50%)",
  ffn: "hsl(60, 100%, 50%)",
  cross_attention: "hsl(30, 100%, 50%)",
  embedding: "hsl(0, 100%, 50%)",
  decoder_layer: "hsl(330, 100%, 50%)",
  diffusion: "hsl(300, 100%, 50%)",
  upsample: "hsl(270, 100%, 50%)",
  decoder: "hsl(240, 100%, 50%)",
  output: "hsl(210, 100%, 50%)",
  conv: "hsl(180, 100%, 50%)",
  pool: "hsl(150, 100%, 50%)",
  fc: "hsl(120, 100%, 50%)",
};
