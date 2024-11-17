export const MIX_BACKEND_ITERATION = 5;
export const MIX_BACKEND_LEVEL = 6;

export function iterationSpeedMultiplier(iteration) {
  return 1 / iteration;
}

//screen visibility
//hooks > useScreenVisibility
export const TIMEOUTS = {
  //TRANSITION LOGIC
  TRANSITION: 7000,
  BACKEND: 9000,
  PROJECTOR_OFFSET: 2000,
  MOBILE_RESET: 500,

  ////RESET LOGIC
  ENDING: 110 * 1000,
  ENDING_BASE: 50 * 1000,
  RESET: 20 * 1000,
};

//transition: delay between devices
//screen > transition
export const BASE_DELAY = 700;
export const DEVICE_DELAY_MULTIPLIER = 500;

//conversation: black and white time
//backend > useConversation
export const EXTRA_BLACK_TIME = [1500, 4000, 2000, 2000, 1000, 0, 0];
export const WHITE_TIME = [3000, 4000, 3000, 2000, 2000, 1500, 1000];

//heartbeat: mobile
export const HEARTBEAT_INTERVAL = 1000;
