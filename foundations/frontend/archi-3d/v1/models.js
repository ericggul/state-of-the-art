import { STRUCTURE, NUM_ENCODER_LAYERS, NUM_DECODER_LAYERS } from "./structure";

const calculateNodeSize = (dimensions) => {
  const maxDim = Math.max(...dimensions);
  const scale = 10 / maxDim;
  return dimensions.map((d) => d * scale);
};

export const MODELS = {
  videoGen: {
    cameraPosition: [-100, 50, 150],
    layerSpacing: 13,
    structure: STRUCTURE.map((layer) => {
      let nodeSize, gridConfig;

      if (layer.type === "encoder_layer" || layer.type === "decoder_layer") {
        const sublayerSize = calculateNodeSize(layer.sublayers[0].dimensions);
        nodeSize = sublayerSize;
        gridConfig = {
          xCount: 2,
          yCount: layer.sublayers.length,
          xInterval: sublayerSize[0] * 1.2,
          yInterval: sublayerSize[1] * 1.2,
        };
      } else {
        nodeSize = [10, 10, 1]; // Default size for other layers
        gridConfig = { xCount: 1, yCount: 1, xInterval: 12, yInterval: 12 };
      }

      return {
        name: layer.name,
        type: layer.type,
        stack: layer.stack,
        unexpandedNode: { size: [30, 10, 10] },
        node: { size: nodeSize },
        grid: gridConfig,
        color: layer.stack === "encoder" ? "blue" : "green",
      };
    }),
  },
  alexNet: {
    cameraPosition: [40, 30, 50],
    layerSpacing: 60,
    structure: [
      {
        unexpandedNode: { size: [227, 227, 0.3] },
        node: { size: [113.5, 113.5, 1] },
        grid: { xCount: 3, yCount: 1, xInterval: 124.85, yInterval: 124.85 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [55, 55, 9.6] },
        node: { size: [27.5, 27.5, 1] },
        grid: { xCount: 12, yCount: 8, xInterval: 30.25, yInterval: 30.25 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [27, 27, 9.6] },
        node: { size: [13.5, 13.5, 1] },
        grid: { xCount: 12, yCount: 8, xInterval: 14.85, yInterval: 14.85 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [27, 27, 25.6] },
        node: { size: [13.5, 13.5, 1] },
        grid: { xCount: 16, yCount: 16, xInterval: 14.85, yInterval: 14.85 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [13, 13, 25.6] },
        node: { size: [6.5, 6.5, 1] },
        grid: { xCount: 16, yCount: 16, xInterval: 7.15, yInterval: 7.15 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [13, 13, 38.4] },
        node: { size: [6.5, 6.5, 1] },
        grid: { xCount: 24, yCount: 16, xInterval: 7.15, yInterval: 7.15 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [13, 13, 38.4] },
        node: { size: [6.5, 6.5, 1] },
        grid: { xCount: 24, yCount: 16, xInterval: 7.15, yInterval: 7.15 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [13, 13, 25.6] },
        node: { size: [6.5, 6.5, 1] },
        grid: { xCount: 16, yCount: 16, xInterval: 7.15, yInterval: 7.15 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [6, 6, 25.6] },
        node: { size: [3, 3, 1] },
        grid: { xCount: 16, yCount: 16, xInterval: 3.3, yInterval: 3.3 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [4096, 1, 0.1] },
        node: { size: [20, 1, 1] },
        grid: { xCount: 1, yCount: 1, xInterval: 22, yInterval: 1 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [4096, 1, 0.1] },
        node: { size: [20, 1, 1] },
        grid: { xCount: 1, yCount: 1, xInterval: 22, yInterval: 1 },
        color: "hsl(240, 100%, 50%)",
      },
      {
        unexpandedNode: { size: [1000, 1, 0.1] },
        node: { size: [10, 1, 1] },
        grid: { xCount: 1, yCount: 1, xInterval: 12, yInterval: 1 },
        color: "hsl(240, 100%, 50%)",
      },
    ],
  },
};
