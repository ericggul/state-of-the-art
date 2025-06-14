import * as CNN from "./cnn";
import * as TRANSFORMER from "./transformer";
import * as BASIC_NN from "./basic_nn";
import * as RNN from "./rnn";
import * as VAE from "./vae";
import * as SELF_SUPERVISED from "./self_supervised";
import * as GAN from "./gan";
import * as DIFFUSION from "./diffusion";
import * as MULTI_MODAL from "./multi_modal";
import * as REINFORCEMENT from "./reinforcement";
import * as HOPFIELD_BOLTZMANN from "./hopfield_boltzmann";

export const MODELS = {
  ...CNN,
  ...TRANSFORMER,
  ...BASIC_NN,
  ...RNN,
  ...VAE,
  ...SELF_SUPERVISED,
  ...GAN,
  ...DIFFUSION,
  ...MULTI_MODAL,
  ...REINFORCEMENT,
  ...HOPFIELD_BOLTZMANN,
};

export const LAYER_CONFIGS = {
  ...CNN.LAYER_CONFIGS,
  ...TRANSFORMER.LAYER_CONFIGS,
  ...BASIC_NN.LAYER_CONFIGS,
  ...RNN.LAYER_CONFIGS,
  ...VAE.LAYER_CONFIGS,
  ...SELF_SUPERVISED.LAYER_CONFIGS,
  ...GAN.LAYER_CONFIGS,
  ...DIFFUSION.LAYER_CONFIGS,
  ...MULTI_MODAL.LAYER_CONFIGS,
  ...REINFORCEMENT.LAYER_CONFIGS,
  ...HOPFIELD_BOLTZMANN.LAYER_CONFIGS,
};

export const GRID_CONFIGS = {
  ...CNN.GRID_CONFIGS,
  ...TRANSFORMER.GRID_CONFIGS,
  ...BASIC_NN.GRID_CONFIGS,
  ...RNN.GRID_CONFIGS,
  ...VAE.GRID_CONFIGS,
  ...SELF_SUPERVISED.GRID_CONFIGS,
  ...GAN.GRID_CONFIGS,
  ...DIFFUSION.GRID_CONFIGS,
  ...MULTI_MODAL.GRID_CONFIGS,
  ...REINFORCEMENT.GRID_CONFIGS,
  ...HOPFIELD_BOLTZMANN.GRID_CONFIGS,
};

// Function to get model structure based on model name
export function getModelStructure(modelName) {
  try {
    const model = MODELS[modelName];
    if (!model) {
      console.warn(
        `Model structure not found for ${modelName}, returning empty array`
      );
      return [];
    }
    return model;
  } catch (error) {
    console.warn(`Error getting model structure for ${modelName}:`, error);
    return [];
  }
}
