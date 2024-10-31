// Move the current mathUtils.js content here - it's identical
export const getRandom = (a, b) => Math.random() * (b - a) + a;

export const getWeightedRandom = (min, max) => {
  const range = max - min;
  const mid = (min + max) / 2;
  const r = Math.random();
  return r < 0.5
    ? min + Math.sqrt(r * range * (mid - min))
    : max - Math.sqrt((1 - r) * range * (max - mid));
};

export const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 10,
  controlY2Factor: 5,
};
