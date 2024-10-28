import * as d3 from "d3";

export const DURATION = 300;

export const getVersionColor = (majorVersion) => {
  const colorScale = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8]).range([
    "hsl(180, 100%, 70%)", // v1 - Teal
    "hsl(120, 100%, 70%)", // v2 - Green
    "hsl(60, 100%, 70%)", // v3 - Yellow
    "hsl(0, 100%, 70%)", // v4 - Red
    "hsl(240, 100%, 70%)", // v5 - Blue
    "hsl(300, 100%, 70%)", // v6 - Purple
    "hsl(30, 100%, 70%)", // v7 - Orange
    "hsl(150, 100%, 70%)", // v8 - Turquoise
  ]);
  return majorVersion ? colorScale(majorVersion) : "rgba(255, 255, 255, 0.7)";
};

export const getMajorVersion = (version) => {
  if (!version) return null;
  const match = version.match(/v(\d+)/);
  return match ? parseInt(match[1]) : null;
};
