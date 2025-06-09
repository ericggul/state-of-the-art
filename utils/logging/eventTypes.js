// Event Type Constants for User Interaction Logging
export const EVENT_TYPES = {
  // Session lifecycle
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  
  // Frontend user interactions
  USERNAME_ENTERED: "username_entered",
  ACCELEROMETER_ACTIVATED: "accelerometer_activated",
  ACCELEROMETER_DEACTIVATED: "accelerometer_deactivated",
  ACCELEROMETER_ACTIVITY: "accelerometer_activity",
  INTRO_PROGRESSION: "intro_progression",
  ARCHITECTURE_INTERACTION: "architecture_interaction",
  USER_INACTIVITY_START: "user_inactivity_start",
  VISIBILITY_CHANGE: "visibility_change",
  
  // Key transition points (NO detailed backend logging)
  TRANSITION_TO_BACKEND: "transition_to_backend",
  BACKEND_STARTED: "backend_started",
  ENDING_STARTED: "ending_started",
  
  // Error events
  LOGGING_ERROR: "logging_error",
};

export const INTERACTION_TYPES = {
  SCROLL: "scroll",
  TAP: "tap", 
  ACCELEROMETER: "accelerometer",
};

export const ENGAGEMENT_LEVELS = {
  HIGH: "high",
  MODERATE: "moderate", 
  LOW: "low",
  NONE: "none",
}; 