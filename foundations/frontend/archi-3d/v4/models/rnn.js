// models/rnn.js

// Constants for model configurations
const NUM_RNN_LAYERS = 10;
const NUM_LSTM_LAYERS = 10;
const NUM_GRU_LAYERS = 10;
const HIDDEN_SIZE = 128;

// Common dimensions for layers
const INPUT_DIMENSIONS = [10, 10, 1]; // Adjust as needed
const RNN_LAYER_DIMENSIONS = [20, 20, 1]; // Adjust as needed
const OUTPUT_DIMENSIONS = [10, 10, 1]; // Adjust as needed

export const RNN_RECURRENT_NEURAL_NETWORK = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
  ...Array.from({ length: NUM_RNN_LAYERS }, (_, i) => ({
    name: `RNN Layer ${i + 1}`,
    type: "rnn_cell",
    dimensions: RNN_LAYER_DIMENSIONS,
    zSpan: [4, 4],
  })),
  {
    name: "Output",
    type: "output",
    dimensions: OUTPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
];

export const LONG_SHORT_TERM_MEMORY_LSTM = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
  ...Array.from({ length: NUM_LSTM_LAYERS }, (_, i) => ({
    name: `LSTM Layer ${i + 1}`,
    type: "lstm_cell",
    dimensions: RNN_LAYER_DIMENSIONS,
    zSpan: [4, 4],
  })),
  {
    name: "Output",
    type: "output",
    dimensions: OUTPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
];

export const PEEPHOLE_LSTM = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
  {
    name: "Peephole LSTM Layer",
    type: "peephole_lstm_cell",
    dimensions: RNN_LAYER_DIMENSIONS,
    zSpan: [4, 4],
  },
  {
    name: "Output",
    type: "output",
    dimensions: OUTPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
];

export const BIDIRECTIONAL_LSTM = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
  {
    name: "Forward LSTM Layer",
    type: "lstm_cell",
    dimensions: RNN_LAYER_DIMENSIONS,
    zSpan: [4, 4],
    direction: "forward",
  },
  {
    name: "Backward LSTM Layer",
    type: "lstm_cell",
    dimensions: RNN_LAYER_DIMENSIONS,
    zSpan: [4, 4],
    direction: "backward",
  },
  {
    name: "Concatenate",
    type: "concat",
    dimensions: [
      RNN_LAYER_DIMENSIONS[0],
      RNN_LAYER_DIMENSIONS[1],
      RNN_LAYER_DIMENSIONS[2] * 2,
    ],
    zSpan: [4, 4],
  },
  {
    name: "Output",
    type: "output",
    dimensions: [
      OUTPUT_DIMENSIONS[0],
      OUTPUT_DIMENSIONS[1],
      OUTPUT_DIMENSIONS[2] * 2,
    ],
    zSpan: [1, 1],
  },
];

export const GATED_RECURRENT_UNIT_GRU = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
  ...Array.from({ length: NUM_GRU_LAYERS }, (_, i) => ({
    name: `GRU Layer ${i + 1}`,
    type: "gru_cell",
    dimensions: RNN_LAYER_DIMENSIONS,
    zSpan: [4, 4],
  })),
  {
    name: "Output",
    type: "output",
    dimensions: OUTPUT_DIMENSIONS,
    zSpan: [1, 1],
  },
];

// Export models
export const MODELS = {
  RNN_RECURRENT_NEURAL_NETWORK,
  LONG_SHORT_TERM_MEMORY_LSTM,
  PEEPHOLE_LSTM,
  BIDIRECTIONAL_LSTM,
  GATED_RECURRENT_UNIT_GRU,
};

// Layer configurations
export const LAYER_CONFIGS = {
  RNN_RECURRENT_NEURAL_NETWORK: {
    layerHeight: 20,
    keyPrefix: "simplernn",
    type: "rnn",
  },
  LONG_SHORT_TERM_MEMORY_LSTM: {
    layerHeight: 20,
    keyPrefix: "lstm",
    type: "rnn",
  },
  PEEPHOLE_LSTM: {
    layerHeight: 20,
    keyPrefix: "peephole_lstm",
    type: "rnn",
  },
  BIDIRECTIONAL_LSTM: {
    layerHeight: 20,
    keyPrefix: "bidirectional_lstm",
    type: "rnn",
  },
  GATED_RECURRENT_UNIT_GRU: {
    layerHeight: 20,
    keyPrefix: "gru",
    type: "rnn",
  },
};

// Grid configurations
export const GRID_CONFIGS = {
  RNN_RECURRENT_NEURAL_NETWORK: {
    input: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    rnn_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    output: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  LONG_SHORT_TERM_MEMORY_LSTM: {
    input: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    lstm_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    output: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  PEEPHOLE_LSTM: {
    input: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    peephole_lstm_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    output: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  BIDIRECTIONAL_LSTM: {
    input: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    lstm_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 }, // For both forward and backward layers
    concat: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    output: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  GATED_RECURRENT_UNIT_GRU: {
    input: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    gru_cell: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
    output: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
};
