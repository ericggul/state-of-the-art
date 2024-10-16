// models/rnn.js

// Constants for model configurations
const NUM_RNN_LAYERS = 1;
const NUM_LSTM_LAYERS = 1;
const NUM_GRU_LAYERS = 1;
const HIDDEN_SIZE = 128;

export const RNN_RECURRENT_NEURAL_NETWORK = [
  { name: "Input", type: "input", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
  ...Array.from({ length: NUM_RNN_LAYERS }, (_, i) => ({
    name: `RNN Layer ${i + 1}`,
    type: "rnn_cell",
    dimensions: [HIDDEN_SIZE],
    zSpan: [4, 4],
  })),
  { name: "Output", type: "output", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
];

export const LSTM = [
  { name: "Input", type: "input", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
  ...Array.from({ length: NUM_LSTM_LAYERS }, (_, i) => ({
    name: `LSTM Layer ${i + 1}`,
    type: "lstm_cell",
    dimensions: [HIDDEN_SIZE],
    zSpan: [4, 4],
  })),
  { name: "Output", type: "output", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
];

export const PEEPHOLE_LSTM = [
  { name: "Input", type: "input", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
  {
    name: "Peephole LSTM Layer",
    type: "peephole_lstm_cell",
    dimensions: [HIDDEN_SIZE],
    zSpan: [4, 4],
  },
  { name: "Output", type: "output", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
];

export const BIDIRECTIONAL_LSTM = [
  { name: "Input", type: "input", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
  {
    name: "Forward LSTM Layer",
    type: "lstm_cell",
    dimensions: [HIDDEN_SIZE],
    zSpan: [4, 4],
    direction: "forward",
  },
  {
    name: "Backward LSTM Layer",
    type: "lstm_cell",
    dimensions: [HIDDEN_SIZE],
    zSpan: [4, 4],
    direction: "backward",
  },
  {
    name: "Concatenate",
    type: "concat",
    dimensions: [HIDDEN_SIZE * 2],
    zSpan: [4, 4],
  },
  {
    name: "Output",
    type: "output",
    dimensions: [HIDDEN_SIZE * 2],
    zSpan: [1, 1],
  },
];

export const GRU = [
  { name: "Input", type: "input", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
  ...Array.from({ length: NUM_GRU_LAYERS }, (_, i) => ({
    name: `GRU Layer ${i + 1}`,
    type: "gru_cell",
    dimensions: [HIDDEN_SIZE],
    zSpan: [4, 4],
  })),
  { name: "Output", type: "output", dimensions: [HIDDEN_SIZE], zSpan: [1, 1] },
];

// Export models
export const MODELS = {
  RNN_RECURRENT_NEURAL_NETWORK,
  LSTM,
  PEEPHOLE_LSTM,
  BIDIRECTIONAL_LSTM,
  GRU,
};

// Layer configurations
export const LAYER_CONFIGS = {
  RNN_RECURRENT_NEURAL_NETWORK: {
    layerHeight: 60,
    keyPrefix: "simplernn",
    type: "rnn",
  },
  LSTM: {
    layerHeight: 60,
    keyPrefix: "lstm",
    type: "rnn",
  },
  PEEPHOLE_LSTM: {
    layerHeight: 60,
    keyPrefix: "peephole_lstm",
    type: "rnn",
  },
  BIDIRECTIONAL_LSTM: {
    layerHeight: 60,
    keyPrefix: "bidirectional_lstm",
    type: "rnn",
  },
  GRU: {
    layerHeight: 60,
    keyPrefix: "gru",
    type: "rnn",
  },
};

// Grid configurations (if needed)
export const GRID_CONFIGS = {
  RNN_RECURRENT_NEURAL_NETWORK: {
    rnn_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  LSTM: {
    lstm_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  PEEPHOLE_LSTM: {
    peephole_lstm_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  BIDIRECTIONAL_LSTM: {
    bidirectional_lstm_cell: {
      xCount: 1,
      yCount: 1,
      xInterval: 5,
      yInterval: 5,
    },
  },
  GRU: {
    gru_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  // Add configurations for other models...
};
