import { create } from "zustand";

// Default state object
const DEFAULT_STATE = {
  // Architecture related
  currentArchitectures: [],
  mobileVisibility: null,
  stage: "Idle",
  iteration: 0,

  // Device settings
  isProjector: true,
  zoomFactor: 1,
  deviceIndex: 5,
  targetMobileId: null,

  // User interaction states
  userName: "",
  introState: 0,
  isTransition: false,
  isEnding: false,
  lastInteractionTime: Date.now(),
  isAccelerometerActive: false,

  sessionId: Date.now().toString(),
};

// Reset state (excluding device-specific settings)
const RESET_STATE = {
  targetMobileId: null,
  stage: "Idle",
  isTransition: false,
  currentArchitectures: [],
  mobileVisibility: null,
  isEnding: false,
  iteration: 0,
  userName: "",
  introState: 0,
  zoomFactor: 1,
  lastInteractionTime: Date.now(),
  isAccelerometerActive: false,

  sessionId: Date.now().toString(),
};

const useScreenStore = create((set) => ({
  ...DEFAULT_STATE,

  // Simple setters
  setCurrentArchitectures: (architectures) =>
    set({ currentArchitectures: architectures }),
  setMobileVisibility: (visibility) => set({ mobileVisibility: visibility }),
  setZoomFactor: (zoom) => set({ zoomFactor: zoom }),
  //get the current zoom factor and invert it
  setIsProjector: (isProjector) => set({ isProjector }),
  setDeviceIndex: (deviceIndex) => set({ deviceIndex }),
  setTargetMobileId: (mobileId) => set({ targetMobileId: mobileId }),
  setStage: (stage) => set({ stage }),
  setIsTransition: (isTransition) => set({ isTransition }),
  setUserName: (userName) => set({ userName }),
  setIntroState: (introState) => set({ introState }),
  setIsEnding: (isEnding) => set({ isEnding }),
  setIsAccelerometerActive: (isAccelerometerActive) =>
    set({ isAccelerometerActive }),
  setSessionId: (sessionId) => set({ sessionId }),

  handleNewMobile: (data) => {
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {
        lastInteractionTime: Date.now(),
      };

      if (state.targetMobileId !== data.mobileId) {
        console.log("updating targetMobileId", data, data.mobileId);
        updates.targetMobileId = data.mobileId;
        console.log(updates.targetMobileId);
      }

      if (state.stage !== "Frontend") {
        updates.stage = "Frontend";
      }

      return updates;
    });
  },

  handleNewMobileIntro: (data) => {
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {
        lastInteractionTime: Date.now(),
      };

      switch (data.type) {
        case "accelerometer_activation":
          updates.introState = 2;
          updates.isAccelerometerActive = data.activated;
          break;
        case "state_change":
          if (state.introState !== data.introState) {
            updates.introState = data.introState;
          }
          break;
        case "username_submit":
          updates.userName = data.username;
          updates.introState = 1;
          break;
        case "username_update":
          updates.introState = 0;
          updates.userName = data.username;
          break;
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewMobileArchitecture: (data) => {
    try {
      set((state) => {
        if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
          return state;
        }

        const updates = {
          lastInteractionTime: Date.now(),
        };

        if (!state.mobileVisibility) {
          updates.mobileVisibility = true;
        }

        if (data.currentArchitectures?.length) {
          updates.currentArchitectures = data.currentArchitectures;
        }

        if (state.introState <= 2) {
          updates.introState = 3;
        }

        return Object.keys(updates).length ? updates : state;
      });
    } catch (e) {
      console.log("handleNewMobileArchitecture error", e);
    }
  },

  handleNewMobileVisibility: (data) => {
    console.log("New visibility received:", data);
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {
        lastInteractionTime: Date.now(),
      };

      if (state.mobileVisibility !== data.isVisible) {
        updates.mobileVisibility = data.isVisible;

        if (data.isVisible && !state.mobileVisibility) {
          updates.iteration = state.iteration + 1;
          updates.stage = "Frontend";
          updates.isTransition = false;
        }
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewControllerInit: (data) => {
    console.log("New controller init received:", data);
    set((state) => {
      if (
        (state.targetMobileId && state.targetMobileId === data.mobileId) ||
        state.stage === "Frontend"
      ) {
        return state;
      }

      const updates = {};

      // Only update if not already set
      if (state.targetMobileId !== data.mobileId) {
        updates.targetMobileId = data.mobileId;
      }

      if (state.stage !== "Frontend") {
        updates.stage = "Frontend";
      }

      // Only add lastInteractionTime if there are other updates
      if (Object.keys(updates).length) {
        updates.lastInteractionTime = Date.now();
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewControllerVisibility: (data) => {
    console.log("New controller visibility received:", data);
    set((state) => {
      // If this screen isn't tracking this mobile or
      // current visibility already matches what controller wants to set, no update needed
      if (
        (state.targetMobileId && state.targetMobileId !== data.mobileId) ||
        state.mobileVisibility === data.isVisible
      ) {
        return state;
      }

      const updates = {};

      updates.mobileVisibility = data.isVisible;

      // Handle iteration increment only when becoming visible
      if (data.isVisible && !state.mobileVisibility) {
        updates.iteration = state.iteration + 1;
      }

      // Only add lastInteractionTime if there are other updates
      if (Object.keys(updates).length) {
        updates.lastInteractionTime = Date.now();
      }

      return updates;
    });
  },

  // Complex handlers
  handleNewControllerArchitectures: (data) => {
    console.log("New architectures received:", data);
    set((state) => {
      const updates = {
        lastInteractionTime: Date.now(),
      };

      if (!state.mobileVisibility) {
        updates.mobileVisibility = true;
      }

      if (data.currentArchitectures?.length) {
        updates.currentArchitectures = data.currentArchitectures;
      }

      if (state.introState <= 2) {
        updates.introState = 3;
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewControllerStageAndReset: (data) => {
    console.log("New controller stage and reset received:", data);
    set((state) => {
      // Reset handling could be more explicit
      if (data.type === "reset" && data.isReset) {
        window.location.reload(true);
        return state; // Explicit return while reload happens
      }

      const updates = {};
      if (data.type === "stage" && state.stage !== data.stage) {
        console.log("updating state from controller!");
        updates.stage = data.stage;
        updates.lastInteractionTime = Date.now();
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewControllerSessionId: ({ sessionId }) => set({ sessionId }),

  handleNewControllerSessionIdDecline: (data) => {
    console.log("session id decline", data);
    console.log(data.mobileId, "mobileId");

    if (data.decline) {
      set((state) => {
        console.log(state);
        console.log(state.targetMobileId, "targetMobileId");
        console.log(data.mobileId, "data.mobileId");
        if (state.targetMobileId === data.mobileId) {
          console.log("299");
          return Object.entries(RESET_STATE).some(
            ([key, value]) => state[key] !== value
          )
            ? RESET_STATE
            : state;
        }
        return state;
      });
    }
  },

  handleReset: () => {
    set((state) => {
      return Object.entries(RESET_STATE).some(
        ([key, value]) => state[key] !== value
      )
        ? RESET_STATE
        : state;
    });
  },

  handleNewScreenConversation: (data) => {
    console.log("New screen conversation received:", data);
  },
}));

export default useScreenStore;
