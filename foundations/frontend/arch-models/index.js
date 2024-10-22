import * as CNN from "./cnn";
import * as TRANSFORMER from "./transformer";
import * as BASIC_NN from "./basic_nn";
import * as RNN from "./rnn";
import * as VAE from "./vae";
import * as SELF_SUPERVISED from "./self_supervised";
import * as GAN from "./gan";

export const MODELS = {
  ...CNN.MODELS,
  ...TRANSFORMER.MODELS,
  ...BASIC_NN.MODELS,
  ...RNN.MODELS,
  ...VAE.MODELS,
  ...SELF_SUPERVISED.MODELS,
  ...GAN.MODELS,
};

export const LAYER_CONFIGS = {
  ...CNN.LAYER_CONFIGS,
  ...TRANSFORMER.LAYER_CONFIGS,
  ...BASIC_NN.LAYER_CONFIGS,
  ...RNN.LAYER_CONFIGS,
  ...VAE.LAYER_CONFIGS,
  ...SELF_SUPERVISED.LAYER_CONFIGS,
  ...GAN.LAYER_CONFIGS,
};

export const GRID_CONFIGS = {
  ...CNN.GRID_CONFIGS,
  ...TRANSFORMER.GRID_CONFIGS,
  ...BASIC_NN.GRID_CONFIGS,
  ...RNN.GRID_CONFIGS,
  ...VAE.GRID_CONFIGS,
  ...SELF_SUPERVISED.GRID_CONFIGS,
  ...GAN.GRID_CONFIGS,
};

// Function to get model structure based on model name
export function getModelStructure(modelName) {
  return MODELS[modelName];
}
