import { getImageData, processImage } from "./utils";

export const ACCELERATION = 0.03;
export const XLEN = 167;
export const YLEN = 50;

export const getRandomMax = (max) => {
  let res = Math.floor(Math.random() * Math.min(max, 10));
  return res == 0 ? " " : res;
};

// Implemented sigmoid
const inverseSigmoid = (x) => {
  return Math.log(x / (1 - x));
};

export async function blanksGenerator(imagePath) {
  const imageData = await getImageData(imagePath);
  const processedResult = processImage(imageData);

  const res = [];
  for (let y = 0; y < YLEN; y++) {
    res.push([]);
    for (let x = 0; x < XLEN; x++) {
      if (processedResult[y][x] === " ") {
        res[y].push([x, x]);
      } else {
        res[y].push([x, x, processedResult[y][x]]);
      }
    }
  }
  return res;
}
