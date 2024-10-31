import { useCallback } from "react";
import { getWeightedRandom } from "../utils/mathUtils";

export function generateBezierParams(xRange, yRange) {
  return {
    controlX1Factor: getWeightedRandom(-xRange, xRange),
    controlX2Factor: getWeightedRandom(0.7 - xRange, 0.7 + xRange),
    controlY1Factor: getWeightedRandom(10 - yRange, 10 + yRange),
    controlY2Factor: getWeightedRandom(10 - yRange, 10 + yRange),
  };
}

export function createBezierPath(x1, y1, x2, y2, bezierParam, margins) {
  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return "";

  const { inputMargin, outputMargin } = margins;
  const controlX1 = x1 + (x2 - x1) * bezierParam.controlX1Factor;
  const controlY1 = y1 + inputMargin * bezierParam.controlY1Factor;
  const controlX2 = x1 + (x2 - x1) * bezierParam.controlX2Factor;
  const controlY2 = y2 - outputMargin * bezierParam.controlY2Factor;

  return `M${x1},${
    y1 + inputMargin
  } C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${
    y2 - outputMargin
  }`;
}
