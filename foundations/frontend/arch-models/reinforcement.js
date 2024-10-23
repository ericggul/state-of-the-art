// Constants for Reinforcement Learning models
const INPUT_DIM_ATARI = [84, 84, 4]; // Input dimensions for Atari (stacked frames)
const ACTION_DIM_ATARI = 18; // Number of actions in typical Atari games

const INPUT_DIM_GO = [19, 19, 17]; // Input dimensions for AlphaGo (19x19 board with features)
const ACTION_DIM_GO = 361; // 19x19 possible moves

const INPUT_DIM_CHESS = [8, 8, 119]; // Input dimensions for AlphaZero/MuZero (Chess)
const ACTION_DIM_CHESS = 4672; // Possible moves in chess (approximate)

const RESIDUAL_FILTERS = 256; // Number of filters in residual blocks
const NUM_RESIDUAL_BLOCKS_ALPHAGO = 13; // AlphaGo uses 13 residual blocks
const NUM_RESIDUAL_BLOCKS_ALPHAZERO = 19; // AlphaZero uses 19-40 residual blocks
const NUM_LSTM_UNITS = 256; // For A3C LSTM layer

// Model definitions

/** Deep Q-Network (DQN) **/
export const DEEP_Q_NETWORK_DQN = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIM_ATARI,
  },
  // Convolutional Layers
  {
    name: "Conv Layer 1",
    type: "conv",
    dimensions: [20, 20, 32],
    parameters: {
      kernel_size: [8, 8],
      stride: 4,
    },
  },
  {
    name: "Conv Layer 2",
    type: "conv",
    dimensions: [9, 9, 64],
    parameters: {
      kernel_size: [4, 4],
      stride: 2,
    },
  },
  {
    name: "Conv Layer 3",
    type: "conv",
    dimensions: [7, 7, 64],
    parameters: {
      kernel_size: [3, 3],
      stride: 1,
    },
  },
  {
    name: "Flatten",
    type: "flatten",
    dimensions: [1, 1, 3136], // Adjusted based on previous layers
  },
  {
    name: "Fully Connected",
    type: "dense",
    dimensions: [1, 1, 512],
  },
  {
    name: "Output Q-Values",
    type: "output",
    dimensions: [1, 1, ACTION_DIM_ATARI],
  },
];

/** Asynchronous Advantage Actor-Critic (A3C) **/
export const A3C = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIM_ATARI,
  },
  // Convolutional Layers
  {
    name: "Conv Layer 1",
    type: "conv",
    dimensions: [20, 20, 16],
    parameters: {
      kernel_size: [8, 8],
      stride: 4,
    },
  },
  {
    name: "Conv Layer 2",
    type: "conv",
    dimensions: [9, 9, 32],
    parameters: {
      kernel_size: [4, 4],
      stride: 2,
    },
  },
  {
    name: "Flatten",
    type: "flatten",
    dimensions: [1, 1, 2592],
  },
  {
    name: "LSTM Layer",
    type: "lstm",
    dimensions: [1, 1, NUM_LSTM_UNITS],
    parameters: {
      units: NUM_LSTM_UNITS,
    },
  },
  {
    name: "Policy Output",
    type: "output",
    dimensions: [1, 1, ACTION_DIM_ATARI],
  },
  {
    name: "Value Output",
    type: "output",
    dimensions: [1, 1, 1],
  },
];

/** AlphaGo **/
export const ALPHAGO = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIM_GO,
  },
  // Initial Convolution Layer
  {
    name: "Initial Conv Layer",
    type: "conv",
    dimensions: [19, 19, RESIDUAL_FILTERS],
    parameters: {
      kernel_size: [5, 5],
      stride: 1,
      padding: "same",
    },
  },
  // Residual Blocks
  ...Array.from({ length: NUM_RESIDUAL_BLOCKS_ALPHAGO }, (_, i) => ({
    name: `Residual Block ${i + 1}`,
    type: "residual_block",
    dimensions: [19, 19, RESIDUAL_FILTERS],
    sublayers: [
      {
        name: `Conv Layer 1`,
        type: "conv",
        dimensions: [19, 19, RESIDUAL_FILTERS],
        parameters: {
          kernel_size: [3, 3],
          stride: 1,
          padding: "same",
        },
      },
      {
        name: `Batch Norm 1`,
        type: "batch_norm",
        dimensions: [19, 19, RESIDUAL_FILTERS],
      },
      {
        name: `ReLU Activation 1`,
        type: "activation",
        activation: "relu",
      },
      {
        name: `Conv Layer 2`,
        type: "conv",
        dimensions: [19, 19, RESIDUAL_FILTERS],
        parameters: {
          kernel_size: [3, 3],
          stride: 1,
          padding: "same",
        },
      },
      {
        name: `Batch Norm 2`,
        type: "batch_norm",
        dimensions: [19, 19, RESIDUAL_FILTERS],
      },
      // Note: Skip connection is implied in residual blocks
    ],
  })),
  // Policy Head
  {
    name: "Policy Head",
    type: "policy_head",
    sublayers: [
      {
        name: "Conv Layer",
        type: "conv",
        dimensions: [19, 19, 2],
        parameters: {
          kernel_size: [1, 1],
          stride: 1,
        },
      },
      {
        name: "Batch Norm",
        type: "batch_norm",
        dimensions: [19, 19, 2],
      },
      {
        name: "ReLU Activation",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Flatten",
        type: "flatten",
        dimensions: [1, 1, 722], // 19 * 19 * 2
      },
      {
        name: "Fully Connected",
        type: "dense",
        dimensions: [1, 1, ACTION_DIM_GO],
      },
      {
        name: "Softmax Output",
        type: "activation",
        activation: "softmax",
      },
    ],
  },
  // Value Head
  {
    name: "Value Head",
    type: "value_head",
    sublayers: [
      {
        name: "Conv Layer",
        type: "conv",
        dimensions: [19, 19, 1],
        parameters: {
          kernel_size: [1, 1],
          stride: 1,
        },
      },
      {
        name: "Batch Norm",
        type: "batch_norm",
        dimensions: [19, 19, 1],
      },
      {
        name: "ReLU Activation",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Flatten",
        type: "flatten",
        dimensions: [1, 1, 361], // 19 * 19 * 1
      },
      {
        name: "Fully Connected",
        type: "dense",
        dimensions: [1, 1, 256],
      },
      {
        name: "ReLU Activation",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Scalar Output",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "tanh",
      },
    ],
  },
];

/** AlphaZero **/
export const ALPHAZERO = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIM_CHESS,
  },
  // Initial Convolution Layer
  {
    name: "Initial Conv Layer",
    type: "conv",
    dimensions: [8, 8, RESIDUAL_FILTERS],
    parameters: {
      kernel_size: [3, 3],
      stride: 1,
      padding: "same",
    },
  },
  // Residual Blocks
  ...Array.from({ length: NUM_RESIDUAL_BLOCKS_ALPHAZERO }, (_, i) => ({
    name: `Residual Block ${i + 1}`,
    type: "residual_block",
    dimensions: [8, 8, RESIDUAL_FILTERS],
    sublayers: [
      {
        name: `Conv Layer 1`,
        type: "conv",
        dimensions: [8, 8, RESIDUAL_FILTERS],
        parameters: {
          kernel_size: [3, 3],
          stride: 1,
          padding: "same",
        },
      },
      {
        name: `Batch Norm 1`,
        type: "batch_norm",
        dimensions: [8, 8, RESIDUAL_FILTERS],
      },
      {
        name: `ReLU Activation 1`,
        type: "activation",
        activation: "relu",
      },
      {
        name: `Conv Layer 2`,
        type: "conv",
        dimensions: [8, 8, RESIDUAL_FILTERS],
        parameters: {
          kernel_size: [3, 3],
          stride: 1,
          padding: "same",
        },
      },
      {
        name: `Batch Norm 2`,
        type: "batch_norm",
        dimensions: [8, 8, RESIDUAL_FILTERS],
      },
      // Skip connection is implied
    ],
  })),
  // Policy Head
  {
    name: "Policy Head",
    type: "policy_head",
    sublayers: [
      {
        name: "Conv Layer",
        type: "conv",
        dimensions: [8, 8, 2],
        parameters: {
          kernel_size: [1, 1],
          stride: 1,
        },
      },
      {
        name: "Batch Norm",
        type: "batch_norm",
        dimensions: [8, 8, 2],
      },
      {
        name: "ReLU Activation",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Flatten",
        type: "flatten",
        dimensions: [1, 1, 128], // 8 * 8 * 2
      },
      {
        name: "Fully Connected",
        type: "dense",
        dimensions: [1, 1, ACTION_DIM_CHESS],
      },
      {
        name: "Softmax Output",
        type: "activation",
        activation: "softmax",
      },
    ],
  },
  // Value Head
  {
    name: "Value Head",
    type: "value_head",
    sublayers: [
      {
        name: "Conv Layer",
        type: "conv",
        dimensions: [8, 8, 1],
        parameters: {
          kernel_size: [1, 1],
          stride: 1,
        },
      },
      {
        name: "Batch Norm",
        type: "batch_norm",
        dimensions: [8, 8, 1],
      },
      {
        name: "ReLU Activation",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Flatten",
        type: "flatten",
        dimensions: [1, 1, 64], // 8 * 8 * 1
      },
      {
        name: "Fully Connected",
        type: "dense",
        dimensions: [1, 1, 256],
      },
      {
        name: "ReLU Activation",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Scalar Output",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "tanh",
      },
    ],
  },
];

/** MuZero **/
export const MUZERO = [
  // Representation Network
  {
    name: "Representation Network",
    type: "representation_network",
    sublayers: [
      {
        name: "Input",
        type: "input",
        dimensions: INPUT_DIM_CHESS,
      },
      ...Array.from({ length: NUM_RESIDUAL_BLOCKS_ALPHAZERO }, (_, i) => ({
        name: `Residual Block ${i + 1}`,
        type: "residual_block",
        dimensions: [8, 8, RESIDUAL_FILTERS],
        sublayers: [
          {
            name: `Conv Layer 1`,
            type: "conv",
            dimensions: [8, 8, RESIDUAL_FILTERS],
            parameters: {
              kernel_size: [3, 3],
              stride: 1,
              padding: "same",
            },
          },
          {
            name: `Batch Norm 1`,
            type: "batch_norm",
            dimensions: [8, 8, RESIDUAL_FILTERS],
          },
          {
            name: `ReLU Activation 1`,
            type: "activation",
            activation: "relu",
          },
          {
            name: `Conv Layer 2`,
            type: "conv",
            dimensions: [8, 8, RESIDUAL_FILTERS],
            parameters: {
              kernel_size: [3, 3],
              stride: 1,
              padding: "same",
            },
          },
          {
            name: `Batch Norm 2`,
            type: "batch_norm",
            dimensions: [8, 8, RESIDUAL_FILTERS],
          },
        ],
      })),
    ],
  },
  // Dynamics Network
  {
    name: "Dynamics Network",
    type: "dynamics_network",
    sublayers: [
      {
        name: "Action",
        type: "input_action",
        dimensions: [1, 1, ACTION_DIM_CHESS],
      },
      {
        name: "Concat with Hidden State",
        type: "concat",
        dimensions: [8, 8, RESIDUAL_FILTERS + ACTION_DIM_CHESS],
      },
      ...Array.from({ length: NUM_RESIDUAL_BLOCKS_ALPHAZERO }, (_, i) => ({
        name: `Residual Block ${i + 1}`,
        type: "residual_block",
        dimensions: [8, 8, RESIDUAL_FILTERS],
        sublayers: [
          {
            name: `Conv Layer 1`,
            type: "conv",
            dimensions: [8, 8, RESIDUAL_FILTERS],
            parameters: {
              kernel_size: [3, 3],
              stride: 1,
              padding: "same",
            },
          },
          {
            name: `Batch Norm 1`,
            type: "batch_norm",
            dimensions: [8, 8, RESIDUAL_FILTERS],
          },
          {
            name: `ReLU Activation 1`,
            type: "activation",
            activation: "relu",
          },
          {
            name: `Conv Layer 2`,
            type: "conv",
            dimensions: [8, 8, RESIDUAL_FILTERS],
            parameters: {
              kernel_size: [3, 3],
              stride: 1,
              padding: "same",
            },
          },
          {
            name: `Batch Norm 2`,
            type: "batch_norm",
            dimensions: [8, 8, RESIDUAL_FILTERS],
          },
        ],
      })),
      // Predicted Reward
      {
        name: "Predicted Reward",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "tanh",
      },
    ],
  },
  // Prediction Network
  {
    name: "Prediction Network",
    type: "prediction_network",
    sublayers: [
      ...Array.from({ length: NUM_RESIDUAL_BLOCKS_ALPHAZERO }, (_, i) => ({
        name: `Residual Block ${i + 1}`,
        type: "residual_block",
        dimensions: [8, 8, RESIDUAL_FILTERS],
        sublayers: [
          {
            name: `Conv Layer 1`,
            type: "conv",
            dimensions: [8, 8, RESIDUAL_FILTERS],
            parameters: {
              kernel_size: [3, 3],
              stride: 1,
              padding: "same",
            },
          },
          {
            name: `Batch Norm 1`,
            type: "batch_norm",
            dimensions: [8, 8, RESIDUAL_FILTERS],
          },
          {
            name: `ReLU Activation 1`,
            type: "activation",
            activation: "relu",
          },
          {
            name: `Conv Layer 2`,
            type: "conv",
            dimensions: [8, 8, RESIDUAL_FILTERS],
            parameters: {
              kernel_size: [3, 3],
              stride: 1,
              padding: "same",
            },
          },
          {
            name: `Batch Norm 2`,
            type: "batch_norm",
            dimensions: [8, 8, RESIDUAL_FILTERS],
          },
        ],
      })),
      // Policy Head
      {
        name: "Policy Head",
        type: "policy_head",
        sublayers: [
          {
            name: "Conv Layer",
            type: "conv",
            dimensions: [8, 8, 2],
            parameters: {
              kernel_size: [1, 1],
              stride: 1,
            },
          },
          {
            name: "Batch Norm",
            type: "batch_norm",
            dimensions: [8, 8, 2],
          },
          {
            name: "ReLU Activation",
            type: "activation",
            activation: "relu",
          },
          {
            name: "Flatten",
            type: "flatten",
            dimensions: [1, 1, 128],
          },
          {
            name: "Fully Connected",
            type: "dense",
            dimensions: [1, 1, ACTION_DIM_CHESS],
          },
          {
            name: "Softmax Output",
            type: "activation",
            activation: "softmax",
          },
        ],
      },
      // Value Head
      {
        name: "Value Head",
        type: "value_head",
        sublayers: [
          {
            name: "Conv Layer",
            type: "conv",
            dimensions: [8, 8, 1],
            parameters: {
              kernel_size: [1, 1],
              stride: 1,
            },
          },
          {
            name: "Batch Norm",
            type: "batch_norm",
            dimensions: [8, 8, 1],
          },
          {
            name: "ReLU Activation",
            type: "activation",
            activation: "relu",
          },
          {
            name: "Flatten",
            type: "flatten",
            dimensions: [1, 1, 64],
          },
          {
            name: "Fully Connected",
            type: "dense",
            dimensions: [1, 1, 256],
          },
          {
            name: "ReLU Activation",
            type: "activation",
            activation: "relu",
          },
          {
            name: "Scalar Output",
            type: "dense",
            dimensions: [1, 1, 1],
            activation: "tanh",
          },
        ],
      },
      // Predicted Value and Policy
    ],
  },
];

// Layer configurations for reinforcement models
export const LAYER_CONFIGS = {
  DEEP_Q_NETWORK_DQN: {
    layerHeight: 40,
    keyPrefix: "dqn",
    type: "reinforcement",
  },
  A3C: {
    layerHeight: 50,
    keyPrefix: "a3c",
    type: "reinforcement",
  },
  ALPHAGO: {
    layerHeight: 90,
    keyPrefix: "alphago",
    type: "reinforcement",
  },
  ALPHAZERO: {
    layerHeight: 120,
    keyPrefix: "alphazero",
    type: "reinforcement",
  },
  MUZERO: {
    layerHeight: 150,
    keyPrefix: "muzero",
    type: "reinforcement",
  },
};

// Grid configurations for reinforcement models
export const GRID_CONFIGS = {
  DEEP_Q_NETWORK_DQN: {
    input: {
      xCount: INPUT_DIM_ATARI[0],
      yCount: INPUT_DIM_ATARI[1],
      xInterval: 1,
      yInterval: 1,
    },
    conv: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 3 },
    dense: { xCount: 512, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    output: { xCount: ACTION_DIM_ATARI, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  A3C: {
    input: {
      xCount: INPUT_DIM_ATARI[0],
      yCount: INPUT_DIM_ATARI[1],
      xInterval: 1,
      yInterval: 1,
    },
    conv: { xCount: 8, yCount: 8, xInterval: 3, yInterval: 3 },
    lstm: { xCount: NUM_LSTM_UNITS, yCount: 1, xInterval: 0.5, yInterval: 0.5 },
    output: { xCount: ACTION_DIM_ATARI, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  ALPHAGO: {
    input: { xCount: 19, yCount: 19, xInterval: 1, yInterval: 1 },
    conv: { xCount: RESIDUAL_FILTERS, yCount: 1, xInterval: 2, yInterval: 2 },
    residual_block: {
      xCount: RESIDUAL_FILTERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    policy_head: {
      xCount: ACTION_DIM_GO,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    value_head: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  ALPHAZERO: {
    input: { xCount: 8, yCount: 8, xInterval: 1, yInterval: 1 },
    conv: { xCount: RESIDUAL_FILTERS, yCount: 1, xInterval: 2, yInterval: 2 },
    residual_block: {
      xCount: RESIDUAL_FILTERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    policy_head: {
      xCount: ACTION_DIM_CHESS,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    value_head: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  MUZERO: {
    representation_network: {
      xCount: 8,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    dynamics_network: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    prediction_network: { xCount: 8, yCount: 8, xInterval: 2, yInterval: 2 },
    residual_block: {
      xCount: RESIDUAL_FILTERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    policy_head: {
      xCount: ACTION_DIM_CHESS,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    value_head: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
};
