import { create } from "zustand";

// Default state object
const DEFAULT_STATE = {
  // Mobile device state
  activeMobileId: null,
  mobileVisibility: false,
  currentArchitecture: null,

  stage: "Idle",
  iteration: 0,
  isReset: false,
};

const useControllerStore = create((set) => ({
  ...DEFAULT_STATE,

  // Simple setters
  setActiveMobileId: (id) => set({ activeMobileId: id }),
  setMobileVisibility: (isVisible) => set({ mobileVisibility: isVisible }),
  setCurrentArchitecture: (architecture) =>
    set({ currentArchitecture: architecture }),

  setStage: (stage) => set({ stage }),
  setIteration: (iteration) => set({ iteration }),
  setIsReset: (isReset) => set({ isReset }),

  // Socket event handlers
  handleNewMobileInit: (data) => {
    console.log("New mobile connected:", data);
    set((state) => ({
      activeMobileId: data.mobileId,
      mobileVisibility: true,
    }));
  },

  handleNewMobileVisibility: (data) => {
    console.log("Mobile visibility changed:", data);
    set((state) => {
      if (state.activeMobileId === data.mobileId) {
        const updates = {
          mobileVisibility: data.isVisible,
          isReset: false,
        };

        // Handle iteration increment only when becoming visible
        if (data.isVisible && !state.mobileVisibility) {
          updates.iteration = state.iteration + 1;
        }

        return updates;
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
