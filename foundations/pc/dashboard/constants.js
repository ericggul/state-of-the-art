export const MODEL_IMAGE =
  "https://via.placeholder.com/300x200.png?text=GPT+Model+Image";

export const DEFAULT_MODEL = {
  name: "GPT",
  version: "v4.2.3.1",
  year: 2018,
  place: "Alec Radford et al., OpenAI",
  citation: 13500,
  explanation:
    "Introduced unsupervised pre-training for language models using Transformer decoder.",
  parameters: "175B",
  trainingData: "570GB",
  performance: {
    labels: ["1B", "10B", "100B", "175B"],
    data: [18, 15, 12, 10],
  },
};

export const RELATED_PAPERS = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    url: "#",
  },
  {
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin et al.",
    year: 2018,
    url: "#",
  },
  {
    title: "Language Models are Few-Shot Learners",
    authors: "Brown et al.",
    year: 2020,
    url: "#",
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
