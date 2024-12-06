import { filterModels, flattenModels } from "@/components/frontend/utils";

const FEATURED_MODELS = [
  ////PROBLEMATIC MODELS: FOR DEBUGGING PURPOSES
  // "StyleGAN2",
  // "DenseNet",

  "McCulloch-Pitts Neuron",
  "Hopfield Network",
  "Boltzmann Machine",
  "Basic Autoencoder",
  "SimCLR",
  "AlexNet",
  "RNN (Recurrent Neural Network)",
  "Transformer Architecture",
  "GPT",
  "Generative Adversarial Networks (GANs)",
  "Stable Diffusion",
  "DALL-E",
  "AlphaGo",
];

export const generateInitialModelArray = (models) => {
  const allModels = filterModels(flattenModels(models));

  // Select featured models
  const selectedModels = allModels.filter((model) =>
    FEATURED_MODELS.includes(model.name)
  );

  // Get the remaining models
  const remainingModels = allModels.filter(
    (model) => !selectedModels.includes(model)
  );

  // Shuffle the remaining models
  for (let i = remainingModels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingModels[i], remainingModels[j]] = [
      remainingModels[j],
      remainingModels[i],
    ];
  }

  // Combine selected models with shuffled remaining models
  return [...selectedModels, ...remainingModels];
};
