import { create } from "zustand";

const useMobileStore = create((set) => ({
  state: 0,
  chaos: false,
  architectures: [],
  username: "Jeanyoon",

  setState: (state) => set({ state }),
  setChaos: (chaos) => set({ chaos }),
  setArchitectures: (architectures) => set({ architectures }),
  setUsername: (username) => set({ username }),

  reset: () =>
    set({
      state: null,
      chaos: null,
      architectures: [],
      speech: null,
      username: "",
    }),
}));

export default useMobileStore;
