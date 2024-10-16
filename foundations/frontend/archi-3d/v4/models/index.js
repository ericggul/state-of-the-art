import * as CNN from "./cnn";
import * as TRANSFORMER from "./transformer";
import * as BASIC_NN from "./basic_nn";
import * as RNN from "./rnn";
import * as VAE from "./vae";
import * as SELF_SUPERVISED from "./self_supervised";

export const MODELS = {
  ...CNN,
  ...TRANSFORMER,
  ...BASIC_NN,
  ...RNN,
  ...VAE,
  ...SELF_SUPERVISED,
};

export const LAYER_CONFIGS = {
  ...CNN.LAYER_CONFIGS,
  ...TRANSFORMER.LAYER_CONFIGS,
  ...BASIC_NN.LAYER_CONFIGS,
  ...RNN.LAYER_CONFIGS,
  ...VAE.LAYER_CONFIGS,
  ...SELF_SUPERVISED.LAYER_CONFIGS,
};

export const GRID_CONFIGS = {
  ...CNN.GRID_CONFIGS,
  ...TRANSFORMER.GRID_CONFIGS,
  ...BASIC_NN.GRID_CONFIGS,
  ...RNN.GRID_CONFIGS,
  ...VAE.GRID_CONFIGS,
  ...SELF_SUPERVISED.GRID_CONFIGS,
};
