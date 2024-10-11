// useChatLogic.js
import { useState, useEffect, useRef } from "react";
import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
  SYSTEM_SCRIPT,
} from "../constant/v1";
import { fetchAssistantResponse } from "./api";

export const useChatLogic = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("What's your name?");
  const hasSentInitialMessage = useRef(false);

  useEffect(() => {
    if (!hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true;
      setInputDisabled(true);
      setShowInput(false);
      setTimeout(() => {
        sendMessage("");
      }, 1000);
    }
  }, []);

  const sendMessage = async (text) => {
    try {
      setInputDisabled(true);

      const nextCommand =
        SYSTEM_SCRIPT[currentStep]?.command || "Proceed with custom input.";

      const conversation = [
        { role: "system", content: SYSTEM_DESCRIPTION },
        ...messages
          .map((msg) => ({ role: msg.role, content: msg.text }))
          .slice(-10),
        { role: "system", content: SYSTEM_ENSURMENT },
        { role: "system", content: `COMMAND: ${nextCommand}` },
      ];

      if (text) {
        conversation.push({ role: "user", content: text });
        appendMessage("user", text);
      }

      const assistantMessage = await fetchAssistantResponse(conversation);

      setCurrentStep((prevStep) =>
        Math.min(prevStep + 1, SYSTEM_SCRIPT.length - 1)
      );
      appendMessage("assistant", assistantMessage);
      setInputDisabled(false);
      setShowInput(true);

      if (currentStep >= 1) {
        setPlaceholderText("Enter your message...");
      }
    } catch (err) {
      console.error("Error sending message:", err.message);
      setInputDisabled(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setUserInput("");
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  return {
    userInput,
    setUserInput,
    messages,
    inputDisabled,
    currentStep,
    showInput,
    placeholderText,
    handleSubmit,
    sendMessage,
  };
};
