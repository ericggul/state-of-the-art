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
    set({
      mobileVisibility: true,
      currentArchitectures: data.currentArchitectures || [],
    });
  },

  handleNewMobileArchitecture: (data) => {
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {
        mobileVisibility: true,
        currentArchitectures: data.currentArchitectures || [],
      };

      if (state.stage !== "Frontend") {
        updates.stage = "Frontend";
      }

      if (state.targetMobileId !== data.mobileId) {
        updates.targetMobileId = data.mobileId;
      }

      return updates;
    });
  },

  handleNewSpeech: (data) => {
    set({ latestSpeech: data.text || "" });
  },

  handleNewMobileVisibility: (data) => {
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }

      const updates = {
        mobileVisibility: data.isVisible,
        targetMobileId: data.mobileId,
      };

      console.log("state", state);
      if (state.stage === "Idle") {
        updates.stage = data.isVisible ? "Frontend" : "Backend";
        console.log("updates", updates);
      }

      return updates;
    });
  },

  handleNewMobile: (data) => {
    console.log("New join received:", data);
    set((state) => {
      if (state.targetMobileId && state.targetMobileId !== data.mobileId) {
        return state;
      }
      return {
        targetMobileId: data.mobileId,
        stage: "Frontend",
      };
    });
  },

  handleReset: () =>
    set({
      targetMobileId: null,
      stage: "Idle",
      isTransition: false,
      currentArchitectures: [],
      mobileVisibility: null,
    }),
}));

export default useScreenStore;
