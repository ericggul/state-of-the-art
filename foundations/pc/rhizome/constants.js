import * as d3 from "d3";

// Animation and Transition Constants
export const DURATION = 200;
export const ANIMATION = {
  WIGGLE: {
    FREQUENCY: 0.01,
    AMPLITUDE: 0.3,
  },
  ALPHA: {
    INITIAL: 0.3,
    TARGET: 0.4,
    IDLE: 0.2,
  },
  JITTER: 0.2,
  SCROLL_INTERVAL: 2000,
};

// Force Simulation Constants
export const FORCE = {
  LINK: {
    DISTANCE: 120,
    STRENGTH: 0.2,
  },
  CHARGE: {
    STRENGTH: -250,
  },
  VELOCITY_DECAY: 0.2,
  ALPHA_DECAY: 0.01,
};

// Visual Style Constants
export const VISUAL = {
  NODE: {
    DEFAULT: {
      RADIUS: 0.5,
      OPACITY: 0.9,
      STROKE_WIDTH: 0.5,
      FONT_SIZE: "0.8vw",
    },
    HIGHLIGHTED: {
      RADIUS: 8,
      OPACITY: 1,
      STROKE_WIDTH: 2.5,
      FONT_SIZE: "1.5vw",
    },
  },
  LINK: {
    CURVE_FACTOR: 0.7,
    STROKE_WIDTH: 1,
    OPACITY: 0.4,
  },
  TEXT: {
    FONT_SIZE: {
      DEFAULT: "0.8vw",
      HIGHLIGHTED: "1.5vw",
    },
    OPACITY: 0.2,
  },
  BOUNDARY: {
    WIDTH_FACTOR: 0.9,
    HEIGHT_FACTOR: 0.95,
  },
};

// Layout Constants
export const LAYOUT = {
  HIGHLIGHT: {
    TARGET: {
      X_FACTOR: 0.5,
      Y_FACTOR: -0.6,
    },
    CONNECTED: {
      X_FACTOR: -0.3,
      Y_SPREAD: 0.5,
    },
    UNCONNECTED: {
      X_FACTOR: -0.4,
      Y_SPREAD: 0.7,
    },
    FORCE: {
      STRENGTH: 1.2,
      VERTICAL_FACTOR: 0.4,
      CONNECTED_FACTOR: 0.5,
      UNCONNECTED_FACTOR: 0.4,
    },
  },
  VERTICAL_SPREAD_FACTOR: 1.5,
};

// Color Scale
export const getVersionColor = (majorVersion) => {
  const colorScale = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8]).range([
    "hsl(160, 85%, 60%)", // Blue-green
    "hsl(170, 90%, 45%)", // Deep sea green
    "hsl(180, 80%, 65%)", // Medium cyan
    "hsl(190, 85%, 50%)", // Ocean blue
    "hsl(200, 75%, 60%)", // Sky blue
    "hsl(165, 80%, 55%)", // Forest green
    "hsl(175, 85%, 40%)", // Dark cyan
    "hsl(185, 70%, 55%)", // Steel blue
  ]);
  return majorVersion ? colorScale(majorVersion) : "rgba(255, 255, 255, 0.5)";
};

export const getMajorVersion = (version) => {
  if (!version) return null;
  const match = version.match(/v(\d+)/);
  return match ? parseInt(match[1]) : null;
};
