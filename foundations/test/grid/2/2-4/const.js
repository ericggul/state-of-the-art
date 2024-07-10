export const ACCELERATION = 0.03;
export const XLEN = 167;
export const YLEN = 50;

export const getRandomMax = (max) => {
  let res = Math.floor(Math.random() * Math.min(max, 10));
  return res == 0 ? " " : res;
};

const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

export function animateBlanks(iteration) {
  const res = [];

  for (let y = 0; y < YLEN; y++) {
    res.push([]);

    let start =
      XLEN * 0.2 +
      XLEN * 0.03 * Math.sin(y * 0.3 + iteration * 0.3) +
      XLEN * 0.04 * Math.cos(y * 0.1 + iteration * 0.15) +
      XLEN * 0.02 * Math.sin(y * 0.5 + iteration * 0.4) -
      XLEN * 0.01 * Math.cos(y * 0.7 + iteration * 0.5) +
      XLEN * 0.02 * Math.sin(y * 0.4 - iteration * 0.3) -
      XLEN * 0.02 * Math.cos(y * 0.6 - iteration * 0.45) +
      getRandom(1, 10) * Math.sin(y * 0.2 + iteration * 0.15);

    let end =
      XLEN * 0.8 +
      XLEN * 0.04 * Math.cos(y * 0.43 + 1 - iteration * 0.33) +
      XLEN * 0.03 * Math.sin(-y * 0.11 + iteration * 0.21) +
      XLEN * 0.03 * Math.cos(-y * 0.33 + iteration * 0.39) -
      XLEN * 0.02 * Math.sin(y * 0.25 - iteration * 0.27) +
      XLEN * 0.02 * Math.cos(y * 0.12 + iteration * 0.24) -
      XLEN * 0.03 * Math.sin(-y * 0.21 - iteration * 0.28) +
      getRandom(1, 10) * Math.cos(y * 0.1 - iteration * 0.13);

    res[y].push([start, end]);
  }
  return res;
}
