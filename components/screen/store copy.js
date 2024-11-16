import { create } from "zustand";

const useScreenStore = create((set) => ({
  currentArchitectures: [],
  latestSpeech: "",
  mobileVisibility: null,
  stage: "Idle",
  iteration: 0,

  isProjector: true,
  zoomFactor: 1,
  deviceIndex: 5,
  targetMobileId: null,

  userName: "",
  introState: 0,
  isTransition: false,
  isEnding: false,

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

  handleNewControllerArchitectures: (data) => {
    console.log("New architectures received:", data);
    set((state) => {
      const updates = {};

      if (!state.mobileVisibility) {
        updates.mobileVisibility = true;
      }

      if (data.currentArchitectures?.length) {
        updates.currentArchitectures = data.currentArchitectures;
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewMobileArchitecture: (data) => {
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {};

      if (!state.mobileVisibility) {
        updates.mobileVisibility = true;
      }

      if (data.currentArchitectures?.length) {
        updates.currentArchitectures = data.currentArchitectures;
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewSpeech: (data) => {
    set((state) => {
      const newText = data.text || "";
      return state.latestSpeech !== newText ? { latestSpeech: newText } : state;
    });
  },

  handleNewMobileVisibility: (data) => {
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {};

      if (state.mobileVisibility !== data.isVisible) {
        updates.mobileVisibility = data.isVisible;

        if (data.isVisible && !state.mobileVisibility) {
          updates.iteration = state.iteration + 1;
        }
      }

      console.log("updates", updates);
      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewMobile: (data) => {
    console.log("New join received:", data);
    set((state) => {
      console.log(
        "state",
        state,
        state.targetMobileId && state.targetMobileId !== data.mobileId
      );
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {};

      if (state.targetMobileId !== data.mobileId) {
        updates.targetMobileId = data.mobileId;
      }

      if (state.stage !== "Frontend") {
        updates.stage = "Frontend";
      }

      return Object.keys(updates).length ? updates : state;
    });
  },

  handleNewMobileIntro: (data) => {
    set((state) => {
      const updates = {};
      console.log("data", data);

      switch (data.type) {
        // case "state_change":
        //   if (state.introState !== data.introState) {
        //     updates.introState = data.introState;
        //   }
        //   break;

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
      const resetState = {
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
      };

      return Object.entries(resetState).some(
        ([key, value]) => state[key] !== value
      )
        ? resetState
        : state;
    });
  },

  ////////////////////////////////////////////////////////////////
  //backend: inter-screen conversation////
  ////////////////////////////////////////////////////////////////

  handleNewScreenConversation: (data) => {
    console.log("New screen conversation received:", data);
  },
}));

export default useScreenStore;
