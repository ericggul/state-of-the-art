// Constants for Hopfield Network and Boltzmann Machine
const NUM_NODES_HOPFIELD = 25; // Increased number of nodes
const NUM_VISIBLE_UNITS = 17;
const NUM_HIDDEN_UNITS = 37;

/** Hopfield Network **/
export const HOPFIELD_NETWORK = [
  {
    name: "Hopfield Layer",
    type: "hopfield_layer",
    dimensions: [NUM_NODES_HOPFIELD, NUM_NODES_HOPFIELD, 1],
    hasConnections: true,
  },
];

/** Boltzmann Machine **/
export const BOLTZMANN_MACHINE = [
  {
    name: "Visible Units",
    type: "visible_units",
    dimensions: [NUM_VISIBLE_UNITS, NUM_VISIBLE_UNITS, 1],
    hasConnections: true,
  },
  {
    name: "Hidden Units",
    type: "hidden_units",
    dimensions: [NUM_HIDDEN_UNITS, NUM_HIDDEN_UNITS, 1],
    hasConnections: true,
  },
];

// Layer configurations for Hopfield Network and Boltzmann Machine
export const LAYER_CONFIGS = {
  HOPFIELD_NETWORK: {
    layerHeight: 20,
    keyPrefix: "hopfield",
    type: "hopfield",
  },
  BOLTZMANN_MACHINE: {
    layerHeight: 20,
    keyPrefix: "boltzmann",
    type: "boltzmann",
  },
};

// Grid configurations for Hopfield Network and Boltzmann Machine
export const GRID_CONFIGS = {
  HOPFIELD_NETWORK: {
    hopfield_layer: {
      nodeCount: NUM_NODES_HOPFIELD,
      radius: 25,
      connectionWidth: 2,
    },
  },
  BOLTZMANN_MACHINE: {
    visible_units: {
      nodeCount: NUM_VISIBLE_UNITS,
      radius: 20,
      layerPosition: -25,
      connectionWidth: 2,
    },
    hidden_units: {
      nodeCount: NUM_HIDDEN_UNITS,
      radius: 15,
      layerPosition: 25,
      connectionWidth: 2,
    },
  },
};
