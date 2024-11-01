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
    // Foundation Models
    {
      id: 1,
      source: 1,
      target: 2,
      value: 9,
      relation: "introduced binary thresholding",
    },
    {
      id: 2,
      source: 2,
      target: 3,
      value: 9,
      relation: "multi-layer extension",
    },
    {
      id: 3,
      source: 3,
      target: 4,
      value: 9,
      relation: "enabled deep learning",
    },
    {
      id: 4,
      source: 3,
      target: 5,
      value: 7,
      relation: "introduced recurrent connections",
    },
    {
      id: 5,
      source: 5,
      target: 6,
      value: 8,
      relation: "probabilistic version",
    },
    {
      id: 6,
      source: 3,
      target: 7,
      value: 8,
      relation: "unsupervised representation learning",
    },
    {
      id: 7,
      source: 7,
      target: 8,
      value: 8,
      relation: "probabilistic encoding",
    },
    { id: 8, source: 8, target: 9, value: 7, relation: "beta divergence" },
    {
      id: 9,
      source: 8,
      target: 10,
      value: 7,
      relation: "contrastive learning",
    },
    { id: 10, source: 10, target: 11, value: 8, relation: "momentum encoding" },
    { id: 11, source: 10, target: 12, value: 8, relation: "self-distillation" },
    {
      id: 12,
      source: 12,
      target: 13,
      value: 9,
      relation: "improved self-supervised learning",
    },

    // Computer Vision
    {
      id: 13,
      source: 3,
      target: 14,
      value: 9,
      relation: "early convolutional neural network",
    },
    { id: 14, source: 14, target: 15, value: 8, relation: "digit recognition" },
    {
      id: 15,
      source: 15,
      target: 16,
      value: 8,
      relation: "improved CNN for digits",
    },
    {
      id: 16,
      source: 16,
      target: 17,
      value: 9,
      relation: "deep CNN for ImageNet",
    },
    {
      id: 17,
      source: 17,
      target: 18,
      value: 8,
      relation: "deeper CNN architecture",
    },
    {
      id: 18,
      source: 18,
      target: 19,
      value: 7,
      relation: "introduced inception modules",
    },
    {
      id: 19,
      source: 19,
      target: 20,
      value: 9,
      relation: "residual connections",
    },
    { id: 20, source: 20, target: 21, value: 8, relation: "dense connections" },
    { id: 21, source: 21, target: 22, value: 8, relation: "efficient scaling" },
    {
      id: 22,
      source: 20,
      target: 23,
      value: 9,
      relation: "shift to transformers in vision",
    },
    {
      id: 23,
      source: 23,
      target: 24,
      value: 8,
      relation: "hierarchical vision transformer",
    },
    {
      id: 24,
      source: 23,
      target: 25,
      value: 7,
      relation: "data-efficient training",
    },
    {
      id: 25,
      source: 23,
      target: 26,
      value: 8,
      relation: "enhanced vision transformer",
    },
    {
      id: 26,
      source: 17,
      target: 27,
      value: 8,
      relation: "semantic segmentation",
    },
    {
      id: 27,
      source: 27,
      target: 28,
      value: 7,
      relation: "improved segmentation",
    },
    {
      id: 28,
      source: 17,
      target: 29,
      value: 8,
      relation: "real-time object detection",
    },
    {
      id: 29,
      source: 20,
      target: 30,
      value: 7,
      relation: "efficient mobile architecture",
    },
    {
      id: 30,
      source: 30,
      target: 31,
      value: 8,
      relation: "improved efficiency",
    },
    {
      id: 31,
      source: 31,
      target: 32,
      value: 8,
      relation: "advanced mobile CNN",
    },
    {
      id: 32,
      source: 27,
      target: 33,
      value: 9,
      relation: "general segmentation",
    },
    {
      id: 33,
      source: 33,
      target: 34,
      value: 8,
      relation: "unified segmentation",
    },

    // Sequence Models and Transformers
    {
      id: 34,
      source: 3,
      target: 35,
      value: 7,
      relation: "sequential data processing",
    },
    {
      id: 35,
      source: 35,
      target: 36,
      value: 8,
      relation: "long-term dependencies",
    },
    {
      id: 36,
      source: 36,
      target: 37,
      value: 9,
      relation: "attention mechanism",
    },
    {
      id: 37,
      source: 37,
      target: 38,
      value: 8,
      relation: "text-to-text transfer",
    },
    {
      id: 38,
      source: 37,
      target: 39,
      value: 8,
      relation: "denoising autoencoder",
    },
    {
      id: 39,
      source: 37,
      target: 40,
      value: 7,
      relation: "large-scale language model",
    },
    {
      id: 40,
      source: 37,
      target: 41,
      value: 9,
      relation: "bidirectional encoding",
    },
    { id: 41, source: 41, target: 42, value: 8, relation: "optimized BERT" },
    { id: 42, source: 41, target: 43, value: 7, relation: "enhanced BERT" },
    {
      id: 43,
      source: 37,
      target: 44,
      value: 9,
      relation: "autoregressive language model",
    },
    { id: 44, source: 44, target: 45, value: 8, relation: "scaled-up GPT" },
    {
      id: 45,
      source: 45,
      target: 46,
      value: 9,
      relation: "massive language model",
    },
    {
      id: 46,
      source: 46,
      target: 47,
      value: 9,
      relation: "advanced capabilities",
    },
    { id: 47, source: 46, target: 48, value: 8, relation: "Google's large LM" },
    { id: 48, source: 48, target: 49, value: 8, relation: "improved PaLM" },
    {
      id: 49,
      source: 46,
      target: 50,
      value: 8,
      relation: "Anthropic's large LM",
    },
    {
      id: 50,
      source: 46,
      target: 51,
      value: 8,
      relation: "Google's dialogue model",
    },
    { id: 51, source: 46, target: 52, value: 7, relation: "Meta's LLM" },
    { id: 52, source: 52, target: 53, value: 8, relation: "improved LLaMA" },
    { id: 53, source: 52, target: 54, value: 8, relation: "efficient LLM" },
    {
      id: 54,
      source: 54,
      target: 55,
      value: 7,
      relation: "advanced efficiency",
    },
    { id: 55, source: 54, target: 56, value: 7, relation: "Phi-based model" },
    {
      id: 56,
      source: 48,
      target: 57,
      value: 8,
      relation: "next-gen Google LM",
    },
    { id: 57, source: 50, target: 58, value: 8, relation: "improved Claude" },
    { id: 58, source: 37, target: 59, value: 7, relation: "longer context" },
    { id: 59, source: 59, target: 60, value: 8, relation: "permutation LM" },
    {
      id: 60,
      source: 60,
      target: 61,
      value: 8,
      relation: "sample-efficient pre-training",
    },
    {
      id: 61,
      source: 61,
      target: 62,
      value: 7,
      relation: "long-context encoding",
    },
    {
      id: 62,
      source: 61,
      target: 63,
      value: 7,
      relation: "efficient transformer",
    },
    { id: 63, source: 61, target: 64, value: 7, relation: "sparse attention" },
    {
      id: 64,
      source: 37,
      target: 65,
      value: 8,
      relation: "mixture of experts",
    },
    { id: 65, source: 41, target: 66, value: 7, relation: "parameter sharing" },
    {
      id: 66,
      source: 41,
      target: 67,
      value: 7,
      relation: "model distillation",
    },
    {
      id: 67,
      source: 41,
      target: 68,
      value: 7,
      relation: "knowledge integration",
    },
    {
      id: 68,
      source: 41,
      target: 69,
      value: 7,
      relation: "multilingual modeling",
    },
    { id: 69, source: 37, target: 70, value: 8, relation: "multilingual T5" },

    // Generative Models
    {
      id: 70,
      source: 3,
      target: 71,
      value: 7,
      relation: "adversarial training",
    },
    {
      id: 71,
      source: 71,
      target: 72,
      value: 8,
      relation: "deep convolutional GAN",
    },
    { id: 72, source: 72, target: 73, value: 7, relation: "improved training" },
    {
      id: 73,
      source: 73,
      target: 74,
      value: 8,
      relation: "progressive growing",
    },
    {
      id: 74,
      source: 71,
      target: 75,
      value: 7,
      relation: "conditional generation",
    },
    {
      id: 75,
      source: 75,
      target: 76,
      value: 8,
      relation: "unpaired translation",
    },
    {
      id: 76,
      source: 75,
      target: 77,
      value: 7,
      relation: "image-to-image translation",
    },
    {
      id: 77,
      source: 74,
      target: 78,
      value: 8,
      relation: "style-based generator",
    },
    { id: 78, source: 78, target: 79, value: 9, relation: "improved StyleGAN" },
    { id: 79, source: 79, target: 80, value: 8, relation: "alias-free GAN" },
    { id: 80, source: 71, target: 81, value: 7, relation: "diffusion models" },
    { id: 81, source: 81, target: 82, value: 8, relation: "improved training" },
    {
      id: 82,
      source: 82,
      target: 83,
      value: 9,
      relation: "text-to-image diffusion",
    },
    {
      id: 83,
      source: 83,
      target: 84,
      value: 8,
      relation: "enhanced diffusion",
    },
    { id: 84, source: 84, target: 85, value: 7, relation: "faster sampling" },
    {
      id: 85,
      source: 84,
      target: 86,
      value: 7,
      relation: "conditional control",
    },
    { id: 86, source: 83, target: 87, value: 8, relation: "video diffusion" },
    {
      id: 87,
      source: 87,
      target: 88,
      value: 7,
      relation: "enhanced video diffusion",
    },
    {
      id: 88,
      source: 87,
      target: 89,
      value: 7,
      relation: "real-time video generation",
    },
    {
      id: 89,
      source: 87,
      target: 90,
      value: 8,
      relation: "text-to-video generation",
    },
    {
      id: 90,
      source: 83,
      target: 91,
      value: 7,
      relation: "text-to-3D generation",
    },
    { id: 91, source: 78, target: 92, value: 7, relation: "3D GANs" },

    // Multimodal Models
    { id: 92, source: 17, target: 93, value: 7, relation: "image captioning" },
    {
      id: 93,
      source: 93,
      target: 94,
      value: 8,
      relation: "visual question answering",
    },
    {
      id: 94,
      source: 37,
      target: 95,
      value: 9,
      relation: "transformer in multimodal",
    },
    {
      id: 95,
      source: 23,
      target: 95,
      value: 9,
      relation: "vision transformer in CLIP",
    },
    {
      id: 96,
      source: 95,
      target: 96,
      value: 8,
      relation: "large-scale vision model",
    },
    {
      id: 97,
      source: 44,
      target: 97,
      value: 8,
      relation: "text encoding with GPT",
    },
    {
      id: 98,
      source: 97,
      target: 98,
      value: 9,
      relation: "improved generation",
    },
    {
      id: 99,
      source: 98,
      target: 99,
      value: 9,
      relation: "advanced text-to-image",
    },
    {
      id: 100,
      source: 37,
      target: 100,
      value: 8,
      relation: "multimodal few-shot learning",
    },
    {
      id: 101,
      source: 95,
      target: 101,
      value: 8,
      relation: "improved vision-language",
    },
    { id: 102, source: 101, target: 102, value: 7, relation: "advanced VLM" },
    {
      id: 103,
      source: 52,
      target: 103,
      value: 8,
      relation: "LLaMA with vision",
    },
    {
      id: 104,
      source: 48,
      target: 104,
      value: 8,
      relation: "PaLM extended with vision",
    },
    {
      id: 105,
      source: 46,
      target: 105,
      value: 9,
      relation: "GPT-4 with vision",
    },
    {
      id: 106,
      source: 54,
      target: 106,
      value: 9,
      relation: "Claude 3 with vision",
    },
    {
      id: 107,
      source: 57,
      target: 107,
      value: 9,
      relation: "Gemini with vision",
    },
    {
      id: 108,
      source: 37,
      target: 108,
      value: 8,
      relation: "transformer for speech",
    },

    // Reinforcement Learning
    {
      id: 109,
      source: 3,
      target: 109,
      value: 7,
      relation: "function approximation in RL",
    },
    {
      id: 110,
      source: 109,
      target: 110,
      value: 8,
      relation: "asynchronous RL",
    },
    {
      id: 111,
      source: 110,
      target: 111,
      value: 8,
      relation: "policy optimization",
    },
    { id: 112, source: 109, target: 112, value: 9, relation: "deep RL for Go" },
    { id: 113, source: 112, target: 113, value: 9, relation: "self-play RL" },
    {
      id: 114,
      source: 113,
      target: 114,
      value: 9,
      relation: "generalized game AI",
    },
    { id: 115, source: 114, target: 115, value: 9, relation: "model-based RL" },
    {
      id: 116,
      source: 115,
      target: 116,
      value: 9,
      relation: "complex environment RL",
    },

    // Specialized Architectures
    {
      id: 117,
      source: 37,
      target: 117,
      value: 8,
      relation: "transformer for proteins",
    },
    {
      id: 118,
      source: 117,
      target: 118,
      value: 9,
      relation: "improved protein folding",
    },
    // Continuing the links from id:119

    {
      id: 119,
      source: 41,
      target: 117,
      value: 7,
      relation: "applied transformer to proteins",
    },
    {
      id: 120,
      source: 117,
      target: 118,
      value: 9,
      relation: "enhanced protein folding accuracy",
    },
    {
      id: 121,
      source: 46,
      target: 105,
      value: 9,
      relation: "integrated vision into GPT-4V",
    },
    {
      id: 122,
      source: 52,
      target: 103,
      value: 8,
      relation: "extended LLaMA with vision capabilities",
    },
    {
      id: 123,
      source: 54,
      target: 106,
      value: 9,
      relation: "Claude 3 Vision with advanced features",
    },
    {
      id: 124,
      source: 48,
      target: 104,
      value: 8,
      relation: "PaLM-E combining language and vision",
    },
    {
      id: 125,
      source: 83,
      target: 84,
      value: 7,
      relation: "applied architecture search to graphs",
    },
    {
      id: 126,
      source: 84,
      target: 85,
      value: 6,
      relation: "developed capsule networks",
    },
    {
      id: 127,
      source: 37,
      target: 108,
      value: 8,
      relation: "transformer in speech recognition",
    },
    {
      id: 128,
      source: 108,
      target: 95,
      value: 7,
      relation: "cross-modal transformer applications",
    },
    {
      id: 129,
      source: 95,
      target: 68,
      value: 9,
      relation: "foundation for CLIP's architecture",
    },
    {
      id: 130,
      source: 68,
      target: 69,
      value: 8,
      relation: "inspired DALL-E's text-image pairing",
    },
    {
      id: 131,
      source: 69,
      target: 70,
      value: 9,
      relation: "advanced text-to-image synthesis",
    },
    {
      id: 132,
      source: 70,
      target: 99,
      value: 9,
      relation: "progression to DALL-E 3",
    },
    {
      id: 133,
      source: 99,
      target: 62,
      value: 9,
      relation: "utilized diffusion in image generation",
    },
    {
      id: 134,
      source: 62,
      target: 105,
      value: 8,
      relation: "influenced GPT-4V's visual capabilities",
    },
    {
      id: 135,
      source: 105,
      target: 107,
      value: 9,
      relation: "set groundwork for Gemini Vision",
    },
    {
      id: 136,
      source: 57,
      target: 107,
      value: 8,
      relation: "Gemini as next-gen model",
    },
    {
      id: 137,
      source: 17,
      target: 109,
      value: 7,
      relation: "CNNs in reinforcement learning",
    },
    {
      id: 138,
      source: 109,
      target: 112,
      value: 8,
      relation: "deep RL for complex tasks",
    },
    {
      id: 139,
      source: 112,
      target: 113,
      value: 9,
      relation: "evolution to AlphaGo Zero",
    },
    {
      id: 140,
      source: 113,
      target: 114,
      value: 9,
      relation: "generalization in AlphaZero",
    },
    {
      id: 141,
      source: 114,
      target: 115,
      value: 9,
      relation: "model-based RL in MuZero",
    },
    {
      id: 142,
      source: 115,
      target: 116,
      value: 9,
      relation: "complex environment learning",
    },
    {
      id: 143,
      source: 116,
      target: 81,
      value: 8,
      relation: "inspired AlphaFold's RL approach",
    },
    {
      id: 144,
      source: 81,
      target: 82,
      value: 8,
      relation: "improved protein folding in AlphaFold 2",
    },
    {
      id: 145,
      source: 31,
      target: 117,
      value: 7,
      relation: "BERT techniques in biology",
    },
    {
      id: 146,
      source: 117,
      target: 118,
      value: 8,
      relation: "enhanced protein structure prediction",
    },
    {
      id: 147,
      source: 27,
      target: 93,
      value: 7,
      relation: "sequence models for captioning",
    },
    {
      id: 148,
      source: 93,
      target: 94,
      value: 8,
      relation: "development of VQA systems",
    },
    {
      id: 149,
      source: 94,
      target: 95,
      value: 8,
      relation: "multimodal transformers",
    },
    {
      id: 150,
      source: 95,
      target: 96,
      value: 8,
      relation: "Florence's large-scale vision model",
    },
    {
      id: 151,
      source: 96,
      target: 97,
      value: 8,
      relation: "text encoding in DALL-E",
    },
    {
      id: 152,
      source: 97,
      target: 98,
      value: 9,
      relation: "improved generation in DALL-E 2",
    },
    {
      id: 153,
      source: 98,
      target: 99,
      value: 9,
      relation: "advanced text-to-image in DALL-E 3",
    },
    {
      id: 154,
      source: 99,
      target: 105,
      value: 9,
      relation: "contributed to GPT-4V's capabilities",
    },
    {
      id: 155,
      source: 35,
      target: 108,
      value: 8,
      relation: "transformers in speech via Whisper",
    },
    {
      id: 156,
      source: 108,
      target: 95,
      value: 7,
      relation: "multimodal processing advancements",
    },
    {
      id: 157,
      source: 109,
      target: 110,
      value: 8,
      relation: "asynchronous RL methods",
    },
    {
      id: 158,
      source: 110,
      target: 111,
      value: 8,
      relation: "policy optimization techniques",
    },
    {
      id: 159,
      source: 78,
      target: 79,
      value: 8,
      relation: "progression to AlphaGo Zero",
    },
    {
      id: 160,
      source: 79,
      target: 80,
      value: 8,
      relation: "generalization in AlphaZero",
    },
    {
      id: 161,
      source: 80,
      target: 81,
      value: 8,
      relation: "inspired MuZero's model",
    },
    {
      id: 162,
      source: 81,
      target: 82,
      value: 8,
      relation: "advanced to AlphaFold",
    },
    {
      id: 163,
      source: 82,
      target: 83,
      value: 9,
      relation: "improved in AlphaFold 2",
    },
    {
      id: 164,
      source: 68,
      target: 95,
      value: 9,
      relation: "CLIP's multimodal pre-training",
    },
    {
      id: 165,
      source: 95,
      target: 68,
      value: 9,
      relation: "bidirectional influence",
    },
    {
      id: 166,
      source: 45,
      target: 69,
      value: 8,
      relation: "language generation in DALL-E",
    },
    {
      id: 167,
      source: 69,
      target: 70,
      value: 9,
      relation: "advancements in DALL-E 2",
    },
    {
      id: 168,
      source: 70,
      target: 99,
      value: 9,
      relation: "further improvements in DALL-E 3",
    },
    {
      id: 169,
      source: 99,
      target: 62,
      value: 9,
      relation: "integration of diffusion models",
    },
    {
      id: 170,
      source: 62,
      target: 83,
      value: 9,
      relation: "Stable Diffusion's impact",
    },
    {
      id: 171,
      source: 83,
      target: 84,
      value: 8,
      relation: "enhancements in SD XL",
    },
    {
      id: 172,
      source: 84,
      target: 85,
      value: 7,
      relation: "speed improvements in SDXL Turbo",
    },
    {
      id: 173,
      source: 85,
      target: 86,
      value: 7,
      relation: "added control via IP-Adapter",
    },
    {
      id: 174,
      source: 86,
      target: 87,
      value: 8,
      relation: "extension to video with Stable Video Diffusion",
    },
    {
      id: 175,
      source: 87,
      target: 88,
      value: 7,
      relation: "enhancements in Sora",
    },
    {
      id: 176,
      source: 88,
      target: 89,
      value: 7,
      relation: "developments in Lumiere",
    },
    {
      id: 177,
      source: 89,
      target: 90,
      value: 8,
      relation: "innovations in Gen-2",
    },
    {
      id: 178,
      source: 90,
      target: 91,
      value: 7,
      relation: "3D generation in Point-E",
    },
    {
      id: 179,
      source: 91,
      target: 92,
      value: 7,
      relation: "advancements in GET3D",
    },
    {
      id: 180,
      source: 33,
      target: 45,
      value: 8,
      relation: "transition from BERT to GPT",
    },
    {
      id: 181,
      source: 45,
      target: 46,
      value: 9,
      relation: "scaling up in GPT-2",
    },
    {
      id: 182,
      source: 46,
      target: 35,
      value: 9,
      relation: "massive scaling in GPT-3",
    },
    {
      id: 183,
      source: 35,
      target: 36,
      value: 9,
      relation: "advancements in GPT-4",
    },
    {
      id: 184,
      source: 36,
      target: 105,
      value: 9,
      relation: "multimodal integration in GPT-4V",
    },
    {
      id: 185,
      source: 105,
      target: 73,
      value: 8,
      relation: "influenced instruction tuning",
    },
    {
      id: 186,
      source: 73,
      target: 74,
      value: 8,
      relation: "applied in embodied AI",
    },
    {
      id: 187,
      source: 74,
      target: 75,
      value: 9,
      relation: "foundation for advanced multimodal models",
    },
    {
      id: 188,
      source: 75,
      target: 107,
      value: 9,
      relation: "culmination in Gemini",
    },
    {
      id: 189,
      source: 37,
      target: 108,
      value: 8,
      relation: "transformers in speech (Whisper)",
    },
    {
      id: 190,
      source: 108,
      target: 95,
      value: 7,
      relation: "cross-modal transformer usage",
    },
    {
      id: 191,
      source: 95,
      target: 68,
      value: 9,
      relation: "reinforced CLIP's architecture",
    },
    {
      id: 192,
      source: 68,
      target: 69,
      value: 8,
      relation: "influenced DALL-E's development",
    },
    { id: 193, source: 69, target: 70, value: 9, relation: "led to DALL-E 2" },
    {
      id: 194,
      source: 70,
      target: 99,
      value: 9,
      relation: "progression to DALL-E 3",
    },
    {
      id: 195,
      source: 99,
      target: 105,
      value: 9,
      relation: "contributed to GPT-4V",
    },
    {
      id: 196,
      source: 105,
      target: 107,
      value: 9,
      relation: "influenced Gemini Vision",
    },
    {
      id: 197,
      source: 83,
      target: 98,
      value: 8,
      relation: "diffusion models in text-to-image",
    },
    {
      id: 198,
      source: 98,
      target: 99,
      value: 9,
      relation: "advancements in DALL-E 3",
    },
    {
      id: 199,
      source: 99,
      target: 105,
      value: 9,
      relation: "impact on GPT-4V's visual understanding",
    },
    {
      id: 200,
      source: 28,
      target: 37,
      value: 9,
      relation: "foundation for transformers",
    },
    {
      id: 201,
      source: 37,
      target: 31,
      value: 8,
      relation: "inspired BERT's architecture",
    },
    {
      id: 202,
      source: 31,
      target: 33,
      value: 7,
      relation: "shifted to autoregressive models",
    },
    {
      id: 203,
      source: 33,
      target: 45,
      value: 8,
      relation: "led to GPT models",
    },
    {
      id: 204,
      source: 45,
      target: 35,
      value: 9,
      relation: "massive scaling in GPT-3",
    },
    {
      id: 205,
      source: 35,
      target: 36,
      value: 9,
      relation: "further advancements in GPT-4",
    },
    {
      id: 206,
      source: 36,
      target: 105,
      value: 9,
      relation: "multimodal capabilities in GPT-4V",
    },
    {
      id: 207,
      source: 105,
      target: 107,
      value: 9,
      relation: "influenced development of Gemini",
    },
    {
      id: 208,
      source: 28,
      target: 68,
      value: 9,
      relation: "enabled CLIP's transformer",
    },
    {
      id: 209,
      source: 68,
      target: 95,
      value: 9,
      relation: "multimodal pre-training in CLIP",
    },
    {
      id: 210,
      source: 95,
      target: 98,
      value: 8,
      relation: "applied in DALL-E",
    },
    {
      id: 211,
      source: 98,
      target: 99,
      value: 9,
      relation: "improved in DALL-E 2 and 3",
    },
    {
      id: 212,
      source: 99,
      target: 105,
      value: 9,
      relation: "contributed to GPT-4V",
    },
    {
      id: 213,
      source: 105,
      target: 107,
      value: 9,
      relation: "led to Gemini Vision",
    },
    {
      id: 214,
      source: 116,
      target: 83,
      value: 8,
      relation: "applied AlphaStar's techniques to architecture search",
    },
    {
      id: 215,
      source: 83,
      target: 84,
      value: 7,
      relation: "extended architecture search to graphs",
    },
    {
      id: 216,
      source: 84,
      target: 85,
      value: 6,
      relation: "influenced the development of capsule networks",
    },
    {
      id: 217,
      source: 85,
      target: 86,
      value: 7,
      relation: "alternative to CNNs for feature hierarchies",
    },
    {
      id: 218,
      source: 86,
      target: 87,
      value: 8,
      relation: "contextual word embeddings in NLP",
    },
    {
      id: 219,
      source: 87,
      target: 88,
      value: 8,
      relation: "transfer learning in language models",
    },
    {
      id: 220,
      source: 88,
      target: 31,
      value: 8,
      relation: "influenced BERT's pre-training",
    },
    {
      id: 221,
      source: 31,
      target: 32,
      value: 7,
      relation: "optimization in RoBERTa",
    },
    {
      id: 222,
      source: 32,
      target: 45,
      value: 8,
      relation: "transition to GPT models",
    },
    {
      id: 223,
      source: 45,
      target: 46,
      value: 9,
      relation: "scaled up to GPT-2",
    },
    {
      id: 224,
      source: 46,
      target: 35,
      value: 9,
      relation: "further scaling in GPT-3",
    },
    {
      id: 225,
      source: 35,
      target: 36,
      value: 9,
      relation: "advanced capabilities in GPT-4",
    },
    {
      id: 226,
      source: 36,
      target: 105,
      value: 9,
      relation: "added vision in GPT-4V",
    },
    {
      id: 227,
      source: 105,
      target: 107,
      value: 9,
      relation: "culminated in Gemini Vision",
    },
    {
      id: 228,
      source: 117,
      target: 118,
      value: 9,
      relation: "improved protein folding with AlphaFold 2",
    },
    {
      id: 229,
      source: 28,
      target: 37,
      value: 9,
      relation: "foundation for transformers",
    },
    {
      id: 230,
      source: 37,
      target: 117,
      value: 8,
      relation: "transformers applied to protein modeling",
    },
    {
      id: 231,
      source: 117,
      target: 118,
      value: 9,
      relation: "enhanced accuracy in protein folding",
    },
    {
      id: 232,
      source: 83,
      target: 84,
      value: 7,
      relation: "NASNet's influence on graph networks",
    },
    {
      id: 233,
      source: 84,
      target: 85,
      value: 6,
      relation: "led to the development of capsule networks",
    },
    {
      id: 234,
      source: 85,
      target: 21,
      value: 6,
      relation: "influenced Swin Transformer's design",
    },
    {
      id: 235,
      source: 21,
      target: 96,
      value: 7,
      relation: "applied in Florence's architecture",
    },
    {
      id: 236,
      source: 96,
      target: 99,
      value: 8,
      relation: "contributed to DALL-E 3's vision encoder",
    },
    {
      id: 237,
      source: 99,
      target: 105,
      value: 9,
      relation: "enhanced GPT-4V's visual understanding",
    },
    {
      id: 238,
      source: 68,
      target: 69,
      value: 8,
      relation: "CLIP inspired DALL-E's text-image pairing",
    },
    {
      id: 239,
      source: 69,
      target: 70,
      value: 9,
      relation: "DALL-E 2 improved text-to-image generation",
    },
    {
      id: 240,
      source: 70,
      target: 99,
      value: 9,
      relation: "DALL-E 3 further advancements",
    },
    {
      id: 241,
      source: 99,
      target: 83,
      value: 8,
      relation: "integration with diffusion models",
    },
    {
      id: 242,
      source: 83,
      target: 84,
      value: 8,
      relation: "enhanced diffusion techniques in SDXL",
    },
    {
      id: 243,
      source: 84,
      target: 85,
      value: 7,
      relation: "introduced IP-Adapter for control",
    },
    {
      id: 244,
      source: 85,
      target: 86,
      value: 7,
      relation: "applied to video with Stable Video Diffusion",
    },
    { id: 245, source: 86, target: 87, value: 8, relation: "improved in Sora" },
    {
      id: 246,
      source: 87,
      target: 88,
      value: 7,
      relation: "developed further in Lumiere",
    },
    {
      id: 247,
      source: 88,
      target: 89,
      value: 7,
      relation: "innovated in Gen-2",
    },
    {
      id: 248,
      source: 89,
      target: 90,
      value: 8,
      relation: "text-to-video generation advancements",
    },
    {
      id: 249,
      source: 90,
      target: 91,
      value: 7,
      relation: "3D generation with Point-E",
    },
    {
      id: 250,
      source: 91,
      target: 92,
      value: 7,
      relation: "enhanced in GET3D",
    },
    {
      id: 251,
      source: 52,
      target: 54,
      value: 8,
      relation: "LLaMA leading to LLaMA 2",
    },
    {
      id: 252,
      source: 54,
      target: 55,
      value: 7,
      relation: "efficiency improvements in Mistral",
    },
    {
      id: 253,
      source: 55,
      target: 56,
      value: 7,
      relation: "advancements in Phi-2",
    },
    {
      id: 254,
      source: 56,
      target: 57,
      value: 8,
      relation: "development towards Gemini",
    },
    {
      id: 255,
      source: 57,
      target: 107,
      value: 9,
      relation: "culminated in Gemini Vision",
    },
    {
      id: 256,
      source: 48,
      target: 104,
      value: 8,
      relation: "PaLM extended to PaLM-E",
    },
    {
      id: 257,
      source: 104,
      target: 105,
      value: 9,
      relation: "influenced GPT-4V",
    },
    {
      id: 258,
      source: 46,
      target: 50,
      value: 8,
      relation: "development of LaMDA",
    },
    {
      id: 259,
      source: 50,
      target: 51,
      value: 8,
      relation: "influence on LLaMA",
    },
    {
      id: 260,
      source: 51,
      target: 52,
      value: 7,
      relation: "progression to LLaMA 2",
    },
    {
      id: 261,
      source: 37,
      target: 108,
      value: 8,
      relation: "transformers in speech recognition with Whisper",
    },
    {
      id: 262,
      source: 108,
      target: 105,
      value: 8,
      relation: "influenced GPT-4V's multimodality",
    },
    {
      id: 263,
      source: 108,
      target: 106,
      value: 8,
      relation: "applied in Claude 3 Vision",
    },
    {
      id: 264,
      source: 35,
      target: 105,
      value: 9,
      relation: "GPT-3's influence on GPT-4V",
    },
    {
      id: 265,
      source: 35,
      target: 73,
      value: 8,
      relation: "instruction tuning based on GPT-3",
    },
    {
      id: 266,
      source: 73,
      target: 74,
      value: 8,
      relation: "application in embodied AI",
    },
    {
      id: 267,
      source: 74,
      target: 75,
      value: 9,
      relation: "foundation for advanced multimodal models",
    },
    {
      id: 268,
      source: 75,
      target: 107,
      value: 9,
      relation: "culminated in Gemini Vision",
    },
    {
      id: 269,
      source: 112,
      target: 113,
      value: 9,
      relation: "evolution from AlphaGo to AlphaGo Zero",
    },
    {
      id: 270,
      source: 113,
      target: 114,
      value: 9,
      relation: "generalization in AlphaZero",
    },
    {
      id: 271,
      source: 114,
      target: 115,
      value: 9,
      relation: "model-based RL in MuZero",
    },
    {
      id: 272,
      source: 115,
      target: 116,
      value: 9,
      relation: "applied in AlphaStar",
    },
    {
      id: 273,
      source: 116,
      target: 81,
      value: 8,
      relation: "influenced AlphaFold's RL approach",
    },
    {
      id: 274,
      source: 81,
      target: 82,
      value: 8,
      relation: "improved in AlphaFold 2",
    },
    {
      id: 275,
      source: 109,
      target: 112,
      value: 8,
      relation: "deep RL in AlphaGo",
    },
    {
      id: 276,
      source: 35,
      target: 108,
      value: 8,
      relation: "language model applied to Whisper's speech",
    },
    {
      id: 277,
      source: 108,
      target: 107,
      value: 9,
      relation: "inspired Gemini Vision's multimodal input",
    },
    {
      id: 278,
      source: 68,
      target: 105,
      value: 8,
      relation: "CLIP's visual understanding in GPT-4V",
    },
    {
      id: 279,
      source: 105,
      target: 106,
      value: 9,
      relation: "expanded capabilities in Claude 3 Vision",
    },
    {
      id: 280,
      source: 106,
      target: 107,
      value: 8,
      relation: "multimodal AI in Gemini Vision",
    },
    {
      id: 281,
      source: 62,
      target: 84,
      value: 7,
      relation: "diffusion model advancements to graph AI",
    },
    {
      id: 282,
      source: 84,
      target: 85,
      value: 7,
      relation: "graph-based improvements in capsule networks",
    },
    {
      id: 283,
      source: 85,
      target: 83,
      value: 6,
      relation: "alternative architecture for Mobile AI",
    },
    {
      id: 284,
      source: 33,
      target: 74,
      value: 8,
      relation: "language model use in robotics",
    },
    {
      id: 285,
      source: 74,
      target: 75,
      value: 9,
      relation: "advanced robotics using multimodal AI",
    },
    {
      id: 286,
      source: 75,
      target: 107,
      value: 9,
      relation: "culminated in state-of-the-art AI",
    },
    {
      id: 287,
      source: 76,
      target: 77,
      value: 8,
      relation: "enhanced training in deep reinforcement",
    },
    {
      id: 288,
      source: 77,
      target: 78,
      value: 9,
      relation: "RL methods used in AlphaGo",
    },
    {
      id: 289,
      source: 78,
      target: 81,
      value: 9,
      relation: "real-time strategy enhancements",
    },
    {
      id: 290,
      source: 81,
      target: 82,
      value: 8,
      relation: "AlphaFold's deep RL capabilities",
    },
    {
      id: 291,
      source: 82,
      target: 83,
      value: 7,
      relation: "contributions to neural architecture search",
    },
    {
      id: 292,
      source: 83,
      target: 84,
      value: 7,
      relation: "automated search applied to graphs",
    },
    {
      id: 293,
      source: 31,
      target: 28,
      value: 8,
      relation: "transformer backbone for BERT",
    },
    {
      id: 294,
      source: 28,
      target: 33,
      value: 9,
      relation: "BERT's architecture rooted in transformers",
    },
    {
      id: 295,
      source: 33,
      target: 45,
      value: 9,
      relation: "language modeling advancements in GPT",
    },
    {
      id: 296,
      source: 45,
      target: 105,
      value: 9,
      relation: "GPT's evolution to multimodal models",
    },
    {
      id: 297,
      source: 20,
      target: 68,
      value: 8,
      relation: "vision transformer used in CLIP",
    },
    {
      id: 298,
      source: 68,
      target: 107,
      value: 9,
      relation: "zero-shot capabilities in Gemini Vision",
    },
    {
      id: 299,
      source: 28,
      target: 34,
      value: 9,
      relation: "advanced training used in GPT models",
    },
    {
      id: 300,
      source: 34,
      target: 36,
      value: 9,
      relation: "GPT-4's large-scale architecture",
    },
    {
      id: 301,
      source: 36,
      target: 37,
      value: 9,
      relation: "further enhancements in large language models",
    },
    {
      id: 302,
      source: 39,
      target: 40,
      value: 8,
      relation: "similar open-source approach in LLaMA",
    },
    {
      id: 303,
      source: 40,
      target: 41,
      value: 7,
      relation: "multilingual pre-training applied",
    },
    {
      id: 304,
      source: 41,
      target: 42,
      value: 8,
      relation: "extended context modeling",
    },
    {
      id: 305,
      source: 42,
      target: 43,
      value: 8,
      relation: "efficient training techniques in transformers",
    },
    {
      id: 306,
      source: 43,
      target: 45,
      value: 8,
      relation: "sparse transformer evolution",
    },
    {
      id: 307,
      source: 45,
      target: 50,
      value: 8,
      relation: "transfer learning advancements",
    },
    {
      id: 308,
      source: 50,
      target: 51,
      value: 9,
      relation: "multilingual modeling in LLaMA",
    },
    {
      id: 309,
      source: 51,
      target: 52,
      value: 9,
      relation: "fine-tuned to LLaMA 2",
    },
    {
      id: 310,
      source: 14,
      target: 20,
      value: 7,
      relation: "convolution to transformer evolution",
    },
    {
      id: 311,
      source: 20,
      target: 75,
      value: 9,
      relation: "applied in advanced multimodal models",
    },
    {
      id: 312,
      source: 75,
      target: 85,
      value: 8,
      relation: "integration with graph-based models",
    },
    {
      id: 313,
      source: 85,
      target: 86,
      value: 8,
      relation: "contextual embedding improvements",
    },
    {
      id: 314,
      source: 86,
      target: 87,
      value: 9,
      relation: "pre-training for transfer learning",
    },
    {
      id: 315,
      source: 87,
      target: 88,
      value: 8,
      relation: "applied to language modeling",
    },
    {
      id: 316,
      source: 28,
      target: 76,
      value: 8,
      relation: "transformer attention in RL",
    },
    {
      id: 317,
      source: 76,
      target: 78,
      value: 9,
      relation: "transformer RL applications",
    },
    {
      id: 318,
      source: 78,
      target: 80,
      value: 9,
      relation: "model-based planning",
    },
    {
      id: 319,
      source: 80,
      target: 81,
      value: 9,
      relation: "MuZero's game-playing enhancements",
    },
    {
      id: 320,
      source: 17,
      target: 23,
      value: 7,
      relation: "CNN features used in segmentation",
    },
    {
      id: 321,
      source: 23,
      target: 24,
      value: 8,
      relation: "U-Net's impact on segmentation models",
    },
    {
      id: 322,
      source: 24,
      target: 25,
      value: 8,
      relation: "improved real-time object detection",
    },
    {
      id: 323,
      source: 25,
      target: 30,
      value: 7,
      relation: "applied to mobile-efficient models",
    },
    {
      id: 324,
      source: 30,
      target: 33,
      value: 8,
      relation: "used in BERT's training",
    },
    {
      id: 325,
      source: 33,
      target: 45,
      value: 9,
      relation: "transitioned to GPT-style pre-training",
    },
    {
      id: 326,
      source: 45,
      target: 105,
      value: 9,
      relation: "expanded to multimodal applications",
    },
    {
      id: 327,
      source: 105,
      target: 106,
      value: 9,
      relation: "influenced Claude 3 Vision",
    },
    {
      id: 328,
      source: 106,
      target: 107,
      value: 9,
      relation: "culminated in Gemini Vision",
    },
    {
      id: 329,
      source: 37,
      target: 108,
      value: 8,
      relation: "transformers applied to Whisper",
    },
    {
      id: 330,
      source: 108,
      target: 109,
      value: 8,
      relation: "efficient speech recognition",
    },
    {
      id: 331,
      source: 109,
      target: 110,
      value: 7,
      relation: "text-to-speech advancements",
    },
    {
      id: 332,
      source: 110,
      target: 111,
      value: 8,
      relation: "applied to TTS in AI models",
    },
    {
      id: 333,
      source: 111,
      target: 112,
      value: 8,
      relation: "back to speech recognition",
    },
    {
      id: 334,
      source: 76,
      target: 80,
      value: 9,
      relation: "RL applied in real-time games",
    },
    {
      id: 335,
      source: 80,
      target: 82,
      value: 8,
      relation: "AlphaFold's real-time learning",
    },
    {
      id: 336,
      source: 82,
      target: 83,
      value: 8,
      relation: "contributions to protein folding",
    },
    {
      id: 337,
      source: 83,
      target: 84,
      value: 7,
      relation: "automated search applied to graphs",
    },
    {
      id: 338,
      source: 33,
      target: 87,
      value: 9,
      relation: "contextual understanding in NLP",
    },
    {
      id: 339,
      source: 28,
      target: 88,
      value: 8,
      relation: "sparse transformer techniques",
    },
    {
      id: 340,
      source: 84,
      target: 86,
      value: 6,
      relation: "graph data applied to transformers",
    },
    {
      id: 341,
      source: 78,
      target: 87,
      value: 8,
      relation: "advanced RL for NLP tasks",
    },
    {
      id: 342,
      source: 87,
      target: 89,
      value: 9,
      relation: "knowledge distillation methods",
    },
    {
      id: 343,
      source: 89,
      target: 90,
      value: 7,
      relation: "faster language model training",
    },
    {
      id: 344,
      source: 70,
      target: 107,
      value: 8,
      relation: "efficient text-to-image models",
    },
    {
      id: 345,
      source: 107,
      target: 108,
      value: 8,
      relation: "model fusion techniques",
    },
    {
      id: 346,
      source: 28,
      target: 84,
      value: 9,
      relation: "attention for structured data",
    },
    {
      id: 347,
      source: 84,
      target: 88,
      value: 8,
      relation: "graph-based attention in transformers",
    },
    {
      id: 348,
      source: 88,
      target: 89,
      value: 9,
      relation: "optimized training for graphs",
    },
    {
      id: 349,
      source: 89,
      target: 92,
      value: 9,
      relation: "advanced graph-based NLP models",
    },
    {
      id: 350,
      source: 17,
      target: 31,
      value: 7,
      relation: "CNN influences in BERT",
    },
    {
      id: 351,
      source: 31,
      target: 33,
      value: 8,
      relation: "BERT influenced by CNN insights",
    },
    {
      id: 352,
      source: 33,
      target: 35,
      value: 9,
      relation: "language model expansion",
    },
    {
      id: 353,
      source: 35,
      target: 37,
      value: 9,
      relation: "GPT scale-up methods",
    },
    {
      id: 354,
      source: 37,
      target: 39,
      value: 8,
      relation: "open-source language models",
    },
    {
      id: 355,
      source: 39,
      target: 40,
      value: 9,
      relation: "distributed training techniques",
    },
    {
      id: 356,
      source: 40,
      target: 42,
      value: 8,
      relation: "context-aware text generation",
    },
    {
      id: 357,
      source: 42,
      target: 44,
      value: 9,
      relation: "sparse attention models",
    },
    {
      id: 358,
      source: 44,
      target: 46,
      value: 8,
      relation: "parameter-efficient transformers",
    },
    {
      id: 359,
      source: 46,
      target: 48,
      value: 8,
      relation: "knowledge distillation in RoBERTa",
    },
    {
      id: 360,
      source: 48,
      target: 50,
      value: 9,
      relation: "efficient language modeling",
    },
    {
      id: 361,
      source: 50,
      target: 52,
      value: 9,
      relation: "transfer learning for LLaMA",
    },
    {
      id: 362,
      source: 52,
      target: 55,
      value: 8,
      relation: "efficient GAN training",
    },
    {
      id: 363,
      source: 55,
      target: 58,
      value: 7,
      relation: "progressive GAN synthesis",
    },
    {
      id: 364,
      source: 58,
      target: 61,
      value: 9,
      relation: "image generation to diffusion models",
    },
    {
      id: 365,
      source: 61,
      target: 65,
      value: 8,
      relation: "diffusion model sampling techniques",
    },
    {
      id: 366,
      source: 65,
      target: 67,
      value: 9,
      relation: "efficient sampling improvements",
    },
    {
      id: 367,
      source: 67,
      target: 69,
      value: 9,
      relation: "advanced text-to-image generation",
    },
    {
      id: 368,
      source: 69,
      target: 71,
      value: 9,
      relation: "zero-shot text-to-image models",
    },
    {
      id: 369,
      source: 71,
      target: 74,
      value: 8,
      relation: "language-vision integration",
    },
    {
      id: 370,
      source: 74,
      target: 75,
      value: 9,
      relation: "multimodal robotics applications",
    },
    {
      id: 371,
      source: 75,
      target: 78,
      value: 8,
      relation: "real-time multimodal AI",
    },
    {
      id: 372,
      source: 78,
      target: 80,
      value: 9,
      relation: "game AI to real-world AI applications",
    },
    {
      id: 373,
      source: 80,
      target: 85,
      value: 8,
      relation: "transfer learning in reinforcement models",
    },
    {
      id: 374,
      source: 85,
      target: 87,
      value: 7,
      relation: "embedding techniques in AI",
    },
    {
      id: 375,
      source: 87,
      target: 88,
      value: 8,
      relation: "NLP advancements in RL",
    },
    {
      id: 376,
      source: 88,
      target: 89,
      value: 9,
      relation: "faster model optimizations",
    },
    {
      id: 377,
      source: 89,
      target: 90,
      value: 7,
      relation: "sparse model techniques",
    },
    {
      id: 378,
      source: 90,
      target: 93,
      value: 9,
      relation: "scaling techniques in LLMs",
    },
    {
      id: 379,
      source: 93,
      target: 95,
      value: 8,
      relation: "efficient language generation",
    },
    {
      id: 380,
      source: 95,
      target: 97,
      value: 9,
      relation: "optimizing large models",
    },
    {
      id: 381,
      source: 97,
      target: 100,
      value: 8,
      relation: "model fine-tuning advancements",
    },
    {
      id: 382,
      source: 100,
      target: 101,
      value: 8,
      relation: "enhanced diffusion-based models",
    },
    {
      id: 383,
      source: 101,
      target: 102,
      value: 9,
      relation: "applied generative modeling to protein structures",
    },
    {
      id: 384,
      source: 102,
      target: 103,
      value: 7,
      relation: "utilized large-scale transformers",
    },
    {
      id: 385,
      source: 103,
      target: 104,
      value: 8,
      relation: "multimodal extensions for PaLM-E",
    },
    {
      id: 386,
      source: 104,
      target: 105,
      value: 9,
      relation: "inspired GPT-4V capabilities",
    },
    {
      id: 387,
      source: 105,
      target: 106,
      value: 8,
      relation: "Claude 3 Vision development",
    },
    {
      id: 388,
      source: 106,
      target: 107,
      value: 10,
      relation: "culminated in Gemini Vision",
    },
    {
      id: 389,
      source: 76,
      target: 80,
      value: 9,
      relation: "reinforcement learning applied in real-time",
    },
    {
      id: 390,
      source: 80,
      target: 82,
      value: 8,
      relation: "advanced AlphaFold real-time learning",
    },
    {
      id: 391,
      source: 82,
      target: 83,
      value: 7,
      relation: "improved protein folding prediction",
    },
    {
      id: 392,
      source: 83,
      target: 84,
      value: 6,
      relation: "influenced graph neural networks",
    },
    {
      id: 393,
      source: 84,
      target: 85,
      value: 7,
      relation: "developed attention-based graph models",
    },
    {
      id: 394,
      source: 85,
      target: 86,
      value: 8,
      relation: "integrated efficient sampling techniques",
    },
    {
      id: 395,
      source: 86,
      target: 87,
      value: 8,
      relation: "applied context embedding in AI",
    },
    {
      id: 396,
      source: 87,
      target: 88,
      value: 9,
      relation: "NLP advancements influencing RL",
    },
    {
      id: 397,
      source: 88,
      target: 89,
      value: 7,
      relation: "optimized graph-based models",
    },
    {
      id: 398,
      source: 89,
      target: 90,
      value: 8,
      relation: "sparse model optimizations",
    },
    {
      id: 399,
      source: 90,
      target: 93,
      value: 6,
      relation: "influenced efficient large-scale LLMs",
    },
    {
      id: 400,
      source: 93,
      target: 95,
      value: 9,
      relation: "enhanced language generation models",
    },
    {
      id: 401,
      source: 71,
      target: 74,
      value: 8,
      relation: "language-vision integration",
    },
    {
      id: 402,
      source: 74,
      target: 75,
      value: 9,
      relation: "real-time AI applications",
    },
    {
      id: 403,
      source: 75,
      target: 78,
      value: 8,
      relation: "AI models in robotics",
    },
    {
      id: 404,
      source: 78,
      target: 80,
      value: 9,
      relation: "game AI transferred to real-world tasks",
    },
    {
      id: 405,
      source: 80,
      target: 85,
      value: 8,
      relation: "real-time adaptation methods",
    },
    {
      id: 406,
      source: 85,
      target: 87,
      value: 7,
      relation: "contextual embeddings in AI",
    },
    {
      id: 407,
      source: 87,
      target: 88,
      value: 8,
      relation: "reinforcement learning improvements",
    },
    {
      id: 408,
      source: 88,
      target: 89,
      value: 9,
      relation: "optimized sparse transformers",
    },
    {
      id: 409,
      source: 89,
      target: 90,
      value: 7,
      relation: "better attention mechanisms",
    },
    {
      id: 410,
      source: 90,
      target: 93,
      value: 9,
      relation: "scaling large models",
    },
    {
      id: 411,
      source: 93,
      target: 95,
      value: 9,
      relation: "efficiency for text generation",
    },
    {
      id: 412,
      source: 95,
      target: 97,
      value: 8,
      relation: "multimodal model usage",
    },
    {
      id: 413,
      source: 97,
      target: 99,
      value: 9,
      relation: "DALL-E improvements",
    },
    {
      id: 414,
      source: 99,
      target: 105,
      value: 9,
      relation: "influenced GPT-4V capabilities",
    },
    {
      id: 415,
      source: 40,
      target: 44,
      value: 7,
      relation: "extended transformer functions",
    },
    {
      id: 416,
      source: 44,
      target: 46,
      value: 8,
      relation: "transformer enhancements",
    },
    {
      id: 417,
      source: 46,
      target: 50,
      value: 9,
      relation: "optimized for language understanding",
    },
    {
      id: 418,
      source: 50,
      target: 51,
      value: 9,
      relation: "scaled multilingual models",
    },
    {
      id: 419,
      source: 51,
      target: 52,
      value: 9,
      relation: "evolved LLaMA to next level",
    },
    {
      id: 420,
      source: 52,
      target: 55,
      value: 8,
      relation: "NLP GAN integration",
    },
    {
      id: 421,
      source: 55,
      target: 58,
      value: 7,
      relation: "GAN methods for sequential data",
    },
    {
      id: 422,
      source: 58,
      target: 61,
      value: 9,
      relation: "innovative image generation techniques",
    },
    {
      id: 423,
      source: 61,
      target: 65,
      value: 8,
      relation: "diffusion model optimizations",
    },
    {
      id: 424,
      source: 65,
      target: 67,
      value: 9,
      relation: "optimized for better sampling",
    },
    {
      id: 425,
      source: 67,
      target: 69,
      value: 9,
      relation: "advanced text-image synthesis",
    },
    {
      id: 426,
      source: 69,
      target: 71,
      value: 9,
      relation: "applied zero-shot text modeling",
    },
    {
      id: 427,
      source: 71,
      target: 74,
      value: 8,
      relation: "cross-modality enhancements",
    },
    {
      id: 428,
      source: 74,
      target: 75,
      value: 9,
      relation: "robotics with multimodal AI",
    },
    {
      id: 429,
      source: 75,
      target: 78,
      value: 8,
      relation: "multimodal advancements",
    },
    {
      id: 430,
      source: 78,
      target: 80,
      value: 9,
      relation: "applications in real-world AI tasks",
    },
    {
      id: 431,
      source: 80,
      target: 85,
      value: 8,
      relation: "transfer methods in AI",
    },
    {
      id: 432,
      source: 85,
      target: 87,
      value: 7,
      relation: "embedding improvements",
    },
    {
      id: 433,
      source: 87,
      target: 88,
      value: 8,
      relation: "integration in RL models",
    },
    {
      id: 434,
      source: 88,
      target: 89,
      value: 9,
      relation: "optimized for sparse computing",
    },
    {
      id: 435,
      source: 37,
      target: 117,
      value: 9,
      relation: "transformer architecture applied to protein folding",
    },
    {
      id: 436,
      source: 84,
      target: 105,
      value: 9,
      relation: "diffusion's role in GPT-4V development",
    },
    {
      id: 437,
      source: 36,
      target: 68,
      value: 8,
      relation: "BERT's influence on multimodal learning",
    },
    {
      id: 438,
      source: 31,
      target: 80,
      value: 8,
      relation: "context embeddings inspired MuZero",
    },
    {
      id: 439,
      source: 21,
      target: 78,
      value: 7,
      relation: "DenseNet's influence on StyleGAN",
    },
    {
      id: 440,
      source: 95,
      target: 96,
      value: 8,
      relation: "CLIP's advancement used in Florence",
    },
    {
      id: 441,
      source: 100,
      target: 106,
      value: 9,
      relation: "multimodal generation techniques applied to Claude 3 Vision",
    },
    {
      id: 442,
      source: 76,
      target: 110,
      value: 8,
      relation: "RL methods in efficient language models",
    },
    {
      id: 443,
      source: 104,
      target: 105,
      value: 9,
      relation: "PaLM-E inspired GPT-4V's multimodal abilities",
    },
    {
      id: 444,
      source: 80,
      target: 92,
      value: 8,
      relation: "MuZero's strategies extended to Point-E",
    },
    {
      id: 445,
      source: 108,
      target: 107,
      value: 8,
      relation: "Whisper's cross-modal impact on Gemini Vision",
    },
    {
      id: 446,
      source: 28,
      target: 81,
      value: 8,
      relation: "real-time CNN methods inspired AlphaFold",
    },
    {
      id: 447,
      source: 75,
      target: 86,
      value: 7,
      relation: "CycleGAN's contributions to context embedding",
    },
    {
      id: 448,
      source: 83,
      target: 104,
      value: 8,
      relation: "diffusion models influence on PaLM-E",
    },
    {
      id: 449,
      source: 55,
      target: 109,
      value: 9,
      relation: "Phi-2's reinforcement methods",
    },
    {
      id: 450,
      source: 52,
      target: 75,
      value: 8,
      relation: "LLaMA extended for multimodal RL",
    },
    {
      id: 451,
      source: 90,
      target: 93,
      value: 8,
      relation: "graph-based techniques aiding large LLMs",
    },
    {
      id: 452,
      source: 101,
      target: 92,
      value: 7,
      relation: "advanced multimodal synthesis for Point-E",
    },
    {
      id: 453,
      source: 105,
      target: 88,
      value: 8,
      relation: "GPT-4V's efficiency impacts Lumiere",
    },
    {
      id: 454,
      source: 87,
      target: 89,
      value: 7,
      relation: "transfer learning used in Gen-2 advancements",
    },
    {
      id: 455,
      source: 74,
      target: 68,
      value: 9,
      relation: "robotics AI influenced by CLIP",
    },
    {
      id: 456,
      source: 110,
      target: 113,
      value: 9,
      relation: "policy optimization impacts AlphaGo Zero",
    },
    {
      id: 457,
      source: 36,
      target: 48,
      value: 9,
      relation: "GPT-4 built upon Megatron-LM",
    },
    {
      id: 458,
      source: 37,
      target: 50,
      value: 7,
      relation: "Transformer design influenced LaMDA",
    },
    {
      id: 459,
      source: 68,
      target: 101,
      value: 9,
      relation: "CLIP's framework extended to BLIP-2",
    },
    {
      id: 460,
      source: 96,
      target: 99,
      value: 8,
      relation: "Florence's visual approach used in DALL-E 3",
    },
    {
      id: 461,
      source: 95,
      target: 103,
      value: 8,
      relation: "multimodal understanding advances in LLaVA",
    },
    {
      id: 462,
      source: 69,
      target: 94,
      value: 7,
      relation: "DALL-E 2's text-to-image roots in VQA",
    },
    {
      id: 463,
      source: 85,
      target: 88,
      value: 8,
      relation: "IP-Adapter's control used in Lumiere",
    },
    {
      id: 464,
      source: 45,
      target: 97,
      value: 9,
      relation: "GPT-2 foundations for Microsoft's T-NLG",
    },
    {
      id: 465,
      source: 104,
      target: 107,
      value: 9,
      relation: "PaLM-E advancements shaping Gemini Vision",
    },
    {
      id: 466,
      source: 109,
      target: 115,
      value: 8,
      relation: "deep RL techniques applied to MuZero",
    },
    {
      id: 467,
      source: 100,
      target: 102,
      value: 8,
      relation: "cross-modal generative models for protein synthesis",
    },
    {
      id: 468,
      source: 21,
      target: 84,
      value: 7,
      relation: "DenseNet's efficiency aiding graph AI",
    },
    {
      id: 469,
      source: 58,
      target: 104,
      value: 9,
      relation: "Reformer approaches utilized in PaLM-E",
    },
    {
      id: 470,
      source: 68,
      target: 95,
      value: 8,
      relation: "multilingual approaches from CLIP",
    },
    {
      id: 471,
      source: 93,
      target: 106,
      value: 9,
      relation: "Show and Tell's impact on Claude 3 Vision",
    },
    {
      id: 472,
      source: 107,
      target: 90,
      value: 8,
      relation: "Gemini Vision's text-to-video evolution",
    },
    {
      id: 473,
      source: 70,
      target: 110,
      value: 9,
      relation: "GAN research contributing to RL models",
    },
    {
      id: 474,
      source: 78,
      target: 87,
      value: 7,
      relation: "StyleGAN's embedding techniques influencing Sora",
    },
    {
      id: 475,
      source: 97,
      target: 101,
      value: 8,
      relation: "Turing NLG's generative advancements in BLIP-2",
    },
    {
      id: 476,
      source: 79,
      target: 86,
      value: 8,
      relation: "StyleGAN3's efficiency extended to video AI",
    },
    {
      id: 477,
      source: 44,
      target: 106,
      value: 9,
      relation: "ELECTRA's transformer efficiency impacting Claude 3 Vision",
    },
    {
      id: 478,
      source: 54,
      target: 64,
      value: 8,
      relation: "LLaMA's sparse approaches improving efficiency",
    },
    {
      id: 479,
      source: 35,
      target: 113,
      value: 7,
      relation: "Transformer LSTM hybrid used in AlphaZero",
    },
    {
      id: 480,
      source: 83,
      target: 98,
      value: 8,
      relation: "diffusion integration into DALL-E",
    },
    {
      id: 481,
      source: 39,
      target: 99,
      value: 9,
      relation: "XLNet's approach enhanced DALL-E 3",
    },
    {
      id: 482,
      source: 56,
      target: 107,
      value: 9,
      relation: "Gemini integration from Phi-2",
    },
    {
      id: 483,
      source: 46,
      target: 76,
      value: 8,
      relation: "GPT architectures influencing RL research",
    },
    {
      id: 484,
      source: 53,
      target: 102,
      value: 9,
      relation: "efficient LLM methods aiding mT5",
    },
    {
      id: 485,
      source: 60,
      target: 62,
      value: 8,
      relation: "sparse attention optimization in Stable Diffusion",
    },
    {
      id: 486,
      source: 108,
      target: 104,
      value: 9,
      relation: "Whisper's techniques used in PaLM-E",
    },
    {
      id: 487,
      source: 67,
      target: 72,
      value: 7,
      relation: "GAN distillation impacting Progressive GAN",
    },
    {
      id: 488,
      source: 41,
      target: 51,
      value: 8,
      relation: "BERT's context handling extended to LLaMA",
    },
    {
      id: 489,
      source: 48,
      target: 77,
      value: 9,
      relation: "MoCo's probabilistic learning in StyleGAN",
    },
    {
      id: 490,
      source: 89,
      target: 93,
      value: 8,
      relation: "Lumiere's contributions to efficient LLMs",
    },
    {
      id: 491,
      source: 87,
      target: 101,
      value: 9,
      relation: "video-to-text influences BLIP-2",
    },
    {
      id: 493,
      source: 75,
      target: 113,
      value: 8,
      relation: "CycleGAN's data efficiency used in AlphaZero",
    },
    {
      id: 494,
      source: 45,
      target: 54,
      value: 9,
      relation: "GPT's architecture influenced Mistral",
    },
    {
      id: 495,
      source: 27, // U-Net
      target: 83, // Stable Diffusion
      value: 9,
      relation: "U-Net architecture used in diffusion models",
    },
    {
      id: 496,
      source: 8, // Variational Autoencoder (VAE)
      target: 81, // DDPM
      value: 8,
      relation: "Probabilistic modeling inspired diffusion models",
    },
    {
      id: 497,
      source: 37, // Transformer Architecture
      target: 23, // Vision Transformer (ViT)
      value: 9,
      relation: "Applied Transformer architecture to vision tasks",
    },
    {
      id: 498,
      source: 20, // ResNet
      target: 37, // Transformer Architecture
      value: 8,
      relation: "Residual connections inspired Transformer's design",
    },
    {
      id: 499,
      source: 41, // BERT
      target: 61, // ELECTRA
      value: 8,
      relation: "ELECTRA improved upon BERT's pre-training",
    },
    {
      id: 500,
      source: 41, // BERT
      target: 65, // ALBERT
      value: 8,
      relation: "Parameter sharing in ALBERT based on BERT",
    },
    {
      id: 501,
      source: 10, // SimCLR
      target: 95, // CLIP
      value: 8,
      relation: "Contrastive learning methods influenced CLIP",
    },
    {
      id: 502,
      source: 11, // MoCo
      target: 95, // CLIP
      value: 8,
      relation: "Momentum contrast in MoCo inspired CLIP",
    },
    {
      id: 503,
      source: 17, // AlexNet
      target: 20, // ResNet
      value: 8,
      relation: "ResNet built upon deep CNN architectures like AlexNet",
    },
    {
      id: 504,
      source: 18, // VGGNet
      target: 20, // ResNet
      value: 8,
      relation:
        "ResNet addressed vanishing gradients in deep networks like VGGNet",
    },
    {
      id: 505,
      source: 18, // VGGNet
      target: 21, // DenseNet
      value: 8,
      relation: "DenseNet extended ideas from VGGNet on depth and connectivity",
    },
    {
      id: 506,
      source: 20, // ResNet
      target: 22, // EfficientNet
      value: 8,
      relation: "EfficientNet built upon ideas from ResNet for scaling",
    },
    {
      id: 507,
      source: 22, // EfficientNet
      target: 32, // MobileNetV3
      value: 8,
      relation: "Efficient scaling methods applied in MobileNetV3",
    },
    {
      id: 508,
      source: 41, // BERT
      target: 38, // T5
      value: 7,
      relation: "BERT's pretraining methods influenced T5",
    },
    {
      id: 509,
      source: 44, // GPT
      target: 38, // T5
      value: 7,
      relation: "GPT's autoregressive modeling influenced T5",
    },
    {
      id: 510,
      source: 23, // Vision Transformer (ViT)
      target: 12, // DINO
      value: 8,
      relation: "ViT architecture used in DINO's self-supervised learning",
    },
    {
      id: 511,
      source: 10, // SimCLR
      target: 12, // DINO
      value: 7,
      relation: "Contrastive learning methods influenced DINO",
    },
    {
      id: 512,
      source: 11, // MoCo
      target: 12, // DINO
      value: 7,
      relation: "Momentum encoding inspired DINO's approach",
    },
    {
      id: 513,
      source: 52, // LLaMA
      target: 53, // LLaMA 2
      value: 8,
      relation: "Improved LLaMA with better performance",
    },
    {
      id: 514,
      source: 53, // LLaMA 2
      target: 54, // Mistral
      value: 8,
      relation: "Mistral built upon LLaMA 2's advancements",
    },
    {
      id: 515,
      source: 54, // Mistral
      target: 55, // Mixtral
      value: 7,
      relation: "Mixtral combined multiple Mistral architectures",
    },
    {
      id: 516,
      source: 53, // LLaMA 2
      target: 103, // LLaVA
      value: 8,
      relation: "LLaVA extends LLaMA 2 with visual understanding",
    },
    {
      id: 517,
      source: 47, // GPT-4
      target: 105, // GPT-4V
      value: 9,
      relation: "GPT-4V extends GPT-4 with visual capabilities",
    },
    {
      id: 518,
      source: 105, // GPT-4V
      target: 107, // Gemini Vision
      value: 8,
      relation: "Gemini Vision builds upon GPT-4V's multimodal abilities",
    },
    {
      id: 519,
      source: 104, // PaLM-E
      target: 105, // GPT-4V
      value: 8,
      relation: "PaLM-E influenced GPT-4V's multimodal capabilities",
    },
    {
      id: 520,
      source: 105, // GPT-4V
      target: 106, // Claude 3 Vision
      value: 9,
      relation: "GPT-4V's visual capabilities inspired Claude 3 Vision",
    },
    {
      id: 521,
      source: 27, // U-Net
      target: 81, // DDPM
      value: 8,
      relation: "U-Net architecture used in DDPM models",
    },
    {
      id: 522,
      source: 23, // Vision Transformer (ViT)
      target: 95, // CLIP
      value: 9,
      relation: "ViT's architecture used in CLIP's image encoder",
    },
    {
      id: 523,
      source: 41, // BERT
      target: 97, // DALL-E
      value: 8,
      relation: "BERT's text encoding influenced DALL-E's text processing",
    },
    {
      id: 524,
      source: 95, // CLIP
      target: 97, // DALL-E
      value: 9,
      relation:
        "CLIP's image-text alignment inspired DALL-E's text-to-image generation",
    },
    {
      id: 525,
      source: 83, // Stable Diffusion
      target: 84, // Stable Diffusion XL
      value: 9,
      relation: "Stable Diffusion XL improved upon Stable Diffusion",
    },
    {
      id: 526,
      source: 84, // Stable Diffusion XL
      target: 85, // SDXL Turbo
      value: 8,
      relation: "SDXL Turbo accelerated image generation from SDXL",
    },
    {
      id: 527,
      source: 83, // Stable Diffusion
      target: 86, // IP-Adapter
      value: 7,
      relation: "IP-Adapter enhanced Stable Diffusion with image prompts",
    },
    {
      id: 528,
      source: 81, // DDPM
      target: 83, // Stable Diffusion
      value: 9,
      relation: "Stable Diffusion built upon DDPM techniques",
    },
    {
      id: 529,
      source: 81, // DDPM
      target: 82, // Improved DDPM
      value: 8,
      relation: "Improved sampling techniques in Improved DDPM",
    },
    {
      id: 530,
      source: 82, // Improved DDPM
      target: 83, // Stable Diffusion
      value: 8,
      relation: "Stable Diffusion utilized Improved DDPM methods",
    },
    {
      id: 531,
      source: 69, // XLM
      target: 70, // mT5
      value: 7,
      relation: "XLM's multilingual approach influenced mT5",
    },
    {
      id: 532,
      source: 95, // CLIP
      target: 96, // Florence
      value: 8,
      relation: "CLIP's techniques contributed to Florence's development",
    },
    {
      id: 533,
      source: 95, // CLIP
      target: 101, // BLIP-2
      value: 8,
      relation: "CLIP's pre-training methods influenced BLIP-2",
    },
    {
      id: 534,
      source: 105, // GPT-4V
      target: 104, // PaLM-E
      value: 7,
      relation: "GPT-4V and PaLM-E share multimodal capabilities",
    },
    {
      id: 535,
      source: 117, // AlphaFold
      target: 118, // AlphaFold 2
      value: 9,
      relation: "AlphaFold 2 significantly improved AlphaFold",
    },
    {
      id: 536,
      source: 115, // MuZero
      target: 117, // AlphaFold
      value: 8,
      relation: "MuZero's techniques influenced AlphaFold's development",
    },
    {
      id: 537,
      source: 61, // ELECTRA
      target: 65, // ALBERT
      value: 7,
      relation: "ELECTRA and ALBERT both aimed for efficient pre-training",
    },
    {
      id: 538,
      source: 42, // RoBERTa
      target: 61, // ELECTRA
      value: 8,
      relation: "ELECTRA built upon optimizations from RoBERTa",
    },
    {
      id: 539,
      source: 44, // GPT
      target: 52, // LLaMA
      value: 8,
      relation: "LLaMA was inspired by GPT's autoregressive modeling",
    },
    {
      id: 540,
      source: 46, // GPT-3
      target: 53, // LLaMA 2
      value: 8,
      relation: "LLaMA 2 built upon insights from GPT-3",
    },
    {
      id: 541,
      source: 38, // T5
      target: 70, // mT5
      value: 8,
      relation: "mT5 is the multilingual version of T5",
    },
    {
      id: 542,
      source: 79, // StyleGAN2
      target: 80, // StyleGAN3
      value: 9,
      relation: "StyleGAN3 further improved upon StyleGAN2",
    },
    {
      id: 543,
      source: 75, // Conditional GAN
      target: 97, // DALL-E
      value: 8,
      relation: "Conditional GAN concepts used in DALL-E",
    },
    {
      id: 544,
      source: 95, // CLIP
      target: 98, // DALL-E 2
      value: 9,
      relation: "CLIP's embeddings integrated into DALL-E 2",
    },
    {
      id: 545,
      source: 98, // DALL-E 2
      target: 99, // DALL-E 3
      value: 9,
      relation: "DALL-E 3 improved upon DALL-E 2",
    },
    {
      id: 546,
      source: 43, // DeBERTa
      target: 105, // GPT-4V
      value: 7,
      relation: "Advancements in DeBERTa influenced GPT-4V",
    },
    {
      id: 547,
      source: 99, // DALL-E 3
      target: 105, // GPT-4V
      value: 8,
      relation: "DALL-E 3's capabilities contributed to GPT-4V",
    },
    {
      id: 548,
      source: 83, // Stable Diffusion
      target: 87, // Stable Video Diffusion
      value: 9,
      relation: "Stable Video Diffusion extended Stable Diffusion to video",
    },
    {
      id: 549,
      source: 105, // GPT-4V
      target: 107, // Gemini Vision
      value: 9,
      relation: "GPT-4V's multimodal abilities inspired Gemini Vision",
    },
    {
      id: 550,
      source: 103, // LLaVA
      target: 105, // GPT-4V
      value: 7,
      relation: "LLaVA's visual capabilities are similar to GPT-4V",
    },
    {
      id: 551,
      source: 95, // CLIP
      target: 103, // LLaVA
      value: 8,
      relation: "CLIP's techniques influenced LLaVA's development",
    },
    {
      id: 552,
      source: 12, // DINO
      target: 26, // EVA
      value: 8,
      relation: "DINO's self-supervised methods used in EVA",
    },
    {
      id: 553,
      source: 95, // CLIP
      target: 100, // FLAMINGO
      value: 8,
      relation: "CLIP's multimodal approach influenced FLAMINGO",
    },
    {
      id: 554,
      source: 100, // FLAMINGO
      target: 107, // Gemini Vision
      value: 8,
      relation: "FLAMINGO's methods contributed to Gemini Vision",
    },
    {
      id: 555,
      source: 12, // DINO
      target: 13, // DINOv2
      value: 9,
      relation: "DINOv2 improved upon DINO's methods",
    },
    {
      id: 556,
      source: 46, // GPT-3 (ID 46)
      target: 58, // Claude 3 (ID 58)
      value: 8,
      relation: "Claude 3 competes with GPT-3",
    },
    {
      id: 557,
      source: 47, // GPT-4 (ID 47)
      target: 58, // Claude 3 (ID 58)
      value: 9,
      relation: "Claude 3 as an alternative to GPT-4",
    },
    {
      id: 558,
      source: 50, // Claude (ID 50)
      target: 58, // Claude 3 (ID 58)
      value: 9,
      relation: "Claude 3 improved upon Claude",
    },
    {
      id: 559,
      source: 48, // PaLM (ID 48)
      target: 49, // PaLM 2 (ID 49)
      value: 9,
      relation: "PaLM 2 improved upon PaLM",
    },
    {
      id: 560,
      source: 47, // GPT-4 (ID 47)
      target: 49, // PaLM 2 (ID 49)
      value: 8,
      relation: "PaLM 2 competes with GPT-4",
    },
    {
      id: 561,
      source: 51, // LaMDA (ID 51)
      target: 48, // PaLM (ID 48)
      value: 8,
      relation: "PaLM built upon LaMDA's conversational capabilities",
    },
    {
      id: 562,
      source: 51, // LaMDA (ID 51)
      target: 49, // PaLM 2 (ID 49)
      value: 8,
      relation: "PaLM 2 enhanced LaMDA's dialogue abilities",
    },
    {
      id: 563,
      source: 105, // GPT-4V (ID 105)
      target: 106, // Claude 3 Vision (ID 106)
      value: 7,
      relation: "GPT-4V and Claude 3 Vision as multimodal competitors",
    },
    {
      id: 564,
      source: 58, // Claude 3 (ID 58)
      target: 106, // Claude 3 Vision (ID 106)
      value: 9,
      relation: "Claude 3 Vision extends Claude 3 with vision",
    },
    {
      id: 565,
      source: 46, // GPT-3 (ID 46)
      target: 97, // DALL-E (ID 97)
      value: 8,
      relation: "GPT-3's language model used in DALL-E's text processing",
    },
    {
      id: 566,
      source: 95, // CLIP (ID 95)
      target: 105, // GPT-4V (ID 105)
      value: 8,
      relation: "CLIP's vision-language model influenced GPT-4V",
    },
    {
      id: 567,
      source: 95, // CLIP (ID 95)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "CLIP's methods contributed to Claude 3's development",
    },
    {
      id: 568,
      source: 99, // DALL-E 3 (ID 99)
      target: 105, // GPT-4V (ID 105)
      value: 8,
      relation: "DALL-E 3's techniques influenced GPT-4V's multimodality",
    },
    {
      id: 569,
      source: 105, // GPT-4V (ID 105)
      target: 57, // Gemini (ID 57)
      value: 8,
      relation: "GPT-4V's capabilities contributed to Gemini",
    },
    {
      id: 570,
      source: 57, // Gemini (ID 57)
      target: 107, // Gemini Vision (ID 107)
      value: 9,
      relation: "Gemini Vision extends Gemini with visual understanding",
    },
    {
      id: 571,
      source: 108, // Whisper (ID 108)
      target: 105, // GPT-4V (ID 105)
      value: 7,
      relation: "Whisper's audio processing influenced GPT-4V",
    },
    {
      id: 572,
      source: 46, // GPT-3 (ID 46)
      target: 52, // LLaMA (ID 52)
      value: 8,
      relation: "LLaMA built upon GPT-3's architecture",
    },
    {
      id: 573,
      source: 52, // LLaMA (ID 52)
      target: 53, // LLaMA 2 (ID 53)
      value: 9,
      relation: "LLaMA 2 improved upon LLaMA",
    },
    {
      id: 574,
      source: 53, // LLaMA 2 (ID 53)
      target: 103, // LLaVA (ID 103)
      value: 8,
      relation: "LLaVA extended LLaMA 2 with visual understanding",
    },
    {
      id: 575,
      source: 103, // LLaVA (ID 103)
      target: 105, // GPT-4V (ID 105)
      value: 7,
      relation: "LLaVA's visual capabilities are similar to GPT-4V",
    },
    {
      id: 576,
      source: 105, // GPT-4V (ID 105)
      target: 107, // Gemini Vision (ID 107)
      value: 9,
      relation: "GPT-4V's multimodal abilities inspired Gemini Vision",
    },
    {
      id: 577,
      source: 58, // Claude 3 (ID 58)
      target: 107, // Gemini Vision (ID 107)
      value: 7,
      relation: "Claude 3 Vision competes with Gemini Vision",
    },
    {
      id: 578,
      source: 49, // PaLM 2 (ID 49)
      target: 104, // PaLM-E (ID 104)
      value: 8,
      relation: "PaLM-E extended PaLM 2 with multimodal capabilities",
    },
    {
      id: 579,
      source: 104, // PaLM-E (ID 104)
      target: 107, // Gemini Vision (ID 107)
      value: 8,
      relation: "PaLM-E's methods influenced Gemini Vision",
    },
    {
      id: 580,
      source: 97, // DALL-E (ID 97)
      target: 98, // DALL-E 2 (ID 98)
      value: 9,
      relation: "DALL-E 2 improved upon DALL-E",
    },
    {
      id: 581,
      source: 98, // DALL-E 2 (ID 98)
      target: 99, // DALL-E 3 (ID 99)
      value: 9,
      relation: "DALL-E 3 further advanced text-to-image generation",
    },
    {
      id: 582,
      source: 99, // DALL-E 3 (ID 99)
      target: 105, // GPT-4V (ID 105)
      value: 8,
      relation: "DALL-E 3's capabilities contributed to GPT-4V",
    },
    {
      id: 583,
      source: 105, // GPT-4V (ID 105)
      target: 106, // Claude 3 Vision (ID 106)
      value: 8,
      relation: "Claude 3 Vision competes with GPT-4V",
    },
    {
      id: 584,
      source: 47, // GPT-4 (ID 47)
      target: 49, // PaLM 2 (ID 49)
      value: 7,
      relation: "GPT-4 and PaLM 2 are competing large language models",
    },
    {
      id: 585,
      source: 45, // GPT-2 (ID 45)
      target: 46, // GPT-3 (ID 46)
      value: 9,
      relation: "GPT-3 scaled up GPT-2's capabilities",
    },
    {
      id: 586,
      source: 46, // GPT-3 (ID 46)
      target: 47, // GPT-4 (ID 47)
      value: 9,
      relation: "GPT-4 improved upon GPT-3",
    },
    {
      id: 587,
      source: 58, // Claude 3 (ID 58)
      target: 47, // GPT-4 (ID 47)
      value: 8,
      relation: "Claude 3 competes with GPT-4",
    },
    {
      id: 588,
      source: 108, // Whisper (ID 108)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "Whisper's speech models used in Claude 3",
    },
    {
      id: 589,
      source: 57, // Gemini (ID 57)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "Gemini competes with Claude 3",
    },
    {
      id: 590,
      source: 53, // LLaMA 2 (ID 53)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "LLaMA 2's methods influenced Claude 3",
    },
    {
      id: 591,
      source: 51, // LaMDA (ID 51)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "LaMDA's dialogue capabilities inspired Claude 3",
    },
    {
      id: 592,
      source: 51, // LaMDA (ID 51)
      target: 106, // Claude 3 Vision (ID 106)
      value: 7,
      relation: "LaMDA influenced Claude 3 Vision's development",
    },
    {
      id: 593,
      source: 105, // GPT-4V (ID 105)
      target: 108, // Whisper (ID 108)
      value: 7,
      relation: "GPT-4V's audio understanding influenced by Whisper",
    },
    {
      id: 594,
      source: 95, // CLIP (ID 95)
      target: 58, // Claude 3 (ID 58)
      value: 8,
      relation: "CLIP's techniques influenced Claude 3's multimodal abilities",
    },
    {
      id: 595,
      source: 103, // LLaVA (ID 103)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "LLaVA's advancements related to Claude 3's vision",
    },
    {
      id: 596,
      source: 53, // LLaMA 2 (ID 53)
      target: 105, // GPT-4V (ID 105)
      value: 7,
      relation: "LLaMA 2's improvements influenced GPT-4V",
    },
    {
      id: 597,
      source: 48, // PaLM (ID 48)
      target: 51, // LaMDA (ID 51)
      value: 8,
      relation: "PaLM's large-scale training influenced LaMDA",
    },
    {
      id: 598,
      source: 105, // GPT-4V (ID 105)
      target: 104, // PaLM-E (ID 104)
      value: 7,
      relation: "GPT-4V and PaLM-E share multimodal capabilities",
    },
    {
      id: 599,
      source: 58, // Claude 3 (ID 58)
      target: 107, // Gemini Vision (ID 107)
      value: 7,
      relation: "Claude 3 Vision competes with Gemini Vision",
    },
    {
      id: 600,
      source: 49, // PaLM 2 (ID 49)
      target: 58, // Claude 3 (ID 58)
      value: 7,
      relation: "PaLM 2 competes with Claude 3",
    },
    {
      id: 601,
      source: 3, // Multi-Layer Perceptron (ID 3)
      target: 14, // Neocognitron (ID 14)
      value: 7,
      relation: "MLP inspired the development of Neocognitron",
    },
    {
      id: 602,
      source: 14, // Neocognitron (ID 14)
      target: 15, // LeNet-1 (ID 15)
      value: 8,
      relation: "LeNet-1 built upon Neocognitron's convolutional concepts",
    },
    {
      id: 603,
      source: 15, // LeNet-1 (ID 15)
      target: 16, // LeNet-5 (ID 16)
      value: 9,
      relation: "LeNet-5 improved and expanded LeNet-1",
    },
    {
      id: 604,
      source: 16, // LeNet-5 (ID 16)
      target: 17, // AlexNet (ID 17)
      value: 9,
      relation: "AlexNet scaled up CNNs based on LeNet-5",
    },
    {
      id: 605,
      source: 17, // AlexNet (ID 17)
      target: 18, // VGGNet (ID 18)
      value: 8,
      relation: "VGGNet increased depth over AlexNet",
    },
    {
      id: 606,
      source: 17, // AlexNet (ID 17)
      target: 19, // GoogLeNet (ID 19)
      value: 8,
      relation: "GoogLeNet introduced inception modules after AlexNet",
    },
    {
      id: 607,
      source: 18, // VGGNet (ID 18)
      target: 20, // ResNet (ID 20)
      value: 9,
      relation:
        "ResNet addressed vanishing gradients in deep networks like VGGNet",
    },
    {
      id: 608,
      source: 20, // ResNet (ID 20)
      target: 21, // DenseNet (ID 21)
      value: 8,
      relation: "DenseNet built upon ResNet's skip connections",
    },
    {
      id: 609,
      source: 20, // ResNet (ID 20)
      target: 23, // Vision Transformer (ViT) (ID 23)
      value: 7,
      relation: "ResNet inspired ViT's use of residual connections",
    },
    {
      id: 610,
      source: 23, // Vision Transformer (ViT) (ID 23)
      target: 24, // Swin Transformer (ID 24)
      value: 8,
      relation: "Swin Transformer improved ViT with hierarchical design",
    },
    {
      id: 611,
      source: 20, // ResNet (ID 20)
      target: 27, // U-Net (ID 27)
      value: 8,
      relation: "U-Net adapted ResNet's architecture for segmentation",
    },
    {
      id: 612,
      source: 27, // U-Net (ID 27)
      target: 28, // SegNet (ID 28)
      value: 7,
      relation: "SegNet built upon U-Net's segmentation approach",
    },
    {
      id: 613,
      source: 20, // ResNet (ID 20)
      target: 29, // YOLO (ID 29)
      value: 8,
      relation: "YOLO utilized CNN features inspired by ResNet",
    },
    {
      id: 614,
      source: 29, // YOLO (ID 29)
      target: 30, // MobileNetV1 (ID 30)
      value: 7,
      relation: "MobileNetV1 applied YOLO's efficiency for mobile devices",
    },
    {
      id: 615,
      source: 30, // MobileNetV1 (ID 30)
      target: 31, // MobileNetV2 (ID 31)
      value: 8,
      relation: "MobileNetV2 improved upon MobileNetV1",
    },
    {
      id: 616,
      source: 31, // MobileNetV2 (ID 31)
      target: 32, // MobileNetV3 (ID 32)
      value: 8,
      relation: "MobileNetV3 further optimized MobileNetV2",
    },
    {
      id: 617,
      source: 17, // AlexNet (ID 17)
      target: 35, // RNN (ID 35)
      value: 6,
      relation: "AlexNet's success influenced exploration in sequential models",
    },
    {
      id: 618,
      source: 35, // RNN (ID 35)
      target: 36, // LSTM (ID 36)
      value: 9,
      relation: "LSTM addressed RNN's vanishing gradient problem",
    },
    {
      id: 619,
      source: 36, // LSTM (ID 36)
      target: 37, // Transformer Architecture (ID 37)
      value: 9,
      relation:
        "Transformers overcame LSTM's sequential processing limitations",
    },
    {
      id: 620,
      source: 37, // Transformer Architecture (ID 37)
      target: 81, // DDPM (ID 81)
      value: 7,
      relation:
        "Transformers inspired attention mechanisms in diffusion models",
    },
    {
      id: 621,
      source: 81, // DDPM (ID 81)
      target: 83, // Stable Diffusion (ID 83)
      value: 9,
      relation: "Stable Diffusion built upon DDPM techniques",
    },
    {
      id: 622,
      source: 83, // Stable Diffusion (ID 83)
      target: 84, // Stable Diffusion XL (ID 84)
      value: 8,
      relation: "Stable Diffusion XL enhanced image quality and resolution",
    },
    {
      id: 623,
      source: 83, // Stable Diffusion (ID 83)
      target: 87, // Stable Video Diffusion (ID 87)
      value: 8,
      relation: "Stable Video Diffusion extended Stable Diffusion to video",
    },
    {
      id: 624,
      source: 81, // DDPM (ID 81)
      target: 82, // Improved DDPM (ID 82)
      value: 8,
      relation: "Improved DDPM optimized sampling efficiency",
    },
    {
      id: 625,
      source: 82, // Improved DDPM (ID 82)
      target: 83, // Stable Diffusion (ID 83)
      value: 8,
      relation: "Stable Diffusion utilized Improved DDPM methods",
    },
    {
      id: 626,
      source: 27, // U-Net (ID 27)
      target: 83, // Stable Diffusion (ID 83)
      value: 9,
      relation: "U-Net architecture used in Stable Diffusion's model",
    },
    {
      id: 627,
      source: 20, // ResNet (ID 20)
      target: 83, // Stable Diffusion (ID 83)
      value: 7,
      relation: "ResNet's concepts influenced Stable Diffusion's encoder",
    },
    {
      id: 628,
      source: 17, // AlexNet (ID 17)
      target: 20, // ResNet (ID 20)
      value: 8,
      relation: "ResNet built upon deep CNN architectures like AlexNet",
    },
    {
      id: 629,
      source: 18, // VGGNet (ID 18)
      target: 20, // ResNet (ID 20)
      value: 8,
      relation: "ResNet addressed challenges faced by VGGNet",
    },
    {
      id: 630,
      source: 17, // AlexNet (ID 17)
      target: 109, // Deep Q-Network (DQN) (ID 109)
      value: 6,
      relation: "CNNs from AlexNet applied in DQN for Atari games",
    },
    {
      id: 631,
      source: 109, // Deep Q-Network (DQN) (ID 109)
      target: 110, // A3C (ID 110)
      value: 8,
      relation: "A3C improved training efficiency over DQN",
    },
    {
      id: 632,
      source: 110, // A3C (ID 110)
      target: 111, // PPO (ID 111)
      value: 9,
      relation: "PPO simplified and improved policy optimization",
    },
    {
      id: 633,
      source: 111, // PPO (ID 111)
      target: 112, // AlphaGo (ID 112)
      value: 7,
      relation: "PPO techniques contributed to AlphaGo's training",
    },
    {
      id: 634,
      source: 112, // AlphaGo (ID 112)
      target: 113, // AlphaGo Zero (ID 113)
      value: 9,
      relation: "AlphaGo Zero removed the need for human data",
    },
    {
      id: 635,
      source: 113, // AlphaGo Zero (ID 113)
      target: 114, // AlphaZero (ID 114)
      value: 9,
      relation: "AlphaZero generalized AlphaGo Zero's approach",
    },
    {
      id: 636,
      source: 114, // AlphaZero (ID 114)
      target: 115, // MuZero (ID 115)
      value: 9,
      relation: "MuZero learned models without knowing the rules",
    },
    {
      id: 637,
      source: 115, // MuZero (ID 115)
      target: 116, // AlphaStar (ID 116)
      value: 8,
      relation: "MuZero's techniques influenced AlphaStar",
    },
    {
      id: 638,
      source: 116, // AlphaStar (ID 116)
      target: 117, // AlphaFold (ID 117)
      value: 7,
      relation: "AlphaStar's advancements inspired AlphaFold",
    },
    {
      id: 639,
      source: 117, // AlphaFold (ID 117)
      target: 118, // AlphaFold 2 (ID 118)
      value: 9,
      relation: "AlphaFold 2 significantly improved protein folding accuracy",
    },
    {
      id: 640,
      source: 36, // LSTM (ID 36)
      target: 109, // Deep Q-Network (DQN) (ID 109)
      value: 7,
      relation: "LSTM concepts applied in sequence prediction for DQN",
    },
    {
      id: 641,
      source: 95, // CLIP (ID 95)
      target: 83, // Stable Diffusion (ID 83)
      value: 8,
      relation: "CLIP's text encoder used in Stable Diffusion",
    },
    {
      id: 642,
      source: 83, // Stable Diffusion (ID 83)
      target: 105, // GPT-4V (ID 105)
      value: 7,
      relation: "Stable Diffusion's multimodality influenced GPT-4V",
    },
    {
      id: 643,
      source: 20, // ResNet (ID 20)
      target: 95, // CLIP (ID 95)
      value: 8,
      relation: "ResNet used as image encoder in CLIP",
    },
    {
      id: 644,
      source: 23, // Vision Transformer (ViT) (ID 23)
      target: 95, // CLIP (ID 95)
      value: 9,
      relation: "ViT architecture used in CLIP's image encoder",
    },
    {
      id: 645,
      source: 81, // DDPM (ID 81)
      target: 97, // DALL-E (ID 97)
      value: 7,
      relation: "DDPM techniques influenced DALL-E's generation",
    },
    {
      id: 646,
      source: 97, // DALL-E (ID 97)
      target: 98, // DALL-E 2 (ID 98)
      value: 9,
      relation: "DALL-E 2 improved upon DALL-E with diffusion models",
    },
    {
      id: 647,
      source: 98, // DALL-E 2 (ID 98)
      target: 99, // DALL-E 3 (ID 99)
      value: 9,
      relation: "DALL-E 3 further advanced text-to-image generation",
    },
    {
      id: 648,
      source: 27, // U-Net (ID 27)
      target: 81, // DDPM (ID 81)
      value: 8,
      relation: "U-Net architecture utilized in DDPM's denoising process",
    },
    {
      id: 649,
      source: 83, // Stable Diffusion (ID 83)
      target: 99, // DALL-E 3 (ID 99)
      value: 7,
      relation: "Stable Diffusion's methods influenced DALL-E 3",
    },
    {
      id: 650,
      source: 108, // Whisper (ID 108)
      target: 109, // Deep Q-Network (DQN) (ID 109)
      value: 6,
      relation: "Whisper's sequence models inspired RL applications",
    },
    {
      id: 651,
      source: 45, // GPT-2 (ID 45)
      target: 83, // Stable Diffusion (ID 83)
      value: 7,
      relation:
        "GPT-2's language modeling influenced text prompts in diffusion",
    },
    {
      id: 652,
      source: 52, // LLaMA (ID 52)
      target: 83, // Stable Diffusion (ID 83)
      value: 6,
      relation: "LLaMA's language understanding used in diffusion prompts",
    },
    {
      id: 653,
      source: 36, // LSTM (ID 36)
      target: 108, // Whisper (ID 108)
      value: 8,
      relation: "LSTM's sequence processing foundational for Whisper",
    },
    {
      id: 654,
      source: 81, // DDPM (ID 81)
      target: 87, // Stable Video Diffusion (ID 87)
      value: 8,
      relation: "DDPM's methods extended to video generation",
    },
    {
      id: 655,
      source: 87, // Stable Video Diffusion (ID 87)
      target: 90, // Gen-2 (ID 90)
      value: 8,
      relation: "Gen-2 improved upon Stable Video Diffusion",
    },
    {
      id: 656,
      source: 29, // YOLO (ID 29)
      target: 34, // SAM (Segment Anything Model) (ID 34)
      value: 7,
      relation: "YOLO's object detection concepts influenced SAM",
    },
    {
      id: 657,
      source: 34, // SAM (Segment Anything Model) (ID 34)
      target: 35, // SEEM (ID 35)
      value: 8,
      relation: "SEEM extended SAM's segmentation capabilities",
    },
    {
      id: 658,
      source: 112, // AlphaGo (ID 112)
      target: 115, // MuZero (ID 115)
      value: 8,
      relation: "AlphaGo's techniques evolved into MuZero",
    },
    {
      id: 659,
      source: 116, // AlphaStar (ID 116)
      target: 112, // AlphaGo (ID 112)
      value: 7,
      relation: "AlphaStar built upon AlphaGo's reinforcement learning",
    },
    {
      id: 660,
      source: 37, // Transformer Architecture (ID 37)
      target: 116, // AlphaStar (ID 116)
      value: 7,
      relation: "Transformers applied in AlphaStar's architecture",
    },
    {
      id: 661,
      source: 81, // DDPM (ID 81)
      target: 104, // PaLM-E (ID 104)
      value: 6,
      relation: "DDPM's generative models inspired PaLM-E's multimodality",
    },
    {
      id: 662,
      source: 104, // PaLM-E (ID 104)
      target: 105, // GPT-4V (ID 105)
      value: 8,
      relation: "PaLM-E's multimodal approach influenced GPT-4V",
    },
    {
      id: 663,
      source: 37, // Transformer Architecture (ID 37)
      target: 83, // Stable Diffusion (ID 83)
      value: 7,
      relation: "Transformers' attention mechanisms inspired diffusion models",
    },
    {
      id: 664,
      source: 20, // ResNet (ID 20)
      target: 27, // U-Net (ID 27)
      value: 8,
      relation: "U-Net incorporated ResNet's skip connections",
    },
    {
      id: 665,
      source: 20, // ResNet (ID 20)
      target: 28, // SegNet (ID 28)
      value: 7,
      relation: "SegNet built upon CNN architectures like ResNet",
    },
    {
      id: 666,
      source: 23, // Vision Transformer (ViT) (ID 23)
      target: 27, // U-Net (ID 27)
      value: 6,
      relation: "ViT concepts applied in U-Net variants",
    },
    {
      id: 667,
      source: 23, // Vision Transformer (ViT) (ID 23)
      target: 81, // DDPM (ID 81)
      value: 7,
      relation: "ViT used as encoder in some diffusion models",
    },
    {
      id: 668,
      source: 36, // LSTM (ID 36)
      target: 81, // DDPM (ID 81)
      value: 6,
      relation: "LSTM's sequential processing influenced diffusion time steps",
    },
    {
      id: 669,
      source: 95, // CLIP (ID 95)
      target: 97, // DALL-E (ID 97)
      value: 9,
      relation: "CLIP's embeddings used in DALL-E for text-to-image",
    },
    {
      id: 670,
      source: 95, // CLIP (ID 95)
      target: 83, // Stable Diffusion (ID 83)
      value: 8,
      relation: "CLIP provided text embeddings for Stable Diffusion",
    },
    {
      id: 671,
      source: 45, // GPT-2 (ID 45)
      target: 95, // CLIP (ID 95)
      value: 7,
      relation: "GPT-2's language understanding influenced CLIP's text encoder",
    },
    {
      id: 672,
      source: 45, // GPT-2 (ID 45)
      target: 97, // DALL-E (ID 97)
      value: 8,
      relation: "GPT-2's architecture used in DALL-E's text processing",
    },
    {
      id: 673,
      source: 95, // CLIP (ID 95)
      target: 98, // DALL-E 2 (ID 98)
      value: 9,
      relation: "CLIP's advancements integrated into DALL-E 2",
    },
    {
      id: 674,
      source: 47, // GPT-4 (ID 47)
      target: 105, // GPT-4V (ID 105)
      value: 9,
      relation: "GPT-4V extends GPT-4 with visual capabilities",
    },
    {
      id: 675,
      source: 105, // GPT-4V (ID 105)
      target: 107, // Gemini Vision (ID 107)
      value: 9,
      relation: "GPT-4V's multimodal abilities inspired Gemini Vision",
    },
    {
      id: 676,
      source: 103, // LLaVA (ID 103)
      target: 107, // Gemini Vision (ID 107)
      value: 7,
      relation: "LLaVA's methods influenced Gemini Vision",
    },
    {
      id: 677,
      source: 95, // CLIP (ID 95)
      target: 103, // LLaVA (ID 103)
      value: 8,
      relation: "CLIP's techniques contributed to LLaVA's development",
    },
    {
      id: 678,
      source: 27, // U-Net (ID 27)
      target: 86, // IP-Adapter (ID 86)
      value: 7,
      relation: "U-Net architecture used in IP-Adapter",
    },
    {
      id: 679,
      source: 86, // IP-Adapter (ID 86)
      target: 83, // Stable Diffusion (ID 83)
      value: 7,
      relation: "IP-Adapter enhanced Stable Diffusion with image prompts",
    },
    {
      id: 680,
      source: 84, // Stable Diffusion XL (ID 84)
      target: 86, // IP-Adapter (ID 86)
      value: 8,
      relation: "IP-Adapter techniques applied in SDXL",
    },
    {
      id: 681,
      source: 86, // IP-Adapter (ID 86)
      target: 87, // Stable Video Diffusion (ID 87)
      value: 8,
      relation: "IP-Adapter concepts extended to video diffusion",
    },
    {
      id: 682,
      source: 87, // Stable Video Diffusion (ID 87)
      target: 88, // Sora (ID 88)
      value: 7,
      relation: "Sora improved upon Stable Video Diffusion",
    },
    {
      id: 683,
      source: 88, // Sora (ID 88)
      target: 89, // Lumiere (ID 89)
      value: 7,
      relation: "Lumiere advanced video generation techniques",
    },
    {
      id: 684,
      source: 89, // Lumiere (ID 89)
      target: 90, // Gen-2 (ID 90)
      value: 8,
      relation: "Gen-2 built upon Lumiere's innovations",
    },
  ],
};
