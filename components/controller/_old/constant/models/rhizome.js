import { OBJECT_ARRAY } from "./v3";

export const DATA_NODES_LINKS = {
  // Update nodes to include version information
  nodes: OBJECT_ARRAY.map((model, index) => ({
    id: index + 1,
    name: model.name,
    version: model.version,
    majorVersion: model.version
      ? parseInt(model.version.match(/v(\d+)/)[1])
      : null,
  })),
  links: [
    { id: 1, source: 1, target: 2, value: 9, relation: "direct predecessor" },
    { id: 2, source: 2, target: 3, value: 8, relation: "evolved into" },
    { id: 3, source: 3, target: 4, value: 9, relation: "trained using" },
    {
      id: 4,
      source: 4,
      target: 17,
      value: 7,
      relation: "enabled deep networks",
    },
    {
      id: 5,
      source: 3,
      target: 5,
      value: 6,
      relation: "architectural similarity",
    },
    { id: 6, source: 5, target: 6, value: 8, relation: "direct evolution" },
    { id: 7, source: 6, target: 7, value: 7, relation: "refinement" },
    {
      id: 8,
      source: 3,
      target: 8,
      value: 5,
      relation: "inspired self-supervised learning",
    },
    { id: 9, source: 8, target: 9, value: 6, relation: "similar approach" },
    { id: 10, source: 9, target: 10, value: 7, relation: "improved upon" },
    { id: 11, source: 10, target: 11, value: 8, relation: "direct successor" },
    {
      id: 12,
      source: 3,
      target: 12,
      value: 7,
      relation: "early CNN architecture",
    },
    { id: 13, source: 12, target: 13, value: 8, relation: "improved version" },
    {
      id: 14,
      source: 13,
      target: 14,
      value: 7,
      relation: "inspired modern CNNs",
    },
    {
      id: 15,
      source: 14,
      target: 15,
      value: 6,
      relation: "deeper architecture",
    },
    {
      id: 16,
      source: 15,
      target: 16,
      value: 7,
      relation: "introduced inception modules",
    },
    {
      id: 17,
      source: 16,
      target: 17,
      value: 8,
      relation: "introduced residual connections",
    },
    { id: 18, source: 17, target: 18, value: 7, relation: "dense connections" },
    { id: 19, source: 18, target: 19, value: 6, relation: "efficient scaling" },
    {
      id: 20,
      source: 17,
      target: 20,
      value: 8,
      relation: "inspired attention in vision",
    },
    {
      id: 21,
      source: 20,
      target: 21,
      value: 7,
      relation: "hierarchical vision transformer",
    },
    {
      id: 22,
      source: 20,
      target: 22,
      value: 6,
      relation: "data-efficient vision transformer",
    },
    {
      id: 23,
      source: 14,
      target: 23,
      value: 7,
      relation: "semantic segmentation",
    },
    {
      id: 24,
      source: 23,
      target: 24,
      value: 6,
      relation: "improved segmentation",
    },
    { id: 25, source: 14, target: 25, value: 7, relation: "object detection" },
    {
      id: 26,
      source: 3,
      target: 26,
      value: 8,
      relation: "sequential data processing",
    },
    {
      id: 27,
      source: 26,
      target: 27,
      value: 9,
      relation: "long-term dependencies",
    },
    {
      id: 28,
      source: 27,
      target: 28,
      value: 8,
      relation: "attention mechanism",
    },
    {
      id: 29,
      source: 28,
      target: 29,
      value: 7,
      relation: "text-to-text transfer",
    },
    {
      id: 30,
      source: 28,
      target: 30,
      value: 7,
      relation: "sequence-to-sequence",
    },
    {
      id: 31,
      source: 28,
      target: 31,
      value: 9,
      relation: "bidirectional encoding",
    },
    {
      id: 32,
      source: 31,
      target: 32,
      value: 8,
      relation: "robustly optimized",
    },
    {
      id: 33,
      source: 28,
      target: 33,
      value: 9,
      relation: "generative pre-training",
    },
    { id: 34, source: 33, target: 34, value: 8, relation: "scaled up version" },
    { id: 35, source: 34, target: 35, value: 9, relation: "massive scale-up" },
    {
      id: 36,
      source: 35,
      target: 36,
      value: 9,
      relation: "further advancement",
    },
    {
      id: 37,
      source: 35,
      target: 37,
      value: 8,
      relation: "alternative large LM",
    },
    { id: 38, source: 37, target: 38, value: 9, relation: "improved version" },
    {
      id: 39,
      source: 35,
      target: 39,
      value: 8,
      relation: "open-source alternative",
    },
    {
      id: 40,
      source: 39,
      target: 40,
      value: 7,
      relation: "similar open approach",
    },
    { id: 41, source: 28, target: 41, value: 7, relation: "extended context" },
    {
      id: 42,
      source: 41,
      target: 42,
      value: 8,
      relation: "permutation language model",
    },
    {
      id: 43,
      source: 31,
      target: 43,
      value: 7,
      relation: "efficient pre-training",
    },
    { id: 44, source: 28, target: 44, value: 8, relation: "sparse attention" },
    {
      id: 45,
      source: 31,
      target: 45,
      value: 7,
      relation: "parameter reduction",
    },
    {
      id: 46,
      source: 31,
      target: 46,
      value: 6,
      relation: "knowledge distillation",
    },
    { id: 47, source: 28, target: 47, value: 7, relation: "sparse attention" },
    {
      id: 48,
      source: 28,
      target: 48,
      value: 7,
      relation: "efficient attention",
    },
    {
      id: 49,
      source: 28,
      target: 49,
      value: 7,
      relation: "long-range attention",
    },
    {
      id: 50,
      source: 31,
      target: 50,
      value: 6,
      relation: "knowledge integration",
    },
    {
      id: 51,
      source: 31,
      target: 51,
      value: 7,
      relation: "multilingual pre-training",
    },
    {
      id: 52,
      source: 3,
      target: 52,
      value: 8,
      relation: "adversarial training",
    },
    { id: 53, source: 52, target: 53, value: 8, relation: "convolutional GAN" },
    {
      id: 54,
      source: 53,
      target: 54,
      value: 7,
      relation: "improved stability",
    },
    {
      id: 55,
      source: 54,
      target: 55,
      value: 8,
      relation: "progressive growing",
    },
    {
      id: 56,
      source: 52,
      target: 56,
      value: 7,
      relation: "conditional generation",
    },
    {
      id: 57,
      source: 56,
      target: 57,
      value: 8,
      relation: "unpaired translation",
    },
    {
      id: 58,
      source: 55,
      target: 58,
      value: 9,
      relation: "style-based generator",
    },
    { id: 59, source: 58, target: 59, value: 8, relation: "improved version" },
    { id: 60, source: 59, target: 60, value: 8, relation: "alias-free GAN" },
    { id: 61, source: 52, target: 61, value: 7, relation: "diffusion models" },
    {
      id: 62,
      source: 61,
      target: 62,
      value: 9,
      relation: "text-to-image diffusion",
    },
    { id: 63, source: 62, target: 63, value: 7, relation: "guided diffusion" },
    {
      id: 64,
      source: 62,
      target: 64,
      value: 8,
      relation: "high-resolution diffusion",
    },
    { id: 65, source: 61, target: 65, value: 7, relation: "faster sampling" },
    { id: 66, source: 28, target: 66, value: 7, relation: "image captioning" },
    { id: 67, source: 66, target: 67, value: 8, relation: "visual reasoning" },
    {
      id: 68,
      source: 28,
      target: 68,
      value: 9,
      relation: "contrastive language-image pre-training",
    },
    {
      id: 69,
      source: 68,
      target: 69,
      value: 8,
      relation: "text-to-image generation",
    },
    {
      id: 70,
      source: 69,
      target: 70,
      value: 9,
      relation: "improved text-to-image",
    },
    {
      id: 71,
      source: 68,
      target: 71,
      value: 8,
      relation: "few-shot visual learning",
    },
    {
      id: 72,
      source: 68,
      target: 72,
      value: 8,
      relation: "vision-language pre-training",
    },
    {
      id: 73,
      source: 72,
      target: 73,
      value: 8,
      relation: "visual instruction tuning",
    },
    { id: 74, source: 37, target: 74, value: 8, relation: "embodied AI" },
    {
      id: 75,
      source: 36,
      target: 75,
      value: 9,
      relation: "multimodal capabilities",
    },
    {
      id: 76,
      source: 3,
      target: 76,
      value: 7,
      relation: "reinforcement learning",
    },
    {
      id: 77,
      source: 76,
      target: 77,
      value: 8,
      relation: "asynchronous methods",
    },
    { id: 78, source: 77, target: 78, value: 9, relation: "game-playing AI" },
    {
      id: 79,
      source: 78,
      target: 79,
      value: 9,
      relation: "generalized game AI",
    },
    { id: 80, source: 79, target: 80, value: 8, relation: "model-based RL" },
    {
      id: 81,
      source: 80,
      target: 81,
      value: 9,
      relation: "real-time strategy AI",
    },
    {
      id: 82,
      source: 14,
      target: 82,
      value: 7,
      relation: "efficient mobile networks",
    },
    {
      id: 83,
      source: 19,
      target: 83,
      value: 8,
      relation: "automated architecture search",
    },
    {
      id: 84,
      source: 3,
      target: 84,
      value: 7,
      relation: "graph-structured data",
    },
    {
      id: 85,
      source: 14,
      target: 85,
      value: 6,
      relation: "alternative to CNNs",
    },
    {
      id: 86,
      source: 27,
      target: 86,
      value: 7,
      relation: "contextualized word embeddings",
    },
    {
      id: 87,
      source: 86,
      target: 87,
      value: 8,
      relation: "transfer learning for NLP",
    },
    {
      id: 88,
      source: 87,
      target: 31,
      value: 8,
      relation: "inspired pre-training",
    },
    {
      id: 89,
      source: 31,
      target: 33,
      value: 7,
      relation: "different pre-training approach",
    },
    {
      id: 90,
      source: 14,
      target: 16,
      value: 8,
      relation: "inspired inception modules",
    },
    {
      id: 91,
      source: 16,
      target: 17,
      value: 8,
      relation: "addressed vanishing gradients",
    },
    {
      id: 92,
      source: 17,
      target: 19,
      value: 7,
      relation: "efficient scaling techniques",
    },
    {
      id: 93,
      source: 19,
      target: 20,
      value: 7,
      relation: "efficient vision transformers",
    },
    {
      id: 94,
      source: 20,
      target: 68,
      value: 8,
      relation: "vision encoder in CLIP",
    },
    {
      id: 95,
      source: 31,
      target: 68,
      value: 8,
      relation: "text encoder in CLIP",
    },
    {
      id: 96,
      source: 68,
      target: 62,
      value: 8,
      relation: "text guidance in diffusion",
    },
    {
      id: 97,
      source: 35,
      target: 62,
      value: 7,
      relation: "language model for conditioning",
    },
    {
      id: 98,
      source: 28,
      target: 76,
      value: 6,
      relation: "sequential decision making",
    },
    {
      id: 99,
      source: 76,
      target: 78,
      value: 8,
      relation: "deep reinforcement learning",
    },
    {
      id: 100,
      source: 17,
      target: 78,
      value: 7,
      relation: "deep neural network in RL",
    },
    {
      id: 101,
      source: 28,
      target: 29,
      value: 8,
      relation: "encoder-decoder architecture",
    },
    {
      id: 102,
      source: 28,
      target: 30,
      value: 8,
      relation: "denoising pre-training",
    },
    {
      id: 103,
      source: 31,
      target: 29,
      value: 7,
      relation: "transfer learning",
    },
    {
      id: 104,
      source: 31,
      target: 30,
      value: 7,
      relation: "bidirectional pre-training",
    },
    {
      id: 105,
      source: 33,
      target: 31,
      value: 7,
      relation: "different pre-training objective",
    },
    {
      id: 106,
      source: 34,
      target: 32,
      value: 6,
      relation: "improved training",
    },
    {
      id: 107,
      source: 35,
      target: 39,
      value: 8,
      relation: "open-source alternative",
    },
    {
      id: 108,
      source: 36,
      target: 40,
      value: 7,
      relation: "competing large language model",
    },
    {
      id: 109,
      source: 37,
      target: 39,
      value: 7,
      relation: "similar scale model",
    },
    {
      id: 110,
      source: 38,
      target: 40,
      value: 7,
      relation: "similar capabilities",
    },
    {
      id: 111,
      source: 28,
      target: 45,
      value: 7,
      relation: "parameter sharing",
    },
    {
      id: 112,
      source: 28,
      target: 46,
      value: 6,
      relation: "model compression",
    },
    {
      id: 113,
      source: 28,
      target: 47,
      value: 7,
      relation: "sparse attention mechanism",
    },
    {
      id: 114,
      source: 28,
      target: 48,
      value: 7,
      relation: "efficient attention computation",
    },
    {
      id: 115,
      source: 28,
      target: 49,
      value: 7,
      relation: "long-range dependencies",
    },
    {
      id: 116,
      source: 31,
      target: 50,
      value: 6,
      relation: "knowledge enhancement",
    },
    {
      id: 117,
      source: 31,
      target: 51,
      value: 7,
      relation: "cross-lingual modeling",
    },
    {
      id: 118,
      source: 52,
      target: 58,
      value: 8,
      relation: "advanced GAN architecture",
    },
    {
      id: 119,
      source: 58,
      target: 60,
      value: 8,
      relation: "improved image synthesis",
    },
    {
      id: 120,
      source: 61,
      target: 63,
      value: 8,
      relation: "guided image generation",
    },
    {
      id: 121,
      source: 61,
      target: 64,
      value: 8,
      relation: "high-fidelity image synthesis",
    },
    {
      id: 122,
      source: 28,
      target: 66,
      value: 7,
      relation: "sequence generation for captions",
    },
    {
      id: 123,
      source: 66,
      target: 68,
      value: 7,
      relation: "improved vision-language modeling",
    },
    {
      id: 124,
      source: 68,
      target: 71,
      value: 8,
      relation: "few-shot visual learning",
    },
    {
      id: 125,
      source: 68,
      target: 72,
      value: 8,
      relation: "vision-language pre-training",
    },
    {
      id: 126,
      source: 35,
      target: 73,
      value: 8,
      relation: "instruction following for vision",
    },
    {
      id: 127,
      source: 35,
      target: 74,
      value: 8,
      relation: "language model for robotics",
    },
    {
      id: 128,
      source: 36,
      target: 75,
      value: 9,
      relation: "multimodal capabilities",
    },
    {
      id: 129,
      source: 76,
      target: 79,
      value: 8,
      relation: "advanced game-playing AI",
    },
    {
      id: 130,
      source: 79,
      target: 81,
      value: 8,
      relation: "complex game environments",
    },
    {
      id: 131,
      source: 14,
      target: 82,
      value: 7,
      relation: "efficient mobile architectures",
    },
    {
      id: 132,
      source: 19,
      target: 82,
      value: 8,
      relation: "mobile-optimized networks",
    },
    {
      id: 133,
      source: 17,
      target: 83,
      value: 7,
      relation: "automated architecture design",
    },
    {
      id: 134,
      source: 19,
      target: 83,
      value: 8,
      relation: "efficient architecture search",
    },
    {
      id: 135,
      source: 3,
      target: 84,
      value: 6,
      relation: "non-Euclidean data processing",
    },
    {
      id: 136,
      source: 28,
      target: 84,
      value: 7,
      relation: "attention on graphs",
    },
    {
      id: 137,
      source: 14,
      target: 85,
      value: 6,
      relation: "alternative to convolutions",
    },
    {
      id: 138,
      source: 27,
      target: 86,
      value: 7,
      relation: "context-aware word representations",
    },
    {
      id: 139,
      source: 86,
      target: 31,
      value: 8,
      relation: "contextualized language modeling",
    },
    {
      id: 140,
      source: 87,
      target: 33,
      value: 7,
      relation: "transfer learning in NLP",
    },
    { id: 141, source: 3, target: 14, value: 8, relation: "enabled deep CNNs" },
    {
      id: 142,
      source: 14,
      target: 15,
      value: 7,
      relation: "deeper architectures",
    },
    {
      id: 143,
      source: 15,
      target: 17,
      value: 8,
      relation: "very deep networks",
    },
    {
      id: 144,
      source: 17,
      target: 23,
      value: 7,
      relation: "encoder for segmentation",
    },
    {
      id: 145,
      source: 23,
      target: 25,
      value: 6,
      relation: "dense prediction tasks",
    },
    {
      id: 146,
      source: 17,
      target: 25,
      value: 7,
      relation: "backbone for object detection",
    },
    {
      id: 147,
      source: 26,
      target: 28,
      value: 8,
      relation: "sequential modeling breakthrough",
    },
    {
      id: 148,
      source: 27,
      target: 28,
      value: 8,
      relation: "addressed long-term dependencies",
    },
    {
      id: 149,
      source: 28,
      target: 35,
      value: 9,
      relation: "scaled transformer for LLMs",
    },
    {
      id: 150,
      source: 35,
      target: 36,
      value: 9,
      relation: "advanced capabilities",
    },
    {
      id: 151,
      source: 52,
      target: 55,
      value: 8,
      relation: "high-quality image generation",
    },
    {
      id: 152,
      source: 55,
      target: 58,
      value: 9,
      relation: "style-based generation",
    },
    {
      id: 153,
      source: 58,
      target: 62,
      value: 7,
      relation: "high-quality image synthesis",
    },
    {
      id: 154,
      source: 62,
      target: 70,
      value: 8,
      relation: "text-guided image generation",
    },
    {
      id: 155,
      source: 68,
      target: 70,
      value: 8,
      relation: "improved text-image alignment",
    },
    {
      id: 156,
      source: 35,
      target: 71,
      value: 8,
      relation: "few-shot learning in vision",
    },
    {
      id: 157,
      source: 35,
      target: 72,
      value: 8,
      relation: "language-vision integration",
    },
    {
      id: 158,
      source: 76,
      target: 80,
      value: 8,
      relation: "model-based reinforcement learning",
    },
    { id: 159, source: 80, target: 81, value: 9, relation: "advanced game AI" },
    {
      id: 160,
      source: 14,
      target: 83,
      value: 7,
      relation: "automated CNN design",
    },
    {
      id: 161,
      source: 17,
      target: 84,
      value: 6,
      relation: "residual connections in GNNs",
    },
    {
      id: 162,
      source: 31,
      target: 87,
      value: 7,
      relation: "transfer learning in NLP",
    },
    {
      id: 163,
      source: 3,
      target: 85,
      value: 6,
      relation: "alternative neural architecture",
    },
    {
      id: 164,
      source: 14,
      target: 20,
      value: 8,
      relation: "shift from CNNs to Transformers in vision",
    },
    {
      id: 165,
      source: 20,
      target: 68,
      value: 9,
      relation: "vision-language pre-training",
    },
    {
      id: 166,
      source: 31,
      target: 68,
      value: 9,
      relation: "language understanding in multimodal models",
    },
    {
      id: 167,
      source: 35,
      target: 69,
      value: 8,
      relation: "large language model for image generation",
    },
    {
      id: 168,
      source: 69,
      target: 62,
      value: 8,
      relation: "text-to-image diffusion models",
    },
    {
      id: 169,
      source: 28,
      target: 52,
      value: 7,
      relation: "adversarial training concept",
    },
    {
      id: 170,
      source: 52,
      target: 61,
      value: 8,
      relation: "generative models evolution",
    },
    {
      id: 171,
      source: 17,
      target: 82,
      value: 7,
      relation: "efficient architectures for mobile",
    },
    {
      id: 172,
      source: 19,
      target: 20,
      value: 7,
      relation: "efficient vision models",
    },
    {
      id: 173,
      source: 31,
      target: 35,
      value: 8,
      relation: "large-scale language modeling",
    },
    {
      id: 174,
      source: 35,
      target: 74,
      value: 8,
      relation: "language models for robotics",
    },
    {
      id: 175,
      source: 36,
      target: 73,
      value: 9,
      relation: "visual instruction following",
    },
    {
      id: 176,
      source: 28,
      target: 67,
      value: 7,
      relation: "attention for visual reasoning",
    },
    {
      id: 177,
      source: 67,
      target: 75,
      value: 8,
      relation: "advanced visual question answering",
    },
    {
      id: 178,
      source: 76,
      target: 81,
      value: 8,
      relation: "deep RL for complex games",
    },
    {
      id: 179,
      source: 14,
      target: 84,
      value: 6,
      relation: "feature extraction for graphs",
    },
    {
      id: 180,
      source: 28,
      target: 85,
      value: 6,
      relation: "attention mechanism in capsules",
    },
    {
      id: 181,
      source: 86,
      target: 33,
      value: 7,
      relation: "contextual language understanding",
    },
    {
      id: 182,
      source: 33,
      target: 87,
      value: 7,
      relation: "transfer learning in NLP",
    },
    {
      id: 183,
      source: 3,
      target: 52,
      value: 7,
      relation: "adversarial training concept",
    },
    { id: 184, source: 14, target: 53, value: 8, relation: "CNNs in GANs" },
    {
      id: 185,
      source: 53,
      target: 56,
      value: 7,
      relation: "conditional image generation",
    },
    {
      id: 186,
      source: 56,
      target: 57,
      value: 8,
      relation: "unpaired image translation",
    },
    {
      id: 187,
      source: 57,
      target: 58,
      value: 7,
      relation: "improved image synthesis",
    },
    {
      id: 188,
      source: 58,
      target: 61,
      value: 7,
      relation: "high-quality image generation",
    },
    {
      id: 189,
      source: 61,
      target: 65,
      value: 8,
      relation: "faster sampling in diffusion models",
    },
    {
      id: 190,
      source: 28,
      target: 65,
      value: 6,
      relation: "attention in generative models",
    },
    {
      id: 191,
      source: 14,
      target: 66,
      value: 7,
      relation: "CNN for image features in captioning",
    },
    {
      id: 192,
      source: 27,
      target: 66,
      value: 7,
      relation: "LSTM for caption generation",
    },
    {
      id: 193,
      source: 66,
      target: 69,
      value: 7,
      relation: "image-text understanding",
    },
    {
      id: 194,
      source: 69,
      target: 71,
      value: 8,
      relation: "few-shot visual generation",
    },
    {
      id: 195,
      source: 71,
      target: 72,
      value: 8,
      relation: "improved vision-language models",
    },
    {
      id: 196,
      source: 72,
      target: 74,
      value: 7,
      relation: "embodied AI with language",
    },
    {
      id: 197,
      source: 74,
      target: 75,
      value: 8,
      relation: "multimodal AI systems",
    },
    { id: 198, source: 76, target: 78, value: 9, relation: "deep RL for Go" },
    {
      id: 199,
      source: 78,
      target: 79,
      value: 9,
      relation: "general game playing AI",
    },
    {
      id: 200,
      source: 79,
      target: 80,
      value: 8,
      relation: "model-based planning in RL",
    },
    {
      id: 201,
      source: 17,
      target: 82,
      value: 7,
      relation: "efficient CNN architectures",
    },
    {
      id: 202,
      source: 82,
      target: 83,
      value: 8,
      relation: "automated mobile network design",
    },
    {
      id: 203,
      source: 83,
      target: 84,
      value: 6,
      relation: "architecture search for graphs",
    },
    {
      id: 204,
      source: 84,
      target: 85,
      value: 6,
      relation: "alternative graph processing",
    },
    {
      id: 205,
      source: 85,
      target: 20,
      value: 6,
      relation: "alternative to CNNs in vision",
    },
    {
      id: 206,
      source: 86,
      target: 32,
      value: 7,
      relation: "improved word representations",
    },
    {
      id: 207,
      source: 32,
      target: 87,
      value: 7,
      relation: "transfer learning techniques",
    },
    {
      id: 208,
      source: 3,
      target: 23,
      value: 7,
      relation: "pixel-wise prediction",
    },
    {
      id: 209,
      source: 23,
      target: 24,
      value: 8,
      relation: "improved segmentation architecture",
    },
    {
      id: 210,
      source: 24,
      target: 25,
      value: 7,
      relation: "real-time object detection",
    },
    {
      id: 211,
      source: 14,
      target: 26,
      value: 6,
      relation: "feature extraction for sequences",
    },
    {
      id: 212,
      source: 26,
      target: 29,
      value: 7,
      relation: "sequence-to-sequence modeling",
    },
    {
      id: 213,
      source: 29,
      target: 30,
      value: 8,
      relation: "text-to-text transfer learning",
    },
    {
      id: 214,
      source: 30,
      target: 31,
      value: 7,
      relation: "bidirectional context modeling",
    },
    {
      id: 215,
      source: 31,
      target: 34,
      value: 8,
      relation: "large-scale language modeling",
    },
    {
      id: 216,
      source: 34,
      target: 37,
      value: 8,
      relation: "scaling language models",
    },
    {
      id: 217,
      source: 37,
      target: 40,
      value: 7,
      relation: "open-source large language models",
    },
    {
      id: 218,
      source: 28,
      target: 42,
      value: 7,
      relation: "permutation-based language modeling",
    },
    {
      id: 219,
      source: 42,
      target: 43,
      value: 7,
      relation: "efficient pre-training",
    },
    {
      id: 220,
      source: 43,
      target: 44,
      value: 7,
      relation: "sparse transformer models",
    },
    {
      id: 221,
      source: 44,
      target: 47,
      value: 8,
      relation: "efficient attention mechanisms",
    },
    {
      id: 222,
      source: 47,
      target: 48,
      value: 7,
      relation: "reformulated attention computation",
    },
    {
      id: 223,
      source: 48,
      target: 49,
      value: 7,
      relation: "long-range language modeling",
    },
    {
      id: 224,
      source: 49,
      target: 50,
      value: 6,
      relation: "knowledge integration in transformers",
    },
    {
      id: 225,
      source: 50,
      target: 51,
      value: 7,
      relation: "multilingual modeling",
    },
    {
      id: 226,
      source: 52,
      target: 54,
      value: 8,
      relation: "improved GAN training",
    },
    {
      id: 227,
      source: 54,
      target: 55,
      value: 8,
      relation: "progressive GAN training",
    },
    {
      id: 228,
      source: 55,
      target: 59,
      value: 9,
      relation: "style-based generator improvements",
    },
    { id: 229, source: 59, target: 60, value: 8, relation: "alias-free GAN" },
    {
      id: 230,
      source: 60,
      target: 61,
      value: 7,
      relation: "high-quality image synthesis",
    },
    {
      id: 231,
      source: 61,
      target: 63,
      value: 8,
      relation: "guided diffusion models",
    },
    {
      id: 232,
      source: 63,
      target: 64,
      value: 8,
      relation: "high-resolution diffusion",
    },
    {
      id: 233,
      source: 64,
      target: 65,
      value: 7,
      relation: "faster diffusion sampling",
    },
    {
      id: 234,
      source: 28,
      target: 68,
      value: 9,
      relation: "transformer for vision-language tasks",
    },
    {
      id: 235,
      source: 68,
      target: 70,
      value: 9,
      relation: "improved text-to-image generation",
    },
    {
      id: 236,
      source: 70,
      target: 71,
      value: 8,
      relation: "few-shot visual learning",
    },
    {
      id: 237,
      source: 71,
      target: 73,
      value: 8,
      relation: "visual instruction tuning",
    },
    {
      id: 238,
      source: 73,
      target: 75,
      value: 9,
      relation: "multimodal AI capabilities",
    },
    {
      id: 239,
      source: 76,
      target: 77,
      value: 8,
      relation: "asynchronous deep RL",
    },
    {
      id: 240,
      source: 77,
      target: 80,
      value: 8,
      relation: "advanced model-based RL",
    },
    {
      id: 241,
      source: 80,
      target: 81,
      value: 9,
      relation: "RL for complex strategy games",
    },
    {
      id: 242,
      source: 14,
      target: 83,
      value: 7,
      relation: "CNN architecture search",
    },
    {
      id: 243,
      source: 83,
      target: 19,
      value: 8,
      relation: "efficient network scaling",
    },
    {
      id: 244,
      source: 19,
      target: 84,
      value: 6,
      relation: "efficient architectures for graphs",
    },
    {
      id: 244,
      source: 19,
      target: 84,
      value: 6,
      relation: "efficient architectures for graphs",
    },
    {
      id: 245,
      source: 84,
      target: 85,
      value: 6,
      relation: "alternative graph processing",
    },
    {
      id: 246,
      source: 85,
      target: 20,
      value: 6,
      relation: "non-CNN vision architectures",
    },
    {
      id: 247,
      source: 20,
      target: 21,
      value: 8,
      relation: "hierarchical vision transformer",
    },
    {
      id: 248,
      source: 21,
      target: 22,
      value: 7,
      relation: "efficient vision transformer training",
    },
    {
      id: 249,
      source: 22,
      target: 68,
      value: 8,
      relation: "vision transformer for CLIP",
    },
    {
      id: 250,
      source: 68,
      target: 69,
      value: 9,
      relation: "text-to-image generation",
    },
    {
      id: 251,
      source: 69,
      target: 70,
      value: 9,
      relation: "improved text-to-image model",
    },
    {
      id: 252,
      source: 70,
      target: 72,
      value: 8,
      relation: "vision-language pre-training",
    },
    {
      id: 253,
      source: 72,
      target: 74,
      value: 8,
      relation: "embodied AI with language",
    },
    {
      id: 254,
      source: 74,
      target: 75,
      value: 9,
      relation: "multimodal AI system",
    },
    {
      id: 255,
      source: 35,
      target: 75,
      value: 9,
      relation: "large language model with vision",
    },
    {
      id: 256,
      source: 14,
      target: 76,
      value: 6,
      relation: "CNN for state representation in RL",
    },
    {
      id: 257,
      source: 76,
      target: 78,
      value: 9,
      relation: "deep RL for complex games",
    },
    { id: 258, source: 78, target: 79, value: 9, relation: "self-play in RL" },
    { id: 259, source: 79, target: 80, value: 8, relation: "model-based RL" },
    {
      id: 260,
      source: 80,
      target: 81,
      value: 9,
      relation: "RL for real-time strategy games",
    },
    {
      id: 261,
      source: 17,
      target: 82,
      value: 7,
      relation: "efficient CNN architectures",
    },
    {
      id: 262,
      source: 82,
      target: 83,
      value: 8,
      relation: "neural architecture search",
    },
    {
      id: 263,
      source: 83,
      target: 19,
      value: 9,
      relation: "efficient network scaling",
    },
    {
      id: 264,
      source: 19,
      target: 20,
      value: 8,
      relation: "efficient vision transformers",
    },
    {
      id: 265,
      source: 86,
      target: 87,
      value: 8,
      relation: "transfer learning in NLP",
    },
    {
      id: 266,
      source: 87,
      target: 31,
      value: 9,
      relation: "pre-training for NLP tasks",
    },
    {
      id: 267,
      source: 31,
      target: 32,
      value: 8,
      relation: "robust optimization of BERT",
    },
    {
      id: 268,
      source: 32,
      target: 33,
      value: 7,
      relation: "generative pre-training",
    },
    {
      id: 269,
      source: 33,
      target: 34,
      value: 9,
      relation: "scaled up language model",
    },
    {
      id: 270,
      source: 34,
      target: 35,
      value: 9,
      relation: "massive language model",
    },
    {
      id: 271,
      source: 35,
      target: 36,
      value: 9,
      relation: "advanced language model",
    },
    {
      id: 272,
      source: 36,
      target: 37,
      value: 8,
      relation: "competing large language model",
    },
    { id: 273, source: 37, target: 38, value: 9, relation: "improved version" },
    {
      id: 274,
      source: 38,
      target: 39,
      value: 8,
      relation: "open-source alternative",
    },
    {
      id: 275,
      source: 39,
      target: 40,
      value: 8,
      relation: "similar open-source approach",
    },
    {
      id: 276,
      source: 28,
      target: 41,
      value: 7,
      relation: "extended context modeling",
    },
    {
      id: 277,
      source: 41,
      target: 42,
      value: 8,
      relation: "permutation-based pre-training",
    },
    {
      id: 278,
      source: 42,
      target: 43,
      value: 7,
      relation: "efficient pre-training",
    },
    {
      id: 279,
      source: 43,
      target: 44,
      value: 8,
      relation: "sparse attention mechanism",
    },
    {
      id: 280,
      source: 44,
      target: 45,
      value: 7,
      relation: "parameter reduction techniques",
    },
    {
      id: 281,
      source: 45,
      target: 46,
      value: 7,
      relation: "model compression",
    },
    {
      id: 282,
      source: 46,
      target: 47,
      value: 6,
      relation: "efficient transformers",
    },
    {
      id: 283,
      source: 47,
      target: 48,
      value: 7,
      relation: "reformer architecture",
    },
    {
      id: 284,
      source: 48,
      target: 49,
      value: 7,
      relation: "long-range transformer",
    },
    {
      id: 285,
      source: 49,
      target: 50,
      value: 6,
      relation: "knowledge integration",
    },
    {
      id: 286,
      source: 50,
      target: 51,
      value: 7,
      relation: "multilingual modeling",
    },
    {
      id: 287,
      source: 3,
      target: 52,
      value: 7,
      relation: "adversarial training concept",
    },
    {
      id: 288,
      source: 52,
      target: 53,
      value: 8,
      relation: "GAN for image generation",
    },
    {
      id: 289,
      source: 53,
      target: 54,
      value: 7,
      relation: "improved GAN training",
    },
    {
      id: 290,
      source: 54,
      target: 55,
      value: 8,
      relation: "progressive growing technique",
    },
    {
      id: 291,
      source: 55,
      target: 56,
      value: 7,
      relation: "conditional generation",
    },
    {
      id: 292,
      source: 56,
      target: 57,
      value: 8,
      relation: "unpaired image translation",
    },
    {
      id: 293,
      source: 57,
      target: 58,
      value: 7,
      relation: "style-based generator",
    },
    {
      id: 294,
      source: 58,
      target: 59,
      value: 9,
      relation: "improved style-based GAN",
    },
    { id: 295, source: 59, target: 60, value: 8, relation: "alias-free GAN" },
    { id: 296, source: 60, target: 61, value: 7, relation: "diffusion models" },
    {
      id: 297,
      source: 61,
      target: 62,
      value: 9,
      relation: "text-to-image diffusion",
    },
    {
      id: 298,
      source: 62,
      target: 63,
      value: 8,
      relation: "guided diffusion process",
    },
    {
      id: 299,
      source: 63,
      target: 64,
      value: 8,
      relation: "high-resolution diffusion",
    },
    {
      id: 300,
      source: 64,
      target: 65,
      value: 7,
      relation: "faster sampling in diffusion",
    },
    {
      id: 301,
      source: 28,
      target: 66,
      value: 7,
      relation: "attention for image captioning",
    },
    {
      id: 302,
      source: 66,
      target: 67,
      value: 8,
      relation: "visual question answering",
    },
    {
      id: 303,
      source: 67,
      target: 68,
      value: 8,
      relation: "vision-language pre-training",
    },
    {
      id: 304,
      source: 68,
      target: 69,
      value: 9,
      relation: "text-to-image generation",
    },
    {
      id: 305,
      source: 69,
      target: 70,
      value: 9,
      relation: "improved text-to-image model",
    },
    {
      id: 306,
      source: 70,
      target: 71,
      value: 8,
      relation: "few-shot visual learning",
    },
    {
      id: 307,
      source: 71,
      target: 72,
      value: 8,
      relation: "vision-language pre-training",
    },
    {
      id: 308,
      source: 72,
      target: 73,
      value: 8,
      relation: "visual instruction tuning",
    },
    {
      id: 309,
      source: 73,
      target: 74,
      value: 8,
      relation: "embodied AI with language",
    },
    {
      id: 311,
      source: 28,
      target: 20,
      value: 10,
      relation: "architectural foundation for vision transformers",
    },
    {
      id: 312,
      source: 28,
      target: 66,
      value: 9,
      relation: "enabled image-text attention",
    },
    {
      id: 313,
      source: 28,
      target: 62,
      value: 8,
      relation: "transformer in diffusion models",
    },
    {
      id: 314,
      source: 33,
      target: 68,
      value: 9,
      relation: "language understanding foundation",
    },
    {
      id: 315,
      source: 33,
      target: 73,
      value: 8,
      relation: "instruction tuning basis",
    },
    {
      id: 316,
      source: 17,
      target: 28,
      value: 8,
      relation: "deep architecture principles",
    },
    {
      id: 317,
      source: 17,
      target: 23,
      value: 7,
      relation: "backbone for segmentation",
    },
    {
      id: 318,
      source: 20,
      target: 69,
      value: 8,
      relation: "vision-language integration",
    },
    {
      id: 319,
      source: 20,
      target: 73,
      value: 7,
      relation: "visual instruction understanding",
    },
    {
      id: 320,
      source: 61,
      target: 69,
      value: 9,
      relation: "text-guided image generation",
    },
    {
      id: 321,
      source: 61,
      target: 58,
      value: 7,
      relation: "generative modeling evolution",
    },
    {
      id: 322,
      source: 14,
      target: 28,
      value: 6,
      relation: "spatial processing insights",
    },
    {
      id: 323,
      source: 33,
      target: 62,
      value: 8,
      relation: "text conditioning in diffusion",
    },
    {
      id: 324,
      source: 33, // BERT
      target: 71, // Visual-Language Models
      value: 9,
      relation: "language understanding for vision",
    },
    {
      id: 325,
      source: 28, // Transformer
      target: 75, // Multimodal Models
      value: 10,
      relation: "foundation for multimodal architectures",
    },
    {
      id: 326,
      source: 45, // GPT
      target: 69, // Text-to-Image Models
      value: 8,
      relation: "language generation principles",
    },

    // Vision -> Language
    {
      id: 327,
      source: 17, // ResNet
      target: 66, // Image Captioning
      value: 7,
      relation: "visual feature extraction",
    },
    {
      id: 328,
      source: 20, // ViT
      target: 72, // Vision-Language Models
      value: 9,
      relation: "unified vision-language processing",
    },

    // 2. MODEL FAMILY CONNECTIONS
    // Transformer Family
    {
      id: 329,
      source: 28, // Original Transformer
      target: 33, // BERT
      value: 10,
      relation: "bidirectional encoding",
    },
    {
      id: 330,
      source: 28,
      target: 45, // GPT
      value: 10,
      relation: "autoregressive decoding",
    },
    {
      id: 331,
      source: 33, // BERT
      target: 48, // RoBERTa
      value: 8,
      relation: "optimized training",
    },

    // Vision Family
    {
      id: 332,
      source: 14, // Early CNNs
      target: 20, // ViT
      value: 7,
      relation: "spatial processing evolution",
    },
    {
      id: 333,
      source: 17, // ResNet
      target: 21, // Swin Transformer
      value: 8,
      relation: "hierarchical feature processing",
    },

    // Generative Family
    {
      id: 334,
      source: 52, // GANs
      target: 61, // Diffusion
      value: 8,
      relation: "generative modeling evolution",
    },
    {
      id: 335,
      source: 58, // StyleGAN
      target: 62, // Stable Diffusion
      value: 7,
      relation: "style-based generation",
    },

    // 3. TEMPORAL INFLUENCE CHAINS
    // Early -> Modern Evolution
    {
      id: 336,
      source: 12, // AlexNet
      target: 17, // ResNet
      value: 9,
      relation: "deep CNN evolution",
    },
    {
      id: 337,
      source: 17, // ResNet
      target: 20, // ViT
      value: 8,
      relation: "vision architecture evolution",
    },

    // Language Model Evolution
    {
      id: 338,
      source: 33, // BERT
      target: 45, // GPT
      value: 8,
      relation: "transformer application evolution",
    },
    {
      id: 339,
      source: 45, // GPT
      target: 73, // Instruction Tuning
      value: 9,
      relation: "language model capabilities",
    },

    // Multimodal Evolution
    {
      id: 340,
      source: 66, // Image Captioning
      target: 68, // CLIP
      value: 8,
      relation: "vision-language alignment",
    },
    {
      id: 341,
      source: 68, // CLIP
      target: 75, // Advanced Multimodal
      value: 9,
      relation: "multimodal understanding",
    },

    // 4. TECHNICAL CAPABILITY FLOWS
    {
      id: 342,
      source: 28, // Transformer
      target: 62, // Stable Diffusion
      value: 8,
      relation: "attention in generation",
    },
    {
      id: 343,
      source: 17, // ResNet
      target: 69, // Text-to-Image
      value: 7,
      relation: "visual quality foundation",
    },
    {
      id: 344,
      source: 33, // BERT
      target: 74, // Embodied AI
      value: 8,
      relation: "language understanding in robotics",
    },
    {
      id: 345,
      source: 45, // GPT
      target: 62, // Stable Diffusion
      value: 9,
      relation: "language conditioning in image generation",
    },
    {
      id: 346,
      source: 20, // ViT
      target: 48, // RoBERTa
      value: 7,
      relation: "cross-attention mechanisms",
    },
    {
      id: 347,
      source: 68, // CLIP
      target: 71, // Visual-Language Models
      value: 9,
      relation: "zero-shot transfer learning",
    },
    {
      id: 348,
      source: 17, // ResNet
      target: 45, // GPT
      value: 7,
      relation: "deep architecture scaling",
    },
    {
      id: 349,
      source: 33, // BERT
      target: 69, // Text-to-Image
      value: 8,
      relation: "text understanding in generation",
    },
    {
      id: 350,
      source: 45, // GPT
      target: 71, // Visual-Language Models
      value: 9,
      relation: "large-scale pre-training",
    },
    {
      id: 351,
      source: 20, // ViT
      target: 74, // Embodied AI
      value: 8,
      relation: "visual perception in robotics",
    },
    {
      id: 352,
      source: 14, // Early CNNs
      target: 23, // Segmentation Models
      value: 7,
      relation: "feature hierarchy principles",
    },
    {
      id: 353,
      source: 21, // Swin Transformer
      target: 69, // Text-to-Image
      value: 8,
      relation: "hierarchical image generation",
    },
    {
      id: 354,
      source: 12, // AlexNet
      target: 28, // Transformer
      value: 7,
      relation: "deep learning foundation",
    },
    {
      id: 355,
      source: 28, // Transformer
      target: 68, // CLIP
      value: 9,
      relation: "multimodal architecture evolution",
    },
    {
      id: 356,
      source: 68, // CLIP
      target: 73, // Instruction Tuning
      value: 8,
      relation: "vision-language alignment progression",
    },
    {
      id: 357,
      source: 61, // Diffusion Models
      target: 75, // Advanced Multimodal
      value: 9,
      relation: "generative multimodal synthesis",
    },
    {
      id: 358,
      source: 17, // ResNet
      target: 62, // Stable Diffusion
      value: 7,
      relation: "image quality enhancement",
    },
    {
      id: 359,
      source: 33, // BERT
      target: 70, // Advanced Text-to-Image
      value: 8,
      relation: "semantic understanding in generation",
    },
    {
      id: 360,
      source: 45, // GPT
      target: 74, // Embodied AI
      value: 9,
      relation: "language planning in robotics",
    },
    {
      id: 361,
      source: 68, // CLIP
      target: 72, // Vision-Language Models
      value: 9,
      relation: "multimodal representation learning",
    },
    {
      id: 362,
      source: 20, // ViT
      target: 75, // Advanced Multimodal
      value: 9,
      relation: "unified perception architecture",
    },
    {
      id: 363,
      source: 61, // Diffusion Models
      target: 73, // Instruction Tuning
      value: 8,
      relation: "controlled generation capabilities",
    },
    {
      id: 364,
      source: 48, // RoBERTa
      target: 71, // Visual-Language Models
      value: 8,
      relation: "robust feature extraction",
    },
    {
      id: 365,
      source: 21, // Swin Transformer
      target: 74, // Embodied AI
      value: 8,
      relation: "hierarchical visual understanding",
    },
    // Add connections for newer emergent relationships
    {
      id: 366,
      source: 75, // Advanced Multimodal
      target: 74, // Embodied AI
      value: 10,
      relation: "multimodal robotic control",
    },
    {
      id: 367,
      source: 62, // Stable Diffusion
      target: 75, // Advanced Multimodal
      value: 9,
      relation: "visual synthesis in multimodal systems",
    },
    {
      id: 368,
      source: 35, // GPT-3
      target: 74, // Embodied AI
      value: 9,
      relation: "language planning in robotics",
    },
    {
      id: 369,
      source: 68, // CLIP
      target: 78, // AlphaGo
      value: 7,
      relation: "visual reasoning in games",
    },
    {
      id: 370,
      source: 33, // BERT
      target: 80, // MuZero
      value: 7,
      relation: "language understanding in planning",
    },
    {
      id: 371,
      source: 35, // GPT-3
      target: 62, // Stable Diffusion
      value: 8,
      relation: "large-scale conditioning",
    },
    {
      id: 372,
      source: 68, // CLIP
      target: 75, // Advanced Multimodal
      value: 9,
      relation: "zero-shot transfer in multimodal",
    },
    {
      id: 373,
      source: 14, // Early CNNs
      target: 28, // Transformer
      value: 7,
      relation: "spatial to sequential processing",
    },
    {
      id: 374,
      source: 27, // LSTM
      target: 28, // Transformer
      value: 8,
      relation: "sequential modeling evolution",
    },
    {
      id: 375,
      source: 1, // Early Neural Networks
      target: 28, // Transformer
      value: 6,
      relation: "neural computation principles",
    },
    {
      id: 376,
      source: 2, // Perceptron
      target: 20, // ViT
      value: 5,
      relation: "pattern recognition fundamentals",
    },
    {
      id: 377,
      source: 4, // Backpropagation
      target: 61, // Diffusion Models
      value: 7,
      relation: "gradient-based optimization",
    },
    {
      id: 378,
      source: 8, // SVMs
      target: 33, // BERT
      value: 6,
      relation: "feature space transformation",
    },

    // 2. Cross-Domain Influence Links
    {
      id: 379,
      source: 78, // AlphaGo
      target: 74, // Embodied AI
      value: 8,
      relation: "decision making in physical space",
    },
    {
      id: 380,
      source: 68, // CLIP
      target: 80, // MuZero
      value: 8,
      relation: "visual understanding in RL",
    },
    {
      id: 381,
      source: 45, // GPT
      target: 78, // AlphaGo
      value: 7,
      relation: "sequential decision making",
    },
    {
      id: 382,
      source: 17, // ResNet
      target: 80, // MuZero
      value: 7,
      relation: "deep representation learning",
    },

    // 3. Foundational Techniques to Modern Models
    {
      id: 383,
      source: 4, // Backpropagation
      target: 75, // Advanced Multimodal
      value: 9,
      relation: "end-to-end learning foundation",
    },
    {
      id: 384,
      source: 27, // LSTM
      target: 62, // Stable Diffusion
      value: 7,
      relation: "sequential generation principles",
    },
    {
      id: 385,
      source: 14, // Early CNNs
      target: 71, // Visual-Language Models
      value: 8,
      relation: "hierarchical feature learning",
    },

    // 4. Competing Approaches Relationships
    {
      id: 386,
      source: 52, // GANs
      target: 61, // Diffusion Models
      value: 9,
      relation: "competing generative paradigms",
    },
    {
      id: 387,
      source: 33, // BERT
      target: 45, // GPT
      value: 8,
      relation: "competing pre-training approaches",
    },
    {
      id: 388,
      source: 20, // ViT
      target: 21, // Swin Transformer
      value: 7,
      relation: "competing vision architectures",
    },
    {
      id: 389,
      source: 68, // CLIP
      target: 69, // Text-to-Image
      value: 8,
      relation: "competing multimodal approaches",
    },

    // 5. Evaluation Metrics and Benchmarks Influence
    {
      id: 390,
      source: 12, // AlexNet
      target: 17, // ResNet
      value: 8,
      relation: "ImageNet benchmark evolution",
    },
    {
      id: 391,
      source: 33, // BERT
      target: 48, // RoBERTa
      value: 7,
      relation: "GLUE benchmark optimization",
    },
    {
      id: 392,
      source: 68, // CLIP
      target: 70, // Advanced Text-to-Image
      value: 8,
      relation: "zero-shot evaluation impact",
    },
    {
      id: 393,
      source: 45, // GPT
      target: 73, // Instruction Tuning
      value: 9,
      relation: "human evaluation influence",
    },
    {
      id: 394,
      source: 74, // Embodied AI
      target: 75, // Advanced Multimodal
      value: 8,
      relation: "real-world performance metrics",
    },
  ],
};

// Add version-based grouping helper
export const getVersionColor = (majorVersion) => {
  const colorScale = {
    1: "hsl(180, 100%, 70%)", // Foundation Models
    2: "hsl(120, 100%, 70%)", // Memory-Based and Unsupervised
    3: "hsl(60, 100%, 70%)", // Computer Vision
    4: "hsl(0, 100%, 70%)", // Sequence Models
    5: "hsl(240, 100%, 70%)", // Generative Models
    6: "hsl(300, 100%, 70%)", // Multimodal
    7: "hsl(30, 100%, 70%)", // Reinforcement Learning
    8: "hsl(150, 100%, 70%)", // Efficient/Specialized
    9: "hsl(270, 100%, 70%)", // Advanced NLP
  };
  return majorVersion ? colorScale[majorVersion] : "rgba(255, 255, 255, 0.7)";
};

// Add version grouping helper
export const getModelFamily = (version) => {
  const families = {
    1: "Foundation Models",
    2: "Memory-Based and Unsupervised",
    3: "Computer Vision",
    4: "Sequence Models and Transformers",
    5: "Generative Models",
    6: "Multimodal Models",
    7: "Reinforcement Learning",
    8: "Efficient/Specialized Architectures",
    9: "Advanced NLP",
  };
  const majorVersion = version ? parseInt(version.match(/v(\d+)/)[1]) : null;
  return majorVersion ? families[majorVersion] : "Unknown";
};
