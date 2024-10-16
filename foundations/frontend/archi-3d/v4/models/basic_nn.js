export const MCCULLOCH_PITTS_NEURON = [
  { name: "Inputs", type: "input", neurons: 2 },
  { name: "McCulloch-Pitts Neuron", type: "neuron", neurons: 1 },
  { name: "Output", type: "output", neurons: 1 },
];

export const PERCEPTRON = [
  { name: "Inputs", type: "input", neurons: 3 },
  { name: "Weights", type: "weights", neurons: 3 },
  { name: "Perceptron", type: "neuron", neurons: 1 },
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
