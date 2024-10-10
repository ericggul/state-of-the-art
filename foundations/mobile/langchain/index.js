"use client";

import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
  SYSTEM_SCRIPT,
} from "../constant";

import { Message } from "../message";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("What's your name?");
  const messagesEndRef = useRef(null);
  const hasSentInitialMessage = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const fetchAssistantResponse = async (conversation) => {
    try {
      const response = await fetch(`/api/langchain/default`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: conversation }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    } catch (e) {
      console.error("Error fetching assistant response", e);
      return "Sorry, something went wrong.";
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

  return (
    <S.Container>
      <S.Messages>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </S.Messages>

      {showInput && (
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
      )}
    </S.Container>
  );
};

export default Chat;
