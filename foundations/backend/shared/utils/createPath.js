export function createArcPath(x1, y1, x2, y2, params) {
  const { yMargin, dir = 1 } = params;
  const radius = Math.abs(x2 - x1) / 2;
  const sweepFlag = dir;
  const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * (x1 < x2 ? 1 : -1) * yMargin;
  const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * (x1 < x2 ? 1 : -1) * yMargin;

  return `M${x1} ${y1Adjusted} A${radius} ${
    radius * 0.6
  } 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
}

export function createRadialPath(x1, y1, x2, y2, params) {
  const { margin, radialIdx, dir = 1 } = params;
  const radius = Math.abs(x2 - x1) / 2;
  const sweepFlag = dir;
  const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * margin;
  const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * margin;

  return `M${x1} ${y1Adjusted} A${radius} ${
    radius * radialIdx
  } 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
}

export function createBezierPathV3(x1, y1, x2, y2, bezierParams, margins) {
  const { inputMargin, outputMargin } = margins;
  const followVal = (val) => val;

  const controlX1 = x1 + (x2 - x1) * followVal(bezierParams.controlX1Factor);
  const controlY1 = y1 + inputMargin * followVal(bezierParams.controlY1Factor);
  const controlX2 = x1 + (x2 - x1) * followVal(bezierParams.controlX2Factor);
  const controlY2 = y2 - outputMargin * followVal(bezierParams.controlY2Factor);

  return `M${x1},${
    y1 + inputMargin
  } C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${
    y2 - outputMargin
  }`;
}

export function createBezierPathV4(x1, y1, x2, y2, bezierParam, margins) {
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
