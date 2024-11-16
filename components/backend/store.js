import { create } from "zustand";
import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "@/foundations/backend/shared/constants/conversation";

// Default state object
const DEFAULT_STATE = {
  // Visual state
  isblack: true,

  // Conversation state
  conversations: [],

  // Embeddings state
  embeddings: [],
  inputEmbeddings: INPUT_EMBEDDINGS,
  outputEmbeddings: OUTPUT_EMBEDDINGS,

  // Length state
  length: 10,

  // Loop and level state
  loop: 0,
  level: 0,
  subLevel: 0,
};

// Reset state

const useStore = create((set) => ({
  ...DEFAULT_STATE,

  // Simple setters
  setIsblack: (value) => set({ isblack: value }),
  setConversations: (value) => set({ conversations: value }),
  setEmbeddings: (value) => set({ embeddings: value }),
  setInputEmbeddings: (value) => set({ inputEmbeddings: value }),
  setOutputEmbeddings: (value) => set({ outputEmbeddings: value }),
  setLength: (value) => set({ length: value }),
  setLevel: (value) => set({ level: value }),

  // Complex setters
  setLoop: (value) =>
    set({
      loop: value,
      level: Math.floor(value / 3),
      subLevel:
        value >= 21
          ? Math.min(Math.floor(value % 6), 5)
          : Math.min(Math.floor(value % 3), 2),
    }),

  // Complex handlers
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),

  addEmbedding: (embedding) =>
    set((state) => {
      const newEmbeddings = [...state.embeddings, embedding];
      const lastIndex = newEmbeddings.length - 1;
      const inputData =
        lastIndex > 0 ? newEmbeddings[lastIndex - 1] : INPUT_EMBEDDINGS;
      const outputData = newEmbeddings[lastIndex];

      return {
        embeddings: newEmbeddings,
        inputEmbeddings: inputData,
        outputEmbeddings: outputData,
        length: inputData.tokens.length + outputData.tokens.length,
      };
    }),

  // Reset handler
  handleBackendReset: () => {
    set((state) => {
      return Object.entries(DEFAULT_STATE).some(
        ([key, value]) => state[key] !== value
      )
        ? DEFAULT_STATE
        : state;
    });
  },
}));

export default useStore;
