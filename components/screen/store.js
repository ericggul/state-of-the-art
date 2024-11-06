import { create } from "zustand";

const useScreenStore = create((set) => ({
  currentArchitectures: [],
  latestSpeech: "",
  mobileVisibility: true,
  styleIndex: 0,
  isProjector: true,
  zoomFactor: 1,

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

  handleNewVisibilityChange: (data) => {
    console.log("New visibility change received:", data);
    set({ mobileVisibility: data.isVisible });
  },

  // handleNewMobileOrientationSpike: (data) => {
  //   set({ styleIndex: Math.floor(data.spikeCount) % 15 });
  // },

  setIsProjector: (isProjector) => set({ isProjector }),
}));

export default useScreenStore;
