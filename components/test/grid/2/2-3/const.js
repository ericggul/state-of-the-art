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

function blanksGenerator() {
  const res = [];

  const cutFrom = YLEN * 0.9;

  for (let y = 0; y < YLEN; y++) {
    res.push([]);

    let start = 0;
    if (y < cutFrom) {
      start = XLEN * 0.5 + (((cutFrom - y) * XLEN) / YLEN) * 0.7;
    }

    res[y].push([start, XLEN]);

    for (let j = 0; j < 2; j++) {
      // res[i].push([
      //   sigmoidVal, XLEN
      // ]);
    }
  }
  return res;
}

export const TEST_BLANKS = blanksGenerator();
