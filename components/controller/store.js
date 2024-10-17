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
  isAccelerometerActive: false,
  deviceLanguage: "en",
  isAccelerometerPrompt: false,
  isWaitingForResponse: false,

  appendMessage: (role, text) =>
    set((state) => ({
      messages: [...state.messages, { role, text }],
    })),

  setRecommendedResponses: (responses) =>
    set({ recommendedResponses: responses }),
  setCurrentArchitectures: (architectures) =>
    set({ currentArchitectures: architectures }),
  setConversationStage: (stage) => {
    const prevStage = get().conversationStage;
    set((state) => ({
      conversationStage: stage,
      isAccelerometerPrompt:
        prevStage === "activateAccelerometer" &&
        stage === "interactiveExperience"
          ? true
          : state.isAccelerometerPrompt,
    }));
  },
  setUserName: (name) => set({ userName: name }),
  setIsAccelerometerActive: (active) => set({ isAccelerometerActive: active }),
  setDeviceLanguage: (language) => {
    const languageKey = getLanguageKey(language);
    set({ deviceLanguage: languageKey });
  },
  setIsAccelerometerPrompt: (isPrompt) =>
    set({ isAccelerometerPrompt: isPrompt }),
  setIsWaitingForResponse: (isWaiting) =>
    set({ isWaitingForResponse: isWaiting }),

  grantAccelerometerAccess: async (granted) => {
    set((state) => ({
      isAccelerometerActive: granted,
      isAccelerometerPrompt: false,
      isWaitingForResponse: true,
    }));

    const state = get();
    const message = granted
      ? "User granted accelerometer access."
      : "User denied accelerometer access.";

    await state.sendMessage(message);
  },

  sendMessage: async (text) => {
    const state = get();

    // Prevent sending empty messages after the initial one
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
