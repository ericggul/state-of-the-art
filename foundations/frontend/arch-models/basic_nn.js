export const MCCULLOCH_PITTS_NEURON = [
  { name: "Inputs", type: "input", neurons: 2 },
  { name: "McCulloch-Pitts Neuron", type: "neuron", neurons: 3 },
  { name: "Output", type: "output", neurons: 2 },
];

export const PERCEPTRON = [
  { name: "Inputs", type: "input", neurons: 3 },
  { name: "Weights", type: "weights", neurons: 3 },
  { name: "Perceptron", type: "neuron", neurons: 2 },
  { name: "Output", type: "output", neurons: 1 },
];

export const MULTI_LAYER_PERCEPTRON_MLP = [
  { name: "Input Layer", type: "input", neurons: 3 },
  { name: "Hidden Layer", type: "hidden", neurons: 4 },
  { name: "Output Layer", type: "output", neurons: 2 },
  { name: "Input Layer", type: "input", neurons: 3 },
  { name: "Hidden Layer", type: "hidden", neurons: 4 },
  { name: "Output Layer", type: "output", neurons: 2 },
  { name: "Input Layer", type: "input", neurons: 3 },
  { name: "Hidden Layer", type: "hidden", neurons: 4 },
  { name: "Output Layer", type: "output", neurons: 2 },
];

export const BACKPROPAGATION_ALGORITHM = [
  { name: "Input Layer", type: "input", neurons: 4 },
  { name: "Hidden Layer", type: "hidden", neurons: 6 },
  { name: "Hidden Layer", type: "hidden", neurons: 5 },
  { name: "Hidden Layer", type: "hidden", neurons: 6 },
  { name: "Hidden Layer", type: "hidden", neurons: 5 },
  { name: "Hidden Layer", type: "hidden", neurons: 4 },
  { name: "Output Layer", type: "output", neurons: 4 },
];

export const LAYER_CONFIGS = {
  MCCULLOCH_PITTS_NEURON: {
    type: "basic_nn",
    keyPrefix: "mp",
    layerHeight: 20,
  },
  PERCEPTRON: {
    type: "basic_nn",
    keyPrefix: "perceptron",
    layerHeight: 15,
  },
  MULTI_LAYER_PERCEPTRON_MLP: {
    type: "basic_nn",
    keyPrefix: "mlp",
    layerHeight: 10,
  },
  BACKPROPAGATION_ALGORITHM: {
    type: "basic_nn",
    keyPrefix: "backprop",
    layerHeight: 10,
  },
};

export const GRID_CONFIGS = {
  // Add any specific grid configurations for basic_nn models here
  // For example:
  MULTI_LAYER_PERCEPTRON_MLP: {
    input: { xCount: 3, yCount: 3, xInterval: 5, yInterval: 5 },
    hidden: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 5 },
    output: { xCount: 2, yCount: 2, xInterval: 5, yInterval: 5 },
  },
};
