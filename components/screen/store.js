import { create } from "zustand";

// Default state object
const DEFAULT_STATE = {
  // Architecture related
  currentArchitectures: [],
  latestSpeech: "",
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
  latestSpeech: "",
  userName: "",
  introState: 0,
  zoomFactor: 1,
  lastInteractionTime: Date.now(),
};

const useScreenStore = create((set) => ({
  ...DEFAULT_STATE,

  // Simple setters
  setCurrentArchitectures: (architectures) =>
    set({ currentArchitectures: architectures }),
  setLatestSpeech: (speech) => set({ latestSpeech: speech }),
  setMobileVisibility: (visibility) => set({ mobileVisibility: visibility }),
  setZoomFactor: (zoom) => set({ zoomFactor: zoom }),
  setIsProjector: (isProjector) => set({ isProjector }),
  setDeviceIndex: (deviceIndex) => set({ deviceIndex }),
  setTargetMobileId: (mobileId) => set({ targetMobileId: mobileId }),
  setStage: (stage) => set({ stage }),
  setIsTransition: (isTransition) => set({ isTransition }),
  setUserName: (userName) => set({ userName }),
  setIntroState: (introState) => set({ introState }),
  setIsEnding: (isEnding) => set({ isEnding }),

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

      return updates;
    });
  },

  handleNewMobileArchitecture: (data) => {
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
        }
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewMobile: (data) => {
    console.log("New join received:", data);
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {
        lastInteractionTime: Date.now(),
      };

      if (state.targetMobileId !== data.mobileId) {
        updates.targetMobileId = data.mobileId;
      }

      if (state.stage !== "Frontend") {
        updates.stage = "Frontend";
      }

      return updates;
    });
  },

  handleNewMobileIntro: (data) => {
    set((state) => {
      const updates = {
        lastInteractionTime: Date.now(),
      };
      console.log("data", data);

      switch (data.type) {
        case "accelerometer_activation":
          updates.introState = 2;
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
          if (state.userName !== data.username) {
            updates.userName = data.username;
          }
          break;
      }

      return Object.keys(updates).length ? updates : state;
    });
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
