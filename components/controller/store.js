import { create } from "zustand";
import {
  getSystemEnsurment,
  getLanguageKey,
} from "@/components/controller/constant/system-script";

const useChatStore = create((set, get) => ({
  messages: [],
  recommendedResponses: [],
  currentArchitectures: [],
  conversationStage: "initial",
  userName: "",
  deviceLanguage: "en",
  isWaitingForResponse: false,

  appendMessage: (role, text) =>
    set((state) => ({
      messages: [...state.messages, { role, text }],
    })),

  setRecommendedResponses: (responses) =>
    set({ recommendedResponses: responses }),
  setCurrentArchitectures: (architectures) =>
    set({ currentArchitectures: architectures }),
  setConversationStage: (stage) => set({ conversationStage: stage }),
  setUserName: (name) => set({ userName: name }),
  setDeviceLanguage: (language) => {
    const languageKey = getLanguageKey(language);
    set({ deviceLanguage: languageKey });
  },
  setIsWaitingForResponse: (isWaiting) =>
    set({ isWaitingForResponse: isWaiting }),

  sendMessage: async (text) => {
    const state = get();

    if (!text && state.messages.length > 0) {
      console.log("Ignoring empty message");
      return false;
    }

    set({ isWaitingForResponse: true });

    try {
      const systemEnsurment = getSystemEnsurment(state.deviceLanguage);
      const conversation = [
        ...state.messages.map((msg) => ({ role: msg.role, content: msg.text })),
        { role: "system", content: systemEnsurment },
      ];

      if (text) {
        conversation.push({ role: "user", content: text });
        state.appendMessage("user", text);
      }

      const assistantResponse = await fetchAssistantResponse(
        conversation,
        state.conversationStage,
        state.userName,
        state.deviceLanguage
      );

      state.appendMessage("assistant", assistantResponse.content);

      if (assistantResponse.nextStage === "interactiveExperience") {
        state.setRecommendedResponses(assistantResponse.recommended_responses);
      } else {
        state.setRecommendedResponses([]);
      }

      state.setCurrentArchitectures(assistantResponse.currentArchitecture);
      state.setConversationStage(assistantResponse.nextStage);

      if (assistantResponse.userName) {
        state.setUserName(assistantResponse.userName);
      }

      set({ isWaitingForResponse: false });
      return true;
    } catch (err) {
      console.error("Error sending message:", err.message);
      state.appendMessage("assistant", "Sorry, something went wrong.");
      set({ isWaitingForResponse: false });
      return false;
    }
  },
}));

async function fetchAssistantResponse(conversation, stage, userName, language) {
  try {
    const response = await fetch(`/api/langchain/v3`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversation,
        stage,
        userName,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error fetching assistant response", e);
    return {
      content: "Sorry, something went wrong.",
      responseType: "ask",
      currentArchitecture: [],
      recommended_responses: [],
      nextStage: stage,
    };
  }
}

export default useChatStore;
