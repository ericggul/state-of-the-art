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

const INPUT_DIM_MUJOCO = [17, 1, 1]; // Input dimensions for MuJoCo Humanoid task
const ACTION_DIM_MUJOCO = [17, 1, 1]; // Action dimensions for MuJoCo Humanoid task

// Constants for AlphaStar
const INPUT_DIM_ALPHASTAR = [512, 512, 13]; // Spatial dimensions (512x512) with 13 feature layers
const ACTION_DIM_ALPHASTAR = 1000000; // Approximate number of possible actions in StarCraft II
const NUM_ACTION_TYPES = 20; // Approximate number of action types in StarCraft II
const NUM_ARGUMENT_TYPES = 13; // Number of different argument types for actions

// Add PPO-specific constants
const NUM_PPO_LAYERS = 3;
const PPO_HIDDEN_DIM = 64;
const PPO_ACTOR_DIM = 256;
const PPO_CRITIC_DIM = 256;

// Add AlphaGo Zero specific constants
const NUM_RESIDUAL_BLOCKS_ALPHAGO_ZERO = 40; // Deeper network than AlphaGo
const ALPHAGO_ZERO_FILTERS = 256;
const ALPHAGO_ZERO_INPUT_DIM = [19, 19, 17]; // Go board with feature planes

// Add OpenAI Five specific constants
const NUM_OPENAI_FIVE_LSTM_UNITS = 8192;
const NUM_OPENAI_FIVE_LSTM_LAYERS = 4;
const NUM_OPENAI_FIVE_HIDDEN_UNITS = 8192;
const OPENAI_FIVE_EMBED_DIM = 1024;
const NUM_HEROES = 117; // Number of heroes in Dota 2
const NUM_ITEMS = 200; // Approximate number of items
const NUM_ABILITIES = 400; // Approximate number of abilities

const DOTA_ACTION_DIM = 170000; // Approximate action space size for Dota 2
const DOTA_OBS_DIM = 1228; // Observation space size

// Add AlphaFold specific constants
const MSA_MAX_SEQUENCES = 32;
const MSA_MAX_POSITIONS = 512;
const NUM_MSA_FEATURES = 49;
const NUM_PAIR_FEATURES = 88;
const NUM_RECYCLING_ITERS = 3;
const NUM_EXTRA_SEQ_FEATURES = 7;
const NUM_TEMPLATES = 4;
const TEMPLATE_DIM = 64;
const ALPHAFOLD_EMBED_DIM = 256;

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

// Model definitions

/** AlphaStar **/
export const ALPHASTAR = [
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIM_ALPHASTAR,
  },
  // Encoder Network
  {
    name: "Encoder",
    type: "encoder",
    sublayers: [
      {
        name: "Transformer Encoder",
        type: "transformer_encoder",
        dimensions: [512, 512, 512],
        parameters: {
          num_layers: 4,
          num_heads: 8,
          d_model: 512,
        },
      },
    ],
  },
  // Core LSTM
  {
    name: "Core LSTM",
    type: "lstm",
    dimensions: [1, 1, 1024],
    parameters: {
      units: 1024,
    },
  },
  // Policy Head
  {
    name: "Policy Head",
    type: "policy_head",
    sublayers: [
      {
        name: "Action Type Logits",
        type: "dense",
        dimensions: [1, 1, NUM_ACTION_TYPES],
        activation: "linear",
      },
      {
        name: "Argument Heads",
        type: "argument_heads",
        sublayers: Array.from({ length: NUM_ARGUMENT_TYPES }, (_, i) => ({
          name: `Argument Head ${i + 1}`,
          type: "pointer_network",
          dimensions: [1, 1, 512],
          parameters: {
            num_pointers: 1,
          },
        })),
      },
    ],
  },
  // Value Head
  {
    name: "Value Head",
    type: "value_head",
    sublayers: [
      {
        name: "Dense Layer",
        type: "dense",
        dimensions: [1, 1, 256],
        activation: "relu",
      },
      {
        name: "Scalar Output",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "linear",
      },
    ],
  },
];

/** PPO **/
export const PPO = [
  // Shared Feature Extractor
  {
    name: "Input",
    type: "input",
    dimensions: INPUT_DIM_ATARI,
  },
  {
    name: "Feature Extractor",
    type: "feature_extractor",
    dimensions: [20, 20, 32],
    sublayers: [
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
        dimensions: [1, 1, 3136],
      },
    ],
  },

  // Actor Network (Policy)
  {
    name: "Actor Network",
    type: "actor_network",
    dimensions: [1, 1, PPO_ACTOR_DIM],
    sublayers: [
      {
        name: "Actor Hidden 1",
        type: "dense",
        dimensions: [1, 1, PPO_ACTOR_DIM],
        activation: "relu",
      },
      {
        name: "Actor Hidden 2",
        type: "dense",
        dimensions: [1, 1, PPO_ACTOR_DIM],
        activation: "relu",
      },
      {
        name: "Action Mean",
        type: "dense",
        dimensions: [1, 1, ACTION_DIM_ATARI],
        activation: "tanh",
      },
      {
        name: "Action Std",
        type: "dense",
        dimensions: [1, 1, ACTION_DIM_ATARI],
        activation: "softplus",
      },
    ],
  },

  // Critic Network (Value)
  {
    name: "Critic Network",
    type: "critic_network",
    dimensions: [1, 1, PPO_CRITIC_DIM],
    sublayers: [
      {
        name: "Critic Hidden 1",
        type: "dense",
        dimensions: [1, 1, PPO_CRITIC_DIM],
        activation: "relu",
      },
      {
        name: "Critic Hidden 2",
        type: "dense",
        dimensions: [1, 1, PPO_CRITIC_DIM],
        activation: "relu",
      },
      {
        name: "Value Output",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "linear",
      },
    ],
  },
];

/** AlphaGo Zero **/
export const ALPHAGO_ZERO = [
  // Input Layer
  {
    name: "Input",
    type: "input",
    dimensions: ALPHAGO_ZERO_INPUT_DIM,
  },

  // Initial Convolution Block
  {
    name: "Initial Block",
    type: "conv_block",
    dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
    sublayers: [
      {
        name: "Conv Layer",
        type: "conv",
        dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
        parameters: {
          kernel_size: [3, 3],
          stride: 1,
          padding: "same",
        },
      },
      {
        name: "Batch Norm",
        type: "batch_norm",
        dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
      },
      {
        name: "ReLU",
        type: "activation",
        activation: "relu",
      },
    ],
  },

  // Residual Tower
  {
    name: "Residual Tower",
    type: "residual_tower",
    dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
    sublayers: Array.from(
      { length: NUM_RESIDUAL_BLOCKS_ALPHAGO_ZERO },
      (_, i) => ({
        name: `Residual Block ${i + 1}`,
        type: "residual_block",
        dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
        sublayers: [
          {
            name: "Conv1 + BN + ReLU",
            type: "conv_block",
            dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
            sublayers: [
              {
                name: "Conv",
                type: "conv",
                dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
                parameters: {
                  kernel_size: [3, 3],
                  stride: 1,
                  padding: "same",
                },
              },
              {
                name: "BatchNorm",
                type: "batch_norm",
                dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
              },
              {
                name: "ReLU",
                type: "activation",
                activation: "relu",
              },
            ],
          },
          {
            name: "Conv2 + BN",
            type: "conv_block",
            dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
            sublayers: [
              {
                name: "Conv",
                type: "conv",
                dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
                parameters: {
                  kernel_size: [3, 3],
                  stride: 1,
                  padding: "same",
                },
              },
              {
                name: "BatchNorm",
                type: "batch_norm",
                dimensions: [19, 19, ALPHAGO_ZERO_FILTERS],
              },
            ],
          },
        ],
      })
    ),
  },

  // Policy Head
  {
    name: "Policy Head",
    type: "policy_head",
    dimensions: [19, 19, 2],
    sublayers: [
      {
        name: "Policy Conv",
        type: "conv",
        dimensions: [19, 19, 2],
        parameters: {
          kernel_size: [1, 1],
          stride: 1,
        },
      },
      {
        name: "Policy BatchNorm",
        type: "batch_norm",
        dimensions: [19, 19, 2],
      },
      {
        name: "Policy ReLU",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Policy Output",
        type: "dense",
        dimensions: [1, 1, 362], // 19x19 + 1 pass move
        activation: "softmax",
      },
    ],
  },

  // Value Head
  {
    name: "Value Head",
    type: "value_head",
    dimensions: [19, 19, 1],
    sublayers: [
      {
        name: "Value Conv",
        type: "conv",
        dimensions: [19, 19, 1],
        parameters: {
          kernel_size: [1, 1],
          stride: 1,
        },
      },
      {
        name: "Value BatchNorm",
        type: "batch_norm",
        dimensions: [19, 19, 1],
      },
      {
        name: "Value ReLU",
        type: "activation",
        activation: "relu",
      },
      {
        name: "Value FC",
        type: "dense",
        dimensions: [1, 1, 256],
        activation: "relu",
      },
      {
        name: "Value Output",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "tanh",
      },
    ],
  },
];

/** OpenAI Five **/
export const OPENAI_FIVE = [
  // Input Processing
  {
    name: "Input",
    type: "input",
    dimensions: [DOTA_OBS_DIM, 1, 1],
  },

  // Entity Embeddings
  {
    name: "Entity Processing",
    type: "entity_embeddings",
    dimensions: [1, 1, OPENAI_FIVE_EMBED_DIM],
    sublayers: [
      {
        name: "Hero Embeddings",
        type: "entity_embed",
        dimensions: [NUM_HEROES, OPENAI_FIVE_EMBED_DIM],
      },
      {
        name: "Unit Embeddings",
        type: "entity_embed",
        dimensions: [1000, OPENAI_FIVE_EMBED_DIM], // Max units
      },
      {
        name: "Item Embeddings",
        type: "entity_embed",
        dimensions: [NUM_ITEMS, OPENAI_FIVE_EMBED_DIM],
      },
      {
        name: "Ability Embeddings",
        type: "entity_embed",
        dimensions: [NUM_ABILITIES, OPENAI_FIVE_EMBED_DIM],
      },
    ],
  },

  // LSTM Stack (4 layers instead of 2)
  {
    name: "LSTM Stack",
    type: "lstm_stack",
    dimensions: [1, 1, NUM_OPENAI_FIVE_LSTM_UNITS],
    sublayers: Array.from({ length: NUM_OPENAI_FIVE_LSTM_LAYERS }, (_, i) => ({
      name: `LSTM Layer ${i + 1}`,
      type: "lstm",
      dimensions: [1, 1, NUM_OPENAI_FIVE_LSTM_UNITS],
    })),
  },

  // Action Processing
  {
    name: "Action Processing",
    type: "action_processing",
    dimensions: [1, 1, NUM_OPENAI_FIVE_HIDDEN_UNITS],
    sublayers: [
      {
        name: "Action Type Selection",
        type: "action_selection",
        dimensions: [1, 1, 8], // Main action categories
        activation: "softmax",
      },
      {
        name: "Target Selection",
        type: "target_selection",
        sublayers: [
          {
            name: "Unit Targeting",
            type: "pointer_network",
            dimensions: [1, 1, 1000], // Max targetable units
          },
          {
            name: "Location Targeting",
            type: "continuous_action",
            dimensions: [1, 1, 2], // X,Y coordinates
          },
        ],
      },
      {
        name: "Ability/Item Selection",
        type: "discrete_selection",
        dimensions: [1, 1, NUM_ABILITIES + NUM_ITEMS],
      },
    ],
  },

  // Communication Channel
  {
    name: "Communication",
    type: "communication_channel",
    dimensions: [5, NUM_OPENAI_FIVE_HIDDEN_UNITS], // 5 agents
    sublayers: [
      {
        name: "Message Generation",
        type: "message_gen",
        dimensions: [1, 1, NUM_OPENAI_FIVE_HIDDEN_UNITS],
      },
      {
        name: "Message Integration",
        type: "message_integration",
        dimensions: [5, NUM_OPENAI_FIVE_HIDDEN_UNITS],
      },
    ],
  },

  // Value Network with larger capacity
  {
    name: "Value Network",
    type: "value_network",
    dimensions: [1, 1, NUM_OPENAI_FIVE_HIDDEN_UNITS],
    sublayers: [
      {
        name: "Value Hidden 1",
        type: "dense",
        dimensions: [1, 1, NUM_OPENAI_FIVE_HIDDEN_UNITS],
        activation: "relu",
      },
      {
        name: "Value Hidden 2",
        type: "dense",
        dimensions: [1, 1, NUM_OPENAI_FIVE_HIDDEN_UNITS / 2],
        activation: "relu",
      },
      {
        name: "Value Output",
        type: "dense",
        dimensions: [1, 1, 1],
        activation: "linear",
      },
    ],
  },
];

/** AlphaFold **/
export const ALPHAFOLD = [
  // Input Processing
  {
    name: "Input Features",
    type: "input_embeddings",
    sublayers: [
      {
        name: "MSA Embedding",
        type: "msa_embedding",
        dimensions: [MSA_MAX_SEQUENCES, MSA_MAX_POSITIONS, NUM_MSA_FEATURES],
      },
      {
        name: "Pair Embedding",
        type: "pair_embedding",
        dimensions: [MSA_MAX_POSITIONS, MSA_MAX_POSITIONS, NUM_PAIR_FEATURES],
      },
      {
        name: "Template Embedding",
        type: "template_embedding",
        dimensions: [NUM_TEMPLATES, MSA_MAX_POSITIONS, TEMPLATE_DIM],
      },
    ],
  },

  // Evoformer Stack
  {
    name: "Evoformer Stack",
    type: "evoformer_stack",
    dimensions: [MSA_MAX_POSITIONS, MSA_MAX_POSITIONS, ALPHAFOLD_EMBED_DIM],
    sublayers: Array.from({ length: 48 }, (_, i) => ({
      name: `Evoformer Block ${i + 1}`,
      type: "evoformer_block",
      sublayers: [
        {
          name: "MSA Row-wise Attention",
          type: "msa_attention",
          dimensions: [
            MSA_MAX_SEQUENCES,
            MSA_MAX_POSITIONS,
            ALPHAFOLD_EMBED_DIM,
          ],
        },
        {
          name: "MSA Column-wise Attention",
          type: "msa_attention",
          dimensions: [
            MSA_MAX_SEQUENCES,
            MSA_MAX_POSITIONS,
            ALPHAFOLD_EMBED_DIM,
          ],
        },
        {
          name: "MSA Transition",
          type: "msa_transition",
          dimensions: [
            MSA_MAX_SEQUENCES,
            MSA_MAX_POSITIONS,
            ALPHAFOLD_EMBED_DIM,
          ],
        },
        {
          name: "Outer Product Mean",
          type: "outer_product",
          dimensions: [
            MSA_MAX_POSITIONS,
            MSA_MAX_POSITIONS,
            ALPHAFOLD_EMBED_DIM,
          ],
        },
        {
          name: "Triangle Multiplication",
          type: "triangle_multiplication",
          dimensions: [
            MSA_MAX_POSITIONS,
            MSA_MAX_POSITIONS,
            ALPHAFOLD_EMBED_DIM,
          ],
        },
        {
          name: "Pair Transition",
          type: "pair_transition",
          dimensions: [
            MSA_MAX_POSITIONS,
            MSA_MAX_POSITIONS,
            ALPHAFOLD_EMBED_DIM,
          ],
        },
      ],
    })),
  },

  // Structure Module
  {
    name: "Structure Module",
    type: "structure_module",
    dimensions: [MSA_MAX_POSITIONS, 3, 3], // 3D coordinates
    sublayers: [
      {
        name: "IPA Stack",
        type: "ipa_stack",
        sublayers: Array.from({ length: 8 }, (_, i) => ({
          name: `IPA Block ${i + 1}`,
          type: "ipa_block",
          sublayers: [
            {
              name: "Invariant Point Attention",
              type: "invariant_attention",
              dimensions: [MSA_MAX_POSITIONS, ALPHAFOLD_EMBED_DIM],
            },
            {
              name: "Backbone Update",
              type: "backbone_update",
              dimensions: [MSA_MAX_POSITIONS, 3, 3],
            },
          ],
        })),
      },
      {
        name: "Structure Transition",
        type: "structure_transition",
        dimensions: [MSA_MAX_POSITIONS, ALPHAFOLD_EMBED_DIM],
      },
    ],
  },

  // Output Heads
  {
    name: "Output Heads",
    type: "output_heads",
    sublayers: [
      {
        name: "Distogram Head",
        type: "distogram",
        dimensions: [MSA_MAX_POSITIONS, MSA_MAX_POSITIONS, 64], // 64 bins
      },
      {
        name: "TM Score Head",
        type: "tm_score",
        dimensions: [1],
      },
      {
        name: "pTM Head",
        type: "ptm",
        dimensions: [MSA_MAX_POSITIONS, MSA_MAX_POSITIONS, 1],
      },
      {
        name: "Structure Head",
        type: "structure",
        dimensions: [MSA_MAX_POSITIONS, 3, 3], // Final 3D coordinates
      },
    ],
  },
];

// Layer configurations for reinforcement models
export const LAYER_CONFIGS = {
  DEEP_Q_NETWORK_DQN: {
    layerHeight: 20,
    keyPrefix: "dqn",
    type: "reinforcement",
  },
  A3C: {
    layerHeight: 20,
    keyPrefix: "a3c",
    type: "reinforcement",
  },
  ALPHAGO: {
    layerHeight: 80,
    keyPrefix: "alphago",
    type: "reinforcement",
  },
  ALPHAZERO: {
    layerHeight: 80,
    keyPrefix: "alphazero",
    type: "reinforcement",
  },
  MUZERO: {
    layerHeight: 150,
    keyPrefix: "muzero",
    type: "reinforcement",
  },

  ALPHASTAR: {
    layerWidth: 150,
    keyPrefix: "alphastar",
    type: "reinforcement",
  },
  PPO: {
    layerHeight: 140,
    keyPrefix: "ppo",
    type: "reinforcement",
  },
  ALPHAGO_ZERO: {
    layerHeight: 150,
    keyPrefix: "alphago_zero",
    type: "reinforcement",
  },
  OPENAI_FIVE: {
    layerHeight: 10,
    keyPrefix: "openai_five",
    type: "reinforcement",
  },
  ALPHAFOLD: {
    layerHeight: 180,
    keyPrefix: "alphafold",
    type: "protein_structure",
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

  ALPHASTAR: {
    input: {
      xCount: 64,
      yCount: 64,
      xInterval: 1,
      yInterval: 1,
    },
    encoder: {
      xCount: 512,
      yCount: 512,
      xInterval: 1,
      yInterval: 1,
    },
    transformer_encoder: {
      xCount: 128,
      yCount: 128,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    lstm: {
      xCount: 1024,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    policy_head: {
      xCount: NUM_ACTION_TYPES,
      yCount: 1,
      xInterval: 1,
      yInterval: 1,
    },
    argument_heads: {
      xCount: NUM_ARGUMENT_TYPES,
      yCount: 1,
      xInterval: 1,
      yInterval: 1,
    },
    pointer_network: {
      xCount: 512,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    value_head: {
      xCount: 1,
      yCount: 1,
      xInterval: 1,
      yInterval: 1,
    },
    dense: {
      xCount: 256,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
  },
  PPO: {
    input: {
      xCount: INPUT_DIM_ATARI[0],
      yCount: INPUT_DIM_ATARI[1],
      xInterval: 1,
      yInterval: 1,
    },
    feature_extractor: {
      xCount: 16,
      yCount: 16,
      xInterval: 2,
      yInterval: 2,
    },
    conv: {
      xCount: 8,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    actor_network: {
      xCount: PPO_ACTOR_DIM,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    critic_network: {
      xCount: PPO_CRITIC_DIM,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
    dense: {
      xCount: 256,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
  },
  ALPHAGO_ZERO: {
    input: {
      xCount: 19,
      yCount: 19,
      xInterval: 1,
      yInterval: 1,
    },
    conv_block: {
      xCount: 16,
      yCount: 16,
      xInterval: 1.5,
      yInterval: 1.5,
    },
    residual_tower: {
      xCount: ALPHAGO_ZERO_FILTERS,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    residual_block: {
      xCount: ALPHAGO_ZERO_FILTERS / 2,
      yCount: 2,
      xInterval: 2,
      yInterval: 2,
    },
    policy_head: {
      xCount: 19,
      yCount: 19,
      xInterval: 1,
      yInterval: 1,
    },
    value_head: {
      xCount: 8,
      yCount: 8,
      xInterval: 1.5,
      yInterval: 1.5,
    },
    dense: {
      xCount: 256,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
  },
  OPENAI_FIVE: {
    input: {
      xCount: 64,
      yCount: 32,
      xInterval: 1,
      yInterval: 1,
    },
    embedding: {
      xCount: OPENAI_FIVE_EMBED_DIM / 8,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    lstm: {
      xCount: NUM_OPENAI_FIVE_LSTM_UNITS / 64,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
    },
    action: {
      xCount: NUM_OPENAI_FIVE_HIDDEN_UNITS / 64,
      yCount: 4,
      xInterval: 1.5,
      yInterval: 2,
    },
    pointer: {
      xCount: 24,
      yCount: 8,
      xInterval: 1,
      yInterval: 1,
    },
    communication: {
      xCount: 5,
      yCount: NUM_OPENAI_FIVE_HIDDEN_UNITS / 256,
      xInterval: 2,
      yInterval: 1.5,
    },
    value: {
      xCount: NUM_OPENAI_FIVE_HIDDEN_UNITS / 64,
      yCount: 2,
      xInterval: 1.5,
      yInterval: 2,
    },
    dense: {
      xCount: 512,
      yCount: 1,
      xInterval: 0.5,
      yInterval: 0.5,
    },
  },
};
