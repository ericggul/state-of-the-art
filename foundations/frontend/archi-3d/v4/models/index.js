import * as CNN from "./cnn";
import * as TRANSFORMER from "./transformer";
import * as BASIC_NN from "./basic_nn";

export const MODELS = {
  ...CNN,
  ...TRANSFORMER,
  ...BASIC_NN,
};
