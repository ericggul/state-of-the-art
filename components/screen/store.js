import { create } from "zustand";

const useScreenStore = create((set) => ({
  currentArchitectures: [],
  latestSpeech: "",
  mobileVisibility: null,
  stage: "Idle",
  isTransition: false,
  isProjector: true,
  zoomFactor: 1,
  deviceIndex: 5,
  targetMobileId: null,

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

      console.log("state", state, data.isVisible);
      updates.mobileVisibility = data.isVisible;

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
        // updates.mobileVisibility = true;
      }

      console.log("updates", updates);
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
      };

      // Only update if any values are different
      return Object.entries(resetState).some(
        ([key, value]) => state[key] !== value
      )
        ? resetState
        : state;
    });
  },
}));

export default useScreenStore;
