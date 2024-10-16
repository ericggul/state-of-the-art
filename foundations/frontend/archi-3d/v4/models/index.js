import * as CNN from "./cnn";
import * as TRANSFORMER from "./transformer";
import * as BASIC_NN from "./basic_nn";
import * as RNN from "./rnn";

export const MODELS = {
  ...CNN,
  ...TRANSFORMER,
  ...BASIC_NN,
  ...RNN,
};

export const LAYER_CONFIGS = {
  ...CNN.LAYER_CONFIGS,
  ...TRANSFORMER.LAYER_CONFIGS,
  ...BASIC_NN.LAYER_CONFIGS,
  ...RNN.LAYER_CONFIGS,
};

export const GRID_CONFIGS = {
  ...CNN.GRID_CONFIGS,
  ...TRANSFORMER.GRID_CONFIGS,
  ...BASIC_NN.GRID_CONFIGS,
  ...RNN.GRID_CONFIGS,
};
