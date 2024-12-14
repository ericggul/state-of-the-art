export const IS_DEPLOYMENT =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

export const MIX_BACKEND_ITERATION = 500;
export const MIX_BACKEND_LEVEL = 6;

export const CONTROLLER_AUTO_RESET_INTERVAL = 200 * 1000; // 10 minutes in milliseconds

export function iterationSpeedMultiplier(iteration) {
  return 1 / iteration;
}

//screen visibility
//hooks > useScreenVisibility
export const TIMEOUTS = {
  //TRANSITION LOGIC
  TRANSITION: 7 * 1000,
  BACKEND: 9.1 * 1000,
  PROJECTOR_OFFSET: 2000,
  MOBILE_RESET: 500,

  ////RESET LOGIC
  ENDING: 130 * 1000,
  ENDING_BASE: 45 * 1000,
  RESET: 18 * 1000,
  RESET_FRONTEND: 0.2 * 1000,
};

//transition: delay between devices
//screen > transition
// export const BASE_DELAY = 700;
// export const DEVICE_DELAY_MULTIPLIER = 430;
export const BASE_DELAY = 800;
export const DEVICE_DELAY_MULTIPLIER = 450;

//conversation: black and white time
//backend > useConversation
export const EXTRA_BLACK_TIME = [0, 4000, 1000, 1000, 0, 0, 0];
export const WHITE_TIME = [5000, 2500, 2000, 4000, 4000, 1500, 1500];

export const API_TIMEOUT = 15 * 1000;

//heartbeat: mobile
export const HEARTBEAT_INTERVAL = 2000;
export const HEARTBEAT_TIMEOUT = 8000;
export const PING_INTERVAL = 1000;
export const PING_TIMEOUT = 8000;

///inactivity from frontend
// export const FRONTEND_INACTIVITY_TIMEOUT =
//   (IS_DEPLOYMENT ? 1.5 : 8) * 60 * 1000; // 90 seconds
export const FRONTEND_INACTIVITY_TIMEOUT =
  (IS_DEPLOYMENT ? 1.5 : 10) * 60 * 1000; // 90 seconds
export const INTRO_INACTIVITY_TIMEOUT = 25 * 1000;
export const INACTIVITY_TIMEOUT = 15 * 1000;

//IDLE
export const IDLE_QR_LINK = IS_DEPLOYMENT
  ? "https://sota-xdlab.net/mobile"
  : typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.host}/mobile`
  : "http://localhost:3000/mobile";
export const IDLE_MIN_INTERVAL = 6 * 1000;
export const IDLE_MAX_INTERVAL = 22 * 1000;

export const IDLE_TEXTS = [
  "Scan the QR Code to experience the State-of-the-Art.",
  "Experience SoTA: A gallery of neural networks.",
  "Scan the QR, Dive into the State-of-the-Art.",
  "Scan the QR Code to orchestrate artificial intelligence.",
  "Scan the QR to join the canvas of Neural Networks.",
];

export const VERIFY_NAME_TIMEOUT = 3500;

// export const SESSION_VALIDITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
export const SESSION_VALIDITY_TIMEOUT = 200 * 1000; // 3 minutes in milliseconds
