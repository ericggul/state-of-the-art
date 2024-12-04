export const MODEL_TYPE_MAP = {
  basic_nn: "Basic Neural Networks",
  hopfield_boltzmann: "Hopfield & Boltzmann Models",
  vae: "Variational Autoencoders",
  self_supervised: "Self-Supervised Models",
  cnn: "Convolutional Neural Networks (CNN)",
  transformer: "Transformer Models",
  rnn: "Recurrent Neural Networks (RNN)",
  gan: "Generative Adversarial Networks (GAN)",
  diffusion: "Diffusion Models",
  multi_modal: "Multimodal Models",
  reinforcement: "Reinforcement Learning",
};

export const getModelTypeName = (category) => {
  return (
    MODEL_TYPE_MAP[category] ||
    category
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") ||
    "Unknown Type"
  );
};
