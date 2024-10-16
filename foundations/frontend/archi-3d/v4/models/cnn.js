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
};

export const GRID_CONFIGS = {
  VGGNET: {
    conv: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
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
};
