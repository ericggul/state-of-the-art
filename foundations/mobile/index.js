"use client";

import React, { useState, useRef, useEffect } from "react";
import * as S from "./styles";
import { Message } from "./message";
import useMobileStore from "@/components/mobile/store";
import useAccelerometerStore from "@/components/mobile/store/accelerometer";

const ChatUI = ({
  supportsDeviceOrientation,
  accelerometerGranted,
  handleGrantAccess,
  socket,
}) => {
  const {
    messages,
    recommendedResponses,
    currentArchitectures,
    conversationStage,
    sendMessage,
    isWaitingForResponse,
    setIsWaitingForResponse,
    detectLanguage,
    deviceLanguage,
  } = useMobileStore();

  const {
    isAccelerometerActive,
    isAccelerometerPrompt,
    setIsAccelerometerPrompt,
  } = useAccelerometerStore();

  const [userInput, setUserInput] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [placeholderText, setPlaceholderText] = useState("What's your Name?");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showRecommendedResponses, setShowRecommendedResponses] =
    useState(false);

  const messagesEndRef = useRef(null);
  const prevConversationStageRef = useRef(conversationStage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaitingForResponse]);

  useEffect(() => {
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
  }, [conversationStage, isAccelerometerActive, setIsAccelerometerPrompt]);

  const [inputDisabled, setInputDisabled] = useState(true);

  useEffect(() => {
    console.log("ChatUI messages updated:", messages);
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      setInputDisabled(false);
      setIsWaitingForResponse(false);
      setPlaceholderText("Enter your message...");
    }
  }, [messages, setIsWaitingForResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isWaitingForResponse) return;

    setShowRecommendedResponses(false);
    setIsWaitingForResponse(true);
    setInputDisabled(true);
    await sendMessage(userInput, socket);
    setUserInput("");
  };

  const handleSuggestedResponse = async (response) => {
    if (isWaitingForResponse) return;

    setSelectedResponse(response);
    setShowRecommendedResponses(false);
    setIsWaitingForResponse(true);
    await sendMessage(response, socket);
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
                  disabled={isWaitingForResponse || inputDisabled}
                />
                <S.Button
                  type="submit"
                  disabled={isWaitingForResponse || inputDisabled}
                >
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
