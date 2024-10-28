import * as d3 from "d3";

export const DURATION = 200;

export const getVersionColor = (majorVersion) => {
  const colorScale = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8]).range([
    "hsl(180, 100%, 65%)", // Brighter teal
    "hsl(120, 90%, 65%)", // Softer green
    "hsl(60, 90%, 70%)", // Warmer yellow
    "hsl(0, 95%, 65%)", // Vibrant red
    "hsl(240, 90%, 70%)", // Bright blue
    "hsl(300, 90%, 70%)", // Neon purple
    "hsl(30, 95%, 65%)", // Bright orange
    "hsl(150, 95%, 65%)", // Bright turquoise
  ]);
  return majorVersion ? colorScale(majorVersion) : "rgba(255, 255, 255, 0.5)";
};

export const getMajorVersion = (version) => {
  if (!version) return null;
  const match = version.match(/v(\d+)/);
  return match ? parseInt(match[1]) : null;
};
