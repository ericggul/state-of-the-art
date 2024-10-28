import * as d3 from "d3";

export const DURATION = 200;

export const getVersionColor = (majorVersion) => {
  const colorScale = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8]).range([
    "hsl(180, 100%, 50%)", // v1 - Teal
    "hsl(120, 100%, 50%)", // v2 - Green
    "hsl(60, 100%, 50%)", // v3 - Yellow
    "hsl(0, 100%, 50%)", // v4 - Red
    "hsl(240, 100%, 50%)", // v5 - Blue
    "hsl(300, 100%, 50%)", // v6 - Purple
    "hsl(30, 100%, 50%)", // v7 - Orange
    "hsl(150, 100%, 50%)", // v8 - Turquoise
  ]);
  return majorVersion ? colorScale(majorVersion) : "rgba(255, 255, 255, 0.7)";
};

export const getMajorVersion = (version) => {
  if (!version) return null;
  const match = version.match(/v(\d+)/);
  return match ? parseInt(match[1]) : null;
};
