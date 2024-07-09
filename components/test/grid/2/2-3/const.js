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
  for (let y = 0; y < YLEN; y++) {
    res.push([]);

    const adjustedY = YLEN - 1 - y;

    const sigmoidA = inverseSigmoid((adjustedY - 3) * (1 / (YLEN - 1))) * 80;
    const sigmoidB = inverseSigmoid((adjustedY + 3) * (1 / (YLEN - 1))) * 80;

    const STRETCH_X = 600;

    const strechVal = (v) => ((v + STRETCH_X) * XLEN) / (2 * STRETCH_X);

    res[y].push([strechVal(sigmoidA), strechVal(sigmoidB)]);

    for (let j = 0; j < 2; j++) {
      // res[i].push([
      //   sigmoidVal, XLEN
      // ]);
    }
  }
  return res;
}

export const TEST_BLANKS = blanksGenerator();
