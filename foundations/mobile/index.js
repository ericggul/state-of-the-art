"use client";

import React, { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { Message } from "./message";
import useChatStore from "@/components/controller/store";
import { LANGUAGE_MAP } from "./constant/language-map";

const ChatUI = () => {
  const {
    messages,
    recommendedResponses,
    currentArchitectures,
    conversationStage,
    isAccelerometerActive,
    sendMessage,
  } = useChatStore();

  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [placeholderText, setPlaceholderText] = useState(
    "Enter your message..."
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const detectLanguage = () => {
      let fullLanguage = navigator.language || navigator.userLanguage || "en";
      fullLanguage = "ko";
      const primaryLanguage = fullLanguage.split("-")[0];
      try {
        const languageName = LANGUAGE_MAP[primaryLanguage] || "English";
        useChatStore.getState().setDeviceLanguage(languageName);
      } catch (e) {
        useChatStore.getState().setDeviceLanguage("English");
      }
    };

    detectLanguage();
  }, []);

  console.log(currentArchitectures, conversationStage);
  console.log("is accelerometer active", isAccelerometerActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setInputDisabled(true);
    const success = await sendMessage(userInput);
    setInputDisabled(false);
    if (success) {
      setUserInput("");
    }
  };

  return (
    <S.Container>
      <S.Messages>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </S.Messages>

      {showInput && (
        <>
          <S.SuggestedResponses>
            {recommendedResponses.map((response, index) => (
              <S.SuggestedResponseButton
                key={index}
                onClick={() => sendMessage(response)}
              >
                {response}
              </S.SuggestedResponseButton>
            ))}
          </S.SuggestedResponses>
          <S.InputForm onSubmit={handleSubmit}>
            <S.Input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={inputDisabled ? "" : placeholderText}
              disabled={inputDisabled}
            />
            <S.Button type="submit" disabled={inputDisabled}>
              Send
            </S.Button>
          </S.InputForm>
        </>
      )}
    </S.Container>
  );
};

export default ChatUI;
