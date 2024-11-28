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
    "v1.2": {
      name: "Multi-Layer Perceptron (MLP)",
      year: 1965,
      place: "U.S. Department of Commerce",
      citation: 404,
      explanation:
        "A feedforward artificial neural network with multiple layers of perceptrons. MLPs are capable of distinguishing data that is not linearly separable and form the foundation for deep learning.",
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
      "v2.1.1": {
        name: "Basic Autoencoder",
        year: 1986,
        place: "University of Toronto",
        citation: 23900,
        explanation:
          "Neural network that learns to copy its input to output, useful for feature learning and dimensionality reduction.",
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

    "v3.1.2": {
      name: "LeNet-5",
      year: 1998,
      place: "IEEE",
      citation: 70544,
      explanation:
        "Pioneering convolutional neural network for handwritten digit recognition, demonstrating the effectiveness of CNNs.",
    },
  },
  "v4.x - Sequence Models": {
    "v4.0.1": {
      name: "RNN (Recurrent Neural Network)",
      year: 1986,
      place:
        "Institute for Cognitive Science, C-015, University of California, Department of Computer Science, Carnegie-Mellon University",
      citation: 40394,
      explanation:
        "Introduced context units to retain state information, allowing for processing sequences.",
    },
    "v4.2.5": {
      name: "ALBERT",
      year: 2019,
      place: "Google Research",
      citation: 7861,
      explanation:
        "A Lite BERT for self-supervised learning of language representations, introduced parameter sharing to reduce model size.",
    },
    "v6.0.1": {
      name: "Show and Tell",
      year: 2015,
      place: "Google",
      citation: 7845,
      explanation:
        "Early neural image captioning model combining CNN and RNN architectures.",
    },

    "v7.0.3": {
      name: "PPO",
      year: 2017,
      place: "OpenAI",
      citation: 21674,
      explanation:
        "Proximal Policy Optimization, providing stable policy updates for reinforcement learning.",
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
    "v5.0.1.1": {
      name: "DCGAN",
      year: 2015,
      place: "indico Research",
      citation: 18893,
      explanation:
        "Deep Convolutional GAN; introduced convolutional architectures to GANs for improved image generation.",
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
        "v5.1.1": {
          name: "DDPM",
          year: 2020,
          place: "UC Berkeley",
          citation: 14543,
          explanation:
            "Introduced diffusion models for image generation, matching or surpassing GAN performance.",
        },
      },
    },
  },
};
