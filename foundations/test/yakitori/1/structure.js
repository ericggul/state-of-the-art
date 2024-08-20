// utils/generateStructure.js
export const generateStructure = (layerCount = 17) => {
  const structure = [];
  const colorVariations = ["hsl(240, 100%, 50%)", "blue"];

  for (let i = 0; i < layerCount; i++) {
    const positionZ = 40 - i * 10; // Example: start at 40 and decrease by 10 for each layer
    const gridXCount = i % 2 === 0 ? 3 : 5;
    const gridYCount = i % 2 === 0 ? 2 : 5;
    const xInterval = i % 2 === 0 ? 5 : 3;
    const yInterval = i % 2 === 0 ? 5 : 3;

    structure.push({
      position: [0, 0, positionZ],
      node: {
        size: [4, 4, 0.3],
      },
      unexpandedNode: {
        size: [8, 8, 0.3],
      },
      grid: {
        xCount: gridXCount,
        yCount: gridYCount,
        xInterval: xInterval,
        yInterval: yInterval,
      },
      color: colorVariations[i % colorVariations.length],
    });
  }

  return structure;
};
