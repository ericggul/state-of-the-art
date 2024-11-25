export const MIX_BACKEND_ITERATION = 5;
export const MIX_BACKEND_LEVEL = 6;

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
  ENDING: 160 * 1000,
  ENDING_BASE: 70 * 1000,
  RESET: 20 * 1000,

  //TEST TEMPORARILY
  // ENDING: 11 * 1000,
  // ENDING_BASE: 5 * 1000,
  // RESET: 15 * 1000,
};

//transition: delay between devices
//screen > transition
export const BASE_DELAY = 700;
export const DEVICE_DELAY_MULTIPLIER = 450;

//conversation: black and white time
//backend > useConversation
export const EXTRA_BLACK_TIME = [1500, 4000, 2000, 2000, 1000, 0, 0];
export const WHITE_TIME = [3000, 4000, 3000, 2000, 2000, 1500, 1000];

export const API_TIMEOUT = 15 * 1000;

//heartbeat: mobile
export const HEARTBEAT_INTERVAL = 2000;
export const HEARTBEAT_TIMEOUT = 8000;
export const PING_INTERVAL = 2000;
export const PING_TIMEOUT = 8000;

///inactivity from frontend
export const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 5 minutes in milliseconds
