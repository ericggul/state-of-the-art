import { MODELS, LAYER_CONFIGS, GRID_CONFIGS } from "./index";

export { LAYER_CONFIGS, GRID_CONFIGS };

export const getGridConfig = (model) => {
  return GRID_CONFIGS[model] || {};
};

export function getModelStructure(model) {
  return MODELS[model] || [];
}
