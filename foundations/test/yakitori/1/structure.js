// utils/generateStructure.js

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandom = (min, max) => Math.random() * (max - min) + min;

export const generateStructure = (layerCount = 17) => {
  const structure = [];
  const colorVariations = ["hsl(240, 100%, 50%)", "blue"];

  for (let i = 0; i < layerCount; i++) {
    const positionZ = 10 * (i - (layerCount - 1) / 2);
    const gridXCount = getRandomInt(2, 5);
    const gridYCount = getRandomInt(2, 5);
    const xInterval = getRandom(3, 5);
    const yInterval = getRandom(3, 5);

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
