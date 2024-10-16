const BACKBONE_DIM = 2048;
const PROJECTION_DIM = 128;

export const SIMCLR = [
  { name: "Input", type: "input", dimensions: [224, 224, 3] },
  { name: "CNN Backbone", type: "cnn", dimensions: [BACKBONE_DIM, 1, 1] },
  { name: "Projection Head", type: "mlp", dimensions: [PROJECTION_DIM, 1, 1] },
  { name: "Contrastive Loss", type: "loss", dimensions: [1, 1, 1] },
];

export const MOCO = [
  { name: "Query Input", type: "input", dimensions: [224, 224, 3] },
  { name: "Key Input", type: "input", dimensions: [224, 224, 3] },
  { name: "Query Encoder", type: "cnn", dimensions: [BACKBONE_DIM, 1, 1] },
  { name: "Key Encoder", type: "cnn", dimensions: [BACKBONE_DIM, 1, 1] },
  { name: "Queue", type: "memory", dimensions: [BACKBONE_DIM, 65536, 1] },
  { name: "Contrastive Loss", type: "loss", dimensions: [1, 1, 1] },
];

export const DINO = [
  { name: "Student Input", type: "input", dimensions: [224, 224, 3] },
  { name: "Teacher Input", type: "input", dimensions: [224, 224, 3] },
  { name: "Student Backbone", type: "vit", dimensions: [BACKBONE_DIM, 1, 1] },
  { name: "Teacher Backbone", type: "vit", dimensions: [BACKBONE_DIM, 1, 1] },
  { name: "Student Head", type: "mlp", dimensions: [PROJECTION_DIM, 1, 1] },
  { name: "Teacher Head", type: "mlp", dimensions: [PROJECTION_DIM, 1, 1] },
  { name: "Cross-entropy Loss", type: "loss", dimensions: [1, 1, 1] },
];

export const DINOV2 = [
  { name: "Input", type: "input", dimensions: [224, 224, 3] },
  { name: "ViT Backbone", type: "vit", dimensions: [BACKBONE_DIM, 1, 1] },
  { name: "iBoT Head", type: "mlp", dimensions: [PROJECTION_DIM, 1, 1] },
  { name: "Self-Distillation", type: "distillation", dimensions: [1, 1, 1] },
  { name: "Multi-crop", type: "augmentation", dimensions: [1, 1, 1] },
  { name: "Masked Image Modeling", type: "masking", dimensions: [1, 1, 1] },
  { name: "Combined Loss", type: "loss", dimensions: [1, 1, 1] },
];

export const MODELS = {
  SIMCLR,
  MOCO,
  DINO,
  DINOV2,
};

export const LAYER_CONFIGS = {
  SIMCLR: {
    layerHeight: 60,
    keyPrefix: "simclr",
    type: "self_supervised",
  },
  MOCO: {
    layerHeight: 60,
    keyPrefix: "moco",
    type: "self_supervised",
  },
  DINO: {
    layerHeight: 60,
    keyPrefix: "dino",
    type: "self_supervised",
  },
  DINOV2: {
    layerHeight: 60,
    keyPrefix: "dinov2",
    type: "self_supervised",
  },
};

export const GRID_CONFIGS = {
  SIMCLR: {
    input: { xCount: 72, yCount: 72, xInterval: 1, yInterval: 1 },
    cnn: { xCount: 10, yCount: 10, xInterval: 5, yInterval: 5 },
    mlp: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 5 },
    loss: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  MOCO: {
    input: { xCount: 224, yCount: 224, xInterval: 1, yInterval: 1 },
    cnn: { xCount: 10, yCount: 10, xInterval: 5, yInterval: 5 },
    memory: { xCount: 16, yCount: 16, xInterval: 5, yInterval: 5 },
    loss: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  DINO: {
    input: { xCount: 224, yCount: 224, xInterval: 1, yInterval: 1 },
    vit: { xCount: 12, yCount: 12, xInterval: 5, yInterval: 5 },
    mlp: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 5 },
    loss: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
  DINOV2: {
    input: { xCount: 224, yCount: 224, xInterval: 1, yInterval: 1 },
    vit: { xCount: 12, yCount: 12, xInterval: 5, yInterval: 5 },
    mlp: { xCount: 8, yCount: 8, xInterval: 5, yInterval: 5 },
    distillation: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 5 },
    augmentation: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 5 },
    masking: { xCount: 4, yCount: 4, xInterval: 5, yInterval: 5 },
    loss: { xCount: 1, yCount: 1, xInterval: 5, yInterval: 5 },
  },
};
