import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles"; // Import all styles as `S`
import { SYSTEM_DESCRIPTION, SYSTEM_ENSURMENT, SYSTEM_SCRIPT } from "./constant";

// Utility function to map different message roles
const Message = ({ role, text }) => {
  switch (role) {
    case "user":
      return <S.UserMessage>{text}</S.UserMessage>;
    case "assistant":
      return <S.AssistantMessage>{text}</S.AssistantMessage>;
    case "code":
      return (
        <S.CodeMessage>
          {text.split("\n").map((line, index) => (
            <div key={index}>
              <span>{`${index + 1}. `}</span>
              {line}
            </div>
          ))}
        </S.CodeMessage>
      );
    default:
      return null;
  }
};

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]); // Store the entire conversation

  const [inputDisabled, setInputDisabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track script step
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat automatically
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    try {
      setInputDisabled(true); // Disable input while fetching

      const nextCommand = SYSTEM_SCRIPT[currentStep]?.command || "Proceed with custom input.";

      console.log(currentStep, nextCommand);

      const conversation = [
        { role: "system", content: SYSTEM_DESCRIPTION },
        ...messages.map((msg) => ({ role: msg.role, content: msg.text })).slice(-10),
        { role: "system", content: SYSTEM_ENSURMENT }, // System ensurment to follow script
        { role: "system", content: `COMMAND: ${nextCommand}` },
        { role: "user", content: text }, // Include the new user input
      ];

      console.log(conversation, "61");

      const response = await fetch(`/api/openai/chat-1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation }), // Send conversation
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Start a new assistant message
      appendMessage("assistant", "");

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          appendToLastMessage(chunk);
        }
      }

      // Proceed to the next step in the SYSTEM_SCRIPT after receiving input
      setCurrentStep((prevStep) => Math.min(prevStep + 1, SYSTEM_SCRIPT.length - 1));

      setInputDisabled(false); // Re-enable input after fetching
    } catch (err) {
      console.error("Error sending message:", err.message);
      setInputDisabled(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    appendMessage("user", userInput);
    sendMessage(userInput);
    setUserInput("");
    scrollToBottom();
  };

  /* Utility Functions */

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
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

      <S.InputForm onSubmit={handleSubmit}>
        <S.Input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Enter your message..." disabled={inputDisabled} />
        <S.Button type="submit" disabled={inputDisabled}>
          Send
        </S.Button>
      </S.InputForm>
    </S.Container>
  );
};

export default Chat;
