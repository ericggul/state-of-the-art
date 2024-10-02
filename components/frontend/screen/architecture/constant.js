const TEST = {
  "v1.x": {
    title: "Foundation Models",
    models: [
      { "v1.0": "McCulloch-Pitts Neuron (1943)" },
      { "v1.1": "Hebbian Learning (1949)" },
      {
        "v1.2": "Perceptron (1958)",
        submodels: [{ "v1.2.1": "ADALINE (1960)" }, { "v1.2.2": "MADALINE (1960)" }],
      },
      {
        "v1.3": "Multi-Layer Perceptron",
        submodels: [{ "v1.3.1": "Backpropagation Algorithm (1986)" }, { "v1.3.2": "Universal Approximation Implementation (1989)" }],
      },
    ],
  },
  "v2.x": {
    title: "Memory-Based Models",
    models: [
      {
        "v2.0": "Hopfield Networks (1982)",
        submodels: [{ "v2.0.1": "Discrete Hopfield Network" }, { "v2.0.2": "Continuous Hopfield Network" }],
      },
      {
        "v2.1": "Boltzmann Machine (1985)",
        submodels: [{ "v2.1.1": "Restricted Boltzmann Machine" }, { "v2.1.2": "Deep Belief Networks (2006)" }],
      },
      {
        "v2.2": "Self-Organizing Maps (1982)",
        submodels: [{ "v2.2.1": "Growing Neural Gas" }, { "v2.2.2": "Neural Gas" }],
      },
    ],
  },
  "v3.x": {
    title: "Convolutional Neural Networks",
    models: [
      { "v3.0": "Neocognitron (1980)" },
      {
        "v3.1": "LeNet Family",
        submodels: [{ "v3.1.1": "LeNet-1" }, { "v3.1.2": "LeNet-5 (1998)" }],
      },
      {
        "v3.2": "Modern CNN Base",
        submodels: [{ "v3.2.1": "AlexNet (2012)" }, { "v3.2.2": "VGGNet (2014)" }],
      },
      {
        "v3.3": "Advanced Architectures",
        submodels: [{ "v3.3.1": "GoogLeNet/Inception (2014)" }, { "v3.3.2": "ResNet (2015)" }, { "v3.3.3": "DenseNet (2017)" }],
      },
      {
        "v3.4": "Efficiency-Focused",
        submodels: [{ "v3.4.1": "MobileNet" }, { "v3.4.2": "EfficientNet (2019)" }],
      },
    ],
  },
  "v4.x": {
    title: "Sequence Models",
    models: [
      { "v4.0": "Simple RNN (Elman Network, 1990)" },
      {
        "v4.1": "LSTM (1997)",
        submodels: [{ "v4.1.1": "Peephole Connections" }, { "v4.1.2": "Bidirectional LSTM" }],
      },
      { "v4.2": "GRU (2014)" },
      {
        "v4.3": "Attention Mechanisms",
        submodels: [{ "v4.3.1": "Basic Attention" }, { "v4.3.2": "Self-Attention" }],
      },
    ],
  },
  "v5.x": {
    title: "Autoencoder Family",
    models: [
      { "v5.0": "Basic Autoencoder" },
      { "v5.1": "Denoising Autoencoder" },
      { "v5.2": "Sparse Autoencoder" },
      {
        "v5.3": "Variational Autoencoder (2013)",
        submodels: [{ "v5.3.1": "β-VAE (2017)" }, { "v5.3.2": "Conditional VAE" }],
      },
    ],
  },
  "v6.x": {
    title: "Generative Models",
    models: [
      { "v6.0": "GAN (2014)" },
      {
        "v6.1": "Architectural Variants",
        submodels: [{ "v6.1.1": "DCGAN (2015)" }, { "v6.1.2": "WGAN (2017)" }, { "v6.1.3": "Progressive GAN (2017)" }],
      },
      {
        "v6.2": "Conditional Variants",
        submodels: [{ "v6.2.1": "Conditional GAN" }, { "v6.2.2": "CycleGAN (2017)" }],
      },
      {
        "v6.3": "StyleGAN Family",
        submodels: [{ "v6.3.1": "StyleGAN (2019)" }, { "v6.3.2": "StyleGAN2" }, { "v6.3.3": "StyleGAN3" }],
      },
      {
        "v6.4": "Diffusion Models",
        submodels: [{ "v6.4.1": "DDPM (2020)" }, { "v6.4.2": "Stable Diffusion (2022)" }],
      },
    ],
  },
  "v7.x": {
    title: "Transformer Architecture",
    models: [
      { "v7.0": "Original Transformer (2017)" },
      {
        "v7.1": "Encoder-Based",
        submodels: [{ "v7.1.1": "BERT (2018)" }, { "v7.1.2": "RoBERTa (2019)" }],
      },
      {
        "v7.2": "Decoder-Based",
        submodels: [{ "v7.2.1": "GPT (2018)" }, { "v7.2.2": "GPT-2 (2019)" }, { "v7.2.3": "GPT-3 (2020)" }, { "v7.2.4": "GPT-4 (2023)" }],
      },
      {
        "v7.3": "Vision Transformers",
        submodels: [{ "v7.3.1": "ViT (2020)" }, { "v7.3.2": "Swin Transformer (2021)" }],
      },
    ],
  },
  "v8.x": {
    title: "Hybrid/Multimodal Models",
    models: [
      {
        "v8.0": "Early Multimodal",
        submodels: [{ "v8.0.1": "Show and Tell (2015)" }, { "v8.0.2": "VQA Models" }],
      },
      {
        "v8.1": "CLIP/DALL-E Family",
        submodels: [{ "v8.1.1": "CLIP (2021)" }, { "v8.1.2": "DALL-E (2021)" }, { "v8.1.3": "DALL-E 2 (2022)" }],
      },
      {
        "v8.2": "Advanced Multimodal",
        submodels: [{ "v8.2.1": "PaLM (2022)" }, { "v8.2.2": "Claude (2022)" }, { "v8.2.3": "GPT-4V (2023)" }],
      },
    ],
  },
};
