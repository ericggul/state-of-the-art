export const MODELS = {
  "v1.x - Foundation Models": {
    "v1.0": {
      name: "McCulloch-Pitts Neuron",
      year: 1943,
      place: "U.S. Department of Commerce",
      citation: 31925,
      category: "basic_nn",
      explanation:
        "Introduced the first mathematical model of a neuron, laying the foundation for neural network research.",
    },
    "v1.1": {
      name: "Perceptron",
      year: 1958,
      place: "Cornell Aeronautical Laboratory",
      citation: 20597,
      category: "basic_nn",
      explanation:
        "Introduced the perceptron algorithm, the first trainable neural network using supervised learning.",
    },
    "v1.2": {
      name: "Multi-Layer Perceptron (MLP)",
      year: 1965,
      place: "U.S. Department of Commerce",
      citation: 404,
      category: "basic_nn",
      explanation:
        "A feedforward artificial neural network with multiple layers of perceptrons. MLPs are capable of distinguishing data that is not linearly separable and form the foundation for deep learning.",
      "v1.2.1": {
        name: "Backpropagation Algorithm",
        year: 1986,
        place: "UCSD",
        citation: 40430,
        explanation:
          "Introduced the backpropagation algorithm for training multi-layer neural networks.",
        category: "basic_nn",
      },
    },
  },
  "v2.x - Memory-Based and Unsupervised Models": {
    "v2.0": {
      name: "Basic Neural Learning",
      "v2.0.1": {
        name: "Hopfield Network",
        year: 1982,
        place: "California Institute of Technology",
        citation: 28105,
        explanation:
          "Introduced recurrent neural networks for associative memory and optimization.",
        category: "hopfield_boltzmann",
      },
      "v2.0.2": {
        name: "Boltzmann Machine",
        year: 1985,
        place: "Carnegie-Mellon University",
        citation: 5916,
        explanation:
          "Early stochastic recurrent neural network capable of learning internal representations.",
        category: "hopfield_boltzmann",
      },
    },
    "v2.1": {
      name: "Autoencoders and Self-Supervised Learning",
      "v2.1.1": {
        name: "Basic Autoencoder",
        year: 1986,
        place: "University of Toronto",
        citation: 23900,
        explanation:
          "Neural network that learns to copy its input to output, useful for feature learning and dimensionality reduction.",
        category: "vae",
      },
      "v2.1.2": {
        name: "Variational Autoencoder (VAE)",
        year: 2013,
        place: "Universiteit van Amsterdam",
        citation: 39468,
        explanation:
          "Probabilistic generative model that learns latent representations, enabling data generation.",
        category: "vae",
        "v2.1.2.1": {
          name: "Beta-VAE",
          year: 2017,
          place: "Google DeepMind",
          citation: 5412,
          explanation:
            "Introduces a hyperparameter β to control disentanglement in learned representations.",
          category: "vae",
        },
      },
    },
    "v2.2": {
      name: "Contrastive Learning Models",
      "v2.2.1": {
        name: "SimCLR",
        year: 2020,
        place: "Google Research Brain Team",
        citation: 20280,
        explanation:
          "Contrastive self-supervised learning method using data augmentations to learn representations.",
        category: "self_supervised",
      },
      "v2.2.2": {
        name: "MoCo",
        year: 2020,
        place: "Facebook AI Research",
        citation: 13540,
        explanation:
          "Contrastive learning method using a momentum encoder and queue for large dictionaries.",
        category: "self_supervised",
      },
    },
    "v2.3": {
      name: "Self-Distillation Models",
      "v2.3.1": {
        name: "DINO",
        year: 2021,
        place: "Facebook AI Research",
        citation: 5429,
        explanation:
          "Self-supervised method using knowledge distillation without labels to learn visual features.",
        category: "self_supervised",
      },
      "v2.3.2": {
        name: "DINOv2",
        year: 2023,
        place: "Meta AI Research",
        citation: 1648,
        explanation:
          "An improved version of DINO for self-supervised learning on larger datasets.",
        category: "self_supervised",
      },
    },
  },
  "v3.x - Convolutional Neural Networks": {
    "v3.0": {
      name: "Basic CNN Concepts",
      "v3.0.1": {
        name: "Neocognitron",
        year: 1980,
        place: "NHK Broadcasting Science Research Laboratorie",
        citation: 9660,
        explanation:
          "Hierarchical neural network that inspired modern CNNs, introducing the concept of local feature detectors.",
        category: "cnn",
      },
    },
    "v3.1": {
      name: "LeNet Family",
      "v3.1.1": {
        name: "LeNet-1",
        year: 1990,
        place: "AT&T Bell Laboratories",
        citation: 6760,
        explanation:
          "One of the earliest convolutional neural networks, designed for handwritten and machine-printed character recognition.",
        category: "cnn",
      },
      "v3.1.2": {
        name: "LeNet-5",
        year: 1998,
        place: "IEEE",
        citation: 70544,
        explanation:
          "Pioneering convolutional neural network for handwritten digit recognition, demonstrating the effectiveness of CNNs.",
        category: "cnn",
      },
    },
    "v3.2": {
      name: "Modern CNNs",
      "v3.2.1": {
        name: "AlexNet",
        year: 2012,
        place: "University of Toronto",
        citation: 135156,
        explanation:
          "First deep CNN to win ImageNet competition, sparking renewed interest in deep learning.",
        category: "cnn",
      },
      "v3.2.2": {
        name: "VGGNet",
        year: 2014,
        place: "University of Oxford",
        citation: 132477,
        explanation:
          "Demonstrated that increasing depth with small convolution filters improves performance.",
        category: "cnn",
      },
      "v3.2.3": {
        name: "GoogLeNet",
        year: 2014,
        place: "Google Inc.",
        citation: 62896,
        explanation:
          "Introduced Inception modules to improve computational efficiency and depth.",
        category: "cnn",
      },
      "v3.2.4": {
        name: "ResNet",
        year: 2015,
        place: "Microsoft Research",
        citation: 242492,
        explanation:
          "Introduced residual connections to train very deep networks, enabling networks over 100 layers.",
        category: "cnn",
      },
      "v3.2.5": {
        name: "DenseNet",
        year: 2017,
        place: "Cornell University",
        citation: 48567,
        explanation:
          "Connected each layer to every other layer to promote feature reuse and reduce parameters.",
        category: "cnn",
      },
      "v3.2.6": {
        name: "EfficientNet",
        year: 2019,
        place: "Google Research",
        citation: 23775,
        explanation:
          "Scaled networks using a compound coefficient to balance network depth, width, and resolution.",
        category: "cnn",
      },
    },
    "v3.3": {
      name: "Vision Transformers (ViT)",
      "v3.3.1": {
        name: "Vision Transformer (ViT)",
        year: 2020,
        place: "Google Research, Brain Team",
        citation: 47287,
        explanation:
          "Applied Transformer architecture to image recognition tasks, treating images as sequences of patches.",
        category: "transformer",
      },
      "v3.3.2": {
        name: "Swin Transformer",
        year: 2021,
        place:
          "Microsoft Research Asia, University of Science and Technology of China, Xian Jiaotong University, Tsinghua University",
        citation: 23368,
        explanation:
          "Hierarchical Transformer using shifted windows for computer vision tasks.",
        category: "transformer",
      },
      "v3.3.3": {
        name: "DeiT",
        year: 2021,
        place: "",
        citation: 6997,
        explanation:
          "Improved training methods to make ViT models data-efficient.",
        category: "transformer",
      },
      "v3.3.4": {
        name: "EVA",
        year: 2023,
        place: "Shanghai AI Laboratory",
        citation: 579,
        explanation:
          "Large-scale vision foundation model with strong transfer learning capabilities.",
        category: "transformer",
      },
    },
    "v3.4": {
      name: "Advanced CNN Architectures",
      "v3.4.1": {
        name: "U-Net",
        year: 2015,
        place: "University of Freiburg, Germany",
        citation: 95843,
        explanation:
          "Introduced skip connections between encoder and decoder, important for image segmentation tasks.",
        category: "cnn",
      },
      "v3.4.2": {
        name: "SegNet",
        year: 2017,
        place: "",
        citation: 20698,
        explanation:
          "Deep convolutional encoder-decoder architecture for image segmentation.",
        category: "cnn",
      },
      "v3.4.3": {
        name: "YOLO (You Only Look Once)",
        year: 2016,
        place:
          "University of Washington, Allen Institute for AI, Facebook AI Research",
        citation: 54448,
        explanation:
          "Real-time object detection system, important for computer vision tasks.",
        category: "cnn",
      },
    },
    "v3.5": {
      name: "Efficient Mobile Architectures",
      "v3.5.1": {
        name: "MobileNetV1",
        year: 2017,
        place: "Google Inc.",
        citation: 27889,
        explanation:
          "Lightweight CNN architecture using depthwise separable convolutions for mobile devices.",
        category: "cnn",
      },
      "v3.5.2": {
        name: "MobileNetV2",
        year: 2018,
        place: "Google Inc.",
        citation: 25578,
        explanation:
          "Improved mobile architecture using inverted residuals and linear bottlenecks.",
        category: "cnn",
      },
      "v3.5.3": {
        name: "MobileNetV3",
        year: 2019,
        place: "Google AI, Google Brain",
        citation: 9045,
        explanation:
          "Optimized mobile architecture using neural architecture search and squeeze-and-excite blocks.",
        category: "cnn",
      },
    },
    "v3.6": {
      name: "Advanced Vision Understanding",
      "v3.6.1": {
        name: "SAM (Segment Anything Model)",
        year: 2023,
        place: "Meta AI Research, FAIR",
        citation: 6661,
        explanation:
          "Foundation model for image segmentation, capable of segmenting any object from prompts.",
        category: "transformer",
      },
      "v3.6.2": {
        name: "SEEM",
        year: 2023,
        place:
          "University of Wisconsin-Madison, Microsoft Research, Redmond, HKUST, Microsoft Cloud & AI",
        citation: 422,
        explanation:
          "Segment Everything Everywhere Model, extending SAM's capabilities to more tasks.",
        category: "transformer",
      },
    },
  },
  "v4.x - Sequence Models and Transformers": {
    "v4.0": {
      name: "Recurrent Neural Networks (RNNs)",
      "v4.0.1": {
        name: "RNN (Recurrent Neural Network)",
        year: 1986,
        place:
          "Institute for Cognitive Science, C-015, University of California, Department of Computer Science, Carnegie-Mellon University",
        citation: 40394,
        explanation:
          "Introduced context units to retain state information, allowing for processing sequences.",
        category: "rnn",
      },
      "v4.0.2": {
        name: "Long Short-Term Memory (LSTM)",
        year: 1997,
        place: "Technische Universitat Munchen",
        citation: 115630,
        explanation:
          "Addressed the vanishing gradient problem in RNNs, enabling learning of long-term dependencies.",
        category: "rnn",
      },
    },
    "v4.1": {
      name: "Transformer Architecture",
      year: 2017,
      place: "Google Brain",
      citation: 141723,
      explanation:
        "Introduced self-attention mechanisms and eliminated recurrence, revolutionizing sequence modeling.",
      category: "transformer",
      "v4.1.1": {
        name: "Encoder-Decoder Transformers",
        "v4.1.1.1": {
          name: "T5",
          year: 2020,
          place: "Google Research",
          citation: 19380,
          explanation:
            "Unified NLP tasks into a text-to-text format, using a large-scale pre-trained model.",
          category: "transformer",
        },
        "v4.1.1.2": {
          name: "BART",
          year: 2019,
          place: "Facebook AI",
          citation: 11236,
          explanation:
            "Combined BERT and GPT architectures, effective for text generation and comprehension.",
          category: "transformer",
        },
        "v4.1.1.3": {
          name: "Megatron-LM",
          year: 2019,
          place: "",
          citation: 1766,
          explanation:
            "Scaled transformer model with efficient model and data parallelism.",
          category: "transformer",
        },
      },
      "v4.1.2": {
        name: "Encoder-Only Models",
        "v4.1.2.1": {
          name: "BERT",
          year: 2018,
          place: "Google AI Language",
          citation: 118772,
          explanation:
            "Pre-trained deep bidirectional representations, setting state-of-the-art on multiple NLP tasks.",
          category: "transformer",
        },
        "v4.1.2.2": {
          name: "RoBERTa",
          year: 2019,
          place:
            "Paul G. Allen School of Computer Science & Engineering, University of Washington, Seattle, WA, Facebook AI",
          citation: 16222,
          explanation:
            "Optimized BERT's pretraining procedure for better performance.",
          category: "transformer",
        },
        "v4.1.2.3": {
          name: "DeBERTa",
          year: 2020,
          place: "Microsoft Dynamics 365 AI, Microsoft Research",
          citation: 2662,
          explanation:
            "Decoding-enhanced BERT with disentangled attention mechanism.",
          category: "transformer",
        },
      },
      "v4.1.3": {
        name: "Decoder-Only Models",
        "v4.1.3.1": {
          name: "GPT",
          year: 2018,
          place: "OpenAI",
          citation: 11620,
          explanation:
            "Introduced unsupervised pre-training for language models using Transformer decoder.",
          category: "transformer",
        },
        "v4.1.3.2": {
          name: "GPT-2",
          year: 2019,
          place: "OpenAI",
          citation: 14283,
          explanation:
            "Scaled-up GPT model, capable of generating coherent and contextually relevant text.",
          category: "transformer",
        },
        "v4.1.3.3": {
          name: "GPT-3",
          year: 2020,
          place: "OpenAI",
          citation: 35502,
          explanation:
            "Large-scale language model with 175 billion parameters, demonstrating strong few-shot learning.",
          category: "transformer",
        },
        "v4.1.3.4": {
          name: "GPT-4",
          year: 2023,
          place: "OpenAI",
          citation: 5553,
          explanation:
            "Advanced language model with improved reasoning and understanding capabilities.",
          category: "transformer",
        },
        "v4.1.3.5": {
          name: "PaLM",
          year: 2022,
          place: "Google Research",
          citation: 5001,
          explanation:
            "540-billion parameter Transformer model demonstrating strong performance across tasks.",
          category: "transformer",
        },
        "v4.1.3.6": {
          name: "PaLM 2",
          year: 2023,
          place: "Google",
          citation: 1391,
          explanation:
            "An updated version of PaLM with enhanced multilingual, reasoning, and coding capabilities.",
          category: "transformer",
        },
        "v4.1.3.7": {
          name: "Claude",
          year: 2022,
          place: "Anthropic",
          citation: 1101,
          explanation:
            "Advanced language model focusing on constitutional AI and alignment principles.",
          category: "transformer",
        },
        "v4.1.3.8": {
          name: "LaMDA",
          year: 2022,
          place: "Google",
          citation: 1520,
          explanation:
            "Language Model for Dialogue Applications, specialized in conversational AI.",
          category: "transformer",
        },
        "v4.1.3.9": {
          name: "Open-Source Models",
          "v4.1.3.9.1": {
            name: "LLaMA",
            year: 2023,
            place: "Meta AI",
            citation: 10520,
            explanation:
              "A collection of foundation language models ranging from 7B to 65B parameters.",
            category: "transformer",
          },
          "v4.1.3.9.2": {
            name: "LLaMA 2",
            year: 2023,
            place: "GenAI, Meta",
            citation: 10084,
            explanation:
              "Improved version of LLaMA with better performance and commercial usage rights.",
            category: "transformer",
          },
          "v4.1.3.9.3": {
            name: "Mistral",
            year: 2023,
            place: "",
            citation: 858,
            explanation:
              "Efficient 7B model with strong performance relative to its size.",
            category: "transformer",
          },
          "v4.1.3.9.4": {
            name: "Mixtral",
            year: 2023,
            place: "",
            citation: 1017,
            explanation:
              "Mixture-of-experts model combining multiple Mistral architectures.",
            category: "transformer",
          },
          "v4.1.3.9.5": {
            name: "Phi-2",
            year: 2023,
            place: "Microsoft GenAI",
            citation: 157,
            explanation:
              "Small but powerful model showing strong reasoning capabilities.",
            category: "transformer",
          },
        },
        "v4.1.3.10": {
          name: "Latest Proprietary Models",
          "v4.1.3.10.1": {
            name: "Gemini",
            year: 2023,
            place: "Google DeepMind",
            citation: 2023,
            explanation:
              "Family of multimodal models with Ultra, Pro, and Nano variants.",
            category: "transformer",
          },
          "v4.1.3.10.2": {
            name: "Claude 3",
            year: 2024,
            place: "Anthropic",
            citation: 208,
            explanation:
              "Latest Claude series with Opus, Sonnet, and Haiku variants.",
            category: "transformer",
          },
        },
      },
    },
    "v4.2": {
      name: "Advanced Transformer Variants",
      "v4.2.1": {
        name: "Transformer-XL",
        year: 2019,
        place: "Carnegie Mellon University, Google Brain",
        citation: 4464,
        explanation:
          "Extended the Transformer architecture to handle longer sequences, introduced relative positional encodings.",
        category: "transformer",
      },
      "v4.2.2": {
        name: "XLNet",
        year: 2019,
        place: "Carnegie Mellon University, Google AI Brain Team",
        citation: 10314,
        explanation:
          "Generalized autoregressive pretraining method, overcame limitations of BERT using permutation language modeling.",
        category: "transformer",
      },
      "v4.2.3": {
        name: "ELECTRA",
        year: 2020,
        place: "Google Research",
        citation: 4349,
        explanation:
          "More sample-efficient pretraining method for language models, uses a discriminative model to predict whether tokens are original or replaced.",
        category: "transformer",

        "v4.2.3.1": {
          name: "Longformer",
          year: 2020,
          place:
            "Allen Institute for Artificial Intelligence, Seattle, WA, USA",
          citation: 4282,
          explanation:
            "Extended transformer with efficient attention pattern for processing very long documents.",
          category: "transformer",
        },
        "v4.2.3.2": {
          name: "Reformer",
          year: 2020,
          place: "Google Research",
          citation: 2825,
          explanation:
            "Efficient transformer using locality-sensitive hashing and reversible layers.",
          category: "transformer",
        },
        "v4.2.3.3": {
          name: "BigBird",
          year: 2020,
          place: "Google Research",
          citation: 2245,
          explanation:
            "Transformer with sparse attention patterns for processing longer sequences.",
          category: "transformer",
        },
      },
      "v4.2.4": {
        name: "Switch Transformer",
        year: 2021,
        place: "Google Research",
        citation: 1804,
        explanation:
          "Introduced the concept of sparsely-activated models, achieved trillion-parameter models through conditional computation.",
        category: "transformer",
      },
      "v4.2.5": {
        name: "ALBERT",
        year: 2019,
        place: "Google Research",
        citation: 7861,
        explanation:
          "A Lite BERT for self-supervised learning of language representations, introduced parameter sharing to reduce model size.",
        category: "transformer",
      },
      "v4.2.6": {
        name: "DistilBERT",
        year: 2019,
        place: "Hugging Face",
        citation: 7456,
        explanation:
          "A distilled version of BERT, smaller and faster while retaining BERT's language understanding capabilities.",
        category: "transformer",
      },
    },
    "v4.3": {
      name: "Multilingual and Cross-lingual Models",
      "v4.3.1": {
        name: "ERNIE",
        year: 2019,
        place: "Baidu Inc.",
        citation: 1153,
        explanation:
          "Enhanced Representation through Knowledge Integration, incorporated external knowledge into pretraining.",
        category: "transformer",
      },
      "v4.3.2": {
        name: "XLM",
        year: 2019,
        place: "Facebook AI Research",
        citation: 1655,
        explanation:
          "Cross-lingual Language Model Pretraining, important for multilingual NLP tasks.",
        category: "transformer",
      },
      "v4.3.3": {
        name: "mT5",
        year: 2021,
        place: "Google Research",
        citation: 2320,
        explanation:
          "Multilingual version of T5, supporting 101 languages with shared vocabulary.",
        category: "transformer",
      },
    },
  },
  "v5.x - Generative Models": {
    "v5.0": {
      name: "Generative Adversarial Networks (GANs)",
      year: 2014,
      place: "Departement d'informatique et de recherche op ´ erationnelle",
      citation: 74528,
      explanation:
        "Introduced the GAN framework, where two neural networks compete in a zero-sum game to generate realistic data.",
      category: "gan",
      "v5.0.1": {
        name: "Architectural Variants",
        "v5.0.1.1": {
          name: "DCGAN",
          year: 2015,
          place: "indico Research",
          citation: 18893,
          explanation:
            "Deep Convolutional GAN; introduced convolutional architectures to GANs for improved image generation.",
          category: "gan",
        },
        "v5.0.1.2": {
          name: "WGAN",
          year: 2017,
          place: "",
          citation: 17460,
          explanation:
            "Wasserstein GAN; addressed instability in GAN training by using Wasserstein distance.",
          category: "gan",
        },
        "v5.0.1.3": {
          name: "Progressive GAN",
          year: 2018,
          place: "NVIDIA",
          citation: 8838,
          explanation:
            "Progressive Growing of GANs; improved high-resolution image generation by progressively increasing resolution during training.",
          category: "gan",
        },
      },
      "v5.0.2": {
        name: "Conditional Variants",
        "v5.0.2.1": {
          name: "Conditional GAN",
          year: 2014,
          place: "Departement d'informatique et de recherche op ´ erationnelle",
          citation: 14155,
          explanation:
            "Extended GANs to condition on auxiliary information like class labels.",
          category: "gan",
        },
        "v5.0.2.2": {
          name: "CycleGAN",
          year: 2017,
          place: "Berkeley AI Research (BAIR) laboratory, UC Berkeley",
          citation: 24951,
          explanation:
            "Unpaired image-to-image translation using cycle-consistent adversarial networks.",
          category: "gan",
        },
        "v5.0.2.3": {
          name: "Pix2Pix",
          year: 2017,
          place: "Berkeley AI Research (BAIR) Laboratory, UC Berkeley",
          citation: 24742,
          explanation:
            "Paired image-to-image translation using conditional adversarial networks.",
          category: "gan",
        },
      },
      "v5.0.3": {
        name: "StyleGAN Family",
        "v5.0.3.1": {
          name: "StyleGAN",
          year: 2019,
          place: "NVIDIA",
          citation: 12400,
          explanation:
            "Introduced style-based generator architecture, enabling control over image synthesis at different levels.",
          category: "gan",
        },
        "v5.0.3.2": {
          name: "StyleGAN2",
          year: 2020,
          place: "NVIDIA",
          citation: 6790,
          explanation:
            "Improved upon StyleGAN by addressing artifacts and enhancing image quality.",
          category: "gan",
        },
        "v5.0.3.3": {
          name: "StyleGAN3",
          year: 2021,
          place: "NVIDIA",
          citation: 1640,
          explanation:
            "Further improvements in image synthesis, addressing aliasing issues and enabling better consistency.",
          category: "gan",
        },
      },
    },
    "v5.1": {
      name: "Diffusion Models",
      "v5.1.1": {
        name: "DDPM",
        year: 2020,
        place: "UC Berkeley",
        citation: 14543,
        explanation:
          "Introduced diffusion models for image generation, matching or surpassing GAN performance.",
        category: "diffusion",
      },
      "v5.1.2": {
        name: "Improved DDPM",
        year: 2021,
        place: "",
        citation: 3090,
        explanation:
          "Enhanced DDPM with better sampling techniques and architectural improvements.",
        category: "diffusion",
      },
      "v5.1.3": {
        name: "Latent Diffusion Models",
        "v5.1.3.1": {
          name: "Stable Diffusion",
          year: 2022,
          place:
            "Ludwig Maximilian University of Munich & IWR, Heidelberg University, Germany",
          citation: 12514,
          explanation:
            "An efficient diffusion model operating in latent space, enabling high-resolution image synthesis with reduced computational cost.",
          category: "diffusion",
        },
      },
      "v5.1.4": {
        name: "Advanced Image Diffusion",
        "v5.1.4.1": {
          name: "Stable Diffusion XL",
          year: 2023,
          place: "Stability AI, Applied Research",
          citation: 1132,
          explanation:
            "Enhanced version of Stable Diffusion with improved image quality and text understanding.",
          category: "diffusion",
        },
        "v5.1.4.2": {
          name: "SDXL Turbo",
          year: 2023,
          place: "Stability AI",
          citation: 196,
          explanation:
            "Real-time version of SDXL capable of generating images in a single step.",
          category: "diffusion",
        },
        "v5.1.4.3": {
          name: "IP-Adapter",
          year: 2023,
          place: "Tencent AI Lab",
          citation: 337,
          explanation:
            "Image prompt adapter for diffusion models, enabling better image-conditioned generation.",
          category: "diffusion",
        },
      },
      "v5.1.5": {
        name: "Video Diffusion Models",
        "v5.1.5.1": {
          name: "Stable Video Diffusion",
          year: 2023,
          place: "Stability AI",
          citation: 432,
          explanation:
            "Text-to-video model based on Stable Diffusion architecture.",
          category: "diffusion",
        },
        "v5.1.5.2": {
          name: "Sora",
          year: 2024,
          place: "Open AI",
          citation: 134,
          explanation:
            "Advanced text-to-video model capable of generating complex, long-form videos.",
          category: "diffusion",
        },
        "v5.1.5.3": {
          name: "Lumiere",
          year: 2024,
          place: "Google Research",
          citation: 118,
          explanation:
            "Text-to-video diffusion model with focus on motion consistency and temporal coherence.",
          category: "diffusion",
        },
        "v5.1.5.4": {
          name: "Gen-2",
          year: 2023,
          place: "Runway",
          citation: 400,
          explanation:
            "Text-to-video and image-to-video generation model with strong editing capabilities.",
          category: "diffusion",
        },
      },
      "v5.1.6": {
        name: "3D Generation Models",
        "v5.1.6.1": {
          name: "Point-E",
          year: 2022,
          place: "Open AI",
          citation: 437,
          explanation:
            "Text-to-3D point cloud generation model using diffusion.",
          category: "diffusion",
        },
        "v5.1.6.2": {
          name: "GET3D",
          year: 2023,
          place: "NVIDIA",
          citation: 407,
          explanation:
            "Generative model for textured 3D meshes from text descriptions.",
          category: "diffusion",
        },
      },
    },
  },
  "v6.x - Hybrid and Multimodal Models": {
    "v6.0": {
      name: "Early Vision-Language Models",
      "v6.0.1": {
        name: "Show and Tell",
        year: 2015,
        place: "Google",
        citation: 7845,
        explanation:
          "Early neural image captioning model combining CNN and RNN architectures.",
        category: "multi_modal",
      },
      "v6.0.2": {
        name: "Visual Question Answering (VQA)",
        year: 2015,
        place: "Virginia Tech, Microsoft Research",
        citation: 6446,
        explanation:
          "Pioneered the task of answering natural language questions about images.",
        category: "multi_modal",
      },
    },
    "v6.1": {
      name: "Vision-Language Pre-training",
      "v6.1.1": {
        name: "CLIP",
        year: 2021,
        place: "OpenAI",
        citation: 24571,
        explanation:
          "Contrastive Language-Image Pre-training, enabling zero-shot transfer to various visual tasks.",
        category: "multi_modal",
      },
      "v6.1.2": {
        name: "Florence",
        year: 2022,
        place: "Microsoft",
        citation: 873,
        explanation:
          "Unified vision foundation model supporting various vision-language tasks.",
        category: "multi_modal",
      },
    },
    "v6.2": {
      name: "Generative Multimodal Models",
      "v6.2.1": {
        name: "DALL-E",
        year: 2021,
        place: "OpenAI",
        citation: 4966,
        explanation:
          "A generative model that creates images from textual descriptions using a Transformer architecture.",
        category: "multi_modal",
      },
      "v6.2.2": {
        name: "DALL-E 2",
        year: 2022,
        place: "OpenAI",
        citation: 6144,
        explanation:
          "Improved version of DALL-E with higher resolution and greater photorealism.",
        category: "multi_modal",
      },
      "v6.2.3": {
        name: "DALL-E 3",
        year: 2023,
        place: "OpenAI",
        citation: 592,
        explanation:
          "Enhanced version with improved text understanding and artistic capabilities.",
        category: "multi_modal",
      },
    },
    "v6.3": {
      name: "Advanced Vision-Language Models",
      "v6.3.1": {
        name: "FLAMINGO",
        year: 2022,
        place: "DeepMind",
        citation: 3163,
        explanation:
          "A visual language model with few-shot learning capabilities in multimodal contexts.",
        category: "multi_modal",
      },
      "v6.3.2": {
        name: "BLIP-2",
        year: 2023,
        place: "Salesforce Research",
        citation: 3909,
        explanation:
          "Bootstrapping Language-Image Pre-training with frozen image encoders and LLMs.",
        category: "multi_modal",
      },
      "v6.3.3": {
        name: "CogVLM",
        year: 2023,
        place: "Tsinghua University, Zhipu AI",
        citation: 417,
        explanation:
          "Large vision-language model with strong cognitive capabilities and reasoning.",
        category: "multi_modal",
      },
    },
    "v6.4": {
      name: "Multimodal Large Language Models",
      "v6.4.1": {
        name: "LLaVA",
        year: 2023,
        place:
          "University of Wisconsin-Madison, Microsoft Research, Columbia University",
        citation: 3937,
        explanation:
          "Large Language and Vision Assistant, combining GPT-style language models with visual understanding.",
        category: "multi_modal",
      },
      "v6.4.2": {
        name: "PaLM-E",
        year: 2023,
        place: "Google, TU Berlin",
        citation: 1397,
        explanation:
          "An embodied multimodal language model combining vision and language for robotic control.",
        category: "multi_modal",
      },
      "v6.4.3": {
        name: "GPT-4V",
        year: 2023,
        place: "OpenAI",
        citation: 476,
        explanation:
          "An extension of GPT-4 capable of processing and generating visual content along with text.",
        category: "multi_modal",
      },
      "v6.4.4": {
        name: "Claude 3 Vision",
        year: 2024,
        place: "Anthropic",
        citation: 208,
        explanation:
          "Multimodal version of Claude capable of processing images with high accuracy.",
        category: "multi_modal",
      },
      "v6.4.5": {
        name: "Gemini Vision",
        year: 2023,
        place: "The Chinese University of Hong Kong, SmartMore",
        citation: 113,
        explanation:
          "Multimodal capabilities of Gemini, with advanced visual understanding and reasoning.",
        category: "multi_modal",
      },
    },
    "v6.5": {
      name: "Audio and Speech Models",
      "v6.5.1": {
        name: "Whisper",
        year: 2022,
        place: "OpenAI",
        citation: 3218,
        explanation:
          "Robust speech recognition model supporting multiple languages.",
        category: "multi_modal",
      },
    },
  },
  "v7.x - Reinforcement Learning and Advanced AI Systems": {
    "v7.0": {
      name: "Deep Reinforcement Learning",
      "v7.0.1": {
        name: "Deep Q-Network (DQN)",
        year: 2015,
        place: "DeepMind",
        citation: 16264,
        explanation:
          "Introduced deep learning to Q-learning, achieving human-level performance on Atari games.",
        category: "reinforcement",
      },
      "v7.0.2": {
        name: "A3C",
        year: 2016,
        place: "DeepMind, University of Montreal",
        citation: 11980,
        explanation:
          "Asynchronous Advantage Actor-Critic, a policy gradient method that uses asynchronous updates.",
        category: "reinforcement",
      },
      "v7.0.3": {
        name: "PPO",
        year: 2017,
        place: "OpenAI",
        citation: 21674,
        explanation:
          "Proximal Policy Optimization, providing stable policy updates for reinforcement learning.",
        category: "reinforcement",
      },
    },
    "v7.1": {
      name: "Game-Playing AI",
      "v7.1.1": {
        name: "AlphaGo",
        year: 2016,
        place: "Deepmind",
        citation: 20360,
        explanation: "First AI to defeat a world champion in the game of Go.",
        category: "reinforcement",
      },
      "v7.1.2": {
        name: "AlphaGo Zero",
        year: 2017,
        place: "DeepMind",
        citation: 11585,
        explanation:
          "Learned Go solely through self-play, surpassing all previous versions.",
        category: "reinforcement",
      },
      "v7.1.3": {
        name: "AlphaZero",
        year: 2017,
        place: "DeepMind",
        citation: 2407,
        explanation:
          "Generalized AlphaGo to chess and shogi, learning solely through self-play.",
        category: "reinforcement",
      },
      "v7.1.4": {
        name: "MuZero",
        year: 2019,
        place: "DeepMind, University College London",
        citation: 2604,
        explanation:
          "Mastered Go, chess, shogi, and Atari without knowledge of the game rules.",
        category: "reinforcement",
      },
    },
    "v7.2": {
      name: "Real-Time Strategy Games",
      "v7.2.1": {
        name: "AlphaStar",
        year: 2019,
        place: "DeepMind, Team Liquid",
        citation: 4858,
        explanation:
          "First AI to defeat top professional players in StarCraft II, a complex real-time strategy game.",
        category: "reinforcement",
      },
    },
    "v7.3": {
      name: "Advanced AI Systems",
      "v7.3.1": {
        name: "AlphaFold",
        year: 2020,
        place:
          "DeepMind, The Francis Crick Institute, University College London",
        citation: 3381,
        explanation: "Revolutionary protein structure prediction system.",
        category: "reinforcement",
      },
      "v7.3.2": {
        name: "AlphaFold 2",
        year: 2021,
        place: "DeepMind, Seoul National University",
        citation: 29012,
        explanation:
          "Dramatically improved protein structure prediction to atomic accuracy.",
        category: "reinforcement",
      },
    },
  },
};

export const ARRAY = [
  "McCulloch-Pitts Neuron",
  "Perceptron",
  "Multi-Layer Perceptron (MLP)",
  "Backpropagation Algorithm",
  "Hopfield Network",
  "Boltzmann Machine",
  "Basic Autoencoder",
  "Variational Autoencoder (VAE)",
  "Beta-VAE",
  "SimCLR",
  "MoCo",
  "DINO",
  "DINOv2",
  "Neocognitron",
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
  "EVA",
  "U-Net",
  "SegNet",
  "YOLO (You Only Look Once)",
  "MobileNetV1",
  "MobileNetV2",
  "MobileNetV3",
  "SAM (Segment Anything Model)",
  "SEEM",
  "RNN (Recurrent Neural Network)",
  "Long Short-Term Memory (LSTM)",
  "Transformer Architecture",
  "T5",
  "BART",
  "Megatron-LM",
  "BERT",
  "RoBERTa",
  "DeBERTa",
  "GPT",
  "GPT-2",
  "GPT-3",
  "GPT-4",
  "PaLM",
  "PaLM 2",
  "Claude",
  "LaMDA",
  "LLaMA",
  "LLaMA 2",
  "Mistral",
  "Mixtral",
  "Phi-2",
  "Gemini",
  "Claude 3",
  "Transformer-XL",
  "XLNet",
  "ELECTRA",
  "Longformer",
  "Reformer",
  "BigBird",
  "Switch Transformer",
  "ALBERT",
  "DistilBERT",
  "ERNIE",
  "XLM",
  "mT5",
  "Generative Adversarial Networks (GANs)",
  "DCGAN",
  "WGAN",
  "Progressive GAN",
  "Conditional GAN",
  "CycleGAN",
  "Pix2Pix",
  "StyleGAN",
  "StyleGAN2",
  "StyleGAN3",
  "DDPM",
  "Improved DDPM",
  "Stable Diffusion",
  "Stable Diffusion XL",
  "SDXL Turbo",
  "IP-Adapter",
  "Stable Video Diffusion",
  "Sora",
  "Lumiere",
  "Gen-2",
  "Point-E",
  "GET3D",
  "Show and Tell",
  "Visual Question Answering (VQA)",
  "CLIP",
  "Florence",
  "DALL-E",
  "DALL-E 2",
  "DALL-E 3",
  "FLAMINGO",
  "BLIP-2",
  "CogVLM",
  "LLaVA",
  "PaLM-E",
  "GPT-4V",
  "Claude 3 Vision",
  "Gemini Vision",
  "Whisper",
  "Deep Q-Network (DQN)",
  "A3C",
  "PPO",
  "AlphaGo",
  "AlphaGo Zero",
  "AlphaZero",
  "MuZero",
  "AlphaStar",
  "AlphaFold",
  "AlphaFold 2",
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
    name: "Hopfield Network",
    version: "v2.0.1",
  },
  {
    name: "Boltzmann Machine",
    version: "v2.0.2",
  },
  {
    name: "Basic Autoencoder",
    version: "v2.1.1",
  },
  {
    name: "Variational Autoencoder (VAE)",
    version: "v2.1.2",
  },
  {
    name: "Beta-VAE",
    version: "v2.1.2.1",
  },
  {
    name: "SimCLR",
    version: "v2.2.1",
  },
  {
    name: "MoCo",
    version: "v2.2.2",
  },
  {
    name: "DINO",
    version: "v2.3.1",
  },
  {
    name: "DINOv2",
    version: "v2.3.2",
  },
  {
    name: "Neocognitron",
    version: "v3.0.1",
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
    name: "EVA",
    version: "v3.3.4",
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
    name: "MobileNetV1",
    version: "v3.5.1",
  },
  {
    name: "MobileNetV2",
    version: "v3.5.2",
  },
  {
    name: "MobileNetV3",
    version: "v3.5.3",
  },
  {
    name: "SAM (Segment Anything Model)",
    version: "v3.6.1",
  },
  {
    name: "SEEM",
    version: "v3.6.2",
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
    name: "Transformer Architecture",
    version: "v4.1",
  },
  {
    name: "T5",
    version: "v4.1.1.1",
  },
  {
    name: "BART",
    version: "v4.1.1.2",
  },
  {
    name: "Megatron-LM",
    version: "v4.1.1.3",
  },
  {
    name: "BERT",
    version: "v4.1.2.1",
  },
  {
    name: "RoBERTa",
    version: "v4.1.2.2",
  },
  {
    name: "DeBERTa",
    version: "v4.1.2.3",
  },
  {
    name: "GPT",
    version: "v4.1.3.1",
  },
  {
    name: "GPT-2",
    version: "v4.1.3.2",
  },
  {
    name: "GPT-3",
    version: "v4.1.3.3",
  },
  {
    name: "GPT-4",
    version: "v4.1.3.4",
  },
  {
    name: "PaLM",
    version: "v4.1.3.5",
  },
  {
    name: "PaLM 2",
    version: "v4.1.3.6",
  },
  {
    name: "Claude",
    version: "v4.1.3.7",
  },
  {
    name: "LaMDA",
    version: "v4.1.3.8",
  },
  {
    name: "LLaMA",
    version: "v4.1.3.9.1",
  },
  {
    name: "LLaMA 2",
    version: "v4.1.3.9.2",
  },
  {
    name: "Mistral",
    version: "v4.1.3.9.3",
  },
  {
    name: "Mixtral",
    version: "v4.1.3.9.4",
  },
  {
    name: "Phi-2",
    version: "v4.1.3.9.5",
  },
  {
    name: "Gemini",
    version: "v4.1.3.10.1",
  },
  {
    name: "Claude 3",
    version: "v4.1.3.10.2",
  },
  {
    name: "Transformer-XL",
    version: "v4.2.1",
  },
  {
    name: "XLNet",
    version: "v4.2.2",
  },
  {
    name: "ELECTRA",
    version: "v4.2.3",
  },
  {
    name: "Longformer",
    version: "v4.2.3.1",
  },
  {
    name: "Reformer",
    version: "v4.2.3.2",
  },
  {
    name: "BigBird",
    version: "v4.2.3.3",
  },
  {
    name: "Switch Transformer",
    version: "v4.2.4",
  },
  {
    name: "ALBERT",
    version: "v4.2.5",
  },
  {
    name: "DistilBERT",
    version: "v4.2.6",
  },
  {
    name: "ERNIE",
    version: "v4.3.1",
  },
  {
    name: "XLM",
    version: "v4.3.2",
  },
  {
    name: "mT5",
    version: "v4.3.3",
  },
  {
    name: "Generative Adversarial Networks (GANs)",
    version: "v5.0",
  },
  {
    name: "DCGAN",
    version: "v5.0.1.1",
  },
  {
    name: "WGAN",
    version: "v5.0.1.2",
  },
  {
    name: "Progressive GAN",
    version: "v5.0.1.3",
  },
  {
    name: "Conditional GAN",
    version: "v5.0.2.1",
  },
  {
    name: "CycleGAN",
    version: "v5.0.2.2",
  },
  {
    name: "Pix2Pix",
    version: "v5.0.2.3",
  },
  {
    name: "StyleGAN",
    version: "v5.0.3.1",
  },
  {
    name: "StyleGAN2",
    version: "v5.0.3.2",
  },
  {
    name: "StyleGAN3",
    version: "v5.0.3.3",
  },
  {
    name: "DDPM",
    version: "v5.1.1",
  },
  {
    name: "Improved DDPM",
    version: "v5.1.2",
  },
  {
    name: "Stable Diffusion",
    version: "v5.1.3.1",
  },
  {
    name: "Stable Diffusion XL",
    version: "v5.1.4.1",
  },
  {
    name: "SDXL Turbo",
    version: "v5.1.4.2",
  },
  {
    name: "IP-Adapter",
    version: "v5.1.4.3",
  },
  {
    name: "Stable Video Diffusion",
    version: "v5.1.5.1",
  },
  {
    name: "Sora",
    version: "v5.1.5.2",
  },
  {
    name: "Lumiere",
    version: "v5.1.5.3",
  },
  {
    name: "Gen-2",
    version: "v5.1.5.4",
  },
  {
    name: "Point-E",
    version: "v5.1.6.1",
  },
  {
    name: "GET3D",
    version: "v5.1.6.2",
  },
  {
    name: "Show and Tell",
    version: "v6.0.1",
  },
  {
    name: "Visual Question Answering (VQA)",
    version: "v6.0.2",
  },
  {
    name: "CLIP",
    version: "v6.1.1",
  },
  {
    name: "Florence",
    version: "v6.1.2",
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
    name: "DALL-E 3",
    version: "v6.2.3",
  },
  {
    name: "FLAMINGO",
    version: "v6.3.1",
  },
  {
    name: "BLIP-2",
    version: "v6.3.2",
  },
  {
    name: "CogVLM",
    version: "v6.3.3",
  },
  {
    name: "LLaVA",
    version: "v6.4.1",
  },
  {
    name: "PaLM-E",
    version: "v6.4.2",
  },
  {
    name: "GPT-4V",
    version: "v6.4.3",
  },
  {
    name: "Claude 3 Vision",
    version: "v6.4.4",
  },
  {
    name: "Gemini Vision",
    version: "v6.4.5",
  },
  {
    name: "Whisper",
    version: "v6.5.1",
  },
  {
    name: "Deep Q-Network (DQN)",
    version: "v7.0.1",
  },
  {
    name: "A3C",
    version: "v7.0.2",
  },
  {
    name: "PPO",
    version: "v7.0.3",
  },
  {
    name: "AlphaGo",
    version: "v7.1.1",
  },
  {
    name: "AlphaGo Zero",
    version: "v7.1.2",
  },
  {
    name: "AlphaZero",
    version: "v7.1.3",
  },
  {
    name: "MuZero",
    version: "v7.1.4",
  },
  {
    name: "AlphaStar",
    version: "v7.2.1",
  },
  {
    name: "AlphaFold",
    version: "v7.3.1",
  },
  {
    name: "AlphaFold 2",
    version: "v7.3.2",
  },
];
