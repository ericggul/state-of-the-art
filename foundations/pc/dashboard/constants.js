export const MODEL_CATEGORIES = {
  FOUNDATION: "Foundation Models",
  MEMORY: "Memory-Based Models",
  CNN: "Vision Models",
  TRANSFORMER: "Language Models",
  GENERATIVE: "Generative Models",
  MULTIMODAL: "Multimodal Models",
  RL: "Reinforcement Learning",
};

export const PERFORMANCE_TYPES = {
  CLASSIFICATION: {
    metric: "Classification Accuracy",
    yAxisLabel: "Accuracy (%)",
    format: "percentage",
    isLowerBetter: false,
  },
  PERPLEXITY: {
    metric: "Perplexity",
    yAxisLabel: "Score",
    format: "number",
    isLowerBetter: true,
  },
  MMLU: {
    metric: "MMLU Score",
    yAxisLabel: "Accuracy (%)",
    format: "percentage",
    isLowerBetter: false,
  },
};

export const STATS_CONFIG = {
  citations: { label: "Citations", format: "number", priority: 1 },
  parameters: { label: "Parameters", format: "text", priority: 2 },
  trainingData: { label: "Training Data", format: "text", priority: 3 },
  computeUsed: {
    label: "Compute",
    format: "text",
    suffix: "PF-days",
    priority: 4,
  },
  inferenceSpeed: {
    label: "Speed",
    format: "number",
    suffix: "tok/s",
    priority: 5,
  },
  memoryUsage: { label: "Memory", format: "text", priority: 6 },
  trainTime: { label: "Training Time", format: "text", priority: 7 },
  carbonFootprint: {
    label: "CO2",
    format: "text",
    suffix: "tCO2eq",
    priority: 8,
  },
};

export const MODELS_LIST = [
  {
    id: "v1.0",
    category: "FOUNDATION",
    name: "McCulloch-Pitts Neuron",
    year: 1943,
    authors: "Warren McCulloch and Walter Pitts",
    citations: 18434,
    explanation:
      "Introduced the first mathematical model of a neuron, laying the foundation for neural network research.",
    architecture: ["Input", "Threshold", "Output"],
    highlights: [
      "First mathematical model of artificial neuron",
      "Binary threshold activation function",
      "Foundational to modern neural networks",
    ],
    limitations: [
      "Can only implement logical functions",
      "No learning capability",
      "Binary output only",
    ],
    stats: {
      parameters: "1",
      computeUsed: "N/A",
      inferenceSpeed: 1,
      memoryUsage: "1KB",
    },
    performance: {
      metric: "Classification Accuracy",
      yAxisLabel: "Accuracy (%)",
      labels: ["Basic", "Improved", "Modern", "Current"],
      data: [0.65, 0.78, 0.89, 0.92],
      isLowerBetter: false,
      format: "percentage",
    },
    paper:
      "McCulloch, W. S., & Pitts, W. (1943). A logical calculus of the ideas immanent in nervous activity. The bulletin of mathematical biophysics, 5(4), 115-133.",
    relatedPapers: [
      "Rosenblatt, F. (1958). The perceptron: a probabilistic model for information storage and organization in the brain. Psychological review, 65(6), 386.",
      "Minsky, M., & Papert, S. (1969). Perceptrons: An introduction to computational geometry. MIT press.",
    ],
  },
  {
    id: "v4.1",
    category: "TRANSFORMER",
    name: "GPT-3",
    year: 2020,
    authors: "Brown et al., OpenAI",
    citations: 15800,
    explanation:
      "Large-scale language model demonstrating few-shot learning capabilities.",
    architecture: ["Input", "Embedding", "Transformer", "Output"],
    highlights: [
      "175B parameters at scale",
      "Few-shot learning capabilities",
      "State-of-the-art NLP performance",
      "Zero-shot task generalization",
    ],
    limitations: [
      "High computational cost",
      "Limited context window",
      "Potential biases",
      "No real-time knowledge",
    ],
    stats: {
      parameters: "175B",
      trainingData: "570GB",
      computeUsed: "3640",
      inferenceSpeed: 32,
      memoryUsage: "350GB",
      trainTime: "34 days",
      carbonFootprint: "552",
    },
    performance: {
      metric: "Perplexity",
      yAxisLabel: "Score",
      labels: ["GPT-2", "GPT-3", "GPT-4", "Current"],
      data: [35.76, 20.5, 15.32, 10.12],
      isLowerBetter: true,
      format: "number",
    },
    paper:
      "Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., ... & Amodei, D. (2020). Language models are few-shot learners. arXiv preprint arXiv:2005.14165.",
    relatedPapers: [
      "Vaswani, A., et al. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998-6008.",
      "Radford, A., et al. (2019). Language models are unsupervised multitask learners. OpenAI blog, 1(8), 9.",
      "Chowdhery, A., et al. (2022). PaLM: Scaling language modeling with pathways. arXiv preprint arXiv:2204.02311.",
    ],
  },
  {
    id: "v3.2",
    category: "CNN",
    name: "ResNet",
    year: 2015,
    authors: "He et al., Microsoft Research",
    citations: 145000,
    explanation:
      "Introduced residual connections to enable training of very deep networks.",
    architecture: ["Input", "Conv", "ResBlock", "Pool", "FC", "Output"],
    highlights: [
      "Deep residual learning",
      "Skip connections architecture",
      "SOTA image classification",
      "Solved vanishing gradient problem",
    ],
    limitations: [
      "Computationally intensive",
      "Large memory footprint",
      "Limited receptive field",
    ],
    stats: {
      parameters: "60M",
      computeUsed: "1024",
      inferenceSpeed: 150,
      memoryUsage: "102MB",
    },
    performance: {
      metric: "ImageNet Top-1 Accuracy",
      yAxisLabel: "Accuracy (%)",
      labels: ["AlexNet", "VGG", "ResNet", "Current"],
      data: [0.63, 0.74, 0.82, 0.88],
      isLowerBetter: false,
      format: "percentage",
    },
    paper:
      "He, K., Zhang, X., Ren, S., & Sun, J. (2016). Deep residual learning for image recognition. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 770-778).",
    relatedPapers: [
      "Simonyan, K., & Zisserman, A. (2014). Very deep convolutional networks for large-scale image recognition. arXiv preprint arXiv:1409.1556.",
      "Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). Imagenet classification with deep convolutional neural networks. Advances in neural information processing systems, 25.",
    ],
  },
];

// Optional: Common shared data
export const DEFAULT_MODEL = MODELS_LIST.find((model) => model.id === "v4.1");
export const MODEL_IMAGE =
  "https://miro.medium.com/v2/resize:fit:1400/1*ZbnVUpK5pw5iJJeeiBa-9w.png";
