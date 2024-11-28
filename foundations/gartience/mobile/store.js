import { create } from "zustand";

const useMobileStore = create((set) => ({
  state: 0,
  chaos: false,
  architectures: [
    {
      name: "Perceptron",
      year: 1958,
      place: "Frank Rosenblatt, Cornell Aeronautical Laboratory",
      citation: 13000,
      explanation:
        "Introduced the perceptron algorithm, the first trainable neural network using supervised learning.",
    },
  ],
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
