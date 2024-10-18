import { create } from "zustand";
import {
  getSystemEnsurment,
  getLanguageKey,
} from "@/components/controller/constant/system-script";

const WELCOME_MESSAGE =
  "Hi there, dear visitor, welcome to the State-of-the-Art Neural Network Architecture gallery. May I enjoy an honour to know your name?";

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

    set({ isWaitingForResponse: true });

    try {
      if (state.messages.length === 0) {
        // Send the welcome message for the first interaction
        set((state) => ({
          messages: [
            ...state.messages,
            { role: "assistant", text: WELCOME_MESSAGE },
          ],
          isWaitingForResponse: false,
          conversationStage: "askName",
        }));
        return true;
      }

      const systemEnsurment = getSystemEnsurment(state.deviceLanguage);
      const conversation = [
        ...state.messages.map((msg) => ({ role: msg.role, content: msg.text })),
        { role: "system", content: systemEnsurment },
      ];

      if (text) {
        conversation.push({ role: "user", content: text });
        set((state) => ({
          messages: [...state.messages, { role: "user", text }],
        }));
      }

      const assistantResponse = await fetchAssistantResponse(
        conversation,
        state.conversationStage,
        state.userName,
        state.deviceLanguage
      );

      set((state) => ({
        messages: [
          ...state.messages,
          { role: "assistant", text: assistantResponse.content },
        ],
        recommendedResponses:
          assistantResponse.nextStage === "interactiveExperience"
            ? assistantResponse.recommended_responses
            : [],
        currentArchitectures: assistantResponse.currentArchitecture,
        conversationStage: assistantResponse.nextStage,
        userName: assistantResponse.userName || state.userName,
        isWaitingForResponse: false,
      }));

      return true;
    } catch (err) {
      console.error("Error sending message:", err.message);
      set((state) => ({
        messages: [
          ...state.messages,
          { role: "assistant", text: "Sorry, something went wrong." },
        ],
        isWaitingForResponse: false,
      }));
      return false;
    }
  },
}));

async function fetchAssistantResponse(conversation, stage, userName, language) {
  try {
    console.log("Fetching assistant response:", {
      conversation,
      stage,
      userName,
      language,
    });
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

    const data = await response.json();
    console.log("Assistant response:", data);
    return data;
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
