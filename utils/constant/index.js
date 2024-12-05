export const IS_DEPLOYMENT =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

export const MIX_BACKEND_ITERATION = 500;
export const MIX_BACKEND_LEVEL = 6;

export const CONTROLLER_AUTO_RESET_INTERVAL = 60 * 10 * 1000; // 10 minutes in milliseconds

export function iterationSpeedMultiplier(iteration) {
  return 1 / iteration;
}

//screen visibility
//hooks > useScreenVisibility
export const TIMEOUTS = {
  //TRANSITION LOGIC
  TRANSITION: 6500,
  BACKEND: 8500,
  PROJECTOR_OFFSET: 2000,
  MOBILE_RESET: 500,

  ////RESET LOGIC
  ENDING: 150 * 1000,
  ENDING_BASE: 45 * 1000,
  RESET: 20 * 1000,

  //TEST TEMPORARILY
  // ENDING: 11 * 1000,
  // ENDING_BASE: 5 * 1000,
  // RESET: 15 * 1000,
};

//transition: delay between devices
//screen > transition
export const BASE_DELAY = 700;
export const DEVICE_DELAY_MULTIPLIER = 430;

//conversation: black and white time
//backend > useConversation
export const EXTRA_BLACK_TIME = [2500, 5000, 3000, 4000, 1000, 0, 0];
export const WHITE_TIME = [4000, 4000, 4000, 3000, 3000, 1500, 1500];

export const API_TIMEOUT = 15 * 1000;

//heartbeat: mobile
export const HEARTBEAT_INTERVAL = 2000;
export const HEARTBEAT_TIMEOUT = 8000;
export const PING_INTERVAL = 1000;
export const PING_TIMEOUT = 8000;

///inactivity from frontend
export const FRONTEND_INACTIVITY_TIMEOUT = (IS_DEPLOYMENT ? 4 : 8) * 60 * 1000; // 3 minutes
export const INTRO_INACTIVITY_TIMEOUT = 60 * 1000; // 1 minute

//IDLE
export const IDLE_QR_LINK = "https://sota-xdlab.net/mobile";
export const IDLE_MIN_INTERVAL = 7 * 1000;
export const IDLE_MAX_INTERVAL = 20 * 1000;

export const IDLE_TEXTS = [
  "Scan the QR Code to experience the State-of-the-Art.",
  "Experience SoTA: A gallery of neural networks.",
  "Scan the QR, Dive into the State-of-the-Art.",
  "Scan the QR Code to orchestrate artificial intelligence.",
  "Scan the QR to join the canvas of Neural Networks.",
];

export const VERIFY_NAME_TIMEOUT = 3500;

export const SESSION_VALIDITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
