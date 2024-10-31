import { create } from "zustand";
import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "@/foundations/backend/utils/constant";

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
    set((state) => ({
      embeddings: [...state.embeddings, embedding],
    })),

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
  setLoop: (value) => set({ loop: value }),
  level: 0,
  setLevel: (value) => set({ level: value }),
}));

export default useStore;
