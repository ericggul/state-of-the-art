// Constants for model configurations
const INPUT_DIM = [224, 224, 3]; // Standard image input size
const BACKBONE_DIM_CNN = [7, 7, 2048]; // Example output size after CNN backbone
const BACKBONE_DIM_VIT = [14, 14, 768]; // Example for ViT backbone
const PROJECTION_DIM = 128; // Projection head output dimension
const QUEUE_SIZE = 65536; // Queue size for MoCo
const NUM_BACKBONE_LAYERS = 50; // For ResNet-50 backbone
const NUM_VIT_LAYERS = 12; // ViT Base

// SimCLR structure definition
export const SIMCLR = [
  { name: "Input", type: "input", dimensions: INPUT_DIM },
  {
    name: "Backbone (ResNet-50)",
    type: "cnn_backbone",
    dimensions: BACKBONE_DIM_CNN,
    layers: NUM_BACKBONE_LAYERS,
  },
  {
    name: "Projection Head",
    type: "mlp",
    dimensions: [PROJECTION_DIM, 1, 1],
  },
  { name: "Contrastive Loss", type: "loss", dimensions: [1, 1, 1] },
];

// MoCo structure definition
export const MOCO = [
  { name: "Query Input", type: "input", dimensions: INPUT_DIM },
  { name: "Key Input", type: "input", dimensions: INPUT_DIM },
  {
    name: "Query Encoder (ResNet-50)",
    type: "cnn_backbone",
    dimensions: BACKBONE_DIM_CNN,
    layers: NUM_BACKBONE_LAYERS,
  },
  {
    name: "Key Encoder (ResNet-50)",
    type: "cnn_backbone",
    dimensions: BACKBONE_DIM_CNN,
    layers: NUM_BACKBONE_LAYERS,
  },
  {
    name: "Projection Head",
    type: "mlp",
    dimensions: [PROJECTION_DIM, 1, 1],
  },
  {
    name: "Queue",
    type: "memory_bank",
    dimensions: [QUEUE_SIZE, PROJECTION_DIM, 1],
  },
  { name: "Contrastive Loss", type: "loss", dimensions: [1, 1, 1] },
];

// DINO structure definition
export const DINO = [
  { name: "Student Input", type: "input", dimensions: INPUT_DIM },
  { name: "Teacher Input", type: "input", dimensions: INPUT_DIM },
  {
    name: "Student Backbone (ViT)",
    type: "vit_backbone",
    dimensions: BACKBONE_DIM_VIT,
    layers: NUM_VIT_LAYERS,
  },
  {
    name: "Teacher Backbone (ViT)",
    type: "vit_backbone",
    dimensions: BACKBONE_DIM_VIT,
    layers: NUM_VIT_LAYERS,
  },
  {
    name: "Projection Head (Student)",
    type: "mlp",
    dimensions: [PROJECTION_DIM, 1, 1],
  },
  {
    name: "Projection Head (Teacher)",
    type: "mlp",
    dimensions: [PROJECTION_DIM, 1, 1],
  },
  { name: "Cross-Entropy Loss", type: "loss", dimensions: [1, 1, 1] },
];

// DINOv2 structure definition
export const DINOV2 = [
  { name: "Input", type: "input", dimensions: INPUT_DIM },
  {
    name: "ViT Backbone",
    type: "vit_backbone",
    dimensions: BACKBONE_DIM_VIT,
    layers: NUM_VIT_LAYERS,
  },
  {
    name: "Projection Head",
    type: "mlp",
    dimensions: [PROJECTION_DIM, 1, 1],
  },
  { name: "Self-Distillation", type: "distillation", dimensions: [1, 1, 1] },
  { name: "Contrastive Loss", type: "loss", dimensions: [1, 1, 1] },
];

export const MODELS = {
  SIMCLR,
  MOCO,
  DINO,
  DINOV2,
};

// Layer configurations
export const LAYER_CONFIGS = {
  SIMCLR: {
    layerHeight: 20,
    keyPrefix: "simclr",
    type: "self_supervised",
  },
  MOCO: {
    layerHeight: 20,
    keyPrefix: "moco",
    type: "self_supervised",
  },
  DINO: {
    layerHeight: 20,
    keyPrefix: "dino",
    type: "self_supervised",
  },
  DINOV2: {
    layerHeight: 20,
    keyPrefix: "dinov2",
    type: "self_supervised",
  },
};

// Grid configurations
export const GRID_CONFIGS = {
  SIMCLR: {
    input: { xCount: 80, yCount: 80, xInterval: 1, yInterval: 1 },
    cnn_backbone: { xCount: 10, yCount: 10, xInterval: 3, yInterval: 3 },
    mlp: { xCount: 5, yCount: 5, xInterval: 2, yInterval: 2 },
    loss: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  MOCO: {
    input: { xCount: 80, yCount: 80, xInterval: 1, yInterval: 1 },
    cnn_backbone: { xCount: 10, yCount: 10, xInterval: 3, yInterval: 3 },
    mlp: { xCount: 5, yCount: 5, xInterval: 2, yInterval: 2 },
    memory_bank: { xCount: 10, yCount: 10, xInterval: 3, yInterval: 3 },
    loss: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  DINO: {
    input: { xCount: 80, yCount: 80, xInterval: 1, yInterval: 1 },
    vit_backbone: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 },
    mlp: { xCount: 5, yCount: 5, xInterval: 2, yInterval: 2 },
    loss: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
  DINOV2: {
    input: { xCount: 80, yCount: 80, xInterval: 1, yInterval: 1 },
    vit_backbone: { xCount: 12, yCount: 12, xInterval: 3, yInterval: 3 },
    mlp: { xCount: 5, yCount: 5, xInterval: 2, yInterval: 2 },
    distillation: { xCount: 4, yCount: 4, xInterval: 2, yInterval: 2 },
    loss: { xCount: 1, yCount: 1, xInterval: 1, yInterval: 1 },
  },
};
