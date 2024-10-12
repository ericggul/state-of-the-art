import { useState, useEffect, useRef } from "react";
import { SYSTEM_ENSURMENT } from "@/foundations/mobile/constant/v2";

export default function useChatLogic() {
  const [messages, setMessages] = useState([]);
  const [recommendedResponses, setRecommendedResponses] = useState([]);
  const [currentArchitectures, setCurrentArchitectures] = useState([]);
  const [conversationStage, setConversationStage] = useState("initial");
  const [userName, setUserName] = useState("");
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (!initialMessageSent.current) {
      initialMessageSent.current = true;
      sendMessage("");
    }
  }, []);

  const sendMessage = async (text) => {
    try {
      const conversation = [
        ...messages.map((msg) => ({ role: msg.role, content: msg.text })),
        { role: "system", content: SYSTEM_ENSURMENT },
      ];

      if (text) {
        conversation.push({ role: "user", content: text });
        appendMessage("user", text);
      }

      const assistantResponse = await fetchAssistantResponse(
        conversation,
        conversationStage,
        userName
      );

      appendMessage("assistant", assistantResponse.content);

      if (conversationStage === "interactiveExperience") {
        setRecommendedResponses(assistantResponse.recommended_responses);
      } else {
        setRecommendedResponses([]);
      }

      setCurrentArchitectures(assistantResponse.currentArchitecture);
      setConversationStage(assistantResponse.nextStage);

      if (assistantResponse.userName) {
        setUserName(assistantResponse.userName);
      }

      if (
        assistantResponse.nextStage === "activateAccelerometer" &&
        !isAccelerometerActive
      ) {
        setIsAccelerometerActive(true);
      }

      return true; // Indicate successful message send
    } catch (err) {
      console.error("Error sending message:", err.message);
      appendMessage("assistant", "Sorry, something went wrong.");
      return false; // Indicate failed message send
    }
  };

  const fetchAssistantResponse = async (conversation, stage, userName) => {
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
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  return {
    messages,
    recommendedResponses,
    currentArchitectures,
    conversationStage,
    isAccelerometerActive,
    sendMessage,
  };
}
