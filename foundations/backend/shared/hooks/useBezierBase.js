import { useCallback } from "react";
import { getWeightedRandom } from "../utils/mathUtils";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export function generateBezierParams(xRange, yRange) {
  return {
    // controlX1Factor: getWeightedRandom(-xRange, xRange),
    // controlX2Factor: getWeightedRandom(0.5 - xRange, 0.5 + xRange),
    // controlY1Factor: getWeightedRandom(10 - yRange, 10 + yRange),
    // controlY2Factor: getWeightedRandom(10 - yRange, 10 + yRange),

    // controlX1Factor: getWeightedRandom(-xRange, xRange),
    // controlX2Factor: getWeightedRandom(0.7 - xRange, 0.7 + xRange),
    // controlY1Factor: getWeightedRandom(10 - yRange, 10 + yRange),
    // controlY2Factor: getWeightedRandom(10 - yRange, 10 + yRange),

    controlX1Factor: getRandom(-xRange, xRange),
    controlX2Factor: getRandom(0.7 - xRange, 0.7 + xRange),
    controlY1Factor: getRandom(10 - yRange, 10 + yRange),
    controlY2Factor: getRandom(10 - yRange, 10 + yRange),
  };
}
