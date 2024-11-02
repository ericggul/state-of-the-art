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
    {
        "id": 1,
        "source": 1,
        "target": 2,
        "value": 9,
        "relation": "introduced binary thresholding"
    },
    {
        "id": 2,
        "source": 2,
        "target": 3,
        "value": 9,
        "relation": "multi-layer extension"
    },
    {
        "id": 3,
        "source": 3,
        "target": 4,
        "value": 9,
        "relation": "enabled deep learning"
    },
    {
        "id": 4,
        "source": 3,
        "target": 5,
        "value": 7,
        "relation": "introduced recurrent connections"
    },
    {
        "id": 5,
        "source": 5,
        "target": 6,
        "value": 8,
        "relation": "probabilistic version"
    },
    {
        "id": 6,
        "source": 3,
        "target": 7,
        "value": 8,
        "relation": "unsupervised representation learning"
    },
    {
        "id": 7,
        "source": 7,
        "target": 8,
        "value": 8,
        "relation": "probabilistic encoding"
    },
    {
        "id": 8,
        "source": 8,
        "target": 10,
        "value": 7,
        "relation": "contrastive learning"
    },
    {
        "id": 9,
        "source": 10,
        "target": 11,
        "value": 8,
        "relation": "momentum encoding"
    },
    {
        "id": 10,
        "source": 10,
        "target": 12,
        "value": 8,
        "relation": "self-distillation"
    },
    {
        "id": 11,
        "source": 12,
        "target": 13,
        "value": 9,
        "relation": "improved self-supervised learning"
    },
    {
        "id": 12,
        "source": 3,
        "target": 14,
        "value": 9,
        "relation": "early convolutional neural network"
    },
    {
        "id": 13,
        "source": 16,
        "target": 17,
        "value": 9,
        "relation": "deep CNN for ImageNet"
    },
    {
        "id": 14,
        "source": 17,
        "target": 18,
        "value": 8,
        "relation": "deeper CNN architecture"
    },
    {
        "id": 15,
        "source": 18,
        "target": 19,
        "value": 7,
        "relation": "introduced inception modules"
    },
    {
        "id": 16,
        "source": 19,
        "target": 20,
        "value": 9,
        "relation": "residual connections"
    },
    {
        "id": 17,
        "source": 20,
        "target": 21,
        "value": 8,
        "relation": "dense connections"
    },
    {
        "id": 18,
        "source": 21,
        "target": 22,
        "value": 8,
        "relation": "efficient scaling"
    },
    {
        "id": 19,
        "source": 20,
        "target": 23,
        "value": 9,
        "relation": "shift to transformers in vision"
    },
    {
        "id": 20,
        "source": 23,
        "target": 24,
        "value": 8,
        "relation": "hierarchical vision transformer"
    },
    {
        "id": 21,
        "source": 23,
        "target": 25,
        "value": 7,
        "relation": "data-efficient training"
    },
    {
        "id": 22,
        "source": 23,
        "target": 26,
        "value": 8,
        "relation": "enhanced vision transformer"
    },
    {
        "id": 23,
        "source": 17,
        "target": 27,
        "value": 8,
        "relation": "semantic segmentation"
    },
    {
        "id": 24,
        "source": 27,
        "target": 28,
        "value": 7,
        "relation": "improved segmentation"
    },
    {
        "id": 25,
        "source": 17,
        "target": 29,
        "value": 8,
        "relation": "real-time object detection"
    },
    {
        "id": 26,
        "source": 20,
        "target": 30,
        "value": 7,
        "relation": "efficient mobile architecture"
    },
    {
        "id": 27,
        "source": 30,
        "target": 31,
        "value": 8,
        "relation": "improved efficiency"
    },
    {
        "id": 28,
        "source": 31,
        "target": 32,
        "value": 8,
        "relation": "advanced mobile CNN"
    },
    {
        "id": 29,
        "source": 27,
        "target": 33,
        "value": 9,
        "relation": "general segmentation"
    },
    {
        "id": 30,
        "source": 33,
        "target": 34,
        "value": 8,
        "relation": "unified segmentation"
    },
    {
        "id": 31,
        "source": 3,
        "target": 35,
        "value": 7,
        "relation": "sequential data processing"
    },
    {
        "id": 32,
        "source": 36,
        "target": 37,
        "value": 9,
        "relation": "attention mechanism"
    },
    {
        "id": 33,
        "source": 37,
        "target": 38,
        "value": 8,
        "relation": "text-to-text transfer"
    },
    {
        "id": 34,
        "source": 37,
        "target": 39,
        "value": 8,
        "relation": "denoising autoencoder"
    },
    {
        "id": 35,
        "source": 37,
        "target": 40,
        "value": 7,
        "relation": "large-scale language model"
    },
    {
        "id": 36,
        "source": 37,
        "target": 41,
        "value": 9,
        "relation": "bidirectional encoding"
    },
    {
        "id": 37,
        "source": 41,
        "target": 42,
        "value": 8,
        "relation": "optimized BERT"
    },
    {
        "id": 38,
        "source": 41,
        "target": 43,
        "value": 7,
        "relation": "enhanced BERT"
    },
    {
        "id": 39,
        "source": 37,
        "target": 44,
        "value": 9,
        "relation": "autoregressive language model"
    },
    {
        "id": 40,
        "source": 45,
        "target": 46,
        "value": 9,
        "relation": "massive language model"
    },
    {
        "id": 41,
        "source": 46,
        "target": 47,
        "value": 9,
        "relation": "advanced capabilities"
    },
    {
        "id": 42,
        "source": 46,
        "target": 48,
        "value": 8,
        "relation": "Google's large LM"
    },
    {
        "id": 43,
        "source": 46,
        "target": 51,
        "value": 8,
        "relation": "Google's dialogue model"
    },
    {
        "id": 44,
        "source": 52,
        "target": 54,
        "value": 8,
        "relation": "efficient LLM"
    },
    {
        "id": 45,
        "source": 54,
        "target": 55,
        "value": 7,
        "relation": "advanced efficiency"
    },
    {
        "id": 46,
        "source": 54,
        "target": 56,
        "value": 7,
        "relation": "Phi-based model"
    },
    {
        "id": 47,
        "source": 48,
        "target": 57,
        "value": 8,
        "relation": "next-gen Google LM"
    },
    {
        "id": 48,
        "source": 37,
        "target": 59,
        "value": 7,
        "relation": "longer context"
    },
    {
        "id": 49,
        "source": 59,
        "target": 60,
        "value": 8,
        "relation": "permutation LM"
    },
    {
        "id": 50,
        "source": 60,
        "target": 61,
        "value": 8,
        "relation": "sample-efficient pre-training"
    },
    {
        "id": 51,
        "source": 61,
        "target": 62,
        "value": 7,
        "relation": "long-context encoding"
    },
    {
        "id": 52,
        "source": 61,
        "target": 63,
        "value": 7,
        "relation": "efficient transformer"
    },
    {
        "id": 53,
        "source": 61,
        "target": 64,
        "value": 7,
        "relation": "sparse attention"
    },
    {
        "id": 54,
        "source": 37,
        "target": 65,
        "value": 8,
        "relation": "mixture of experts"
    },
    {
        "id": 55,
        "source": 41,
        "target": 68,
        "value": 7,
        "relation": "knowledge integration"
    },
    {
        "id": 56,
        "source": 41,
        "target": 69,
        "value": 7,
        "relation": "multilingual modeling"
    },
    {
        "id": 57,
        "source": 37,
        "target": 70,
        "value": 8,
        "relation": "multilingual T5"
    },
    {
        "id": 58,
        "source": 3,
        "target": 71,
        "value": 7,
        "relation": "adversarial training"
    },
    {
        "id": 59,
        "source": 71,
        "target": 72,
        "value": 8,
        "relation": "deep convolutional GAN"
    },
    {
        "id": 60,
        "source": 72,
        "target": 73,
        "value": 7,
        "relation": "improved training"
    },
    {
        "id": 61,
        "source": 73,
        "target": 74,
        "value": 8,
        "relation": "progressive growing"
    },
    {
        "id": 62,
        "source": 71,
        "target": 75,
        "value": 7,
        "relation": "conditional generation"
    },
    {
        "id": 63,
        "source": 75,
        "target": 76,
        "value": 8,
        "relation": "unpaired translation"
    },
    {
        "id": 64,
        "source": 75,
        "target": 77,
        "value": 7,
        "relation": "image-to-image translation"
    },
    {
        "id": 65,
        "source": 74,
        "target": 78,
        "value": 8,
        "relation": "style-based generator"
    },
    {
        "id": 66,
        "source": 78,
        "target": 79,
        "value": 9,
        "relation": "improved StyleGAN"
    },
    {
        "id": 67,
        "source": 71,
        "target": 81,
        "value": 7,
        "relation": "diffusion models"
    },
    {
        "id": 68,
        "source": 81,
        "target": 82,
        "value": 8,
        "relation": "improved training"
    },
    {
        "id": 69,
        "source": 82,
        "target": 83,
        "value": 9,
        "relation": "text-to-image diffusion"
    },
    {
        "id": 70,
        "source": 87,
        "target": 90,
        "value": 8,
        "relation": "text-to-video generation"
    },
    {
        "id": 71,
        "source": 83,
        "target": 91,
        "value": 7,
        "relation": "text-to-3D generation"
    },
    {
        "id": 72,
        "source": 78,
        "target": 92,
        "value": 7,
        "relation": "3D GANs"
    },
    {
        "id": 73,
        "source": 17,
        "target": 93,
        "value": 7,
        "relation": "image captioning"
    },
    {
        "id": 74,
        "source": 93,
        "target": 94,
        "value": 8,
        "relation": "visual question answering"
    },
    {
        "id": 75,
        "source": 37,
        "target": 95,
        "value": 9,
        "relation": "transformer in multimodal"
    },
    {
        "id": 76,
        "source": 23,
        "target": 95,
        "value": 9,
        "relation": "vision transformer in CLIP"
    },
    {
        "id": 77,
        "source": 95,
        "target": 96,
        "value": 8,
        "relation": "large-scale vision model"
    },
    {
        "id": 78,
        "source": 44,
        "target": 97,
        "value": 8,
        "relation": "text encoding with GPT"
    },
    {
        "id": 79,
        "source": 97,
        "target": 98,
        "value": 9,
        "relation": "improved generation"
    },
    {
        "id": 80,
        "source": 98,
        "target": 99,
        "value": 9,
        "relation": "advanced text-to-image"
    },
    {
        "id": 81,
        "source": 37,
        "target": 100,
        "value": 8,
        "relation": "multimodal few-shot learning"
    },
    {
        "id": 82,
        "source": 95,
        "target": 101,
        "value": 8,
        "relation": "improved vision-language"
    },
    {
        "id": 83,
        "source": 52,
        "target": 103,
        "value": 8,
        "relation": "LLaMA with vision"
    },
    {
        "id": 84,
        "source": 48,
        "target": 104,
        "value": 8,
        "relation": "PaLM extended with vision"
    },
    {
        "id": 85,
        "source": 46,
        "target": 105,
        "value": 9,
        "relation": "GPT-4 with vision"
    },
    {
        "id": 86,
        "source": 54,
        "target": 106,
        "value": 9,
        "relation": "Claude 3 with vision"
    },
    {
        "id": 87,
        "source": 57,
        "target": 107,
        "value": 9,
        "relation": "Gemini with vision"
    },
    {
        "id": 88,
        "source": 37,
        "target": 108,
        "value": 8,
        "relation": "transformer for speech"
    },
    {
        "id": 89,
        "source": 3,
        "target": 109,
        "value": 7,
        "relation": "function approximation in RL"
    },
    {
        "id": 90,
        "source": 109,
        "target": 110,
        "value": 8,
        "relation": "asynchronous RL"
    },
    {
        "id": 91,
        "source": 109,
        "target": 112,
        "value": 9,
        "relation": "deep RL for Go"
    },
    {
        "id": 92,
        "source": 112,
        "target": 113,
        "value": 9,
        "relation": "self-play RL"
    },
    {
        "id": 93,
        "source": 113,
        "target": 114,
        "value": 9,
        "relation": "generalized game AI"
    },
    {
        "id": 94,
        "source": 114,
        "target": 115,
        "value": 9,
        "relation": "model-based RL"
    },
    {
        "id": 95,
        "source": 115,
        "target": 116,
        "value": 9,
        "relation": "complex environment RL"
    },
    {
        "id": 96,
        "source": 117,
        "target": 118,
        "value": 9,
        "relation": "improved protein folding"
    },
    {
        "id": 97,
        "source": 41,
        "target": 117,
        "value": 7,
        "relation": "applied transformer to proteins"
    },
    {
        "id": 98,
        "source": 108,
        "target": 95,
        "value": 7,
        "relation": "cross-modal transformer applications"
    },
    {
        "id": 99,
        "source": 95,
        "target": 68,
        "value": 9,
        "relation": "foundation for CLIP's architecture"
    },
    {
        "id": 100,
        "source": 68,
        "target": 69,
        "value": 8,
        "relation": "inspired DALL-E's text-image pairing"
    },
    {
        "id": 101,
        "source": 69,
        "target": 70,
        "value": 9,
        "relation": "advanced text-to-image synthesis"
    },
    {
        "id": 102,
        "source": 70,
        "target": 99,
        "value": 9,
        "relation": "progression to DALL-E 3"
    },
    {
        "id": 103,
        "source": 99,
        "target": 62,
        "value": 9,
        "relation": "utilized diffusion in image generation"
    },
    {
        "id": 104,
        "source": 62,
        "target": 105,
        "value": 8,
        "relation": "influenced GPT-4V's visual capabilities"
    },
    {
        "id": 105,
        "source": 105,
        "target": 107,
        "value": 9,
        "relation": "set groundwork for Gemini Vision"
    },
    {
        "id": 106,
        "source": 17,
        "target": 109,
        "value": 7,
        "relation": "CNNs in reinforcement learning"
    },
    {
        "id": 107,
        "source": 116,
        "target": 81,
        "value": 8,
        "relation": "inspired AlphaFold's RL approach"
    },
    {
        "id": 108,
        "source": 31,
        "target": 117,
        "value": 7,
        "relation": "BERT techniques in biology"
    },
    {
        "id": 109,
        "source": 27,
        "target": 93,
        "value": 7,
        "relation": "sequence models for captioning"
    },
    {
        "id": 110,
        "source": 94,
        "target": 95,
        "value": 8,
        "relation": "multimodal transformers"
    },
    {
        "id": 111,
        "source": 96,
        "target": 97,
        "value": 8,
        "relation": "text encoding in DALL-E"
    },
    {
        "id": 112,
        "source": 99,
        "target": 105,
        "value": 9,
        "relation": "contributed to GPT-4V's capabilities"
    },
    {
        "id": 113,
        "source": 35,
        "target": 108,
        "value": 8,
        "relation": "transformers in speech via Whisper"
    },
    {
        "id": 114,
        "source": 45,
        "target": 69,
        "value": 8,
        "relation": "language generation in DALL-E"
    },
    {
        "id": 115,
        "source": 62,
        "target": 83,
        "value": 9,
        "relation": "Stable Diffusion's impact"
    },
    {
        "id": 116,
        "source": 89,
        "target": 90,
        "value": 8,
        "relation": "innovations in Gen-2"
    },
    {
        "id": 117,
        "source": 90,
        "target": 91,
        "value": 7,
        "relation": "3D generation in Point-E"
    },
    {
        "id": 118,
        "source": 91,
        "target": 92,
        "value": 7,
        "relation": "advancements in GET3D"
    },
    {
        "id": 119,
        "source": 46,
        "target": 35,
        "value": 9,
        "relation": "massive scaling in GPT-3"
    },
    {
        "id": 120,
        "source": 35,
        "target": 36,
        "value": 9,
        "relation": "advancements in GPT-4"
    },
    {
        "id": 121,
        "source": 36,
        "target": 105,
        "value": 9,
        "relation": "multimodal integration in GPT-4V"
    },
    {
        "id": 122,
        "source": 105,
        "target": 73,
        "value": 8,
        "relation": "influenced instruction tuning"
    },
    {
        "id": 123,
        "source": 74,
        "target": 75,
        "value": 9,
        "relation": "foundation for advanced multimodal models"
    },
    {
        "id": 124,
        "source": 75,
        "target": 107,
        "value": 9,
        "relation": "culmination in Gemini"
    },
    {
        "id": 125,
        "source": 83,
        "target": 98,
        "value": 8,
        "relation": "diffusion models in text-to-image"
    },
    {
        "id": 126,
        "source": 28,
        "target": 37,
        "value": 9,
        "relation": "foundation for transformers"
    },
    {
        "id": 127,
        "source": 37,
        "target": 31,
        "value": 8,
        "relation": "inspired BERT's architecture"
    },
    {
        "id": 128,
        "source": 45,
        "target": 35,
        "value": 9,
        "relation": "massive scaling in GPT-3"
    },
    {
        "id": 129,
        "source": 28,
        "target": 68,
        "value": 9,
        "relation": "enabled CLIP's transformer"
    },
    {
        "id": 130,
        "source": 116,
        "target": 83,
        "value": 8,
        "relation": "applied AlphaStar's techniques to architecture search"
    },
    {
        "id": 131,
        "source": 88,
        "target": 31,
        "value": 8,
        "relation": "influenced BERT's pre-training"
    },
    {
        "id": 132,
        "source": 32,
        "target": 45,
        "value": 8,
        "relation": "transition to GPT models"
    },
    {
        "id": 133,
        "source": 85,
        "target": 21,
        "value": 6,
        "relation": "influenced Swin Transformer's design"
    },
    {
        "id": 134,
        "source": 21,
        "target": 96,
        "value": 7,
        "relation": "applied in Florence's architecture"
    },
    {
        "id": 135,
        "source": 96,
        "target": 99,
        "value": 8,
        "relation": "contributed to DALL-E 3's vision encoder"
    },
    {
        "id": 136,
        "source": 99,
        "target": 83,
        "value": 8,
        "relation": "integration with diffusion models"
    },
    {
        "id": 137,
        "source": 55,
        "target": 56,
        "value": 7,
        "relation": "advancements in Phi-2"
    },
    {
        "id": 138,
        "source": 56,
        "target": 57,
        "value": 8,
        "relation": "development towards Gemini"
    },
    {
        "id": 139,
        "source": 104,
        "target": 105,
        "value": 9,
        "relation": "influenced GPT-4V"
    },
    {
        "id": 140,
        "source": 108,
        "target": 105,
        "value": 8,
        "relation": "influenced GPT-4V's multimodality"
    },
    {
        "id": 141,
        "source": 108,
        "target": 106,
        "value": 8,
        "relation": "applied in Claude 3 Vision"
    },
    {
        "id": 142,
        "source": 35,
        "target": 105,
        "value": 9,
        "relation": "GPT-3's influence on GPT-4V"
    },
    {
        "id": 143,
        "source": 35,
        "target": 73,
        "value": 8,
        "relation": "instruction tuning based on GPT-3"
    },
    {
        "id": 144,
        "source": 108,
        "target": 107,
        "value": 9,
        "relation": "inspired Gemini Vision's multimodal input"
    },
    {
        "id": 145,
        "source": 68,
        "target": 105,
        "value": 8,
        "relation": "CLIP's visual understanding in GPT-4V"
    },
    {
        "id": 146,
        "source": 105,
        "target": 106,
        "value": 9,
        "relation": "expanded capabilities in Claude 3 Vision"
    },
    {
        "id": 147,
        "source": 62,
        "target": 84,
        "value": 7,
        "relation": "diffusion model advancements to graph AI"
    },
    {
        "id": 148,
        "source": 85,
        "target": 83,
        "value": 6,
        "relation": "alternative architecture for Mobile AI"
    },
    {
        "id": 149,
        "source": 33,
        "target": 74,
        "value": 8,
        "relation": "language model use in robotics"
    },
    {
        "id": 150,
        "source": 76,
        "target": 77,
        "value": 8,
        "relation": "enhanced training in deep reinforcement"
    },
    {
        "id": 151,
        "source": 77,
        "target": 78,
        "value": 9,
        "relation": "RL methods used in AlphaGo"
    },
    {
        "id": 152,
        "source": 78,
        "target": 81,
        "value": 9,
        "relation": "real-time strategy enhancements"
    },
    {
        "id": 153,
        "source": 31,
        "target": 28,
        "value": 8,
        "relation": "transformer backbone for BERT"
    },
    {
        "id": 154,
        "source": 28,
        "target": 33,
        "value": 9,
        "relation": "BERT's architecture rooted in transformers"
    },
    {
        "id": 155,
        "source": 33,
        "target": 45,
        "value": 9,
        "relation": "language modeling advancements in GPT"
    },
    {
        "id": 156,
        "source": 45,
        "target": 105,
        "value": 9,
        "relation": "GPT's evolution to multimodal models"
    },
    {
        "id": 157,
        "source": 20,
        "target": 68,
        "value": 8,
        "relation": "vision transformer used in CLIP"
    },
    {
        "id": 158,
        "source": 68,
        "target": 107,
        "value": 9,
        "relation": "zero-shot capabilities in Gemini Vision"
    },
    {
        "id": 159,
        "source": 28,
        "target": 34,
        "value": 9,
        "relation": "advanced training used in GPT models"
    },
    {
        "id": 160,
        "source": 34,
        "target": 36,
        "value": 9,
        "relation": "GPT-4's large-scale architecture"
    },
    {
        "id": 161,
        "source": 40,
        "target": 41,
        "value": 7,
        "relation": "multilingual pre-training applied"
    },
    {
        "id": 162,
        "source": 42,
        "target": 43,
        "value": 8,
        "relation": "efficient training techniques in transformers"
    },
    {
        "id": 163,
        "source": 43,
        "target": 45,
        "value": 8,
        "relation": "sparse transformer evolution"
    },
    {
        "id": 164,
        "source": 45,
        "target": 50,
        "value": 8,
        "relation": "transfer learning advancements"
    },
    {
        "id": 165,
        "source": 50,
        "target": 51,
        "value": 9,
        "relation": "multilingual modeling in LLaMA"
    },
    {
        "id": 166,
        "source": 51,
        "target": 52,
        "value": 9,
        "relation": "fine-tuned to LLaMA 2"
    },
    {
        "id": 167,
        "source": 14,
        "target": 20,
        "value": 7,
        "relation": "convolution to transformer evolution"
    },
    {
        "id": 168,
        "source": 20,
        "target": 75,
        "value": 9,
        "relation": "applied in advanced multimodal models"
    },
    {
        "id": 169,
        "source": 75,
        "target": 85,
        "value": 8,
        "relation": "integration with graph-based models"
    },
    {
        "id": 170,
        "source": 85,
        "target": 86,
        "value": 8,
        "relation": "contextual embedding improvements"
    },
    {
        "id": 171,
        "source": 86,
        "target": 87,
        "value": 9,
        "relation": "pre-training for transfer learning"
    },
    {
        "id": 172,
        "source": 28,
        "target": 76,
        "value": 8,
        "relation": "transformer attention in RL"
    },
    {
        "id": 173,
        "source": 76,
        "target": 78,
        "value": 9,
        "relation": "transformer RL applications"
    },
    {
        "id": 174,
        "source": 78,
        "target": 80,
        "value": 9,
        "relation": "model-based planning"
    },
    {
        "id": 175,
        "source": 80,
        "target": 81,
        "value": 9,
        "relation": "MuZero's game-playing enhancements"
    },
    {
        "id": 176,
        "source": 17,
        "target": 23,
        "value": 7,
        "relation": "CNN features used in segmentation"
    },
    {
        "id": 177,
        "source": 24,
        "target": 25,
        "value": 8,
        "relation": "improved real-time object detection"
    },
    {
        "id": 178,
        "source": 25,
        "target": 30,
        "value": 7,
        "relation": "applied to mobile-efficient models"
    },
    {
        "id": 179,
        "source": 30,
        "target": 33,
        "value": 8,
        "relation": "used in BERT's training"
    },
    {
        "id": 180,
        "source": 108,
        "target": 109,
        "value": 8,
        "relation": "efficient speech recognition"
    },
    {
        "id": 181,
        "source": 111,
        "target": 112,
        "value": 8,
        "relation": "back to speech recognition"
    },
    {
        "id": 182,
        "source": 76,
        "target": 80,
        "value": 9,
        "relation": "RL applied in real-time games"
    },
    {
        "id": 183,
        "source": 80,
        "target": 82,
        "value": 8,
        "relation": "AlphaFold's real-time learning"
    },
    {
        "id": 184,
        "source": 33,
        "target": 87,
        "value": 9,
        "relation": "contextual understanding in NLP"
    },
    {
        "id": 185,
        "source": 28,
        "target": 88,
        "value": 8,
        "relation": "sparse transformer techniques"
    },
    {
        "id": 186,
        "source": 78,
        "target": 87,
        "value": 8,
        "relation": "advanced RL for NLP tasks"
    },
    {
        "id": 187,
        "source": 87,
        "target": 89,
        "value": 9,
        "relation": "knowledge distillation methods"
    },
    {
        "id": 188,
        "source": 70,
        "target": 107,
        "value": 8,
        "relation": "efficient text-to-image models"
    },
    {
        "id": 189,
        "source": 28,
        "target": 84,
        "value": 9,
        "relation": "attention for structured data"
    },
    {
        "id": 190,
        "source": 84,
        "target": 88,
        "value": 8,
        "relation": "graph-based attention in transformers"
    },
    {
        "id": 191,
        "source": 88,
        "target": 89,
        "value": 9,
        "relation": "optimized training for graphs"
    },
    {
        "id": 192,
        "source": 89,
        "target": 92,
        "value": 9,
        "relation": "advanced graph-based NLP models"
    },
    {
        "id": 193,
        "source": 17,
        "target": 31,
        "value": 7,
        "relation": "CNN influences in BERT"
    },
    {
        "id": 194,
        "source": 31,
        "target": 33,
        "value": 8,
        "relation": "BERT influenced by CNN insights"
    },
    {
        "id": 195,
        "source": 33,
        "target": 35,
        "value": 9,
        "relation": "language model expansion"
    },
    {
        "id": 196,
        "source": 35,
        "target": 37,
        "value": 9,
        "relation": "GPT scale-up methods"
    },
    {
        "id": 197,
        "source": 39,
        "target": 40,
        "value": 9,
        "relation": "distributed training techniques"
    },
    {
        "id": 198,
        "source": 40,
        "target": 42,
        "value": 8,
        "relation": "context-aware text generation"
    },
    {
        "id": 199,
        "source": 42,
        "target": 44,
        "value": 9,
        "relation": "sparse attention models"
    },
    {
        "id": 200,
        "source": 44,
        "target": 46,
        "value": 8,
        "relation": "parameter-efficient transformers"
    },
    {
        "id": 201,
        "source": 48,
        "target": 50,
        "value": 9,
        "relation": "efficient language modeling"
    },
    {
        "id": 202,
        "source": 50,
        "target": 52,
        "value": 9,
        "relation": "transfer learning for LLaMA"
    },
    {
        "id": 203,
        "source": 52,
        "target": 55,
        "value": 8,
        "relation": "efficient GAN training"
    },
    {
        "id": 204,
        "source": 55,
        "target": 58,
        "value": 7,
        "relation": "progressive GAN synthesis"
    },
    {
        "id": 205,
        "source": 58,
        "target": 61,
        "value": 9,
        "relation": "image generation to diffusion models"
    },
    {
        "id": 206,
        "source": 61,
        "target": 65,
        "value": 8,
        "relation": "diffusion model sampling techniques"
    },
    {
        "id": 207,
        "source": 65,
        "target": 67,
        "value": 9,
        "relation": "efficient sampling improvements"
    },
    {
        "id": 208,
        "source": 67,
        "target": 69,
        "value": 9,
        "relation": "advanced text-to-image generation"
    },
    {
        "id": 209,
        "source": 69,
        "target": 71,
        "value": 9,
        "relation": "zero-shot text-to-image models"
    },
    {
        "id": 210,
        "source": 71,
        "target": 74,
        "value": 8,
        "relation": "language-vision integration"
    },
    {
        "id": 211,
        "source": 75,
        "target": 78,
        "value": 8,
        "relation": "real-time multimodal AI"
    },
    {
        "id": 212,
        "source": 80,
        "target": 85,
        "value": 8,
        "relation": "transfer learning in reinforcement models"
    },
    {
        "id": 213,
        "source": 85,
        "target": 87,
        "value": 7,
        "relation": "embedding techniques in AI"
    },
    {
        "id": 214,
        "source": 90,
        "target": 93,
        "value": 9,
        "relation": "scaling techniques in LLMs"
    },
    {
        "id": 215,
        "source": 95,
        "target": 97,
        "value": 9,
        "relation": "optimizing large models"
    },
    {
        "id": 216,
        "source": 97,
        "target": 100,
        "value": 8,
        "relation": "model fine-tuning advancements"
    },
    {
        "id": 217,
        "source": 100,
        "target": 101,
        "value": 8,
        "relation": "enhanced diffusion-based models"
    },
    {
        "id": 218,
        "source": 101,
        "target": 102,
        "value": 9,
        "relation": "applied generative modeling to protein structures"
    },
    {
        "id": 219,
        "source": 102,
        "target": 103,
        "value": 7,
        "relation": "utilized large-scale transformers"
    },
    {
        "id": 220,
        "source": 103,
        "target": 104,
        "value": 8,
        "relation": "multimodal extensions for PaLM-E"
    },
    {
        "id": 221,
        "source": 106,
        "target": 107,
        "value": 10,
        "relation": "culminated in Gemini Vision"
    },
    {
        "id": 222,
        "source": 87,
        "target": 88,
        "value": 9,
        "relation": "NLP advancements influencing RL"
    },
    {
        "id": 223,
        "source": 93,
        "target": 95,
        "value": 9,
        "relation": "enhanced language generation models"
    },
    {
        "id": 224,
        "source": 97,
        "target": 99,
        "value": 9,
        "relation": "DALL-E improvements"
    },
    {
        "id": 225,
        "source": 40,
        "target": 44,
        "value": 7,
        "relation": "extended transformer functions"
    },
    {
        "id": 226,
        "source": 46,
        "target": 50,
        "value": 9,
        "relation": "optimized for language understanding"
    },
    {
        "id": 227,
        "source": 37,
        "target": 117,
        "value": 9,
        "relation": "transformer architecture applied to protein folding"
    },
    {
        "id": 228,
        "source": 84,
        "target": 105,
        "value": 9,
        "relation": "diffusion's role in GPT-4V development"
    },
    {
        "id": 229,
        "source": 36,
        "target": 68,
        "value": 8,
        "relation": "BERT's influence on multimodal learning"
    },
    {
        "id": 230,
        "source": 31,
        "target": 80,
        "value": 8,
        "relation": "context embeddings inspired MuZero"
    },
    {
        "id": 231,
        "source": 21,
        "target": 78,
        "value": 7,
        "relation": "DenseNet's influence on StyleGAN"
    },
    {
        "id": 232,
        "source": 100,
        "target": 106,
        "value": 9,
        "relation": "multimodal generation techniques applied to Claude 3 Vision"
    },
    {
        "id": 233,
        "source": 76,
        "target": 110,
        "value": 8,
        "relation": "RL methods in efficient language models"
    },
    {
        "id": 234,
        "source": 80,
        "target": 92,
        "value": 8,
        "relation": "MuZero's strategies extended to Point-E"
    },
    {
        "id": 235,
        "source": 28,
        "target": 81,
        "value": 8,
        "relation": "real-time CNN methods inspired AlphaFold"
    },
    {
        "id": 236,
        "source": 75,
        "target": 86,
        "value": 7,
        "relation": "CycleGAN's contributions to context embedding"
    },
    {
        "id": 237,
        "source": 83,
        "target": 104,
        "value": 8,
        "relation": "diffusion models influence on PaLM-E"
    },
    {
        "id": 238,
        "source": 55,
        "target": 109,
        "value": 9,
        "relation": "Phi-2's reinforcement methods"
    },
    {
        "id": 239,
        "source": 52,
        "target": 75,
        "value": 8,
        "relation": "LLaMA extended for multimodal RL"
    },
    {
        "id": 240,
        "source": 101,
        "target": 92,
        "value": 7,
        "relation": "advanced multimodal synthesis for Point-E"
    },
    {
        "id": 241,
        "source": 105,
        "target": 88,
        "value": 8,
        "relation": "GPT-4V's efficiency impacts Lumiere"
    },
    {
        "id": 242,
        "source": 74,
        "target": 68,
        "value": 9,
        "relation": "robotics AI influenced by CLIP"
    },
    {
        "id": 243,
        "source": 110,
        "target": 113,
        "value": 9,
        "relation": "policy optimization impacts AlphaGo Zero"
    },
    {
        "id": 244,
        "source": 36,
        "target": 48,
        "value": 9,
        "relation": "GPT-4 built upon Megatron-LM"
    },
    {
        "id": 245,
        "source": 37,
        "target": 50,
        "value": 7,
        "relation": "Transformer design influenced LaMDA"
    },
    {
        "id": 246,
        "source": 68,
        "target": 101,
        "value": 9,
        "relation": "CLIP's framework extended to BLIP-2"
    },
    {
        "id": 247,
        "source": 95,
        "target": 103,
        "value": 8,
        "relation": "multimodal understanding advances in LLaVA"
    },
    {
        "id": 248,
        "source": 69,
        "target": 94,
        "value": 7,
        "relation": "DALL-E 2's text-to-image roots in VQA"
    },
    {
        "id": 249,
        "source": 85,
        "target": 88,
        "value": 8,
        "relation": "IP-Adapter's control used in Lumiere"
    },
    {
        "id": 250,
        "source": 45,
        "target": 97,
        "value": 9,
        "relation": "GPT-2 foundations for Microsoft's T-NLG"
    },
    {
        "id": 251,
        "source": 104,
        "target": 107,
        "value": 9,
        "relation": "PaLM-E advancements shaping Gemini Vision"
    },
    {
        "id": 252,
        "source": 109,
        "target": 115,
        "value": 8,
        "relation": "deep RL techniques applied to MuZero"
    },
    {
        "id": 253,
        "source": 100,
        "target": 102,
        "value": 8,
        "relation": "cross-modal generative models for protein synthesis"
    },
    {
        "id": 254,
        "source": 21,
        "target": 84,
        "value": 7,
        "relation": "DenseNet's efficiency aiding graph AI"
    },
    {
        "id": 255,
        "source": 58,
        "target": 104,
        "value": 9,
        "relation": "Reformer approaches utilized in PaLM-E"
    },
    {
        "id": 256,
        "source": 93,
        "target": 106,
        "value": 9,
        "relation": "Show and Tell's impact on Claude 3 Vision"
    },
    {
        "id": 257,
        "source": 107,
        "target": 90,
        "value": 8,
        "relation": "Gemini Vision's text-to-video evolution"
    },
    {
        "id": 258,
        "source": 70,
        "target": 110,
        "value": 9,
        "relation": "GAN research contributing to RL models"
    },
    {
        "id": 259,
        "source": 97,
        "target": 101,
        "value": 8,
        "relation": "Turing NLG's generative advancements in BLIP-2"
    },
    {
        "id": 260,
        "source": 79,
        "target": 86,
        "value": 8,
        "relation": "StyleGAN3's efficiency extended to video AI"
    },
    {
        "id": 261,
        "source": 44,
        "target": 106,
        "value": 9,
        "relation": "ELECTRA's transformer efficiency impacting Claude 3 Vision"
    },
    {
        "id": 262,
        "source": 54,
        "target": 64,
        "value": 8,
        "relation": "LLaMA's sparse approaches improving efficiency"
    },
    {
        "id": 263,
        "source": 35,
        "target": 113,
        "value": 7,
        "relation": "Transformer LSTM hybrid used in AlphaZero"
    },
    {
        "id": 264,
        "source": 39,
        "target": 99,
        "value": 9,
        "relation": "XLNet's approach enhanced DALL-E 3"
    },
    {
        "id": 265,
        "source": 56,
        "target": 107,
        "value": 9,
        "relation": "Gemini integration from Phi-2"
    },
    {
        "id": 266,
        "source": 46,
        "target": 76,
        "value": 8,
        "relation": "GPT architectures influencing RL research"
    },
    {
        "id": 267,
        "source": 53,
        "target": 102,
        "value": 9,
        "relation": "efficient LLM methods aiding mT5"
    },
    {
        "id": 268,
        "source": 60,
        "target": 62,
        "value": 8,
        "relation": "sparse attention optimization in Stable Diffusion"
    },
    {
        "id": 269,
        "source": 108,
        "target": 104,
        "value": 9,
        "relation": "Whisper's techniques used in PaLM-E"
    },
    {
        "id": 270,
        "source": 67,
        "target": 72,
        "value": 7,
        "relation": "GAN distillation impacting Progressive GAN"
    },
    {
        "id": 271,
        "source": 41,
        "target": 51,
        "value": 8,
        "relation": "BERT's context handling extended to LLaMA"
    },
    {
        "id": 272,
        "source": 48,
        "target": 77,
        "value": 9,
        "relation": "MoCo's probabilistic learning in StyleGAN"
    },
    {
        "id": 273,
        "source": 89,
        "target": 93,
        "value": 8,
        "relation": "Lumiere's contributions to efficient LLMs"
    },
    {
        "id": 274,
        "source": 87,
        "target": 101,
        "value": 9,
        "relation": "video-to-text influences BLIP-2"
    },
    {
        "id": 275,
        "source": 75,
        "target": 113,
        "value": 8,
        "relation": "CycleGAN's data efficiency used in AlphaZero"
    },
    {
        "id": 276,
        "source": 45,
        "target": 54,
        "value": 9,
        "relation": "GPT's architecture influenced Mistral"
    },
    {
        "id": 277,
        "source": 27,
        "target": 83,
        "value": 9,
        "relation": "U-Net architecture used in diffusion models"
    },
    {
        "id": 278,
        "source": 8,
        "target": 81,
        "value": 8,
        "relation": "Probabilistic modeling inspired diffusion models"
    },
    {
        "id": 279,
        "source": 37,
        "target": 23,
        "value": 9,
        "relation": "Applied Transformer architecture to vision tasks"
    },
    {
        "id": 280,
        "source": 20,
        "target": 37,
        "value": 8,
        "relation": "Residual connections inspired Transformer's design"
    },
    {
        "id": 281,
        "source": 41,
        "target": 61,
        "value": 8,
        "relation": "ELECTRA improved upon BERT's pre-training"
    },
    {
        "id": 282,
        "source": 41,
        "target": 65,
        "value": 8,
        "relation": "Parameter sharing in ALBERT based on BERT"
    },
    {
        "id": 283,
        "source": 10,
        "target": 95,
        "value": 8,
        "relation": "Contrastive learning methods influenced CLIP"
    },
    {
        "id": 284,
        "source": 11,
        "target": 95,
        "value": 8,
        "relation": "Momentum contrast in MoCo inspired CLIP"
    },
    {
        "id": 285,
        "source": 17,
        "target": 20,
        "value": 8,
        "relation": "ResNet built upon deep CNN architectures like AlexNet"
    },
    {
        "id": 286,
        "source": 18,
        "target": 21,
        "value": 8,
        "relation": "DenseNet extended ideas from VGGNet on depth and connectivity"
    },
    {
        "id": 287,
        "source": 20,
        "target": 22,
        "value": 8,
        "relation": "EfficientNet built upon ideas from ResNet for scaling"
    },
    {
        "id": 288,
        "source": 22,
        "target": 32,
        "value": 8,
        "relation": "Efficient scaling methods applied in MobileNetV3"
    },
    {
        "id": 289,
        "source": 41,
        "target": 38,
        "value": 7,
        "relation": "BERT's pretraining methods influenced T5"
    },
    {
        "id": 290,
        "source": 44,
        "target": 38,
        "value": 7,
        "relation": "GPT's autoregressive modeling influenced T5"
    },
    {
        "id": 291,
        "source": 23,
        "target": 12,
        "value": 8,
        "relation": "ViT architecture used in DINO's self-supervised learning"
    },
    {
        "id": 292,
        "source": 11,
        "target": 12,
        "value": 7,
        "relation": "Momentum encoding inspired DINO's approach"
    },
    {
        "id": 293,
        "source": 53,
        "target": 54,
        "value": 8,
        "relation": "Mistral built upon LLaMA 2's advancements"
    },
    {
        "id": 294,
        "source": 53,
        "target": 103,
        "value": 8,
        "relation": "LLaVA extends LLaMA 2 with visual understanding"
    },
    {
        "id": 295,
        "source": 47,
        "target": 105,
        "value": 9,
        "relation": "GPT-4V extends GPT-4 with visual capabilities"
    },
    {
        "id": 296,
        "source": 27,
        "target": 81,
        "value": 8,
        "relation": "U-Net architecture used in DDPM models"
    },
    {
        "id": 297,
        "source": 41,
        "target": 97,
        "value": 8,
        "relation": "BERT's text encoding influenced DALL-E's text processing"
    },
    {
        "id": 298,
        "source": 83,
        "target": 84,
        "value": 9,
        "relation": "Stable Diffusion XL improved upon Stable Diffusion"
    },
    {
        "id": 299,
        "source": 84,
        "target": 85,
        "value": 8,
        "relation": "SDXL Turbo accelerated image generation from SDXL"
    },
    {
        "id": 300,
        "source": 83,
        "target": 86,
        "value": 7,
        "relation": "IP-Adapter enhanced Stable Diffusion with image prompts"
    },
    {
        "id": 301,
        "source": 81,
        "target": 83,
        "value": 9,
        "relation": "Stable Diffusion built upon DDPM techniques"
    },
    {
        "id": 302,
        "source": 115,
        "target": 117,
        "value": 8,
        "relation": "MuZero's techniques influenced AlphaFold's development"
    },
    {
        "id": 303,
        "source": 42,
        "target": 61,
        "value": 8,
        "relation": "ELECTRA built upon optimizations from RoBERTa"
    },
    {
        "id": 304,
        "source": 44,
        "target": 52,
        "value": 8,
        "relation": "LLaMA was inspired by GPT's autoregressive modeling"
    },
    {
        "id": 305,
        "source": 46,
        "target": 53,
        "value": 8,
        "relation": "LLaMA 2 built upon insights from GPT-3"
    },
    {
        "id": 306,
        "source": 38,
        "target": 70,
        "value": 8,
        "relation": "mT5 is the multilingual version of T5"
    },
    {
        "id": 307,
        "source": 79,
        "target": 80,
        "value": 9,
        "relation": "StyleGAN3 further improved upon StyleGAN2"
    },
    {
        "id": 308,
        "source": 75,
        "target": 97,
        "value": 8,
        "relation": "Conditional GAN concepts used in DALL-E"
    },
    {
        "id": 309,
        "source": 95,
        "target": 98,
        "value": 9,
        "relation": "CLIP's embeddings integrated into DALL-E 2"
    },
    {
        "id": 310,
        "source": 43,
        "target": 105,
        "value": 7,
        "relation": "Advancements in DeBERTa influenced GPT-4V"
    },
    {
        "id": 311,
        "source": 83,
        "target": 87,
        "value": 9,
        "relation": "Stable Video Diffusion extended Stable Diffusion to video"
    },
    {
        "id": 312,
        "source": 103,
        "target": 105,
        "value": 7,
        "relation": "LLaVA's visual capabilities are similar to GPT-4V"
    },
    {
        "id": 313,
        "source": 12,
        "target": 26,
        "value": 8,
        "relation": "DINO's self-supervised methods used in EVA"
    },
    {
        "id": 314,
        "source": 95,
        "target": 100,
        "value": 8,
        "relation": "CLIP's multimodal approach influenced FLAMINGO"
    },
    {
        "id": 315,
        "source": 100,
        "target": 107,
        "value": 8,
        "relation": "FLAMINGO's methods contributed to Gemini Vision"
    },
    {
        "id": 316,
        "source": 46,
        "target": 58,
        "value": 8,
        "relation": "Claude 3 competes with GPT-3"
    },
    {
        "id": 317,
        "source": 47,
        "target": 58,
        "value": 9,
        "relation": "Claude 3 as an alternative to GPT-4"
    },
    {
        "id": 318,
        "source": 50,
        "target": 58,
        "value": 9,
        "relation": "Claude 3 improved upon Claude"
    },
    {
        "id": 319,
        "source": 48,
        "target": 49,
        "value": 9,
        "relation": "PaLM 2 improved upon PaLM"
    },
    {
        "id": 320,
        "source": 47,
        "target": 49,
        "value": 8,
        "relation": "PaLM 2 competes with GPT-4"
    },
    {
        "id": 321,
        "source": 51,
        "target": 48,
        "value": 8,
        "relation": "PaLM built upon LaMDA's conversational capabilities"
    },
    {
        "id": 322,
        "source": 51,
        "target": 49,
        "value": 8,
        "relation": "PaLM 2 enhanced LaMDA's dialogue abilities"
    },
    {
        "id": 323,
        "source": 58,
        "target": 106,
        "value": 9,
        "relation": "Claude 3 Vision extends Claude 3 with vision"
    },
    {
        "id": 324,
        "source": 46,
        "target": 97,
        "value": 8,
        "relation": "GPT-3's language model used in DALL-E's text processing"
    },
    {
        "id": 325,
        "source": 95,
        "target": 105,
        "value": 8,
        "relation": "CLIP's vision-language model influenced GPT-4V"
    },
    {
        "id": 326,
        "source": 105,
        "target": 57,
        "value": 8,
        "relation": "GPT-4V's capabilities contributed to Gemini"
    },
    {
        "id": 327,
        "source": 46,
        "target": 52,
        "value": 8,
        "relation": "LLaMA built upon GPT-3's architecture"
    },
    {
        "id": 328,
        "source": 52,
        "target": 53,
        "value": 9,
        "relation": "LLaMA 2 improved upon LLaMA"
    },
    {
        "id": 329,
        "source": 58,
        "target": 107,
        "value": 7,
        "relation": "Claude 3 Vision competes with Gemini Vision"
    },
    {
        "id": 330,
        "source": 49,
        "target": 104,
        "value": 8,
        "relation": "PaLM-E extended PaLM 2 with multimodal capabilities"
    },
    {
        "id": 331,
        "source": 108,
        "target": 58,
        "value": 7,
        "relation": "Whisper's speech models used in Claude 3"
    },
    {
        "id": 332,
        "source": 57,
        "target": 58,
        "value": 7,
        "relation": "Gemini competes with Claude 3"
    },
    {
        "id": 333,
        "source": 53,
        "target": 58,
        "value": 7,
        "relation": "LLaMA 2's methods influenced Claude 3"
    },
    {
        "id": 334,
        "source": 51,
        "target": 58,
        "value": 7,
        "relation": "LaMDA's dialogue capabilities inspired Claude 3"
    },
    {
        "id": 335,
        "source": 51,
        "target": 106,
        "value": 7,
        "relation": "LaMDA influenced Claude 3 Vision's development"
    },
    {
        "id": 336,
        "source": 95,
        "target": 58,
        "value": 8,
        "relation": "CLIP's techniques influenced Claude 3's multimodal abilities"
    },
    {
        "id": 337,
        "source": 103,
        "target": 58,
        "value": 7,
        "relation": "LLaVA's advancements related to Claude 3's vision"
    },
    {
        "id": 338,
        "source": 53,
        "target": 105,
        "value": 7,
        "relation": "LLaMA 2's improvements influenced GPT-4V"
    },
    {
        "id": 339,
        "source": 49,
        "target": 58,
        "value": 7,
        "relation": "PaLM 2 competes with Claude 3"
    },
    {
        "id": 340,
        "source": 15,
        "target": 16,
        "value": 9,
        "relation": "LeNet-5 improved and expanded LeNet-1"
    },
    {
        "id": 341,
        "source": 17,
        "target": 19,
        "value": 8,
        "relation": "GoogLeNet introduced inception modules after AlexNet"
    },
    {
        "id": 342,
        "source": 18,
        "target": 20,
        "value": 9,
        "relation": "ResNet addressed vanishing gradients in deep networks like VGGNet"
    },
    {
        "id": 343,
        "source": 20,
        "target": 27,
        "value": 8,
        "relation": "U-Net adapted ResNet's architecture for segmentation"
    },
    {
        "id": 344,
        "source": 20,
        "target": 29,
        "value": 8,
        "relation": "YOLO utilized CNN features inspired by ResNet"
    },
    {
        "id": 345,
        "source": 29,
        "target": 30,
        "value": 7,
        "relation": "MobileNetV1 applied YOLO's efficiency for mobile devices"
    },
    {
        "id": 346,
        "source": 17,
        "target": 35,
        "value": 6,
        "relation": "AlexNet's success influenced exploration in sequential models"
    },
    {
        "id": 347,
        "source": 37,
        "target": 81,
        "value": 7,
        "relation": "Transformers inspired attention mechanisms in diffusion models"
    },
    {
        "id": 348,
        "source": 20,
        "target": 83,
        "value": 7,
        "relation": "ResNet's concepts influenced Stable Diffusion's encoder"
    },
    {
        "id": 349,
        "source": 110,
        "target": 111,
        "value": 9,
        "relation": "PPO simplified and improved policy optimization"
    },
    {
        "id": 350,
        "source": 116,
        "target": 117,
        "value": 7,
        "relation": "AlphaStar's advancements inspired AlphaFold"
    },
    {
        "id": 351,
        "source": 36,
        "target": 109,
        "value": 7,
        "relation": "LSTM concepts applied in sequence prediction for DQN"
    },
    {
        "id": 352,
        "source": 95,
        "target": 83,
        "value": 8,
        "relation": "CLIP's text encoder used in Stable Diffusion"
    },
    {
        "id": 353,
        "source": 83,
        "target": 105,
        "value": 7,
        "relation": "Stable Diffusion's multimodality influenced GPT-4V"
    },
    {
        "id": 354,
        "source": 20,
        "target": 95,
        "value": 8,
        "relation": "ResNet used as image encoder in CLIP"
    },
    {
        "id": 355,
        "source": 81,
        "target": 97,
        "value": 7,
        "relation": "DDPM techniques influenced DALL-E's generation"
    },
    {
        "id": 356,
        "source": 45,
        "target": 83,
        "value": 7,
        "relation": "GPT-2's language modeling influenced text prompts in diffusion"
    },
    {
        "id": 357,
        "source": 52,
        "target": 83,
        "value": 6,
        "relation": "LLaMA's language understanding used in diffusion prompts"
    },
    {
        "id": 358,
        "source": 36,
        "target": 108,
        "value": 8,
        "relation": "LSTM's sequence processing foundational for Whisper"
    },
    {
        "id": 359,
        "source": 81,
        "target": 87,
        "value": 8,
        "relation": "DDPM's methods extended to video generation"
    },
    {
        "id": 360,
        "source": 29,
        "target": 34,
        "value": 7,
        "relation": "YOLO's object detection concepts influenced SAM"
    },
    {
        "id": 361,
        "source": 34,
        "target": 35,
        "value": 8,
        "relation": "SEEM extended SAM's segmentation capabilities"
    },
    {
        "id": 362,
        "source": 112,
        "target": 115,
        "value": 8,
        "relation": "AlphaGo's techniques evolved into MuZero"
    },
    {
        "id": 363,
        "source": 116,
        "target": 112,
        "value": 7,
        "relation": "AlphaStar built upon AlphaGo's reinforcement learning"
    },
    {
        "id": 364,
        "source": 37,
        "target": 116,
        "value": 7,
        "relation": "Transformers applied in AlphaStar's architecture"
    },
    {
        "id": 365,
        "source": 81,
        "target": 104,
        "value": 6,
        "relation": "DDPM's generative models inspired PaLM-E's multimodality"
    },
    {
        "id": 366,
        "source": 37,
        "target": 83,
        "value": 7,
        "relation": "Transformers' attention mechanisms inspired diffusion models"
    },
    {
        "id": 367,
        "source": 20,
        "target": 28,
        "value": 7,
        "relation": "SegNet built upon CNN architectures like ResNet"
    },
    {
        "id": 368,
        "source": 23,
        "target": 27,
        "value": 6,
        "relation": "ViT concepts applied in U-Net variants"
    },
    {
        "id": 369,
        "source": 23,
        "target": 81,
        "value": 7,
        "relation": "ViT used as encoder in some diffusion models"
    },
    {
        "id": 370,
        "source": 36,
        "target": 81,
        "value": 6,
        "relation": "LSTM's sequential processing influenced diffusion time steps"
    },
    {
        "id": 371,
        "source": 45,
        "target": 95,
        "value": 7,
        "relation": "GPT-2's language understanding influenced CLIP's text encoder"
    },
    {
        "id": 372,
        "source": 103,
        "target": 107,
        "value": 7,
        "relation": "LLaVA's methods influenced Gemini Vision"
    },
    {
        "id": 373,
        "source": 27,
        "target": 86,
        "value": 7,
        "relation": "U-Net architecture used in IP-Adapter"
    },
    {
        "id": 374,
        "source": 84,
        "target": 86,
        "value": 8,
        "relation": "IP-Adapter techniques applied in SDXL"
    },
    {
        "id": 375,
        "source": 8,
        "target": 9,
        "value": 8,
        "relation": "Beta-VAE modifies VAE to encourage disentangled representations"
    },
    {
        "id": 376,
        "source": 8,
        "target": 71,
        "value": 7,
        "relation": "VAEs and GANs are foundational generative models using different approaches"
    },
    {
        "id": 377,
        "source": 72,
        "target": 78,
        "value": 8,
        "relation": "StyleGAN built upon DCGAN for high-fidelity image synthesis"
    },
    {
        "id": 378,
        "source": 14,
        "target": 15,
        "value": 9,
        "relation": "LeNet-1 built upon Neocognitron's convolutional concepts"
    },
    {
        "id": 379,
        "source": 8,
        "target": 97,
        "value": 8,
        "relation": "VAE concepts contributed to DALL-E's generative modeling"
    },
    {
        "id": 380,
        "source": 71,
        "target": 97,
        "value": 8,
        "relation": "GAN techniques influenced DALL-E's image generation"
    },
    {
        "id": 381,
        "source": 41,
        "target": 66,
        "value": 8,
        "relation": "ALBERT reduces parameters of BERT using parameter sharing"
    },
    {
        "id": 382,
        "source": 41,
        "target": 67,
        "value": 8,
        "relation": "DistilBERT is a distilled version of BERT for efficiency"
    },
    {
        "id": 383,
        "source": 44,
        "target": 45,
        "value": 9,
        "relation": "GPT-2 scaled up GPT's capabilities"
    },
    {
        "id": 384,
        "source": 8,
        "target": 83,
        "value": 8,
        "relation": "VAE concepts contributed to Stable Diffusion's generative modeling"
    },
    {
        "id": 385,
        "source": 71,
        "target": 83,
        "value": 7,
        "relation": "GANs' generative techniques influenced Stable Diffusion"
    },
    {
        "id": 386,
        "source": 3,
        "target": 15,
        "value": 7,
        "relation": "LeNet-1 extended MLP concepts to images with convolution"
    },
    {
        "id": 387,
        "source": 27,
        "target": 87,
        "value": 7,
        "relation": "U-Net architecture used in Stable Video Diffusion"
    }
  ]
};
