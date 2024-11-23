export const MODELS = {
  "v1.x - Foundation Models": {
    "v1.1": {
      name: "Perceptron",
      year: 1958,
      place: "Frank Rosenblatt, Cornell Aeronautical Laboratory",
      citation: 13000,
      explanation:
        "Introduced the perceptron algorithm, the first trainable neural network using supervised learning.",
    },
  },
  "v2.x - Memory-Based and Unsupervised Models": {
    "v2.0": {
      name: "Basic Neural Learning",
      "v2.0.1": {
        name: "Hopfield Network",
        year: 1982,
        place: "John Hopfield",
        citation: 23000,
        explanation:
          "Introduced recurrent neural networks for associative memory and optimization.",
      },
      "v2.0.2": {
        name: "Boltzmann Machine",
        year: 1985,
        place: "Geoffrey Hinton and Terrence Sejnowski",
        citation: 12000,
        explanation:
          "Early stochastic recurrent neural network capable of learning internal representations.",
      },
    },
    "v2.1": {
      name: "Autoencoders and Self-Supervised Learning",
      "v2.1.2": {
        name: "Variational Autoencoder (VAE)",
        year: 2013,
        place: "Diederik P. Kingma and Max Welling",
        citation: 33500,
        explanation:
          "Probabilistic generative model that learns latent representations, enabling data generation.",
      },
    },
    "v2.2": {
      name: "Contrastive Learning Models",
      "v2.2.1": {
        name: "SimCLR",
        year: 2020,
        place: "Ting Chen et al., Google Research",
        citation: 4900,
        explanation:
          "Contrastive self-supervised learning method using data augmentations to learn representations.",
      },
    },
    "v3.2.1": {
      name: "AlexNet",
      year: 2012,
      place: "University of Toronto",
      citation: 135156,
      explanation:
        "First deep CNN to win ImageNet competition, sparking renewed interest in deep learning.",
    },
  },
  "v4.x - Sequence Models": {
    "v4.0": {
      name: "Transformer",
      year: 2017,
      place: "Google Research, Google Brain",
      citation: 89000,
      explanation:
        "Introduced the transformer architecture with self-attention mechanism, revolutionizing sequence modeling and becoming the foundation for modern language models.",
    },
  },
  "v5.x - Generative Models": {
    "v5.0": {
      name: "Generative Adversarial Networks (GANs)",
      year: 2014,
      place: "Ian Goodfellow et al., University of Montreal",
      citation: 66600,
      explanation:
        "Introduced the GAN framework, where two neural networks compete in a zero-sum game to generate realistic data.",
    },
    "v5.1": {
      name: "Diffusion Models",
      "v5.1.3": {
        name: "Latent Diffusion Models",
        "v5.1.3.1": {
          name: "Stable Diffusion",
          year: 2022,
          place: "Robin Rombach et al., LMU Munich and Stability AI",
          citation: 800,
          explanation:
            "An efficient diffusion model operating in latent space, enabling high-resolution image synthesis with reduced computational cost.",
        },
      },
    },
  },
};
