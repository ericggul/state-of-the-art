export const ACCELERATION = 0.03;
export const XLEN = 167;
export const YLEN = 50;

export const getRandomMax = (max) => {
  let res = Math.floor(Math.random() * Math.min(max, 10));
  return res == 0 ? " " : res;
};

//SIGMOID VARIATION
const inverseSigmoid = (x) => {
  return Math.log(x / (1 - x));
};

export function animateBlanks(cutFromIdx) {
  const res = [];

  const cutFrom = YLEN * cutFromIdx;

  for (let y = 0; y < YLEN; y++) {
    res.push([]);

    let start = 0;
    if (y < cutFrom) {
      start = XLEN * 0.5 + (((cutFrom - y) * XLEN) / YLEN) * 0.7;
    }

    res[y].push([start, XLEN]);
  }
  return res;
}
