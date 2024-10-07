import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { SYSTEM_DESCRIPTION, SYSTEM_ENSURMENT, SYSTEM_SCRIPT } from "./constant";

const Message = ({ role, text }) => {
  switch (role) {
    case "user":
      return <S.UserMessage>{text}</S.UserMessage>;
    case "assistant":
      return <S.AssistantMessage>{text}</S.AssistantMessage>;
    default:
      return null;
  }
};

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [suggestedResponses, setSuggestedResponses] = useState([]); // Added state for suggested responses
  const messagesEndRef = useRef(null);
  const hasSentInitialMessage = useRef(false); // Ref to track initial message

  // Scroll to the bottom automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial assistant message when component mounts
  useEffect(() => {
    if (!hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true;
      // Optionally delay the initial message by 1 second
      setTimeout(() => {
        sendMessage("");
      }, 1000);
    }
  }, []);

  const sendMessage = async (text) => {
    try {
      setInputDisabled(true);

      const nextCommand = SYSTEM_SCRIPT[currentStep]?.command || "Proceed with custom input.";

      const conversation = [
        { role: "system", content: SYSTEM_DESCRIPTION },
        ...messages.map((msg) => ({ role: msg.role, content: msg.text })).slice(-10),
        { role: "system", content: SYSTEM_ENSURMENT },
        { role: "system", content: `COMMAND: ${nextCommand}` },
      ];

      if (text) {
        conversation.push({ role: "user", content: text });
      }

      // Stream assistant's response
      await streamAssistantResponse(conversation);

      // Proceed to the next step in the SYSTEM_SCRIPT after receiving input
      setCurrentStep((prevStep) => Math.min(prevStep + 1, SYSTEM_SCRIPT.length - 1));

      // Fetch suggested responses after assistant's message
      await fetchSuggestedResponses();

      setInputDisabled(false);
    } catch (err) {
      console.error("Error sending message:", err.message);
      setInputDisabled(false);
    }
  };

  const streamAssistantResponse = async (conversation) => {
    const response = await fetch(`/api/openai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
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
  };

  const fetchSuggestedResponses = async () => {
    // Get the assistant's last message
    const assistantLastMessage = messages.filter((msg) => msg.role === "assistant").slice(-1)[0]?.text || "";

    const response = await fetch(`/api/openai/chat/suggested-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: assistantLastMessage }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    setSuggestedResponses(data.suggestions || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    appendMessage("user", userInput);
    setSuggestedResponses([]); // Clear suggestions after user input
    sendMessage(userInput);
    setUserInput("");
  };

  const handleSuggestedResponseClick = (suggestion) => {
    appendMessage("user", suggestion);
    setSuggestedResponses([]); // Clear suggestions after user selects one
    sendMessage(suggestion);
    setUserInput("");
  };

  /* Utility Functions */

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      if (prevMessages.length === 0) return prevMessages;

      const lastMessage = prevMessages[prevMessages.length - 1];

      // Ensure we're updating the assistant's message
      if (lastMessage.role !== "assistant") return prevMessages;

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

      {/* Display suggested responses */}
      {suggestedResponses.length > 0 && (
        <S.SuggestedResponses>
          {suggestedResponses.map((suggestion, index) => (
            <S.SuggestedResponseButton key={index} onClick={() => handleSuggestedResponseClick(suggestion)}>
              {suggestion}
            </S.SuggestedResponseButton>
          ))}
        </S.SuggestedResponses>
      )}

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
