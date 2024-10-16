import * as CNN from "./cnn";
import * as TRANSFORMER from "./transformer";
import * as BASIC_NN from "./basic_nn";
import * as RNN from "./rnn";
import * as VAE from "./vae";

export const MODELS = {
  ...CNN,
  ...TRANSFORMER,
  ...BASIC_NN,
  ...RNN,
  ...VAE,
};

export const LAYER_CONFIGS = {
  ...CNN.LAYER_CONFIGS,
  ...TRANSFORMER.LAYER_CONFIGS,
  ...BASIC_NN.LAYER_CONFIGS,
  ...RNN.LAYER_CONFIGS,
  ...VAE.LAYER_CONFIGS,
};

export const GRID_CONFIGS = {
  ...CNN.GRID_CONFIGS,
  ...TRANSFORMER.GRID_CONFIGS,
  ...BASIC_NN.GRID_CONFIGS,
  ...RNN.GRID_CONFIGS,
  ...VAE.GRID_CONFIGS,
};
