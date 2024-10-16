//DELETED REDUNDANT/UNNECESSARY MODELS

export const MODELS = {
  "v1.x - Foundation Models": {
    "v1.0": {
      name: "McCulloch-Pitts Neuron",
      year: 1943,
      place: "Warren McCulloch and Walter Pitts",
      citation: 18434,
      explanation:
        "Introduced the first mathematical model of a neuron, laying the foundation for neural network research.",
    },
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
      place: "Alexey Ivakhnenko and Valentin Lapa",
      citation: 15000,
      explanation:
        "A feedforward artificial neural network with multiple layers of perceptrons. MLPs are capable of distinguishing data that is not linearly separable and form the foundation for deep learning.",
      "v1.2.1": {
        name: "Backpropagation Algorithm",
        year: 1986,
        place: "David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams",
        citation: 68000,
        explanation:
          "Introduced the backpropagation algorithm for training multi-layer neural networks.",
      },
    },
  },
  "v2.x - Memory-Based and Unsupervised Models": {
    "v2.3": {
      name: "Autoencoders and Self-Supervised Learning",
      "v2.3.1": {
        name: "Basic Autoencoder",
        explanation:
          "Neural network that learns to copy its input to output, useful for feature learning and dimensionality reduction.",
        year: 1986,
        place: "David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams",
      },

      "v2.3.3": {
        name: "Variational Autoencoder (VAE)",
        year: 2013,
        place: "Diederik P. Kingma and Max Welling",
        citation: 33500,
        explanation:
          "Probabilistic generative model that learns latent representations, enabling data generation.",
        "v2.3.3.1": {
          name: "β-VAE",
          year: 2017,
          place: "Irina Higgins et al.",
          citation: 3100,
          explanation:
            "Introduces a hyperparameter β to control disentanglement in learned representations.",
        },
      },
      "v2.3.4": {
        name: "Contrastive Learning Models",
        "v2.3.4.1": {
          name: "SimCLR",
          year: 2020,
          place: "Ting Chen et al., Google Research",
          citation: 4900,
          explanation:
            "Contrastive self-supervised learning method using data augmentations to learn representations.",
        },
        "v2.3.4.2": {
          name: "MoCo",
          year: 2020,
          place: "Kaiming He et al., Facebook AI Research",
          citation: 4300,
          explanation:
            "Contrastive learning method using a momentum encoder and queue for large dictionaries.",
        },
      },
      "v2.3.5": {
        name: "Self-Distillation Models",
        "v2.3.5.1": {
          name: "DINO",
          year: 2021,
          place: "Mathilde Caron et al., Facebook AI Research",
          citation: 1500,
          explanation:
            "Self-supervised method using knowledge distillation without labels to learn visual features.",
        },
        "v2.3.5.2": {
          name: "DINOv2",
          year: 2023,
          place: "Meta AI Research",
          citation: 100,
          explanation:
            "An improved version of DINO for self-supervised learning on larger datasets.",
        },
      },
    },
  },
  "v3.x - Convolutional Neural Networks": {
    "v3.1": {
      name: "LeNet Family",
      "v3.1.1": {
        name: "LeNet-1",
        year: 1990,
        place: "Yann LeCun et al., AT&T Bell Laboratories",
        citation: 3500,
        explanation:
          "One of the earliest convolutional neural networks, designed for handwritten and machine-printed character recognition. It introduced the basic structure of convolutional layers followed by subsampling layers.",
      },
      "v3.1.2": {
        name: "LeNet-5",
        year: 1998,
        place: "Yann LeCun et al.",
        citation: 21100,
        explanation:
          "Pioneering convolutional neural network for handwritten digit recognition, demonstrating the effectiveness of CNNs.",
      },
    },
    "v3.2": {
      name: "Modern CNNs",
      "v3.2.1": {
        name: "AlexNet",
        year: 2012,
        place:
          "Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton, University of Toronto",
        citation: 133930,
        explanation:
          "First deep CNN to win ImageNet competition, sparking renewed interest in deep learning.",
      },
      "v3.2.2": {
        name: "VGGNet",
        year: 2014,
        place: "Karen Simonyan, Andrew Zisserman, University of Oxford",
        citation: 85800,
        explanation:
          "Demonstrated that increasing depth with small convolution filters improves performance.",
      },
      "v3.2.3": {
        name: "GoogLeNet",
        year: 2014,
        place: "Christian Szegedy et al., Google",
        citation: 63000,
        explanation:
          "Introduced Inception modules to improve computational efficiency and depth.",
      },
      "v3.2.4": {
        name: "ResNet",
        year: 2015,
        place: "Kaiming He et al., Microsoft Research",
        citation: 202000,
        explanation:
          "Introduced residual connections to train very deep networks, enabling networks over 100 layers.",
      },
      "v3.2.5": {
        name: "DenseNet",
        year: 2017,
        place: "Gao Huang et al.",
        citation: 21800,
        explanation:
          "Connected each layer to every other layer to promote feature reuse and reduce parameters.",
      },
      "v3.2.6": {
        name: "EfficientNet",
        year: 2019,
        place: "Mingxing Tan and Quoc V. Le, Google AI",
        citation: 9500,
        explanation:
          "Scaled networks using a compound coefficient to balance network depth, width, and resolution.",
      },
    },
    "v3.3": {
      name: "Vision Transformers (ViT)",
      "v3.3.1": {
        name: "Vision Transformer (ViT)",
        year: 2020,
        place: "Alexey Dosovitskiy et al., Google Research",
        citation: 18500,
        explanation:
          "Applied Transformer architecture to image recognition tasks, treating images as sequences of patches.",
      },
      "v3.3.2": {
        name: "Swin Transformer",
        year: 2021,
        place: "Ze Liu et al., Microsoft Research",
        citation: 6100,
        explanation:
          "Hierarchical Transformer using shifted windows for computer vision tasks.",
      },
      "v3.3.3": {
        name: "DeiT",
        year: 2021,
        place: "Hugo Touvron et al., Facebook AI",
        citation: 4000,
        explanation:
          "Improved training methods to make ViT models data-efficient.",
      },
    },
    "v3.4": {
      name: "Advanced CNN Architectures",
      "v3.4.1": {
        name: "U-Net",
        year: 2015,
        place: "Olaf Ronneberger et al., University of Freiburg",
        citation: 45000,
        explanation:
          "Introduced skip connections between encoder and decoder, important for image segmentation tasks, particularly in medical imaging.",
      },
      "v3.4.2": {
        name: "SegNet",
        year: 2015,
        place: "Vijay Badrinarayanan et al., University of Cambridge",
        citation: 8000,
        explanation:
          "Deep convolutional encoder-decoder architecture for image segmentation.",
      },
      "v3.4.3": {
        name: "YOLO (You Only Look Once)",
        year: 2016,
        place: "Joseph Redmon et al., University of Washington",
        citation: 26000,
        explanation:
          "Real-time object detection system, important for computer vision tasks.",
      },
    },
  },
  "v4.x - Sequence Models and Transformers": {
    "v4.0": {
      name: "Recurrent Neural Networks (RNNs)",
      "v4.0.1": {
        name: "RNN (Recurrent Neural Network)",
        year: 1990,
        place: "Jeffrey Elman",
        citation: 16800,
        explanation:
          "Introduced context units to retain state information, allowing for processing sequences.",
      },
      "v4.0.2": {
        name: "Long Short-Term Memory (LSTM)",
        year: 1997,
        place: "Sepp Hochreiter and Jürgen Schmidhuber",
        citation: 75400,
        explanation:
          "Addressed the vanishing gradient problem in RNNs, enabling learning of long-term dependencies.",
        "v4.0.2.1": {
          name: "Peephole LSTM",
          year: 2000,
          place: "Felix A. Gers et al.",
          citation: 5200,
          explanation:
            "Extended LSTM by adding peephole connections, allowing internal states to influence gates.",
        },
        "v4.0.2.2": {
          name: "Bidirectional LSTM",
          year: 2005,
          place: "Alex Graves and Jürgen Schmidhuber",
          citation: 22000,
          explanation:
            "Processes data in both forward and backward directions to capture context from both sides.",
        },
      },
      "v4.0.3": {
        name: "Gated Recurrent Unit (GRU)",
        year: 2014,
        place: "Kyunghyun Cho et al.",
        citation: 16700,
        explanation:
          "Simplified version of LSTM with fewer parameters, efficient for sequence modeling.",
      },
    },
    "v4.1": {
      name: "Attention Mechanisms",
      "v4.1.1": {
        name: "Basic Attention",
        year: 2014,
        place: "Dzmitry Bahdanau et al.",
        citation: 34500,
        explanation:
          "Introduced attention for machine translation, allowing models to focus on relevant parts of input.",
      },
      "v4.1.2": {
        name: "Self-Attention",
        year: 2017,
        place: "Ashish Vaswani et al.",
        citation: 110000,
        explanation:
          "Mechanism where different positions of a single sequence are related to compute representations.",
      },
    },
    "v4.2": {
      name: "Transformer Architecture",
      year: 2017,
      place: "Ashish Vaswani et al., Google Brain",
      citation: 110000,
      explanation:
        "Introduced self-attention mechanisms and eliminated recurrence, revolutionizing sequence modeling.",
      "v4.2.1": {
        name: "Encoder-Decoder Transformers",
        "v4.2.1.2": {
          name: "T5",
          year: 2019,
          place: "Colin Raffel et al., Google Research",
          citation: 9500,
          explanation:
            "Unified NLP tasks into a text-to-text format, using a large-scale pre-trained model.",
        },
        "v4.2.1.3": {
          name: "BART",
          year: 2019,
          place: "Mike Lewis et al., Facebook AI",
          citation: 4900,
          explanation:
            "Combined BERT and GPT architectures, effective for text generation and comprehension.",
        },
      },
      "v4.2.2": {
        name: "Encoder-Only Models",
        "v4.2.2.1": {
          name: "BERT",
          year: 2018,
          place: "Jacob Devlin et al., Google AI Language",
          citation: 67300,
          explanation:
            "Pre-trained deep bidirectional representations, setting state-of-the-art on multiple NLP tasks.",
        },
        "v4.2.2.2": {
          name: "RoBERTa",
          year: 2019,
          place: "Yinhan Liu et al., Facebook AI",
          citation: 9100,
          explanation:
            "Optimized BERT's pretraining procedure for better performance.",
        },
      },
      "v4.2.3": {
        name: "Decoder-Only Models",
        "v4.2.3.1": {
          name: "GPT",
          year: 2018,
          place: "Alec Radford et al., OpenAI",
          citation: 13500,
          explanation:
            "Introduced unsupervised pre-training for language models using Transformer decoder.",
        },
        "v4.2.3.2": {
          name: "GPT-2",
          year: 2019,
          place: "Alec Radford et al., OpenAI",
          citation: 15500,
          explanation:
            "Scaled-up GPT model, capable of generating coherent and contextually relevant text.",
        },
        "v4.2.3.3": {
          name: "GPT-3",
          year: 2020,
          place: "Tom B. Brown et al., OpenAI",
          citation: 7000,
          explanation:
            "Large-scale language model with 175 billion parameters, demonstrating strong few-shot learning.",
        },
        "v4.2.3.4": {
          name: "GPT-4",
          year: 2023,
          place: "OpenAI",
          citation: 100,
          explanation:
            "Advanced language model with improved reasoning and understanding capabilities.",
        },
        "v4.2.3.5": {
          name: "PaLM",
          year: 2022,
          place: "Wei et al., Google Research",
          citation: 2000,
          explanation:
            "540-billion parameter Transformer model demonstrating strong performance across tasks.",
        },
        "v4.2.3.6": {
          name: "PaLM 2",
          year: 2023,
          place: "Google",
          citation: 100,
          explanation:
            "An updated version of PaLM with enhanced multilingual, reasoning, and coding capabilities.",
        },
        "v4.2.3.7": {
          name: "Open-Source Models",
          "v4.2.3.7.1": {
            name: "LLaMA",
            year: 2023,
            place: "Hugo Touvron et al., Meta AI",
            citation: 700,
            explanation:
              "A collection of foundation language models ranging from 7B to 65B parameters, open-sourced.",
          },
          "v4.2.3.7.2": {
            name: "Falcon LLM",
            year: 2023,
            place: "Technology Innovation Institute, UAE",
            citation: 200,
            explanation:
              "An open-source language model trained on high-quality data, competing with larger proprietary models.",
          },
        },
      },
    },
    "v4.3": {
      name: "Advanced Transformer Variants",
      "v4.3.1": {
        name: "Transformer-XL",
        year: 2019,
        place: "Zihang Dai et al., Carnegie Mellon University and Google Brain",
        citation: 2500,
        explanation:
          "Extended the Transformer architecture to handle longer sequences, introduced relative positional encodings.",
      },
      "v4.3.2": {
        name: "XLNet",
        year: 2019,
        place: "Zhilin Yang et al., Carnegie Mellon University and Google AI",
        citation: 3800,
        explanation:
          "Generalized autoregressive pretraining method, overcame limitations of BERT by using permutation language modeling.",
      },
      "v4.3.3": {
        name: "ELECTRA",
        year: 2020,
        place: "Kevin Clark et al., Stanford University and Google Research",
        citation: 1800,
        explanation:
          "More sample-efficient pretraining method for language models, uses a discriminative model to predict whether tokens are original or replaced.",
      },
      "v4.3.4": {
        name: "Switch Transformer",
        year: 2021,
        place: "William Fedus et al., Google Research",
        citation: 700,
        explanation:
          "Introduced the concept of sparsely-activated models, achieved trillion-parameter models through conditional computation.",
      },
      "v4.3.5": {
        name: "ALBERT",
        year: 2019,
        place: "Zhenzhong Lan et al., Google Research",
        citation: 4500,
        explanation:
          "A Lite BERT for self-supervised learning of language representations, introduced parameter sharing to reduce model size.",
      },
      "v4.3.6": {
        name: "DistilBERT",
        year: 2019,
        place: "Victor Sanh et al., Hugging Face",
        citation: 2800,
        explanation:
          "A distilled version of BERT, smaller and faster while retaining BERT's language understanding capabilities.",
      },
      "v4.3.7": {
        name: "BigBird",
        year: 2020,
        place: "Manzil Zaheer et al., Google Research",
        citation: 700,
        explanation:
          "Extended Transformer's attention mechanism to handle longer sequences, used a mix of different attention patterns.",
      },
      "v4.3.8": {
        name: "Reformer",
        year: 2020,
        place: "Nikita Kitaev et al., Google Research",
        citation: 1000,
        explanation:
          "Improved Transformer efficiency for long sequences, used locality-sensitive hashing for attention computation.",
      },
      "v4.3.9": {
        name: "Longformer",
        year: 2020,
        place: "Iz Beltagy et al., Allen Institute for AI",
        citation: 1200,
        explanation:
          "Another approach to extend Transformer's context length, used a combination of sliding window and global attention.",
      },
    },
    "v4.4": {
      name: "Multilingual and Cross-lingual Models",
      "v4.4.1": {
        name: "ERNIE",
        year: 2019,
        place: "Yu Sun et al., Baidu",
        citation: 800,
        explanation:
          "Enhanced Representation through Knowledge Integration, incorporated external knowledge into pretraining.",
      },
      "v4.4.2": {
        name: "XLM",
        year: 2019,
        place: "Guillaume Lample and Alexis Conneau, Facebook AI Research",
        citation: 1500,
        explanation:
          "Cross-lingual Language Model Pretraining, important for multilingual NLP tasks.",
      },
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
      "v5.0.1": {
        name: "Original GAN",
        year: 2014,
        place: "Ian Goodfellow et al., University of Montreal",
        citation: 66600,
        explanation:
          "The foundational GAN model proposing the adversarial training framework.",
      },
      "v5.0.2": {
        name: "Architectural Variants",
        "v5.0.2.1": {
          name: "DCGAN",
          year: 2015,
          place: "Alec Radford, Luke Metz, Soumith Chintala",
          citation: 23900,
          explanation:
            "Deep Convolutional GAN; introduced convolutional architectures to GANs for improved image generation.",
        },
        "v5.0.2.2": {
          name: "WGAN",
          year: 2017,
          place: "Martin Arjovsky, Soumith Chintala, Léon Bottou",
          citation: 11700,
          explanation:
            "Wasserstein GAN; addressed instability in GAN training by using Wasserstein distance.",
        },
        "v5.0.2.3": {
          name: "Progressive GAN",
          year: 2018,
          place: "Tero Karras et al., NVIDIA",
          citation: 6500,
          explanation:
            "Progressive Growing of GANs; improved high-resolution image generation by progressively increasing resolution during training.",
        },
      },
      "v5.0.3": {
        name: "Conditional Variants",
        "v5.0.3.1": {
          name: "Conditional GAN",
          year: 2014,
          place: "Mehdi Mirza and Simon Osindero",
          citation: 11300,
          explanation:
            "Extended GANs to condition on auxiliary information like class labels.",
        },
        "v5.0.3.2": {
          name: "CycleGAN",
          year: 2017,
          place: "Jun-Yan Zhu et al., UC Berkeley",
          citation: 16900,
          explanation:
            "Unpaired image-to-image translation using cycle-consistent adversarial networks.",
        },
      },
      "v5.0.4": {
        name: "StyleGAN Family",
        "v5.0.4.1": {
          name: "StyleGAN",
          year: 2019,
          place: "Tero Karras et al., NVIDIA",
          citation: 12300,
          explanation:
            "Introduced style-based generator architecture, enabling control over image synthesis at different levels.",
        },
        "v5.0.4.2": {
          name: "StyleGAN2",
          year: 2020,
          place: "Tero Karras et al., NVIDIA",
          citation: 6200,
          explanation:
            "Improved upon StyleGAN by addressing artifacts and enhancing image quality.",
        },
        "v5.0.4.3": {
          name: "StyleGAN3",
          year: 2021,
          place: "Tero Karras et al., NVIDIA",
          citation: 1000,
          explanation:
            "Further improvements in image synthesis, addressing aliasing issues and enabling better consistency.",
        },
      },
    },
    "v5.1": {
      name: "Diffusion Models",
      "v5.1.1": {
        name: "Denoising Diffusion Probabilistic Models (DDPM)",
        year: 2020,
        place: "Jonathan Ho, Ajay Jain, Pieter Abbeel",
        citation: 3400,
        explanation:
          "Introduced diffusion models for image generation, matching or surpassing GAN performance.",
      },
      "v5.1.2": {
        name: "Latent Diffusion Models",
        "v5.1.2.1": {
          name: "Stable Diffusion",
          year: 2022,
          place: "Robin Rombach et al., LMU Munich and Stability AI",
          citation: 800,
          explanation:
            "An efficient diffusion model operating in latent space, enabling high-resolution image synthesis with reduced computational cost.",
        },
      },
    },
    "v5.2": {
      name: "Neural Rendering and 3D Models",
      "v5.2.1": {
        name: "Neural Radiance Fields (NeRF)",
        year: 2020,
        place: "Ben Mildenhall et al., UC Berkeley",
        citation: 5600,
        explanation:
          "A method for representing 3D scenes using neural networks, enabling novel view synthesis from 2D images.",
      },
    },
  },
  "v6.x - Hybrid and Multimodal Models": {
    "v6.0": {
      name: "Early Multimodal Models",
      "v6.0.1": {
        name: "Show and Tell",
        year: 2015,
        place: "Oriol Vinyals et al., Google",
        citation: 8700,
        explanation:
          "An image captioning model combining CNNs and RNNs to generate descriptive sentences from images.",
      },
      "v6.0.2": {
        name: "Visual Question Answering (VQA) Models",
        year: 2015,
        place: "Aishwarya Agrawal et al., Virginia Tech",
        citation: 5200,
        explanation:
          "Models designed to answer questions about images by combining visual and textual understanding.",
      },
    },
    "v6.1": {
      name: "Contrastive Multimodal Models",
      "v6.1.1": {
        name: "CLIP",
        year: 2021,
        place: "Alec Radford et al., OpenAI",
        citation: 6500,
        explanation:
          "Contrastive Language-Image Pre-training; learned visual representations from natural language supervision.",
      },
    },
    "v6.2": {
      name: "Generative Multimodal Models",
      "v6.2.1": {
        name: "DALL-E",
        year: 2021,
        place: "Aditya Ramesh et al., OpenAI",
        citation: 3800,
        explanation:
          "A generative model that creates images from textual descriptions using a Transformer architecture.",
      },
      "v6.2.2": {
        name: "DALL-E 2",
        year: 2022,
        place: "Aditya Ramesh et al., OpenAI",
        citation: 900,
        explanation:
          "Improved version of DALL-E with higher resolution and greater photorealism.",
      },
      "v6.2.3": {
        name: "Stable Diffusion",
        year: 2022,
        place: "Robin Rombach et al., LMU Munich and Stability AI",
        citation: 800,
        explanation:
          "A latent diffusion model capable of generating high-quality images from text prompts.",
      },
    },
    "v6.3": {
      name: "Advanced Multimodal Models",
      "v6.3.1": {
        name: "PaLM-E",
        year: 2023,
        place: "Google Research",
        citation: 50,
        explanation:
          "An embodied multimodal language model combining vision and language for robotic control.",
      },
      "v6.3.2": {
        name: "GPT-4V",
        year: 2023,
        place: "OpenAI",
        citation: 100,
        explanation:
          "An extension of GPT-4 capable of processing and generating visual content along with text.",
      },
    },
  },
  "v7.x - Reinforcement Learning and Advanced AI Systems": {
    "v7.0": {
      name: "Deep Reinforcement Learning",
      "v7.0.1": {
        name: "Deep Q-Network (DQN)",
        year: 2015,
        place: "Volodymyr Mnih et al., DeepMind",
        citation: 33000,
        explanation:
          "Combined Q-learning with deep neural networks to play Atari games directly from pixels.",
      },
      "v7.0.2": {
        name: "Asynchronous Advantage Actor-Critic (A3C)",
        year: 2016,
        place: "Volodymyr Mnih et al., DeepMind",
        citation: 10000,
        explanation:
          "Introduced a parallelized approach to training RL agents, improving stability and speed.",
      },
    },
    "v7.1": {
      name: "Mastery in Complex Games",
      "v7.1.1": {
        name: "AlphaGo",
        year: 2016,
        place: "David Silver et al., DeepMind",
        citation: 13000,
        explanation:
          "First program to defeat a professional human Go player, combining deep neural networks and tree search.",
      },
      "v7.1.2": {
        name: "AlphaZero",
        year: 2017,
        place: "David Silver et al., DeepMind",
        citation: 8000,
        explanation:
          "Generalized AlphaGo to learn without human data, mastering chess, shogi, and Go.",
      },
      "v7.1.3": {
        name: "MuZero",
        year: 2019,
        place: "Julian Schrittwieser et al., DeepMind",
        citation: 2100,
        explanation:
          "Learned a model of the environment dynamics, achieving superhuman performance in games without knowing the rules.",
      },
    },
  },
  "v8.x - Specialized Architectures and Applications": {
    "v8.0": {
      name: "Efficiency-Focused Models",
      "v8.0.1": {
        name: "MobileNet",
        year: 2017,
        place: "Andrew G. Howard et al., Google",
        citation: 16500,
        explanation:
          "Designed for mobile and embedded vision applications with reduced computational cost.",
      },
      "v8.0.2": {
        name: "EfficientNet",
        year: 2019,
        place: "Mingxing Tan and Quoc V. Le, Google AI",
        citation: 9500,
        explanation:
          "Scaled networks using a compound coefficient to balance network depth, width, and resolution.",
      },
    },
    "v8.1": {
      name: "Self-Supervised Vision Models",
      "v8.1.1": {
        name: "SimCLR",
        year: 2020,
        place: "Ting Chen et al., Google Research",
        citation: 4900,
        explanation:
          "Contrastive self-supervised learning method using data augmentations to learn representations.",
      },
      "v8.1.2": {
        name: "MoCo",
        year: 2020,
        place: "Kaiming He et al., Facebook AI Research",
        citation: 4300,
        explanation:
          "Contrastive learning method using a momentum encoder and queue for large dictionaries.",
      },
      "v8.1.3": {
        name: "DINO",
        year: 2021,
        place: "Mathilde Caron et al., Facebook AI Research",
        citation: 1500,
        explanation:
          "Self-supervised method using knowledge distillation without labels to learn visual features.",
      },
      "v8.1.4": {
        name: "DINOv2",
        year: 2023,
        place: "Meta AI Research",
        citation: 100,
        explanation:
          "An improved version of DINO for self-supervised learning on larger datasets.",
      },
    },
    "v8.2": {
      name: "Other Specialized Models",
      "v8.2.1": {
        name: "Neural Architecture Search (NAS) Models",
        year: 2016,
        place: "Barret Zoph and Quoc V. Le, Google Brain",
        citation: 4100,
        explanation:
          "Automated method to discover neural network architectures optimized for specific tasks.",
      },
      "v8.2.2": {
        name: "Graph Neural Networks (GNNs)",
        year: 2009,
        place: "Franco Scarselli et al.",
        citation: 6200,
        explanation:
          "Neural networks designed to operate on graph-structured data, useful in various domains like social networks and chemistry.",
      },
    },
    "v8.3": {
      name: "Novel Architectures",
      "v8.3.1": {
        name: "Capsule Networks (CapsNet)",
        year: 2017,
        place: "Geoffrey Hinton et al., Google Brain",
        citation: 4000,
        explanation:
          "Introduced by Geoffrey Hinton to address limitations of CNNs, uses groups of neurons (capsules) to represent spatial relationships.",
      },
    },
  },
  "v9.x - Advanced NLP Models": {
    "v9.0": {
      name: "Contextual Word Embeddings",
      "v9.0.1": {
        name: "ELMo",
        year: 2018,
        place: "Matthew E. Peters et al., Allen Institute for AI",
        citation: 13000,
        explanation:
          "Embeddings from Language Models, introduced contextual word embeddings.",
      },
    },
    "v9.1": {
      name: "Transfer Learning in NLP",
      "v9.1.1": {
        name: "ULMFiT",
        year: 2018,
        place: "Jeremy Howard and Sebastian Ruder",
        citation: 3500,
        explanation:
          "Universal Language Model Fine-tuning, introduced effective transfer learning techniques for NLP.",
      },
    },
  },
};

export const ARRAY = [
  "McCulloch-Pitts Neuron",
  "Perceptron",
  "Multi-Layer Perceptron (MLP)",
  "Backpropagation Algorithm",
  "Basic Autoencoder",
  "Variational Autoencoder (VAE)",
  "β-VAE",
  "SimCLR",
  "MoCo",
  "DINO",
  "DINOv2",
  "LeNet-1",
  "LeNet-5",
  "AlexNet",
  "VGGNet",
  "GoogLeNet",
  "ResNet",
  "DenseNet",
  "EfficientNet",
  "Vision Transformer (ViT)",
  "Swin Transformer",
  "DeiT",
  "U-Net",
  "SegNet",
  "YOLO (You Only Look Once)",
  "RNN (Recurrent Neural Network)",
  "Long Short-Term Memory (LSTM)",
  "Peephole LSTM",
  "Bidirectional LSTM",
  "Gated Recurrent Unit (GRU)",
  "Basic Attention",
  "Self-Attention",
  "Transformer Architecture",
  "T5",
  "BART",
  "BERT",
  "RoBERTa",
  "GPT",
  "GPT-2",
  "GPT-3",
  "GPT-4",
  "PaLM",
  "PaLM 2",
  "LLaMA",
  "Falcon LLM",
  "Transformer-XL",
  "XLNet",
  "ELECTRA",
  "Switch Transformer",
  "ALBERT",
  "DistilBERT",
  "BigBird",
  "Reformer",
  "Longformer",
  "ERNIE",
  "XLM",
  "Generative Adversarial Networks (GANs)",
  "Original GAN",
  "DCGAN",
  "WGAN",
  "Progressive GAN",
  "Conditional GAN",
  "CycleGAN",
  "StyleGAN",
  "StyleGAN2",
  "StyleGAN3",
  "Denoising Diffusion Probabilistic Models (DDPM)",
  "Stable Diffusion",
  "Neural Radiance Fields (NeRF)",
  "Show and Tell",
  "Visual Question Answering (VQA) Models",
  "CLIP",
  "DALL-E",
  "DALL-E 2",
  "Stable Diffusion",
  "PaLM-E",
  "GPT-4V",
  "Deep Q-Network (DQN)",
  "Asynchronous Advantage Actor-Critic (A3C)",
  "AlphaGo",
  "AlphaZero",
  "MuZero",
  "MobileNet",
  "EfficientNet",
  "SimCLR",
  "MoCo",
  "DINO",
  "DINOv2",
  "Neural Architecture Search (NAS) Models",
  "Graph Neural Networks (GNNs)",
  "Capsule Networks (CapsNet)",
  "ELMo",
  "ULMFiT",
];

export const OBJECT_ARRAY = [
  {
    name: "McCulloch-Pitts Neuron",
    version: "v1.0",
  },
  {
    name: "Perceptron",
    version: "v1.1",
  },
  {
    name: "Multi-Layer Perceptron (MLP)",
    version: "v1.2",
  },
  {
    name: "Backpropagation Algorithm",
    version: "v1.2.1",
  },
  {
    name: "Basic Autoencoder",
    version: "v2.3.1",
  },
  {
    name: "Variational Autoencoder (VAE)",
    version: "v2.3.3",
  },
  {
    name: "β-VAE",
    version: "v2.3.3.1",
  },
  {
    name: "SimCLR",
    version: "v2.3.4.1",
  },
  {
    name: "MoCo",
    version: "v2.3.4.2",
  },
  {
    name: "DINO",
    version: "v2.3.5.1",
  },
  {
    name: "DINOv2",
    version: "v2.3.5.2",
  },
  {
    name: "LeNet-1",
    version: "v3.1.1",
  },
  {
    name: "LeNet-5",
    version: "v3.1.2",
  },
  {
    name: "AlexNet",
    version: "v3.2.1",
  },
  {
    name: "VGGNet",
    version: "v3.2.2",
  },
  {
    name: "GoogLeNet",
    version: "v3.2.3",
  },
  {
    name: "ResNet",
    version: "v3.2.4",
  },
  {
    name: "DenseNet",
    version: "v3.2.5",
  },
  {
    name: "EfficientNet",
    version: "v3.2.6",
  },
  {
    name: "Vision Transformer (ViT)",
    version: "v3.3.1",
  },
  {
    name: "Swin Transformer",
    version: "v3.3.2",
  },
  {
    name: "DeiT",
    version: "v3.3.3",
  },
  {
    name: "U-Net",
    version: "v3.4.1",
  },
  {
    name: "SegNet",
    version: "v3.4.2",
  },
  {
    name: "YOLO (You Only Look Once)",
    version: "v3.4.3",
  },
  {
    name: "RNN (Recurrent Neural Network)",
    version: "v4.0.1",
  },
  {
    name: "Long Short-Term Memory (LSTM)",
    version: "v4.0.2",
  },
  {
    name: "Peephole LSTM",
    version: "v4.0.2.1",
  },
  {
    name: "Bidirectional LSTM",
    version: "v4.0.2.2",
  },
  {
    name: "Gated Recurrent Unit (GRU)",
    version: "v4.0.3",
  },
  {
    name: "Basic Attention",
    version: "v4.1.1",
  },
  {
    name: "Self-Attention",
    version: "v4.1.2",
  },
  {
    name: "Transformer Architecture",
    version: "v4.2",
  },
  {
    name: "T5",
    version: "v4.2.1.2",
  },
  {
    name: "BART",
    version: "v4.2.1.3",
  },
  {
    name: "BERT",
    version: "v4.2.2.1",
  },
  {
    name: "RoBERTa",
    version: "v4.2.2.2",
  },
  {
    name: "GPT",
    version: "v4.2.3.1",
  },
  {
    name: "GPT-2",
    version: "v4.2.3.2",
  },
  {
    name: "GPT-3",
    version: "v4.2.3.3",
  },
  {
    name: "GPT-4",
    version: "v4.2.3.4",
  },
  {
    name: "PaLM",
    version: "v4.2.3.5",
  },
  {
    name: "PaLM 2",
    version: "v4.2.3.6",
  },
  {
    name: "LLaMA",
    version: "v4.2.3.7.1",
  },
  {
    name: "Falcon LLM",
    version: "v4.2.3.7.2",
  },
  {
    name: "Transformer-XL",
    version: "v4.3.1",
  },
  {
    name: "XLNet",
    version: "v4.3.2",
  },
  {
    name: "ELECTRA",
    version: "v4.3.3",
  },
  {
    name: "Switch Transformer",
    version: "v4.3.4",
  },
  {
    name: "ALBERT",
    version: "v4.3.5",
  },
  {
    name: "DistilBERT",
    version: "v4.3.6",
  },
  {
    name: "BigBird",
    version: "v4.3.7",
  },
  {
    name: "Reformer",
    version: "v4.3.8",
  },
  {
    name: "Longformer",
    version: "v4.3.9",
  },
  {
    name: "ERNIE",
    version: "v4.4.1",
  },
  {
    name: "XLM",
    version: "v4.4.2",
  },
  {
    name: "Generative Adversarial Networks (GANs)",
    version: "v5.0",
  },
  {
    name: "Original GAN",
    version: "v5.0.1",
  },
  {
    name: "DCGAN",
    version: "v5.0.2.1",
  },
  {
    name: "WGAN",
    version: "v5.0.2.2",
  },
  {
    name: "Progressive GAN",
    version: "v5.0.2.3",
  },
  {
    name: "Conditional GAN",
    version: "v5.0.3.1",
  },
  {
    name: "CycleGAN",
    version: "v5.0.3.2",
  },
  {
    name: "StyleGAN",
    version: "v5.0.4.1",
  },
  {
    name: "StyleGAN2",
    version: "v5.0.4.2",
  },
  {
    name: "StyleGAN3",
    version: "v5.0.4.3",
  },
  {
    name: "Denoising Diffusion Probabilistic Models (DDPM)",
    version: "v5.1.1",
  },
  {
    name: "Stable Diffusion",
    version: "v5.1.2.1",
  },
  {
    name: "Neural Radiance Fields (NeRF)",
    version: "v5.2.1",
  },
  {
    name: "Show and Tell",
    version: "v6.0.1",
  },
  {
    name: "Visual Question Answering (VQA) Models",
    version: "v6.0.2",
  },
  {
    name: "CLIP",
    version: "v6.1.1",
  },
  {
    name: "DALL-E",
    version: "v6.2.1",
  },
  {
    name: "DALL-E 2",
    version: "v6.2.2",
  },
  {
    name: "Stable Diffusion",
    version: "v6.2.3",
  },
  {
    name: "PaLM-E",
    version: "v6.3.1",
  },
  {
    name: "GPT-4V",
    version: "v6.3.2",
  },
  {
    name: "Deep Q-Network (DQN)",
    version: "v7.0.1",
  },
  {
    name: "Asynchronous Advantage Actor-Critic (A3C)",
    version: "v7.0.2",
  },
  {
    name: "AlphaGo",
    version: "v7.1.1",
  },
  {
    name: "AlphaZero",
    version: "v7.1.2",
  },
  {
    name: "MuZero",
    version: "v7.1.3",
  },
  {
    name: "MobileNet",
    version: "v8.0.1",
  },
  {
    name: "EfficientNet",
    version: "v8.0.2",
  },
  {
    name: "SimCLR",
    version: "v8.1.1",
  },
  {
    name: "MoCo",
    version: "v8.1.2",
  },
  {
    name: "DINO",
    version: "v8.1.3",
  },
  {
    name: "DINOv2",
    version: "v8.1.4",
  },
  {
    name: "Neural Architecture Search (NAS) Models",
    version: "v8.2.1",
  },
  {
    name: "Graph Neural Networks (GNNs)",
    version: "v8.2.2",
  },
  {
    name: "Capsule Networks (CapsNet)",
    version: "v8.3.1",
  },
  {
    name: "ELMo",
    version: "v9.0.1",
  },
  {
    name: "ULMFiT",
    version: "v9.1.1",
  },
];
