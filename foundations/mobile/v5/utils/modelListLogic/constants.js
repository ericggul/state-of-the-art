export const CONSTANTS = {
  INTERSECTION_OPTIONS: {
    root: null,
    rootMargin: "100px 0px",
    threshold: [0, 0.1, 0.5, 1],
  },
  LIST_OBSERVER_OPTIONS: { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
  NEW_MODELS_COUNT: 37,
  INITIAL_SCROLL_ITEMS: 100,
  USER_SCROLL_THRESHOLD: 100,
  SCROLL_HINT_DURATION: 4000,
  INITIAL_SCROLL_DELAY: 0,
  SCROLL_ANIMATION_DURATION: 1000,
  SCROLL_MOMENTUM: {
    multiplier: 0.8, // Reduces scroll speed
    threshold: 100, // Minimum scroll distance before applying momentum
    maxSpeed: 1000, // Maximum scroll speed in pixels/second
  },
};
