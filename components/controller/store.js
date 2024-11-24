import { create } from "zustand";

// Default state object
const DEFAULT_STATE = {
  // Mobile device state
  activeMobileId: null,
  isMobileVisible: false,
  currentArchitecture: null,
};

const useControllerStore = create((set) => ({
  ...DEFAULT_STATE,

  // Simple setters
  setActiveMobileId: (id) => set({ activeMobileId: id }),
  setIsMobileVisible: (isVisible) => set({ isMobileVisible: isVisible }),
  setCurrentArchitecture: (architecture) =>
    set({ currentArchitecture: architecture }),

  // Socket event handlers
  handleNewMobileInit: (data) => {
    console.log("New mobile connected:", data);
    set((state) => ({
      activeMobileId: data.mobileId,
      isMobileVisible: true,
    }));
  },

  handleNewMobileVisibility: (data) => {
    console.log("Mobile visibility changed:", data);
    set((state) => {
      if (state.activeMobileId === data.mobileId) {
        return {
          isMobileVisible: data.isVisible,
        };
      }
      return state;
    });
  },

  handleNewMobileArchitecture: (data) => {
    console.log("New mobile architecture:", data);
    set((state) => {
      if (state.activeMobileId === data.mobileId) {
        return {
          currentArchitecture: data.currentArchitectures?.[0] || null,
        };
      }
      return state;
    });
  },

  // Reset state
  reset: () => {
    set(DEFAULT_STATE);
  },
}));

export default useControllerStore;
