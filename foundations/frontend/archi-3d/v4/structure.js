import { MODELS } from "./models";

export const LAYER_CONFIGS = {
  ALEXNET: {
    layerHeight: 60,
    keyPrefix: "alexnet",
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
  VGGNET: {
    layerHeight: 60,
    keyPrefix: "vggnet",
    type: "cnn",
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
  VIDEOGEN: {
    layerHeight: 13,
    keyPrefix: "videogen",
    type: "transformer",
  },
  MULTI_LAYER_PERCEPTRON_MLP: {
    type: "basic_nn",
    keyPrefix: "mlp",
    layerHeight: 20,
  },
  MCCULLOCH_PITTS_NEURON: {
    type: "basic_nn",
    keyPrefix: "mp",
    layerHeight: 20,
  },
  PERCEPTRON: {
    type: "basic_nn",
    keyPrefix: "perceptron",
    layerHeight: 20,
  },
};

const GRID_CONFIGS = {
  VIDEOGEN: {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  },
  GPT: {
    attention: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  TRANSFORMER_ARCHITECTURE: {
    attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    ffn: { xCount: 16, yCount: 4, xInterval: 3, yInterval: 5 },
  },
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

export const getGridConfig = (model) => {
  return GRID_CONFIGS[model] || GRID_CONFIGS.VIDEOGEN;
};

export function getModelStructure(model) {
  return MODELS[model] || [];
}
