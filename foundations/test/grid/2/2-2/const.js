export const ACCELERATION = 0.03;
export const XLEN = 167;
export const YLEN = 50;

export const getRandomMax = (max) => {
  let res = Math.floor(Math.random() * Math.min(max, 10));
  return res == 0 ? " " : res;
};

//IMPLEMENTED SIGMOID
const inverseSigmoid = (x) => {
  return Math.log(x / (1 - x));
};

function blanksGenerator() {
  const res = [];
  for (let y = 0; y < YLEN; y++) {
    res.push([]);

    const adjustedY = YLEN - 1 - y;
    const sigmoidVal = inverseSigmoid(adjustedY * (1 / (YLEN - 1))) * 80;
    const VAL = 600;

    const stretchedVal = ((sigmoidVal + VAL) * XLEN) / (2 * VAL);

    console.log(adjustedY, sigmoidVal, stretchedVal);

    res[y].push([stretchedVal, XLEN]);

    for (let j = 0; j < 2; j++) {
      // res[i].push([
      //   sigmoidVal, XLEN
      // ]);
    }
  }
  return res;
}

export const TEST_BLANKS = blanksGenerator();
