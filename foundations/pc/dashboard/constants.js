export const MODEL_IMAGE =
  "https://via.placeholder.com/300x200.png?text=GPT+Model+Image";

export const DEFAULT_MODEL = {
  name: "GPT",
  version: "v4.2.3.1",
  year: 2018,
  place: "Alec Radford et al., OpenAI",
  stats: {
    citations: 13500,
    parameters: "175B",
    trainingData: "570GB",
    computeUsed: "3640",
    inferenceSpeed: 32,
    memoryUsage: "350GB",
    trainTime: "34 days",
    carbonFootprint: "552",
  },
  explanation:
    "Introduced unsupervised pre-training for language models using Transformer decoder.",
  parameters: "175B",
  trainingData: "570GB",
  performance: {
    metric: "Perplexity",
    yAxisLabel: "Score",
    xAxisLabel: "Model Size",
    labels: ["1B", "10B", "100B", "175B"],
    data: [18, 15, 12, 10],
    isLowerBetter: true,
    format: "number",
  },
};

export const RELATED_PAPERS = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
  },
  {
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin et al.",
    year: 2018,
  },
  {
    title: "Language Models are Few-Shot Learners",
    authors: "Brown et al.",
    year: 2020,
  },
];

export const MODEL_LIMITATIONS = [
  "May generate incorrect information",
  "Limited to 128K tokens",
  "Contains societal biases",
  "Fixed knowledge cutoff date",
  "Struggles with complex reasoning",
];

export const MODEL_ARCHITECTURE = [
  "Input",
  "Embedding",
  "Transformer",
  "Output",
];

export const PERFORMANCE_METRICS = {
  FOUNDATION: {
    accuracy: {
      label: "Classification Accuracy",
      yAxisLabel: "Accuracy (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["Perceptron", "MLP", "Modern NN", "Current"],
        data: [0.65, 0.78, 0.89, 0.92],
      },
    },
  },

  MEMORY_MODELS: {
    recallAccuracy: {
      label: "Pattern Recall Accuracy",
      yAxisLabel: "Accuracy (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["Basic RNN", "Hopfield", "LSTM", "Current"],
        data: [0.45, 0.67, 0.82, 0.88],
      },
    },
    convergenceTime: {
      label: "Convergence Time",
      yAxisLabel: "Iterations",
      isLowerBetter: true,
      format: "number",
      benchmarks: {
        labels: ["Basic", "Optimized", "Modern", "Current"],
        data: [1000, 750, 500, 300],
      },
    },
  },

  VISION_CNN: {
    imagenetTop1: {
      label: "ImageNet Top-1 Accuracy",
      yAxisLabel: "Accuracy (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["AlexNet", "VGG", "ResNet", "Current"],
        data: [0.63, 0.74, 0.82, 0.88],
      },
    },
    inferenceTime: {
      label: "Inference Time",
      yAxisLabel: "ms/image",
      isLowerBetter: true,
      format: "number",
      benchmarks: {
        labels: ["Heavy", "Medium", "Light", "Current"],
        data: [100, 50, 25, 15],
      },
    },
  },

  TRANSFORMER_LLM: {
    perplexity: {
      label: "Perplexity",
      yAxisLabel: "Score",
      isLowerBetter: true,
      format: "number",
      benchmarks: {
        labels: ["GPT-2", "GPT-3", "GPT-4", "Current"],
        data: [35.76, 20.5, 15.32, 10.12],
      },
    },
    mmlu: {
      label: "MMLU Score",
      yAxisLabel: "Accuracy (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["BERT", "RoBERTa", "PaLM", "Current"],
        data: [0.452, 0.501, 0.578, 0.699],
      },
    },
    humanEval: {
      label: "HumanEval",
      yAxisLabel: "Pass Rate (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["CodeX", "GPT-3", "GPT-4", "Current"],
        data: [0.521, 0.627, 0.732, 0.815],
      },
    },
  },

  GENERATIVE: {
    fid: {
      label: "FID Score",
      yAxisLabel: "Score",
      isLowerBetter: true,
      format: "decimal",
      benchmarks: {
        labels: ["GAN", "DALL-E", "SD", "Current"],
        data: [32.1, 27.3, 22.1, 18.7],
      },
    },
    clipScore: {
      label: "CLIP Score",
      yAxisLabel: "Score",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["v1", "v2", "v3", "Current"],
        data: [0.652, 0.687, 0.723, 0.758],
      },
    },
  },

  MULTIMODAL: {
    vqa: {
      label: "VQA Score",
      yAxisLabel: "Accuracy (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["Early", "CLIP", "GPT-4V", "Current"],
        data: [0.54, 0.67, 0.78, 0.82],
      },
    },
    crossModalRetrieval: {
      label: "Retrieval Accuracy",
      yAxisLabel: "R@1 (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["CLIP", "Florence", "Gemini", "Current"],
        data: [0.295, 0.381, 0.456, 0.487],
      },
    },
  },

  REINFORCEMENT: {
    winRate: {
      label: "Win Rate",
      yAxisLabel: "Rate (%)",
      isLowerBetter: false,
      format: "percentage",
      benchmarks: {
        labels: ["DQN", "A3C", "AlphaGo", "Current"],
        data: [0.51, 0.67, 0.89, 0.92],
      },
    },
    sampleEfficiency: {
      label: "Sample Efficiency",
      yAxisLabel: "Steps to Converge",
      isLowerBetter: true,
      format: "number",
      benchmarks: {
        labels: ["Basic", "PPO", "Advanced", "Current"],
        data: [1000000, 500000, 250000, 100000],
      },
    },
  },
};

// Example of a model using these metrics:
export const SAMPLE_MODEL = {
  name: "GPT-Neo",
  version: "v2.0",
  year: 2023,
  place: "EleutherAI",
  citation: 8500,
  explanation: "Open-source alternative to GPT-3 with competitive performance.",
  parameters: "125B",
  trainingData: "825GB",
  performance: {
    metric: "MMLU Score",
    yAxisLabel: "Accuracy (%)",
    xAxisLabel: "Model",
    labels: ["BERT", "RoBERTa", "T5", "Current"],
    data: [0.452, 0.501, 0.578, 0.699],
    isLowerBetter: false,
    format: "percentage",
    benchmarks: {
      labels: ["BERT", "RoBERTa", "T5", "Current"],
      data: [0.452, 0.501, 0.578, 0.699],
    },
  },
};

export const MODEL_STATS_CONFIG = {
  citations: {
    label: "Citations",
    priority: 1, // Lower number = higher priority
    format: "number",
    suffix: "",
  },
  parameters: {
    label: "Parameters",
    priority: 2,
    format: "text",
    suffix: "",
  },
  trainingData: {
    label: "Training Data",
    priority: 3,
    format: "text",
    suffix: "",
  },
  computeUsed: {
    label: "Compute Used",
    priority: 4,
    format: "text",
    suffix: "PF-days",
  },
  inferenceSpeed: {
    label: "Inference Speed",
    priority: 5,
    format: "number",
    suffix: "tok/s",
  },
  memoryUsage: {
    label: "Memory Usage",
    priority: 6,
    format: "text",
    suffix: "",
  },
  trainTime: {
    label: "Training Time",
    priority: 7,
    format: "text",
    suffix: "",
  },
  carbonFootprint: {
    label: "CO2 Emission",
    priority: 8,
    format: "text",
    suffix: "tCO2eq",
  },
};
