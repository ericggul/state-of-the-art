"use client";

import React, { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { Message } from "./message";
import useChatStore from "@/components/controller/store";
import { getLanguageKey } from "@/components/controller/constant/system-script";

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
  const [placeholderText, setPlaceholderText] = useState("Enter your Name?");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaitingForResponse]);

  useEffect(() => {
    const detectLanguage = () => {
      let fullLanguage = navigator.language || navigator.userLanguage || "en";
      fullLanguage = "en";
      try {
        const languageKey = getLanguageKey(fullLanguage);
        useChatStore.getState().setDeviceLanguage(languageKey);
      } catch (e) {
        useChatStore.getState().setDeviceLanguage("en");
      }
    };

    detectLanguage();
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      setPlaceholderText("Enter your message...");
    }
    if (
      isWaitingForResponse &&
      messages[messages.length - 1].role === "assistant"
    ) {
      setIsWaitingForResponse(false);
      setSelectedResponse(null);
    }
  }, [messages, isWaitingForResponse]);

  console.log(currentArchitectures, conversationStage);
  console.log("is accelerometer active", isAccelerometerActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isWaitingForResponse) return;

    setIsWaitingForResponse(true);
    const success = await sendMessage(userInput);
    if (success) {
      setUserInput("");
    }
    setIsWaitingForResponse(false);
  };

  const handleSuggestedResponse = async (response) => {
    if (isWaitingForResponse) return;

    setSelectedResponse(response);
    setIsWaitingForResponse(true);
    await sendMessage(response);
    setIsWaitingForResponse(false);
  };

  return (
    <S.Container>
      <S.Messages>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        {isWaitingForResponse && (
          <S.LoadingIndicator>Curating Next Architecture...</S.LoadingIndicator>
        )}
        <div ref={messagesEndRef} />
      </S.Messages>

      {showInput && (
        <S.BottomContainer>
          <S.SuggestedResponses>
            {recommendedResponses.map((response, index) => (
              <S.SuggestedResponseButton
                key={index}
                onClick={() => handleSuggestedResponse(response)}
                disabled={isWaitingForResponse}
                isSelected={response === selectedResponse}
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
              placeholder={isWaitingForResponse ? "" : placeholderText}
              disabled={isWaitingForResponse}
            />
            <S.Button type="submit" disabled={isWaitingForResponse}>
              Send
            </S.Button>
          </S.InputForm>
        </S.BottomContainer>
      )}
    </S.Container>
  );
};

export default ChatUI;
