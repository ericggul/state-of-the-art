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
  const [inputDisabled, setInputDisabled] = useState(true); // Start with input disabled
  const [currentStep, setCurrentStep] = useState(0);
  const [suggestedResponses, setSuggestedResponses] = useState([]);
  const [showInput, setShowInput] = useState(false); // Start with input hidden
  const [placeholderText, setPlaceholderText] = useState("What's your name?"); // Initial placeholder
  const messagesEndRef = useRef(null);
  const hasSentInitialMessage = useRef(false);

  // Scroll to the bottom automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial assistant message when component mounts
  useEffect(() => {
    if (!hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true;
      setInputDisabled(true);
      setShowInput(false); // Hide input during initial delay
      setTimeout(() => {
        sendMessage("");
      }, 1000); // 1-second delay
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

      // Stream assistant's response and get the full assistant message
      const assistantMessage = await streamAssistantResponse(conversation);

      // Proceed to the next step in the SYSTEM_SCRIPT after receiving input
      setCurrentStep((prevStep) => Math.min(prevStep + 1, SYSTEM_SCRIPT.length - 1));

      // Prepare updated conversation including the assistant's latest message
      const updatedConversation = [...conversation, { role: "assistant", content: assistantMessage }];

      // Get the last 5 messages for context
      const lastFiveMessages = updatedConversation.slice(-5);

      await fetchSuggestedResponses({ conversation: lastFiveMessages, nextCommand });

      setInputDisabled(false);

      // Show input and update placeholder after initial assistant message
      setShowInput(true);
      if (currentStep >= 1) {
        setPlaceholderText("Enter your message...");
      }
    } catch (err) {
      console.error("Error sending message:", err.message);
      setInputDisabled(false);
    }
  };

  const streamAssistantResponse = async (conversation) => {
    const response = await fetch(`/api/openai/chat/streaming`, {
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

    let assistantMessageContent = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        assistantMessageContent += chunk;
        appendToLastMessage(chunk);
      }
    }

    return assistantMessageContent;
  };

  const fetchSuggestedResponses = async ({ conversation, nextCommand }) => {
    try {
      const response = await fetch(`/api/openai/chat/suggested-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation, nextCommand }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Prevent suggestions from containing single or double quotes
      const cleanSuggestions = (data.suggestions || []).map((suggestion) => suggestion.replace(/['"]/g, ""));

      setSuggestedResponses(cleanSuggestions);
    } catch (e) {
      console.log(e);
    }
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
      {currentStep >= 2 && suggestedResponses.length > 0 && (
        <S.SuggestedResponses>
          {suggestedResponses.map((suggestion, index) => (
            <S.SuggestedResponseButton key={index} onClick={() => handleSuggestedResponseClick(suggestion)}>
              {suggestion}
            </S.SuggestedResponseButton>
          ))}
        </S.SuggestedResponses>
      )}

      {/* Conditionally render the input form */}
      {showInput && (
        <S.InputForm onSubmit={handleSubmit}>
          <S.Input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={inputDisabled ? "" : placeholderText} disabled={inputDisabled} />
          <S.Button type="submit" disabled={inputDisabled}>
            Send
          </S.Button>
        </S.InputForm>
      )}
    </S.Container>
  );
};

export default Chat;
