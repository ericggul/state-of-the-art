import { MODELS } from "./models";

export const LAYER_CONFIGS = {
  alexnet: {
    layerHeight: 60,
    keyPrefix: "alexnet",
    type: "cnn",
  },
  lenet: {
    layerHeight: 60,
    keyPrefix: "lenet",
    type: "cnn",
  },
  lenet5: {
    layerHeight: 60,
    keyPrefix: "lenet5",
    type: "cnn",
  },
  vggnet: {
    layerHeight: 60,
    keyPrefix: "vggnet",
    type: "cnn",
  },
  gpt: {
    layerHeight: 12,
    keyPrefix: "gpt",
    type: "transformer",
  },
  transformer: {
    layerHeight: 5,
    keyPrefix: "transformer",
    type: "transformer",
  },
  videogen: {
    layerHeight: 13,
    keyPrefix: "videogen",
    type: "transformer",
  },
  basic_nn: { type: "basic_nn", keyPrefix: "basic_nn", layerHeight: 20 },
  mcculloch_pitts: { type: "basic_nn", keyPrefix: "mp", layerHeight: 20 },
  perceptron: { type: "basic_nn", keyPrefix: "perceptron", layerHeight: 20 },
};

const GRID_CONFIGS = {
  videogen: {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  },
  gpt: {
    attention: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  transformer: {
    attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    ffn: { xCount: 16, yCount: 4, xInterval: 3, yInterval: 5 },
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
  return GRID_CONFIGS[model] || GRID_CONFIGS.videogen;
};

export function getModelStructure(model) {
  return MODELS[model.toUpperCase()] || [];
}
