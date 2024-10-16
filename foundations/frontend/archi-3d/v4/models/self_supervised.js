// Constants for model configurations
const INPUT_DIM = [224, 224, 3]; // Standard image input size
const BACKBONE_DIM_CNN = [7, 7, 2048]; // Example output size after CNN backbone
const BACKBONE_DIM_VIT = [14, 14, 768]; // Example for ViT backbone
const PROJECTION_DIM = [128, 1, 1]; // Projection head output dimension
const QUEUE_SIZE = 65536; // Queue size for MoCo
const NUM_BACKBONE_LAYERS = 50; // For ResNet-50 backbone
const NUM_VIT_LAYERS = 12; // ViT Base

// Adjusted dimensions for visualization
const LOSS_DIM = [20, 20, 20]; // Adjusted for better visibility
const DISTILLATION_DIM = [30, 30, 30]; // Adjusted for better visibility

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
    dimensions: PROJECTION_DIM,
  },
  { name: "Contrastive Loss", type: "loss", dimensions: LOSS_DIM },
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
    dimensions: PROJECTION_DIM,
  },
  {
    name: "Queue",
    type: "memory_bank",
    dimensions: [QUEUE_SIZE, PROJECTION_DIM[0], 1],
  },
  { name: "Contrastive Loss", type: "loss", dimensions: LOSS_DIM },
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
    dimensions: PROJECTION_DIM,
  },
  {
    name: "Projection Head (Teacher)",
    type: "mlp",
    dimensions: PROJECTION_DIM,
  },
  { name: "Cross-Entropy Loss", type: "loss", dimensions: LOSS_DIM },
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
    dimensions: PROJECTION_DIM,
  },
  {
    name: "Self-Distillation",
    type: "distillation",
    dimensions: DISTILLATION_DIM,
  },
  { name: "Contrastive Loss", type: "loss", dimensions: LOSS_DIM },
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
    layerHeight: 70,
    keyPrefix: "moco",
    type: "self_supervised",
  },
  DINO: {
    layerHeight: 70,
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
    input: { xCount: 80, yCount: 80, xInterval: 3.5, yInterval: 3.5 },
    cnn_backbone: { xCount: 10, yCount: 10, xInterval: 3, yInterval: 3 },
    mlp: { xCount: 5, yCount: 5, xInterval: 10, yInterval: 10 },
    loss: { xCount: 5, yCount: 5, xInterval: 4, yInterval: 4 },
  },
  MOCO: {
    input: { xCount: 80, yCount: 80, xInterval: 3.5, yInterval: 3.5 },
    cnn_backbone: { xCount: 10, yCount: 10, xInterval: 2, yInterval: 2 },
    mlp: { xCount: 5, yCount: 5, xInterval: 100, yInterval: 50 },
    memory_bank: { xCount: 10, yCount: 10, xInterval: 5000, yInterval: 20 },
    loss: { xCount: 5, yCount: 5, xInterval: 4, yInterval: 4 },
  },
  DINO: {
    input: { xCount: 80, yCount: 80, xInterval: 3.5, yInterval: 3.5 },
    vit_backbone: { xCount: 12, yCount: 12, xInterval: 2, yInterval: 2 },
    mlp: { xCount: 5, yCount: 5, xInterval: 2, yInterval: 2 },
    loss: { xCount: 5, yCount: 5, xInterval: 4, yInterval: 4 },
  },
  DINOV2: {
    input: { xCount: 80, yCount: 80, xInterval: 3.5, yInterval: 3.5 },
    vit_backbone: { xCount: 12, yCount: 12, xInterval: 2, yInterval: 2 },
    mlp: { xCount: 5, yCount: 5, xInterval: 2, yInterval: 2 },
    distillation: { xCount: 6, yCount: 6, xInterval: 5, yInterval: 5 },
    loss: { xCount: 5, yCount: 5, xInterval: 4, yInterval: 4 },
  },
};
