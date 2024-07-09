export const ACCELERATION = 0.03;
export const XLEN = 167;
export const YLEN = 50;

export const getRandomMax = (max) => {
  let res = Math.floor(Math.random() * Math.min(max, 10));
  return res == 0 ? " " : res;
};

export const TEST_BLANKS = new Array(YLEN)
  .fill([
    [30, 60],
    [140, 150],
  ])
  .map((item, index) => item.map(([a, b], j) => [a - (j % 2 === 0 ? 0 : 1) * index, b + (j % 2 === 1 ? 0 : 1) * index]));
