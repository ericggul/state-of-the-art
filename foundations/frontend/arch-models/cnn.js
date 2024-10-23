// New constants for additional models
const NUM_RESNET_LAYERS = 50; // ResNet-50 as an example
const NUM_DENSENET_BLOCKS = 4; // DenseNet blocks
const NUM_EFFICIENTNET_BLOCKS = 7; // EfficientNet-B0
const NUM_U_NET_LEVELS = 4; // U-Net depth
const NUM_GOOGLENET_INCEPTIONS = 9; // Number of Inception modules in GoogLeNet
const NUM_YOLO_LAYERS = 31; // This can be adjusted based on the specific YOLO version

// AlexNet structure definition
export const ALEXNET = [
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

export const VGGNET = [
  { name: "Input", type: "input", dimensions: [224, 224, 3], zSpan: [3, 1] },
  { name: "Conv1_1", type: "conv", dimensions: [224, 224, 64], zSpan: [8, 8] },
  { name: "Conv1_2", type: "conv", dimensions: [224, 224, 64], zSpan: [8, 8] },
  { name: "MaxPool1", type: "pool", dimensions: [112, 112, 64], zSpan: [8, 8] },
  {
    name: "Conv2_1",
    type: "conv",
    dimensions: [112, 112, 128],
    zSpan: [12, 12],
  },
  {
    name: "Conv2_2",
    type: "conv",
    dimensions: [112, 112, 128],
    zSpan: [12, 12],
  },
  {
    name: "MaxPool2",
    type: "pool",
    dimensions: [56, 56, 128],
    zSpan: [12, 12],
  },
  { name: "Conv3_1", type: "conv", dimensions: [56, 56, 256], zSpan: [16, 16] },
  { name: "Conv3_2", type: "conv", dimensions: [56, 56, 256], zSpan: [16, 16] },
  { name: "Conv3_3", type: "conv", dimensions: [56, 56, 256], zSpan: [16, 16] },
  {
    name: "MaxPool3",
    type: "pool",
    dimensions: [28, 28, 256],
    zSpan: [16, 16],
  },
  { name: "Conv4_1", type: "conv", dimensions: [28, 28, 512], zSpan: [24, 24] },
  { name: "Conv4_2", type: "conv", dimensions: [28, 28, 512], zSpan: [24, 24] },
  { name: "Conv4_3", type: "conv", dimensions: [28, 28, 512], zSpan: [24, 24] },
  {
    name: "MaxPool4",
    type: "pool",
    dimensions: [14, 14, 512],
    zSpan: [24, 24],
  },
  { name: "Conv5_1", type: "conv", dimensions: [14, 14, 512], zSpan: [24, 24] },
  { name: "Conv5_2", type: "conv", dimensions: [14, 14, 512], zSpan: [24, 24] },
  { name: "Conv5_3", type: "conv", dimensions: [14, 14, 512], zSpan: [24, 24] },
  { name: "MaxPool5", type: "pool", dimensions: [7, 7, 512], zSpan: [24, 24] },
  { name: "FC6", type: "fc", dimensions: [4096, 1, 1], zSpan: [1, 1] },
  { name: "FC7", type: "fc", dimensions: [4096, 1, 1], zSpan: [1, 1] },
  { name: "FC8", type: "output", dimensions: [1000, 1, 1], zSpan: [1, 1] },
];

export const LENET_1 = [
  { name: "Input", type: "input", dimensions: [32, 32, 1], zSpan: [1, 1] },
  { name: "C1", type: "conv", dimensions: [28, 28, 6], zSpan: [3, 2] },
  { name: "S2", type: "pool", dimensions: [14, 14, 6], zSpan: [3, 2] },
  { name: "C3", type: "conv", dimensions: [10, 10, 16], zSpan: [4, 4] },
  { name: "S4", type: "pool", dimensions: [5, 5, 16], zSpan: [4, 4] },
  { name: "C5", type: "conv", dimensions: [1, 1, 120], zSpan: [12, 10] },
  { name: "F6", type: "fc", dimensions: [84, 1, 1], zSpan: [1, 1] },
  { name: "Output", type: "output", dimensions: [10, 1, 1], zSpan: [1, 1] },
];

export const LENET_5 = [
  { name: "Input", type: "input", dimensions: [32, 32, 1], zSpan: [1, 1] },
  { name: "C1", type: "conv", dimensions: [28, 28, 6], zSpan: [3, 2] },
  { name: "S2", type: "pool", dimensions: [14, 14, 6], zSpan: [3, 2] },
  { name: "C3", type: "conv", dimensions: [10, 10, 16], zSpan: [4, 4] },
  { name: "S4", type: "pool", dimensions: [5, 5, 16], zSpan: [4, 4] },
  { name: "C5", type: "conv", dimensions: [1, 1, 120], zSpan: [12, 10] },
  { name: "F6", type: "fc", dimensions: [84, 1, 1], zSpan: [1, 1] },
  { name: "F7", type: "fc", dimensions: [10, 1, 1], zSpan: [1, 1] },
  { name: "Output", type: "output", dimensions: [10, 1, 1], zSpan: [1, 1] },
];

export const GOOGLENET = [
  { name: "Input", type: "input", dimensions: [224, 224, 3], zSpan: [3, 1] },
  { name: "Conv1", type: "conv", dimensions: [112, 112, 64], zSpan: [8, 8] },
  { name: "MaxPool1", type: "pool", dimensions: [56, 56, 64], zSpan: [8, 8] },
  { name: "Conv2", type: "conv", dimensions: [56, 56, 192], zSpan: [16, 16] },
  {
    name: "MaxPool2",
    type: "pool",
    dimensions: [28, 28, 192],
    zSpan: [16, 16],
  },
  ...Array.from({ length: NUM_GOOGLENET_INCEPTIONS }, (_, i) => ({
    name: `Inception Module ${i + 1}`,
    type: "inception",
    dimensions: [28, 28, 256], // Adjust dimensions per module
    zSpan: [24, 24],
    sublayers: [
      {
        name: "1x1 Conv",
        type: "conv",
        dimensions: [28, 28, 64],
        zSpan: [8, 8],
      },
      {
        name: "3x3 Conv",
        type: "conv",
        dimensions: [28, 28, 128],
        zSpan: [16, 16],
      },
      {
        name: "5x5 Conv",
        type: "conv",
        dimensions: [28, 28, 32],
        zSpan: [8, 8],
      },
      {
        name: "Max Pool",
        type: "pool",
        dimensions: [28, 28, 32],
        zSpan: [8, 8],
      },
    ],
  })),
  // Continue with the rest of the network...
  {
    name: "Average Pool",
    type: "pool",
    dimensions: [1, 1, 1024],
    zSpan: [32, 32],
  },
  { name: "Output", type: "output", dimensions: [1000, 1, 1], zSpan: [1, 1] },
];

// EfficientNet-B0 configuration
const EFFICIENTNET_B0_CONFIG = [
  // [output_channels, kernel_size, stride, expansion_ratio, se_ratio, repeats]
  [16, 3, 1, 1, 0.25, 1], // MBConv1
  [24, 3, 2, 6, 0.25, 2], // MBConv6
  [40, 5, 2, 6, 0.25, 2], // MBConv6
  [80, 3, 2, 6, 0.25, 3], // MBConv6
  [112, 5, 1, 6, 0.25, 3], // MBConv6
  [192, 5, 2, 6, 0.25, 4], // MBConv6
  [320, 3, 1, 6, 0.25, 1], // MBConv6
];

export const EFFICIENTNET = [
  { name: "Input", type: "input", dimensions: [224, 224, 3], zSpan: [3, 1] },
  { name: "Conv1", type: "conv", dimensions: [112, 112, 32], zSpan: [8, 8] },
  ...EFFICIENTNET_B0_CONFIG.flatMap((config, blockIndex) => {
    const [
      outputChannels,
      kernelSize,
      stride,
      expansionRatio,
      seRatio,
      repeats,
    ] = config;
    return Array.from({ length: repeats }, (_, repeatIndex) => ({
      name: `MBConv${expansionRatio} Block ${blockIndex + 1}_${
        repeatIndex + 1
      }`,
      type: "mbconv",
      dimensions: [
        224 / 2 ** (blockIndex + 1),
        224 / 2 ** (blockIndex + 1),
        outputChannels,
      ],
      zSpan: [8, 8],
    }));
  }),
  { name: "Conv2", type: "conv", dimensions: [7, 7, 1280], zSpan: [32, 32] },
  {
    name: "Global Average Pool",
    type: "pool",
    dimensions: [1, 1, 1280],
    zSpan: [32, 32],
  },
  { name: "Output", type: "output", dimensions: [1000, 1, 1], zSpan: [1, 1] },
];

export const U_NET = [
  { name: "Input", type: "input", dimensions: [572, 572, 1], zSpan: [1, 1] },
  // Downsampling path
  ...Array.from({ length: NUM_U_NET_LEVELS }, (_, i) => ({
    name: `Down Conv ${i + 1}`,
    type: "conv",
    dimensions: [572 / 2 ** i, 572 / 2 ** i, 64 * 2 ** i],
    zSpan: [8, 8],
  })),
  // Bottleneck
  {
    name: "Bottleneck",
    type: "conv",
    dimensions: [28, 28, 1024],
    zSpan: [32, 32],
  },
  // Upsampling path
  ...Array.from({ length: NUM_U_NET_LEVELS }, (_, i) => ({
    name: `Up Conv ${i + 1}`,
    type: "upconv",
    dimensions: [28 * 2 ** i, 28 * 2 ** i, 512 / 2 ** i],
    zSpan: [16, 16],
  })),
  { name: "Output", type: "output", dimensions: [388, 388, 2], zSpan: [2, 1] },
];

export const SEGNET = [
  { name: "Input", type: "input", dimensions: [360, 480, 3], zSpan: [3, 1] },
  // Encoder
  ...Array.from({ length: 13 }, (_, i) => ({
    name: `Encoder Conv ${i + 1}`,
    type: "conv",
    dimensions: [
      360 / 2 ** Math.floor(i / 2),
      480 / 2 ** Math.floor(i / 2),
      64 * 2 ** Math.floor(i / 3),
    ],
    zSpan: [8, 8],
  })),
  // Decoder
  ...Array.from({ length: 13 }, (_, i) => ({
    name: `Decoder Conv ${i + 1}`,
    type: "conv",
    dimensions: [
      360 / 2 ** (6 - Math.floor(i / 2)),
      480 / 2 ** (6 - Math.floor(i / 2)),
      64 * 2 ** (3 - Math.floor(i / 3)),
    ],
    zSpan: [8, 8],
  })),
  {
    name: "Output",
    type: "output",
    dimensions: [360, 480, 12],
    zSpan: [12, 1],
  },
];

// Improve ResNet (ResNet-50 implementation)
export const RESNET = [
  { name: "Input", type: "input", dimensions: [224, 224, 3], zSpan: [3, 1] },
  { name: "Conv1", type: "conv", dimensions: [112, 112, 64], zSpan: [8, 8] },
  { name: "MaxPool1", type: "pool", dimensions: [56, 56, 64], zSpan: [8, 8] },
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Residual Block 1_${i + 1}`,
    type: "residual_block",
    dimensions: [56, 56, 256],
    zSpan: [16, 16],
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    name: `Residual Block 2_${i + 1}`,
    type: "residual_block",
    dimensions: [28, 28, 512],
    zSpan: [24, 24],
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    name: `Residual Block 3_${i + 1}`,
    type: "residual_block",
    dimensions: [14, 14, 1024],
    zSpan: [32, 32],
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    name: `Residual Block 4_${i + 1}`,
    type: "residual_block",
    dimensions: [7, 7, 2048],
    zSpan: [32, 32],
  })),
  {
    name: "Global Average Pool",
    type: "pool",
    dimensions: [1, 1, 2048],
    zSpan: [32, 32],
  },
  { name: "Output", type: "output", dimensions: [1000, 1, 1], zSpan: [1, 1] },
];

// Improve DenseNet (DenseNet-121 implementation)
const DENSE_BLOCK_CONFIG = [6, 12, 24, 16];

export const DENSENET = [
  { name: "Input", type: "input", dimensions: [224, 224, 3], zSpan: [3, 1] },
  { name: "Conv1", type: "conv", dimensions: [112, 112, 64], zSpan: [8, 8] },
  { name: "MaxPool1", type: "pool", dimensions: [56, 56, 64], zSpan: [8, 8] },
  ...DENSE_BLOCK_CONFIG.flatMap((numLayers, blockIndex) => [
    {
      name: `Dense Block ${blockIndex + 1}`,
      type: "dense_block",
      dimensions: [
        56 / 2 ** blockIndex,
        56 / 2 ** blockIndex,
        64 + numLayers * 32,
      ],
      zSpan: [16, 16],
    },
    blockIndex < DENSE_BLOCK_CONFIG.length - 1
      ? {
          name: `Transition Layer ${blockIndex + 1}`,
          type: "transition",
          dimensions: [
            28 / 2 ** blockIndex,
            28 / 2 ** blockIndex,
            (64 + numLayers * 32) / 2,
          ],
          zSpan: [8, 8],
        }
      : null,
  ]).filter(Boolean),
  {
    name: "Global Average Pool",
    type: "pool",
    dimensions: [1, 1, 1024],
    zSpan: [32, 32],
  },
  { name: "Output", type: "output", dimensions: [1000, 1, 1], zSpan: [1, 1] },
];

// Improve YOLO (YOLOv3 implementation)
const YOLO_LAYERS = [
  // [out_channels, kernel_size, stride]
  [32, 3, 1],
  [64, 3, 2],
  [32, 1, 1],
  [64, 3, 1],
  [128, 3, 2],
  [64, 1, 1],
  [128, 3, 1],
  [256, 3, 2],
  [128, 1, 1],
  [256, 3, 1],
  [512, 3, 2],
  [256, 1, 1],
  [512, 3, 1],
  [256, 1, 1],
  [512, 3, 1],
  [256, 1, 1],
  [512, 3, 1],
  [1024, 3, 2],
  [512, 1, 1],
  [1024, 3, 1],
  [512, 1, 1],
  [1024, 3, 1],
  [512, 1, 1],
  [1024, 3, 1],
];

export const YOLO_YOU_ONLY_LOOK_ONCE = [
  { name: "Input", type: "input", dimensions: [416, 416, 3], zSpan: [3, 1] },
  ...YOLO_LAYERS.map((layer, index) => ({
    name: `Conv${index + 1}`,
    type: "conv",
    dimensions: [
      416 / 2 ** Math.floor(index / 5),
      416 / 2 ** Math.floor(index / 5),
      layer[0],
    ],
    zSpan: [8, 8],
  })),
  // YOLO output layers
  {
    name: "YOLO Layer 1",
    type: "yolo",
    dimensions: [13, 13, 255],
    zSpan: [16, 16],
  },
  {
    name: "YOLO Layer 2",
    type: "yolo",
    dimensions: [26, 26, 255],
    zSpan: [16, 16],
  },
  {
    name: "YOLO Layer 3",
    type: "yolo",
    dimensions: [52, 52, 255],
    zSpan: [16, 16],
  },
];

export const LAYER_CONFIGS = {
  VGGNET: {
    layerHeight: 60,
    keyPrefix: "vggnet",
    type: "cnn",
  },
  LENET_1: {
    layerHeight: 60,
    keyPrefix: "lenet1",
    type: "cnn",
  },
  LENET_5: {
    layerHeight: 60,
    keyPrefix: "lenet5",
    type: "cnn",
  },
  ALEXNET: {
    layerHeight: 60,
    keyPrefix: "alexnet",
    type: "cnn",
  },
  GOOGLENET: {
    layerHeight: 60,
    keyPrefix: "googlenet",
    type: "cnn",
  },
  RESNET: {
    layerHeight: 60,
    keyPrefix: "resnet",
    type: "cnn",
  },
  DENSENET: {
    layerHeight: 60,
    keyPrefix: "densenet",
    type: "cnn",
  },
  EFFICIENTNET: {
    layerHeight: 60,
    keyPrefix: "efficientnet",
    type: "cnn",
  },
  U_NET: {
    layerHeight: 60,
    keyPrefix: "unet",
    type: "cnn",
  },
  SEGNET: {
    layerHeight: 60,
    keyPrefix: "segnet",
    type: "cnn",
  },
  YOLO_YOU_ONLY_LOOK_ONCE: {
    layerHeight: 60,
    keyPrefix: "yolo",
    type: "cnn",
  },
};

export const GRID_CONFIGS = {
  VGGNET: {
    conv: { xCount: 8, yCount: 8, xInterval: 20, yInterval: 20 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
    fc: { xCount: 16, yCount: 16, xInterval: 2, yInterval: 2 },
  },

  LENET_1: {
    conv: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
    pool: { xCount: 3, yCount: 3, xInterval: 4, yInterval: 4 },
    fc: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
  LENET_5: {
    conv: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
    pool: { xCount: 3, yCount: 3, xInterval: 4, yInterval: 4 },
    fc: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
  },
  GOOGLENET: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    inception: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
  },
  RESNET: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    residual_block: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
  },
  DENSENET: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    dense_block: { xCount: 6, yCount: 6, xInterval: 3, yInterval: 3 },
    bottleneck: { xCount: 4, yCount: 4, xInterval: 2, yInterval: 2 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
    transition: { xCount: 4, yCount: 4, xInterval: 4, yInterval: 4 },
  },
  EFFICIENTNET: {
    mbconv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
  },
  U_NET: {
    conv: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 3 },
    upconv: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 3 },
  },
  SEGNET: {
    conv: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 3 },
  },
  YOLO_YOU_ONLY_LOOK_ONCE: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    pool: { xCount: 4, yCount: 4, xInterval: 6, yInterval: 6 },
    fc: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
};
