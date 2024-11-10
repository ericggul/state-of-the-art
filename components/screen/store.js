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

  handleNewControllerArchitectures: (data) => {
    console.log("New architectures received:", data);
    set({ mobileVisibility: true });
    set((state) => ({
      currentArchitectures: data.currentArchitectures || [],
    }));
  },

  handleNewMobileArchitecture: (data) => {
    set({ mobileVisibility: true });
    set((state) => ({
      currentArchitectures: data.currentArchitectures || [],
    }));
  },

  handleNewSpeech: (data) => {
    set({ latestSpeech: data.text || "" });
  },

  //////stage-related logics////
  handleNewMobileVisibility: (data) => {
    console.log("New visibility change received:", data);
    set({ mobileVisibility: data.isVisible });
  },

  handleNewMobile: (data) => {
    console.log("New join received:", data);
    set((state) => {
      if (state.targetMobileId) {
        if (state.targetMobileId != data.mobileId) return state;
      }
      return { targetMobileId: data.mobileId, stage: "Frontend" };
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

  //default states
  setIsProjector: (isProjector) => set({ isProjector }),
  setDeviceIndex: (deviceIndex) => set({ deviceIndex }),

  //set target mobile id: to be implemented, controller --> target mobile id
  setTargetMobileId: (mobileId) => set({ targetMobileId: mobileId }),
  setStage: (stage) => set({ stage }),
  setIsTransition: (isTransition) => set({ isTransition }),
}));

export default useScreenStore;
