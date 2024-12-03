import { create } from "zustand";

// Default state object
const DEFAULT_STATE = {
  // Mobile device state
  activeMobileId: null,
  mobileVisibility: false,
  currentArchitecture: null,
  introState: 0,

  stage: "Idle",
  iteration: 0,
  isReset: false,
  lastInteractionTime: 0,
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
  setIntroState: (introState) => set({ introState }),

  // Socket event handlers
  handleNewMobileInit: (data) => {
    console.log("New mobile connected:", data);
    set((state) => ({
      activeMobileId: data.mobileId,
      stage: "Frontend",
    }));
  },

  handleNewMobileVisibility: (data) => {
    console.log("Mobile visibility changed:", data);
    set((state) => {
      if (state.activeMobileId === data.mobileId) {
        const updates = {
          lastInteractionTime: Date.now(),
        };

        console.log(state.mobileVisibility, data.isVisible);
        if (state.mobileVisibility !== data.isVisible) {
          updates.mobileVisibility = data.isVisible;
          updates.isReset = false;

          console.log("51");

          // Handle iteration increment only when becoming visible
          if (data.isVisible && !state.mobileVisibility) {
            updates.iteration = state.iteration + 1;
            console.log(updates.iteration);
          }
        }

        return Object.keys(updates).length ? updates : state;
      }
      return state;
    });
  },

  handleNewMobileIntroStore: (data) => {
    set({ introState: data.introState });
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
    console.log("reset");
    window.location.reload();
    set((state) => {
      // If we're already at default state, no need to update
      if (
        Object.entries(DEFAULT_STATE).every(
          ([key, value]) => state[key] === value
        )
      ) {
        return state;
      }
      return DEFAULT_STATE;
    });
  },
}));

export default useControllerStore;
