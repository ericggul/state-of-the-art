import { create } from "zustand";
import { getLanguageKey } from "@/components/controller/_old/constant/system-script";
import { v4 as uuidv4 } from "uuid"; // You might need to install this package

const useMobileStore = create((set, get) => ({
  mobileId: "",
  messages: [],
  recommendedResponses: [],
  currentArchitectures: [],
  conversationStage: "initial",
  userName: "",
  isWaitingForResponse: false,
  deviceLanguage: "en",

  initializeMobileId: () => {
    const storedId = localStorage.getItem("mobileId");
    if (storedId) {
      set({ mobileId: storedId });
    } else {
      const newId = uuidv4();
      localStorage.setItem("mobileId", newId);
      set({ mobileId: newId });
    }
  },

  setMobileId: (id) => {
    localStorage.setItem("mobileId", id);
    set({ mobileId: id });
  },

  setMessages: (messages) => set({ messages }),
  setRecommendedResponses: (responses) =>
    set({ recommendedResponses: responses }),
  setCurrentArchitectures: (architectures) =>
    set({ currentArchitectures: architectures }),
  setConversationStage: (stage) => set({ conversationStage: stage }),
  setUserName: (name) => set({ userName: name }),
  setIsWaitingForResponse: (isWaiting) =>
    set({ isWaitingForResponse: isWaiting }),
  setDeviceLanguage: (language) => {
    const languageKey = getLanguageKey(language);
    set({ deviceLanguage: languageKey });
  },

  appendMessage: (role, text) =>
    set((state) => ({
      messages: [...state.messages, { role, text }],
    })),

  sendMessage: async (text, socket) => {
    set({ isWaitingForResponse: true });
    set((state) => ({
      messages: [...state.messages, { role: "user", content: text }],
    }));
    if (socket && socket.current) {
      socket.current.emit("mobile-new-response", {
        text,
        mobileId: get().mobileId,
      });
    } else {
      console.error("Socket is not available");
      set({ isWaitingForResponse: false });
    }
  },

  detectLanguage: () => {
    let fullLanguage = navigator.language || navigator.userLanguage || "en";
    try {
      const languageKey = getLanguageKey(fullLanguage);
      set({ deviceLanguage: languageKey });
    } catch (e) {
      set({ deviceLanguage: "en" });
    }
  },
}));

export default useMobileStore;
