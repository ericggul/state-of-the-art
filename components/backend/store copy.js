import { create } from "zustand";
import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "@/foundations/backend/shared/constants/conversation";

const useStore = create((set) => ({
  // Visual state
  isblack: true,
  setIsblack: (value) => set({ isblack: value }),

  // Conversation state
  conversations: [],
  setConversations: (value) => set({ conversations: value }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),

  // Embeddings state
  embeddings: [],
  setEmbeddings: (value) => set({ embeddings: value }),
  addEmbedding: (embedding) =>
    set((state) => {
      const newEmbeddings = [...state.embeddings, embedding];

      // Update input/output embeddings when adding new embedding
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

  // Current embeddings state
  inputEmbeddings: INPUT_EMBEDDINGS,
  setInputEmbeddings: (value) => set({ inputEmbeddings: value }),
  outputEmbeddings: OUTPUT_EMBEDDINGS,
  setOutputEmbeddings: (value) => set({ outputEmbeddings: value }),

  // Length state
  length: 10,
  setLength: (value) => set({ length: value }),

  // Loop and level state (for future implementation)
  loop: 0,
  setLoop: (value) =>
    set({
      loop: value,
      level: Math.floor(value / 3),
      subLevel:
        value >= 21
          ? Math.min(Math.floor(value % 6), 5)
          : Math.min(Math.floor(value % 3), 2),
    }),
  level: 0,
  subLevel: 0,
  setLevel: (value) => set({ level: value }),
}));

export default useStore;
