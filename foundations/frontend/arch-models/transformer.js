const NUM_ENCODER_LAYERS = 6;
const NUM_DECODER_LAYERS = 6;

const NUM_TRANSFORMER_LAYERS = 6;
const NUM_T5_LAYERS = 12;
const NUM_BART_LAYERS = 6;
const NUM_BERT_LAYERS = 24;
const NUM_ROBERTA_LAYERS = 24;
const NUM_GPT_LAYERS = 12;
const NUM_GPT_2_LAYERS = 24; // for GPT-2 small, adjust for other sizes
const NUM_GPT_3_LAYERS = 96; // for GPT-3 175B, adjust for other sizes
const NUM_GPT_4_LAYERS = 120; // This is an estimate, exact architecture is not public
const NUM_PALM_LAYERS = 118; // for PaLM 540B
const NUM_PALM_2_LAYERS = 150; // This is an estimate, exact architecture is not public
const NUM_LLAMA_LAYERS = 32; // for LLaMA 7B, adjust for other sizes
const NUM_FALCON_LLM_LAYERS = 60; // for Falcon 40B, adjust for other sizes

const NUM_TRANSFORMER_XL_LAYERS = 18; // Transformer-XL Base
const NUM_XLNET_LAYERS = 12; // XLNet Base
const NUM_ELECTRA_LAYERS = 12; // ELECTRA Base
const NUM_SWITCH_LAYERS = 36; // Switch Transformer example size
const NUM_ALBERT_LAYERS = 12; // ALBERT Base
const NUM_DISTILBERT_LAYERS = 6; // DistilBERT halves BERT layers

// New constants for the additional models
const NUM_BIGBIRD_LAYERS = 12; // BigBird Base
const NUM_REFORMER_LAYERS = 12; // Reformer Base
const NUM_LONGFORMER_LAYERS = 12; // Longformer Base
const NUM_ERNIE_LAYERS = 12; // ERNIE Base
const NUM_XLM_LAYERS = 12; // XLM Base

// New constants for ViT and Swin Transformer
const NUM_VIT_LAYERS = 12; // ViT Base
const NUM_SWIN_STAGES = 12; // Swin Transformer Base
const NUM_SWIN_LAYERS_PER_STAGE = 2; // Swin Transformer Base

// Add this constant
const NUM_DEIT_LAYERS = 12; // DeiT-base has 12 layers

// Add constant
const NUM_EVA_LAYERS = 24; // EVA-g has 24 layers

// Add constants
const NUM_SAM_SEGMENT_ANYTHING_MODEL_LAYERS = 12; // Image encoder layers
const NUM_SEEM_LAYERS = 12; // SEEM uses similar depth

// Add constants
const NUM_MEGATRON_LAYERS = 52; // Megatron-LM 530B
const NUM_DEBERTA_LAYERS = 24; // DeBERTa v3 large

// Add constants
const NUM_CLAUDE_LAYERS = 48; // Anthropic Claude-2
const NUM_LAMDA_LAYERS = 64; // Google LaMDA

// Add constants (already added)
const NUM_LLAMA_2_LAYERS = 32; // LLaMA-2 7B base size
const NUM_MISTRAL_LAYERS = 32; // Mistral 7B

// Add constants
const NUM_MIXTRAL_LAYERS = 32; // Mixtral 8x7B
const NUM_PHI_2_LAYERS = 32; // Phi-2

// Add constants
const NUM_GEMINI_LAYERS = 90; // Gemini Ultra (estimated)
const NUM_CLAUDE_3_LAYERS = 80; // Claude 3 Opus (estimated)

// Add constant
const NUM_MT5_LAYERS = 24; // for mT5-Large, adjust for other sizes

export const VIDEOGEN = [
  { name: `Input Image Frames`, type: "input", stack: "encoder" },
  { name: `TAE Encoder`, type: "encoder", stack: "encoder" },
  ...Array.from({ length: NUM_ENCODER_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [6144, 48, 48],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 48, 1] },
    ],
  })),
  {
    name: `Cross Attention (Text Embeddings)`,
    type: "cross_attention",
    stack: "encoder",
  },
  { name: `UL2 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `MetaCLIP Embeddings`, type: "embedding", stack: "encoder" },
  { name: `ByT5 Embeddings`, type: "embedding", stack: "encoder" },
  { name: `Gaussian Noise Input`, type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_DECODER_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Diffusion Step ${i + 1}`,
        type: "diffusion",
        dimensions: [128, 8, 8],
      },
      {
        name: `Upsample Step ${i + 1}`,
        type: "upsample",
        dimensions: [64, 8, 8],
      },
    ],
  })),
  { name: `TAE Decoder`, type: "decoder", stack: "decoder" },
  { name: `Output Image/Video`, type: "output", stack: "decoder" },
];

export const TRANSFORMER_ARCHITECTURE = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [2048, 8, 1],
      },
    ],
  })),
  { name: "Output Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_TRANSFORMER_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [512, 8, 8],
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [2048, 8, 1],
      },
    ],
  })),
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

export const T5 = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  ...Array.from({ length: NUM_T5_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1 ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      { name: `Layer Norm 2 ${i + 1}`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
    ],
  })),
  { name: "Decoder Input", type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_T5_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1 ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [512, 8, 8],
      },
      { name: `Layer Norm 2 ${i + 1}`, type: "layernorm" },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [512, 8, 8],
      },
      { name: `Layer Norm 3 ${i + 1}`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [2048, 8, 1] },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output Projection", type: "output", stack: "decoder" },
];

export const BART = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  ...Array.from({ length: NUM_BART_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Decoder Input", type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_BART_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 12],
      },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [768, 12, 12],
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 12, 1] },
    ],
  })),
  { name: "Output Projection", type: "output", stack: "decoder" },
];

export const BERT = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_BERT_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
        gridConfig: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
      },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 1, 1] },
    ],
  })),
  { name: "Pooler", type: "output", stack: "encoder" },
];

export const ROBERTA = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_ROBERTA_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1 ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
        gridConfig: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
      },
      { name: `Layer Norm 2 ${i + 1}`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [3072, 1, 1] },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "encoder" },
  { name: "Task-specific Outputs", type: "output", stack: "encoder" },
];

export const GPT = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm ${i + 1}`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 12, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

export const GPT_2 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_2_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [1024, 16, 64],
      },
      { name: `Layer Norm 2`, type: "layernorm" },
      { name: `Feed Forward ${i + 1}`, type: "ffn", dimensions: [4096, 12, 1] },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const GPT_3 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_3_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm" },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [12288, 96, 128],
      },
      { name: `Layer Norm 2`, type: "layernorm" },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [49152, 12, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

export const GPT_4 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_GPT_4_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [16384, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [16384, 128, 128],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [16384, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [65536, 128, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Linear Projection", type: "output", stack: "decoder" },
];

export const PALM = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_PALM_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [18432, 1, 1] },
      {
        name: `Multi-Query Attention ${i + 1}`,
        type: "multi_query_attention",
        dimensions: [18432, 128, 128],
        num_query_groups: 8,
      },
      {
        name: `Pathway Router ${i + 1}`,
        type: "pathway_router",
        dimensions: [18432, 1, 1],
        num_paths: 8,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [18432, 1, 1] },
      {
        name: `SwiGLU Feed Forward ${i + 1}`,
        type: "swiglu_ffn",
        dimensions: [73728, 128, 1],
      },
    ],
  })),
  { name: "RMSNorm", type: "rmsnorm", stack: "decoder" },
  { name: "Multi-Task Output", type: "multi_task_output", stack: "decoder" },
];

export const PALM_2 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  { name: "Vision Encoder", type: "vision_encoder", stack: "encoder" },
  ...Array.from({ length: NUM_PALM_2_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [20480, 1, 1] },
      {
        name: `Multi-Query Attention ${i + 1}`,
        type: "multi_query_attention",
        dimensions: [20480, 160, 160],
        num_query_groups: 16,
      },
      {
        name: `Cross-Modal Attention ${i + 1}`,
        type: "cross_modal_attention",
        dimensions: [20480, 160, 160],
      },
      {
        name: `Enhanced Pathway Router ${i + 1}`,
        type: "pathway_router",
        dimensions: [20480, 1, 1],
        num_paths: 16,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [20480, 1, 1] },
      {
        name: `SwiGLU Feed Forward ${i + 1}`,
        type: "swiglu_ffn",
        dimensions: [81920, 160, 1],
      },
    ],
  })),
  { name: "RMSNorm", type: "rmsnorm", stack: "decoder" },
  { name: "Multi-Modal Output", type: "multi_modal_output", stack: "decoder" },
];

export const LLAMA = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_LLAMA_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `RoPE Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [4096, 32, 32],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [11008, 32, 1],
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const FALCON_LLM = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_FALCON_LLM_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [8192, 1, 1] },
      {
        name: `Multi-Query Attention ${i + 1}`,
        type: "attention",
        dimensions: [8192, 64, 64],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [8192, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [32768, 64, 1],
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

export const TRANSFORMER_XL = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Segment Embeddings", type: "segment", stack: "encoder" },
  { name: "Memory Cache", type: "memory_cache", stack: "encoder" },
  ...Array.from({ length: NUM_TRANSFORMER_XL_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Relative Multi-Head Attention ${i + 1}`,
        type: "relative_attention",
        dimensions: [1024, 16, 64],
        memory_length: 512,
        relative_attention_num_buckets: 32,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Segment-Level Recurrence ${i + 1}`,
        type: "segment_recurrence",
        dimensions: [1024, 16, 1],
        segment_length: 512,
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [4096, 16, 1],
      },
    ],
  })),
  { name: "Final RMSNorm", type: "rmsnorm", stack: "encoder" },
  { name: "Output", type: "output", stack: "encoder" },
];

export const XLNET = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Segment Embeddings", type: "segment", stack: "encoder" },
  {
    name: "Relative Positional Encoding",
    type: "relative_positional",
    stack: "encoder",
  },
  ...Array.from({ length: NUM_XLNET_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Content Stream ${i + 1}`,
        type: "content_stream_attention",
        dimensions: [1024, 16, 64],
        permutation_mask: true,
      },
      {
        name: `Query Stream ${i + 1}`,
        type: "query_stream_attention",
        dimensions: [1024, 16, 64],
        permutation_mask: true,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [4096, 16, 1],
      },
    ],
  })),
  { name: "Final RMSNorm", type: "rmsnorm", stack: "encoder" },
  { name: "Output", type: "output", stack: "encoder" },
];

export const ELECTRA = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  // ELECTRA consists of a generator and a discriminator; focusing on the discriminator
  ...Array.from({ length: NUM_ELECTRA_LAYERS }, (_, i) => ({
    name: `Discriminator Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "Output Layer", type: "output", stack: "encoder" },
];

export const SWITCH_TRANSFORMER = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "encoder",
  },
  ...Array.from({ length: NUM_SWITCH_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Multi-Head Attention ${i + 1}`,
        type: "attention",
        dimensions: [1024, 16, 64],
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Router ${i + 1}`,
        type: "moe_router",
        dimensions: [1024, 1, 1],
        num_experts: 32,
        capacity_factor: 1.5,
      },
      {
        name: `Expert FFN ${i + 1}`,
        type: "moe_ffn",
        dimensions: [65536, 32, 1], // Much larger FFN due to sparsity
        num_experts: 32,
        active_experts: 1, // Top-1 routing
      },
      {
        name: `Load Balancing Loss ${i + 1}`,
        type: "auxiliary_loss",
        dimensions: [32, 1, 1],
      },
    ],
  })),
  { name: "Final RMSNorm", type: "rmsnorm", stack: "encoder" },
  { name: "Output", type: "output", stack: "encoder" },
];

export const ALBERT = [
  {
    name: "Factorized Embedding",
    type: "factorized_embedding",
    stack: "encoder",
    embedding_size: 128, // Reduced embedding size
    hidden_size: 768, // Full hidden size
  },
  { name: "Positional Encoding", type: "positional", stack: "encoder" },
  // Single shared layer that gets reused
  {
    name: "Shared Encoder Layer",
    type: "encoder_layer",
    stack: "encoder",
    shared: true, // Indicates parameter sharing
    sublayers: [
      { name: "Layer Norm 1", type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: "Self-Attention",
        type: "attention",
        dimensions: [768, 12, 64],
      },
      { name: "Layer Norm 2", type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: "Feed Forward",
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  },
  // Sentence-Order Prediction (SOP) head
  {
    name: "Inter-Sentence Coherence",
    type: "sop_head",
    stack: "encoder",
    dimensions: [768, 1, 1],
  },
  { name: "Output", type: "output", stack: "encoder" },
];

export const DISTILBERT = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  {
    name: "Positional Encoding",
    type: "positional",
    stack: "encoder",
  },
  ...Array.from({ length: NUM_DISTILBERT_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "Output Layer", type: "output", stack: "encoder" },
];

export const BIGBIRD = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Embeddings", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_BIGBIRD_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm" },
      {
        name: `Global Attention ${i + 1}`,
        type: "global_attention",
        dimensions: [768, 12, 64],
        num_global_tokens: 2,
      },
      {
        name: `Random Attention ${i + 1}`,
        type: "random_attention",
        dimensions: [768, 12, 64],
        num_random_blocks: 3,
      },
      {
        name: `Window Attention ${i + 1}`,
        type: "window_attention",
        dimensions: [768, 12, 64],
        window_size: 3,
      },
      { name: `Layer Norm 2`, type: "layernorm" },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "Output Layer", type: "output", stack: "encoder" },
];

export const REFORMER = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Sinusoidal Position", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_REFORMER_LAYERS }, (_, i) => ({
    name: `Reversible Layer ${i + 1}`,
    type: "reversible_layer",
    stack: "encoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [512, 1, 1] },
      {
        name: `LSH Attention ${i + 1}`,
        type: "lsh_attention",
        dimensions: [512, 8, 64],
        num_hash_functions: 8,
        bucket_size: 64,
        num_buckets: 32,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [512, 1, 1] },
      {
        name: `Chunked Feed Forward ${i + 1}`,
        type: "chunked_ffn",
        dimensions: [2048, 8, 1],
        chunk_size: 64,
      },
    ],
  })),
  { name: "Final RMSNorm", type: "rmsnorm", stack: "encoder" },
  { name: "Output Layer", type: "output", stack: "encoder" },
];

export const LONGFORMER = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Positional Embeddings", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_LONGFORMER_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [768, 1, 1] },
      {
        name: `Local Attention ${i + 1}`,
        type: "sliding_window_attention",
        dimensions: [768, 12, 64],
        window_size: 512,
      },
      {
        name: `Global Attention ${i + 1}`,
        type: "global_attention",
        dimensions: [768, 12, 64],
        num_global_tokens: 8,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [768, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "Final RMSNorm", type: "rmsnorm", stack: "encoder" },
  { name: "Output Layer", type: "output", stack: "encoder" },
];

export const ERNIE = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Segment Embeddings", type: "segment", stack: "encoder" },
  { name: "Positional Embeddings", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_ERNIE_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
      },
      {
        name: `Knowledge Integration ${i + 1}`,
        type: "knowledge_integration",
        dimensions: [768, 1, 1],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "Output Layer", type: "output", stack: "encoder" },
];

export const XLM = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  { name: "Language Embeddings", type: "language", stack: "encoder" },
  { name: "Positional Embeddings", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_XLM_LAYERS }, (_, i) => ({
    name: `Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm" },
      {
        name: `Cross-Lingual Attention ${i + 1}`,
        type: "attention",
        dimensions: [1024, 16, 64],
      },
      { name: `Layer Norm 2`, type: "layernorm" },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [4096, 1, 1],
      },
    ],
  })),
  { name: "Output Layer", type: "output", stack: "encoder" },
];

// Add to the existing model structures
export const VISION_TRANSFORMER_VIT = [
  { name: "Patch Embedding", type: "embedding", stack: "encoder" },
  { name: "Position Embedding", type: "positional", stack: "encoder" },
  ...Array.from({ length: NUM_VIT_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: `Multi-Head Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "MLP Head", type: "output", stack: "encoder" },
];

export const SWIN_TRANSFORMER = [
  { name: "Patch Embedding", type: "patch_embedding", stack: "encoder" },
  // Stage 1
  ...Array.from({ length: NUM_SWIN_LAYERS_PER_STAGE }, (_, i) => ({
    name: `Stage 1 Layer ${i + 1}`,
    type: "swin_block",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [96, 1, 1] },
      {
        name: `Window Attention ${i % 2 ? "Shifted" : "Regular"}`,
        type: i % 2 ? "shifted_window_attention" : "window_attention",
        dimensions: [96, 7, 7],
        window_size: 7,
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [96, 1, 1] },
      {
        name: `MLP ${i + 1}`,
        type: "mlp",
        dimensions: [384, 1, 1],
      },
    ],
  })),
  { name: "Patch Merging 1", type: "patch_merging", dimensions: [192, 1, 1] },
  // Stage 2 (doubled channels)
  ...Array.from({ length: NUM_SWIN_LAYERS_PER_STAGE }, (_, i) => ({
    name: `Stage 2 Layer ${i + 1}`,
    type: "swin_block",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [192, 1, 1] },
      {
        name: `Window Attention ${i % 2 ? "Shifted" : "Regular"}`,
        type: i % 2 ? "shifted_window_attention" : "window_attention",
        dimensions: [192, 7, 7],
        window_size: 7,
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [192, 1, 1] },
      {
        name: `MLP ${i + 1}`,
        type: "mlp",
        dimensions: [768, 1, 1],
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "encoder" },
  { name: "Global Average Pool", type: "pooling", stack: "encoder" },
];

// Add DeiT structure
export const DEIT = [
  { name: "Patch + Position Embedding", type: "embedding", stack: "encoder" },
  { name: "Class Token", type: "token", stack: "encoder" },
  { name: "Distillation Token", type: "token", stack: "encoder" },
  ...Array.from({ length: NUM_DEIT_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: `Multi-Head Attention ${i + 1}`,
        type: "attention",
        dimensions: [768, 12, 64],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [768, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [3072, 1, 1],
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "encoder" },
  { name: "Classification Head", type: "output", stack: "encoder" },
  { name: "Distillation Head", type: "output", stack: "encoder" },
];

// Add EVA structure
export const EVA = [
  { name: "Patch + Position Embedding", type: "embedding", stack: "encoder" },
  { name: "CLS Token", type: "token", stack: "encoder" },
  ...Array.from({ length: NUM_EVA_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [1408, 1, 1] },
      {
        name: `Multi-Head Attention ${i + 1}`,
        type: "attention",
        dimensions: [1408, 16, 88], // 1408 hidden size, 16 heads
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [1408, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [5632, 1, 1], // 4x hidden size
      },
    ],
  })),
  { name: "Layer Norm", type: "layernorm", stack: "encoder" },
  { name: "Classification Head", type: "output", stack: "encoder" },
];

// SAM_SEGMENT_ANYTHING_MODEL structure
export const SAM_SEGMENT_ANYTHING_MODEL = [
  { name: "Patch + Position Embedding", type: "embedding", stack: "encoder" },
  { name: "Image Encoder", type: "token", stack: "encoder" },
  ...Array.from({ length: NUM_SAM_SEGMENT_ANYTHING_MODEL_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [1280, 1, 1] },
      {
        name: `Multi-Head Attention ${i + 1}`,
        type: "attention",
        dimensions: [1280, 16, 80], // 1280 hidden size, 16 heads
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [1280, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [5120, 1, 1], // 4x hidden size
      },
    ],
  })),
  { name: "Prompt Encoder", type: "encoder", stack: "encoder" },
  { name: "Mask Decoder", type: "decoder", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// SEEM structure
export const SEEM = [
  { name: "Patch + Position Embedding", type: "embedding", stack: "encoder" },
  { name: "Text Encoder", type: "token", stack: "encoder" },
  ...Array.from({ length: NUM_SEEM_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [1024, 1, 1] },
      {
        name: `Multi-Head Attention ${i + 1}`,
        type: "attention",
        dimensions: [1024, 16, 64], // 1024 hidden size, 16 heads
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [1024, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [4096, 1, 1], // 4x hidden size
      },
    ],
  })),
  { name: "Segment Decoder", type: "decoder", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Megatron-LM structure
export const MEGATRON_LM = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_MEGATRON_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [20480, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [20480, 128, 128],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [20480, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [81920, 1, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// DeBERTa structure
export const DEBERTA = [
  { name: "Input Embeddings", type: "embedding", stack: "encoder" },
  {
    name: "Relative Position Encoding",
    type: "disentangled_positional",
    stack: "encoder",
  },
  ...Array.from({ length: NUM_DEBERTA_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [1024, 1, 1] },
      {
        name: `Disentangled Self-Attention ${i + 1}`,
        type: "disentangled_attention",
        content_attention: {
          dimensions: [1024, 16, 64],
          type: "content_stream",
        },
        position_attention: {
          dimensions: [1024, 16, 64],
          type: "position_stream",
        },
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [1024, 1, 1] },
      {
        name: `Enhanced Mask Decoder ${i + 1}`,
        type: "emd",
        dimensions: [1024, 1, 1],
      },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [4096, 1, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "encoder" },
];

// Claude structure
export const CLAUDE = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_CLAUDE_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [8192, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [8192, 64, 64],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [8192, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [32768, 64, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// LaMDA structure
export const LAMDA = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Positional Encoding", type: "positional", stack: "decoder" },
  ...Array.from({ length: NUM_LAMDA_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `Layer Norm 1`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "attention",
        dimensions: [4096, 32, 32],
      },
      { name: `Layer Norm 2`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "ffn",
        dimensions: [16384, 32, 1],
      },
    ],
  })),
  { name: "Final Layer Norm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// LLaMA 2 structure
export const LLAMA_2 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_LLAMA_2_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [4096, 1, 1] },
      {
        name: `RoPE Self-Attention ${i + 1}`,
        type: "rope_attention",
        dimensions: [4096, 32, 32],
      },
      { name: `RMSNorm 2`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `SwiGLU Feed Forward ${i + 1}`,
        type: "swiglu_ffn",
        dimensions: [11008, 32, 1],
      },
    ],
  })),
  { name: "RMSNorm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Mistral structure
export const MISTRAL = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_MISTRAL_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `Sliding Window Attention ${i + 1}`,
        type: "sliding_window_attention",
        dimensions: [4096, 32, 32],
        window_size: 4096,
      },
      {
        name: `GQA ${i + 1}`,
        type: "grouped_query_attention",
        dimensions: [4096, 8, 8],
        num_groups: 8,
      },
      { name: `RMSNorm 2`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `SwiGLU Feed Forward ${i + 1}`,
        type: "swiglu_ffn",
        dimensions: [14336, 32, 1],
      },
    ],
  })),
  { name: "RMSNorm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Mixtral structure (combines Mistral's sliding window + MoE)
export const MIXTRAL = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_MIXTRAL_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [4096, 1, 1] },
      {
        name: `Sliding Window Attention ${i + 1}`,
        type: "sliding_window_attention",
        dimensions: [4096, 32, 32],
        window_size: 4096,
      },
      {
        name: `GQA ${i + 1}`,
        type: "grouped_query_attention",
        dimensions: [4096, 8, 8],
        num_groups: 8,
      },
      { name: `RMSNorm 2`, type: "layernorm", dimensions: [4096, 1, 1] },
      {
        name: `MoE Feed Forward ${i + 1}`,
        type: "moe_ffn",
        dimensions: [14336, 32, 1],
        num_experts: 8,
        active_experts: 2,
      },
    ],
  })),
  { name: "RMSNorm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Phi-2 structure (uses parallel attention and FFN)
export const PHI_2 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_PHI_2_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm`, type: "layernorm", dimensions: [2560, 1, 1] },
      {
        name: `Parallel Attention-FFN ${i + 1}`,
        type: "parallel_transformer",
        attention: {
          type: "attention",
          dimensions: [2560, 32, 32],
        },
        ffn: {
          type: "gated_ffn", // Phi-2 uses gated FFN
          dimensions: [8192, 32, 1],
        },
      },
    ],
  })),
  { name: "RMSNorm", type: "layernorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Gemini structure (multimodal + mixture of experts)
export const GEMINI = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  { name: "Vision Encoder", type: "vision_encoder", stack: "encoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_GEMINI_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [12288, 1, 1] },
      {
        name: `Multi-Query Attention ${i + 1}`,
        type: "multi_query_attention",
        dimensions: [12288, 96, 128],
        num_query_groups: 8,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [12288, 1, 1] },
      {
        name: `MoE Feed Forward ${i + 1}`,
        type: "moe_ffn",
        dimensions: [49152, 96, 1], // 4x hidden size
        num_experts: 8,
        active_experts: 2,
      },
      {
        name: `Cross-Modal Attention ${i + 1}`,
        type: "cross_modal_attention",
        dimensions: [12288, 96, 128],
      },
    ],
  })),
  { name: "RMSNorm", type: "rmsnorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Claude 3 structure (with constitutional AI components)
export const CLAUDE_3 = [
  { name: "Input Embeddings", type: "embedding", stack: "decoder" },
  {
    name: "RoPE Positional Encoding",
    type: "rotary_positional",
    stack: "decoder",
  },
  ...Array.from({ length: NUM_CLAUDE_3_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [8192, 1, 1] },
      {
        name: `Sliding Window Attention ${i + 1}`,
        type: "sliding_window_attention",
        dimensions: [8192, 64, 128],
        window_size: 8192,
      },
      {
        name: `Constitutional Gate ${i + 1}`, // Special Claude 3 feature
        type: "constitutional_gate",
        dimensions: [8192, 1, 1],
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [8192, 1, 1] },
      {
        name: `SwiGLU Feed Forward ${i + 1}`,
        type: "swiglu_ffn",
        dimensions: [32768, 64, 1],
      },
    ],
  })),
  { name: "RMSNorm", type: "rmsnorm", stack: "decoder" },
  { name: "Output", type: "output", stack: "decoder" },
];

// Implement mT5 structure
export const MT5 = [
  {
    name: "Sentencepiece Embeddings",
    type: "embedding",
    stack: "encoder",
    vocab_size: 250000, // Larger vocabulary for multilingual support
  },
  ...Array.from({ length: NUM_MT5_LAYERS }, (_, i) => ({
    name: `Encoder Layer ${i + 1}`,
    type: "encoder_layer",
    stack: "encoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "relative_attention", // Uses relative attention
        dimensions: [1024, 16, 64],
        relative_attention_num_buckets: 32,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "gated_ffn", // Uses gated FFN
        dimensions: [4096, 16, 1],
      },
    ],
  })),
  { name: "Decoder Input", type: "input", stack: "decoder" },
  ...Array.from({ length: NUM_MT5_LAYERS }, (_, i) => ({
    name: `Decoder Layer ${i + 1}`,
    type: "decoder_layer",
    stack: "decoder",
    sublayers: [
      { name: `RMSNorm 1`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Self-Attention ${i + 1}`,
        type: "relative_attention",
        dimensions: [1024, 16, 64],
        relative_attention_num_buckets: 32,
      },
      { name: `RMSNorm 2`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Cross-Attention ${i + 1}`,
        type: "cross_attention",
        dimensions: [1024, 16, 64],
      },
      { name: `RMSNorm 3`, type: "rmsnorm", dimensions: [1024, 1, 1] },
      {
        name: `Feed Forward ${i + 1}`,
        type: "gated_ffn",
        dimensions: [4096, 16, 1],
      },
    ],
  })),
  { name: "Final RMSNorm", type: "rmsnorm", stack: "decoder" },
  { name: "Language-Aware Output", type: "output", stack: "decoder" },
];

///////NOTE////////////////////////////////
//LAYER HEIGHT is not important, it is calculated automatically in TransformerLayers.js

export const LAYER_CONFIGS = {
  VIDEOGEN: {
    layerHeight: 13,
    keyPrefix: "videogen",
    type: "transformer",
  },
  GPT: {
    layerHeight: 12,
    keyPrefix: "gpt",
    type: "transformer",
  },
  TRANSFORMER_ARCHITECTURE: {
    layerHeight: 10,
    keyPrefix: "transformer",
    type: "transformer",
  },
  T5: {
    layerHeight: 10,
    keyPrefix: "t5",
    type: "transformer",
  },
  BART: {
    layerHeight: 10,
    keyPrefix: "bart",
    type: "transformer",
  },
  BERT: {
    layerHeight: 8,
    keyPrefix: "bert",
    type: "transformer",
  },
  ROBERTA: {
    layerHeight: 8,
    keyPrefix: "roberta",
    type: "transformer",
  },
  GPT_2: {
    layerHeight: 8,
    keyPrefix: "gpt2",
    type: "transformer",
  },
  GPT_3: {
    layerHeight: 120,
    keyPrefix: "gpt3",
    type: "transformer",
  },
  GPT_4: {
    layerHeight: 5,
    keyPrefix: "gpt4",
    type: "transformer",
  },
  PALM: {
    layerHeight: 6,
    keyPrefix: "palm",
    type: "transformer",
  },
  PALM_2: {
    layerHeight: 5,
    keyPrefix: "palm2",
    type: "transformer",
  },
  LLAMA: {
    layerHeight: 7,
    keyPrefix: "llama",
    type: "transformer",
  },
  FALCON_LLM: {
    layerHeight: 7,
    keyPrefix: "falcon",
    type: "transformer",
  },
  TRANSFORMER_XL: {
    layerHeight: 10,
    keyPrefix: "transformer_xl",
    type: "transformer",
  },
  XLNET: {
    layerHeight: 10,
    keyPrefix: "xlnet",
    type: "transformer",
  },
  ELECTRA: {
    layerHeight: 10,
    keyPrefix: "electra",
    type: "transformer",
  },
  SWITCH_TRANSFORMER: {
    layerHeight: 10,
    keyPrefix: "switch",
    type: "transformer",
  },
  ALBERT: {
    layerHeight: 10,
    keyPrefix: "albert",
    type: "transformer",
  },
  DISTILBERT: {
    layerHeight: 10,
    keyPrefix: "distilbert",
    type: "transformer",
  },
  BIGBIRD: {
    layerHeight: 10,
    keyPrefix: "bigbird",
    type: "transformer",
  },
  REFORMER: {
    layerHeight: 10,
    keyPrefix: "reformer",
    type: "transformer",
  },
  LONGFORMER: {
    layerHeight: 10,
    keyPrefix: "longformer",
    type: "transformer",
  },
  ERNIE: {
    layerHeight: 10,
    keyPrefix: "ernie",
    type: "transformer",
  },
  XLM: {
    layerHeight: 10,
    keyPrefix: "xlm",
    type: "transformer",
  },

  ///////
  VISION_TRANSFORMER_VIT: {
    layerHeight: 10,
    keyPrefix: "vit",
    type: "transformer",
  },
  SWIN_TRANSFORMER: {
    layerHeight: 10,
    keyPrefix: "swin",
    type: "transformer",
  },
  DEIT: {
    layerHeight: 10,
    keyPrefix: "deit",
    type: "transformer",
  },
  EVA: {
    type: "transformer",
    keyPrefix: "eva",
    layerHeight: 10,
  },
  SAM_SEGMENT_ANYTHING_MODEL: {
    type: "transformer",
    keyPrefix: "sam",
    layerHeight: 10,
  },
  SEEM: {
    type: "transformer",
    keyPrefix: "seem",
    layerHeight: 10,
  },
  MEGATRON_LM: {
    type: "transformer",
    keyPrefix: "megatron",
    layerHeight: 60,
  },
  DEBERTA: {
    type: "transformer",
    keyPrefix: "deberta",
    layerHeight: 60,
  },
  CLAUDE: {
    type: "transformer",
    keyPrefix: "claude",
    layerHeight: 60,
  },
  LAMDA: {
    type: "transformer",
    keyPrefix: "lamda",
    layerHeight: 60,
  },
  LLAMA_2: {
    type: "transformer",
    keyPrefix: "llama2",
    layerHeight: 7,
  },
  MISTRAL: {
    type: "transformer",
    keyPrefix: "mistral",
    layerHeight: 7,
  },
  MIXTRAL: {
    type: "transformer",
    keyPrefix: "mixtral",
    layerHeight: 7,
  },
  PHI_2: {
    type: "transformer",
    keyPrefix: "phi2",
    layerHeight: 7,
  },
  GEMINI: {
    type: "transformer",
    keyPrefix: "gemini",
    layerHeight: 10, // Larger due to multimodal capabilities
  },
  CLAUDE_3: {
    type: "transformer",
    keyPrefix: "claude3",
    layerHeight: 8, // Slightly larger than Claude 2
  },
  MT5: {
    layerHeight: 10,
    keyPrefix: "mt5",
    type: "transformer",
  },
};
export const GRID_CONFIGS = {
  VIDEOGEN: {
    attention: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 3 },
    ffn: { xCount: 12, yCount: 4, xInterval: 2, yInterval: 4 },
    diffusion: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 5 },
    upsample: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 7 },
  },

  TRANSFORMER_ARCHITECTURE: {
    attention: { xCount: 8, yCount: 8, xInterval: 512 / 8, yInterval: 4 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 512 / 8, yInterval: 4 },
    ffn: { xCount: 16, yCount: 4, xInterval: 200.48, yInterval: 5 },
  },
  T5: {
    attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    cross_attention: { xCount: 8, yCount: 8, xInterval: 4, yInterval: 4 },
    ffn: { xCount: 16, yCount: 4, xInterval: 3, yInterval: 5 },
  },
  BART: {
    attention: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 },
    cross_attention: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 24, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  BERT: {
    attention: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 24, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  ROBERTA: {
    attention: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 24, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  GPT: {
    attention: { xCount: 16, yCount: 16, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 32, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  GPT_2: {
    attention: { xCount: 12, yCount: 6, xInterval: 3, yInterval: 3 },
    ffn: { xCount: 24, yCount: 4, xInterval: 2, yInterval: 5 },
  },
  GPT_3: {
    ///Original Values: Drop-off due to performance issues
    // attention: { xCount: 96, yCount: 96, xInterval: 1, yInterval: 1 },
    // ffn: { xCount: 192, yCount: 8, xInterval: 1, yInterval: 3 },
    attention: { xCount: 20, yCount: 6, xInterval: 800, yInterval: 30 },
    ffn: { xCount: 24, yCount: 4, xInterval: 2000, yInterval: 50 },
    reduced: true,
  },
  GPT_4: {
    ///Original Values: Drop-off due to performance issues
    // attention: { xCount: 128, yCount: 128, xInterval: 1, yInterval: 1 },
    // ffn: { xCount: 256, yCount: 8, xInterval: 1, yInterval: 3 },
    attention: { xCount: 32, yCount: 6, xInterval: 300, yInterval: 300 },
    ffn: { xCount: 24, yCount: 4, xInterval: 200, yInterval: 500 },
    reduced: true,
  },
  PALM: {
    ///Original Values: Drop-off due to performance issues
    // attention: { xCount: 128, yCount: 128, xInterval: 1, yInterval: 1 },
    // ffn: { xCount: 256, yCount: 8, xInterval: 1, yInterval: 3 },
    attention: { xCount: 10, yCount: 5, xInterval: 1, yInterval: 1 },
    ffn: { xCount: 12, yCount: 4, xInterval: 1, yInterval: 1 },
    reduced: true,
  },
  PALM_2: {
    ///Original Values: Drop-off due to performance issues
    // attention: { xCount: 160, yCount: 160, xInterval: 1, yInterval: 1 },
    // ffn: { xCount: 320, yCount: 8, xInterval: 1, yInterval: 3 },
    attention: { xCount: 10, yCount: 5, xInterval: 1, yInterval: 1 },
    ffn: { xCount: 14, yCount: 4, xInterval: 1, yInterval: 1 },
    reduced: true,
  },
  LLAMA: {
    ///Original Values: Drop-off due to performance issues
    // attention: { xCount: 32, yCount: 32, xInterval: 2, yInterval: 2 },
    // ffn: { xCount: 64, yCount: 6, xInterval: 1, yInterval: 4 },
    attention: { xCount: 24, yCount: 20, xInterval: 2, yInterval: 2 },
    ffn: { xCount: 24, yCount: 6, xInterval: 1, yInterval: 4 },
    reduced: true,
  },
  FALCON_LLM: {
    ///Original Values: Drop-off due to performance issues
    // attention: { xCount: 32, yCount: 32, xInterval: 2, yInterval: 2 },
    // ffn: { xCount: 64, yCount: 6, xInterval: 1, yInterval: 4 },
    attention: { xCount: 32, yCount: 20, xInterval: 1, yInterval: 1 },
    ffn: { xCount: 64, yCount: 8, xInterval: 1, yInterval: 3 },
    reduced: true,
  },
  TRANSFORMER_XL: {
    relative_attention: {
      xCount: 32,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
      relative_attention_num_buckets: 32,
    },
    segment_recurrence: {
      xCount: 16,
      yCount: 4,
      xInterval: 4,
      yInterval: 4,
      segment_length: 512,
    },
    memory_cache: {
      xCount: 24,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    ffn: {
      xCount: 48,
      yCount: 8,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
  },
  XLNET: {
    content_stream_attention: {
      xCount: 32,
      yCount: 16,
      xInterval: 2,
      yInterval: 2,
      permutation_mask: true,
    },
    query_stream_attention: {
      xCount: 32,
      yCount: 16,
      xInterval: 2,
      yInterval: 2,
      permutation_mask: true,
    },
    ffn: {
      xCount: 48,
      yCount: 8,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
  },
  ELECTRA: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  SWITCH_TRANSFORMER: {
    attention: { xCount: 16, yCount: 8, xInterval: 64, yInterval: 64 },
    moe_ffn: { xCount: 32, yCount: 4, xInterval: 2048, yInterval: 5 },
  },
  ALBERT: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  DISTILBERT: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  BIGBIRD: {
    bigbird_attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  REFORMER: {
    lsh_attention: {
      xCount: 32,
      yCount: 16,
      xInterval: 2,
      yInterval: 2,
      num_hash_functions: 8,
      bucket_size: 64,
    },
    chunked_ffn: {
      xCount: 24,
      yCount: 12,
      xInterval: 4,
      yInterval: 4,
      chunk_size: 64,
    },
    reversible_residual: { xCount: 8, yCount: 2, xInterval: 16, yInterval: 8 },
    rmsnorm: { xCount: 16, yCount: 4, xInterval: 2, yInterval: 2 },
    reduced: true,
  },
  LONGFORMER: {
    sliding_window_attention: {
      xCount: 48,
      yCount: 24,
      xInterval: 2,
      yInterval: 2,
      window_size: 512,
      stride: 256,
    },
    global_attention: {
      xCount: 16,
      yCount: 16,
      xInterval: 8,
      yInterval: 8,
      num_global_tokens: 8,
    },
    global_local_fusion: { xCount: 24, yCount: 12, xInterval: 4, yInterval: 4 },
    ffn: { xCount: 32, yCount: 8, xInterval: 2, yInterval: 2 },
    rmsnorm: { xCount: 16, yCount: 4, xInterval: 2, yInterval: 2 },
    reduced: true,
  },
  ERNIE: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    knowledge_integration: {
      xCount: 12,
      yCount: 1,
      xInterval: 64,
      yInterval: 5,
    },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  XLM: {
    attention: { xCount: 16, yCount: 16, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 32, yCount: 4, xInterval: 128, yInterval: 5 },
  },

  ///////
  VISION_TRANSFORMER_VIT: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  SWIN_TRANSFORMER: {
    window_attention: {
      xCount: 14,
      yCount: 14,
      xInterval: 7,
      yInterval: 7,
      window_size: 7,
    },
    shifted_window_attention: {
      xCount: 14,
      yCount: 14,
      xInterval: 7,
      yInterval: 7,
      window_size: 7,
      shift_size: 3,
    },
    patch_merging: { xCount: 8, yCount: 8, xInterval: 16, yInterval: 16 },
    mlp: { xCount: 16, yCount: 4, xInterval: 64, yInterval: 5 },
  },
  DEIT: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  EVA: {
    attention: { xCount: 12, yCount: 12, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  SAM_SEGMENT_ANYTHING_MODEL: {
    attention: { xCount: 16, yCount: 16, xInterval: 80, yInterval: 80 },
    ffn: { xCount: 32, yCount: 4, xInterval: 160, yInterval: 5 },
  },
  SEEM: {
    attention: { xCount: 16, yCount: 16, xInterval: 64, yInterval: 64 },
    ffn: { xCount: 32, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  MEGATRON_LM: {
    attention: { xCount: 32, yCount: 10, xInterval: 1, yInterval: 1 },
    ffn: { xCount: 64, yCount: 4, xInterval: 1, yInterval: 3 },
    reduced: true, // Following pattern of other large models
  },
  DEBERTA: {
    disentangled_attention: {
      content_stream: { xCount: 16, yCount: 16, xInterval: 32, yInterval: 32 },
      position_stream: { xCount: 16, yCount: 16, xInterval: 32, yInterval: 32 },
    },
    emd: { xCount: 12, yCount: 4, xInterval: 16, yInterval: 4 },
    ffn: { xCount: 24, yCount: 4, xInterval: 128, yInterval: 5 },
  },
  CLAUDE: {
    attention: { xCount: 32, yCount: 10, xInterval: 1, yInterval: 1 },
    ffn: { xCount: 64, yCount: 4, xInterval: 1, yInterval: 3 },
    reduced: true, // Following pattern of other large models
  },
  LAMDA: {
    attention: { xCount: 24, yCount: 10, xInterval: 2, yInterval: 2 },
    ffn: { xCount: 32, yCount: 2, xInterval: 1, yInterval: 4 },
    reduced: true,
  },
  LLAMA_2: {
    attention: { xCount: 32, yCount: 24, xInterval: 2, yInterval: 2 }, // Increased for better attention
    ffn: { xCount: 32, yCount: 8, xInterval: 1, yInterval: 4 }, // Larger FFN
    reduced: true,
  },
  MISTRAL: {
    sliding_window_attention: {
      xCount: 24,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
      window_size: 4096, // Added window size parameter
    },
    grouped_query_attention: {
      xCount: 8,
      yCount: 8,
      xInterval: 4,
      yInterval: 4,
      num_groups: 8, // Added groups parameter
    },
    swiglu_ffn: {
      // Changed to match SwiGLU FFN
      xCount: 28,
      yCount: 6,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      // Added RMSNorm config
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  MIXTRAL: {
    sliding_window_attention: {
      xCount: 24,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
      window_size: 4096,
    },
    grouped_query_attention: {
      xCount: 8,
      yCount: 8,
      xInterval: 4,
      yInterval: 4,
      num_groups: 8,
    },
    moe_ffn: {
      xCount: 32,
      yCount: 8,
      xInterval: 1,
      yInterval: 4,
      num_experts: 8,
      active_experts: 2,
    },
    rmsnorm: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  PHI_2: {
    parallel_transformer: {
      attention: {
        xCount: 24,
        yCount: 16,
        xInterval: 2,
        yInterval: 2,
      },
      gated_ffn: {
        xCount: 28,
        yCount: 6,
        xInterval: 1,
        yInterval: 4,
      },
    },
    rmsnorm: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  GEMINI: {
    multi_query_attention: {
      xCount: 48,
      yCount: 5,
      xInterval: 2,
      yInterval: 2,
      num_query_groups: 8,
    },
    moe_ffn: {
      xCount: 32,
      yCount: 4,
      xInterval: 1,
      yInterval: 4,
      num_experts: 8,
      active_experts: 2,
    },
    cross_modal_attention: {
      xCount: 32,
      yCount: 7,
      xInterval: 2,
      yInterval: 2,
    },
    rmsnorm: {
      xCount: 24,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  CLAUDE_3: {
    sliding_window_attention: {
      xCount: 32,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
      window_size: 8192,
    },
    constitutional_gate: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    swiglu_ffn: {
      xCount: 48,
      yCount: 4,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      xCount: 24,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  PALM: {
    multi_query_attention: {
      xCount: 32,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
      num_query_groups: 8,
    },
    pathway_router: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
      num_paths: 8,
    },
    swiglu_ffn: {
      xCount: 48,
      yCount: 6,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      xCount: 24,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  PALM_2: {
    multi_query_attention: {
      xCount: 40,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
      num_query_groups: 16,
    },
    cross_modal_attention: {
      xCount: 20,
      yCount: 2,
      xInterval: 2,
      yInterval: 2,
      rotation: 90,
    },
    pathway_router: {
      xCount: 20,
      yCount: 1,
      xInterval: 2,
      yInterval: 2,
      num_paths: 16,
    },
    swiglu_ffn: {
      xCount: 64,
      yCount: 2,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      xCount: 32,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  SWITCH_TRANSFORMER: {
    attention: {
      xCount: 32,
      yCount: 16,
      xInterval: 32,
      yInterval: 32,
    },
    moe_router: {
      xCount: 16,
      yCount: 8,
      xInterval: 4,
      yInterval: 4,
      num_experts: 32,
    },
    moe_ffn: {
      xCount: 64,
      yCount: 8,
      xInterval: 128,
      yInterval: 8,
      num_experts: 32,
      active_experts: 1,
    },
    rmsnorm: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    auxiliary_loss: {
      xCount: 8,
      yCount: 4,
      xInterval: 4,
      yInterval: 2,
    },
    reduced: true,
  },
  ALBERT: {
    factorized_embedding: {
      xCount: 16,
      yCount: 8,
      xInterval: 8,
      yInterval: 4,
      reduction_factor: 4,
    },
    attention: {
      xCount: 24,
      yCount: 12,
      xInterval: 32,
      yInterval: 32,
      shared: true, // Indicates shared parameters
    },
    ffn: {
      xCount: 32,
      yCount: 8,
      xInterval: 64,
      yInterval: 8,
      shared: true, // Indicates shared parameters
    },
    sop_head: {
      xCount: 12,
      yCount: 4,
      xInterval: 16,
      yInterval: 4,
    },
    layernorm: {
      xCount: 12,
      yCount: 4,
      xInterval: 8,
      yInterval: 2,
      shared: true,
    },
    reduced: true,
  },
  MT5: {
    relative_attention: {
      xCount: 32,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
      relative_attention_num_buckets: 32,
    },
    cross_attention: {
      xCount: 32,
      yCount: 8,
      xInterval: 2,
      yInterval: 2,
    },
    gated_ffn: {
      xCount: 48,
      yCount: 4,
      xInterval: 1,
      yInterval: 4,
    },
    rmsnorm: {
      xCount: 16,
      yCount: 4,
      xInterval: 2,
      yInterval: 2,
    },
    reduced: true,
  },
  REFORMER: {
    lsh_attention: {
      xCount: 32,
      yCount: 8,
      xInterval: 4,
      yInterval: 4,
      num_hash_functions: 8,
      bucket_size: 64,
    },
    chunked_ffn: {
      xCount: 16,
      yCount: 8,
      xInterval: 8,
      yInterval: 4,
      chunk_size: 64,
    },
    reversible_layer: {
      xCount: 2,
      yCount: 1,
      xInterval: 32,
      yInterval: 1,
    },
    reduced: true,
  },
  BIGBIRD: {
    global_attention: {
      xCount: 32,
      yCount: 16,
      xInterval: 4,
      yInterval: 4,
      num_global_tokens: 2,
    },
    random_attention: {
      xCount: 24,
      yCount: 4,
      xInterval: 3,
      yInterval: 3,
      num_random_blocks: 3,
    },
    window_attention: {
      xCount: 28,
      yCount: 7,
      xInterval: 2,
      yInterval: 2,
      window_size: 3,
    },
    ffn: { xCount: 48, yCount: 8, xInterval: 2, yInterval: 4 },
    layernorm: { xCount: 16, yCount: 4, xInterval: 2, yInterval: 2 },
    reduced: true,
  },
};
