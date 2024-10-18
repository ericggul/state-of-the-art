"use client";

import React, { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { Message } from "./message";
import useChatStore from "@/components/controller/store";
import { getLanguageKey } from "@/components/controller/constant/system-script";

const ChatUI = ({
  supportsDeviceOrientation,
  accelerometerGranted,
  handleGrantAccess,
}) => {
  const {
    messages,
    recommendedResponses,
    currentArchitectures,
    conversationStage,
    isAccelerometerActive,
    sendMessage,
    isWaitingForResponse,
    setIsWaitingForResponse,
  } = useChatStore();

  const [userInput, setUserInput] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [placeholderText, setPlaceholderText] = useState("What's your Name?");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isAccelerometerPrompt, setIsAccelerometerPrompt] = useState(false);
  const [showRecommendedResponses, setShowRecommendedResponses] =
    useState(false);

  const messagesEndRef = useRef(null);
  const prevConversationStageRef = useRef(conversationStage);

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
    setSelectedResponse(null);
    if (messages.length > 1) {
      setPlaceholderText("Enter your message...");
    }
    if (
      messages.length >= 1 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      setIsWaitingForResponse(false);
      setSelectedResponse(null);
      setIsAccelerometerPrompt(false);
      setShowRecommendedResponses(true);
    }
  }, [messages, setIsWaitingForResponse]);

  useEffect(() => {
    if (
      prevConversationStageRef.current === "activateAccelerometer" &&
      conversationStage === "interactiveExperience" &&
      !isAccelerometerActive
    ) {
      setIsAccelerometerPrompt(true);
      setShowRecommendedResponses(false);
    } else if (isAccelerometerActive) {
      setIsAccelerometerPrompt(false);
    }
    prevConversationStageRef.current = conversationStage;
  }, [conversationStage, isAccelerometerActive]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isWaitingForResponse) return;

    setShowRecommendedResponses(false);
    await sendMessage(userInput);
    setUserInput("");
  };

  const handleSuggestedResponse = async (response) => {
    if (isWaitingForResponse) return;

    setSelectedResponse(response);
    setShowRecommendedResponses(false);
    await sendMessage(response);
  };

  const handleAccelerometerAccess = async () => {
    setShowRecommendedResponses(false);
    await handleGrantAccess();
    setIsAccelerometerPrompt(false);
  };

  const getLoadingIndicatorText = () => {
    return conversationStage === "interactiveExperience"
      ? "Curating Next Architecture..."
      : "Generating Next Response...";
  };

  return (
    <S.Container>
      <S.Messages>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        {isWaitingForResponse && (
          <S.LoadingIndicator>{getLoadingIndicatorText()}</S.LoadingIndicator>
        )}
        <div ref={messagesEndRef} />
      </S.Messages>

      {showInput && (
        <S.BottomContainer>
          {isAccelerometerPrompt ? (
            <S.Button
              onClick={handleAccelerometerAccess}
              disabled={isWaitingForResponse || accelerometerGranted}
            >
              {supportsDeviceOrientation ? "Grant Access" : "Continue"}
            </S.Button>
          ) : (
            <>
              {showRecommendedResponses && (
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
              )}
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
            </>
          )}
        </S.BottomContainer>
      )}
    </S.Container>
  );
};

export default ChatUI;
