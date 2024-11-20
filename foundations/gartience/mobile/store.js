import { create } from "zustand";

const useScreenStore = create((set) => ({
  state: 0,
  chaos: false,
  architectures: [],

  setState: (state) => set({ state }),
  setChaos: (chaos) => set({ chaos }),
  setArchitectures: (architectures) => set({ architectures }),

  reset: () =>
    set({ state: null, chaos: null, architectures: [], speech: null }),
}));

export default useScreenStore;
