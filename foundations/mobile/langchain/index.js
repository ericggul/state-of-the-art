"use client";

import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { Message } from "../message";

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
      } else {
        // Handle the case for the initial empty message
        conversation.push({
          role: "system",
          content: "Start the conversation.",
        });
      }

      const assistantMessage = await fetchAssistantResponse(conversation);

      appendMessage("assistant", assistantMessage);
      setInputDisabled(false);
      setShowInput(true);
    } catch (err) {
      console.error("Error sending message:", err.message);
      appendMessage("assistant", "Sorry, something went wrong.");
      setInputDisabled(false);
    }
  };

  const fetchAssistantResponse = async (conversation) => {
    try {
      const response = await fetch(`/api/langchain/test2`, {
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
      if (!data.content) {
        throw new Error("Unexpected response format: missing content");
      }
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
