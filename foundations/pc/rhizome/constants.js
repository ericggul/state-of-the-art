import * as d3 from "d3";

// Animation and Transition Constants
export const KEY_HUE = 230;

export const DURATION = 200;
export const ANIMATION = {
  WIGGLE: {
    FREQUENCY: 0.008,
    AMPLITUDE: 3.5,
  },
  ALPHA: {
    INITIAL: 0.4,
    TARGET: 0.7,
    IDLE: 0.15,
  },
  JITTER: 0.4,
  SCROLL_INTERVAL: 2000,
};

// Force Simulation Constants
export const FORCE = {
  LINK: {
    DISTANCE: 50,
    STRENGTH: 0.3,
  },
  CHARGE: {
    STRENGTH: -250,
  },
  VELOCITY_DECAY: 0.25,
  ALPHA_DECAY: 0.001,
};

// Visual Style Constants
export const VISUAL = {
  NODE: {
    DEFAULT: {
      RADIUS: 2.0,
      OPACITY: 0.5,
      STROKE_WIDTH: 1,
      FONT_SIZE: "0.75vw",
    },
    HIGHLIGHTED: {
      RADIUS: 6,
      OPACITY: 1,
      STROKE_WIDTH: 4,
      FONT_SIZE: "1.5vw",
    },
    SUB_HIGHLIGHTED: {
      RADIUS: 4,
      OPACITY: 0.95,
      STROKE_WIDTH: 2,
      FONT_SIZE: "1.2vw",
    },
  },
  LINK: {
    CURVE_FACTOR: 0.3,
    STROKE_WIDTH: 0.8,
    OPACITY: 0.35,
    HIGHLIGHTED: {
      OPACITY: 1.0,
      STROKE_WIDTH: 2,
    },
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
      // X_FACTOR: 0.6,
      // Y_FACTOR: 0.7,
      X_FACTOR: 0.5,
      Y_FACTOR: 0.8,
    },
    CONNECTED: {
      X_FACTOR: 0.4,
      Y_SPREAD: 1.0,
    },
    UNCONNECTED: {
      X_FACTOR: -0.45,
      Y_SPREAD: 1.2,
    },
    FORCE: {
      STRENGTH: 0.9,
      VERTICAL_FACTOR: 0.4,
      CONNECTED_FACTOR: 0.8,
      UNCONNECTED_FACTOR: 0.08,
    },
  },
  VERTICAL_SPREAD_FACTOR: 1.5,
};

// Color Scale
export const getVersionColor = (majorVersion, hue = 230) => {
  const colorScale = d3
    .scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8])
    .range([
      `hsl(${hue - 18}, 100%, 65%)`, // -20
      `hsl(${hue - 10}, 100%, 50%)`, // -10
      `hsl(${hue}, 100%, 70%)`, // base hue
      `hsl(${hue + 13}, 100%, 55%)`, // +10
      `hsl(${hue + 13}, 100%, 65%)`, // +20
      `hsl(${hue - 15}, 100%, 60%)`, // -15
      `hsl(${hue - 5}, 100%, 45%)`, // -5
      `hsl(${hue + 5}, 100%, 60%)`, // +5
    ]);
  return majorVersion ? colorScale(majorVersion) : "rgba(255, 255, 255, 0.6)";
};

export const getMajorVersion = (version) => {
  if (!version) return null;
  const match = version.match(/v(\d+)/);
  return match ? parseInt(match[1]) : null;
};
