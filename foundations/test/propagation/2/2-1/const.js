export const ACCELERATION = 0.03;
export const XLEN = 167;
export const YLEN = 50;

export const getRandomMax = (max) => {
  let res = Math.floor(Math.random() * Math.min(max, 10));
  return res == 0 ? " " : res;
};

//COMPLETE RANDOM
function blanksGenerator() {
  const res = [];
  for (let i = 0; i < YLEN; i++) {
    res.push([]);
    for (let j = 0; j < 2; j++) {
      res[i].push([Math.floor(Math.random() * XLEN), Math.floor(Math.random() * XLEN)]);
    }
  }
  return res;
}

export const TEST_BLANKS = blanksGenerator();
