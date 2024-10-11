"use client";

import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { Message } from "../message";

import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
  SYSTEM_SCRIPT,
} from "@/foundations/mobile/constant";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(
    "Enter your message..."
  );
  const messagesEndRef = useRef(null);
  const initialMessageSent = useRef(false);
  const [recommendedResponses, setRecommendedResponses] = useState([]);
  const [currentArchitecture, setCurrentArchitecture] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!initialMessageSent.current) {
      initialMessageSent.current = true;
      sendMessage("");
    }
  }, []);

  const sendMessage = async (text) => {
    try {
      setInputDisabled(true);

      const conversation = [
        ...messages.map((msg) => ({ role: msg.role, content: msg.text })),
      ];

      if (text) {
        conversation.push({ role: "user", content: text });
        appendMessage("user", text);
      }

      const assistantResponse = await fetchAssistantResponse(conversation);

      appendMessage("assistant", assistantResponse.content);
      setRecommendedResponses(assistantResponse.recommended_responses);
      setCurrentArchitecture(assistantResponse.currentArchitecture);
      setInputDisabled(false);
      setShowInput(true);

      // You can use assistantResponse.responseType here if needed
    } catch (err) {
      console.error("Error sending message:", err.message);
      appendMessage("assistant", "Sorry, something went wrong.");
      setInputDisabled(false);
    }
  };

  const fetchAssistantResponse = async (conversation) => {
    try {
      const response = await fetch(`/api/langchain/v1`, {
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
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      return data;
    } catch (e) {
      console.error("Error fetching assistant response", e);
      return {
        content: "Sorry, something went wrong.",
        responseType: "ask",
        currentArchitecture: "",
        recommended_responses: [],
      };
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

export default Chat;
