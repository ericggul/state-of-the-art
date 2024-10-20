import { create } from "zustand";

const useScreenStore = create((set) => ({
  currentArchitectures: [],
  latestSpeech: "",
  mobileVisibility: true,

  setCurrentArchitectures: (architectures) =>
    set({ currentArchitectures: architectures }),

  setLatestSpeech: (speech) => set({ latestSpeech: speech }),

  setMobileVisibility: (visibility) => set({ mobileVisibility: visibility }),

  handleNewArchitectures: (data) => {
    console.log("New architectures received:", data);
    set((state) => ({
      currentArchitectures: data.currentArchitectures || [],
    }));
  },

  handleNewSpeech: (data) => {
    console.log("New speech received:", data);
    set({ latestSpeech: data.text || "" });
  },

  handleNewVisibilityChange: (data) => {
    console.log("New visibility change received:", data);
    set({ mobileVisibility: data.visibility });
  },
}));

export default useScreenStore;
