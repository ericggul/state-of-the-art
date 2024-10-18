import { create } from "zustand";

const useAccelerometerStore = create((set) => ({
  isAccelerometerActive: false,
  isAccelerometerPrompt: false,

  setIsAccelerometerActive: (active) => set({ isAccelerometerActive: active }),
  setIsAccelerometerPrompt: (isPrompt) =>
    set({ isAccelerometerPrompt: isPrompt }),

  grantAccelerometerAccess: async (granted, sendMessage) => {
    set((state) => ({
      isAccelerometerActive: granted,
      isAccelerometerPrompt: false,
    }));

    const message = granted
      ? "User granted accelerometer access."
      : "User denied accelerometer access.";

    await sendMessage(message);
  },
}));

export default useAccelerometerStore;
