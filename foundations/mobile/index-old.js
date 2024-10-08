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
        appendMessage("user", text); // Add the user message to the state
      }

      // Fetch the assistant response
      const assistantMessage = await fetchAssistantResponse(conversation);

      // Proceed to the next step in the SYSTEM_SCRIPT after receiving input
      setCurrentStep((prevStep) => Math.min(prevStep + 1, SYSTEM_SCRIPT.length - 1));

      // Append the assistant's message to the conversation
      appendMessage("assistant", assistantMessage);
      setInputDisabled(false);

      // Prepare updated conversation including the assistant's latest message
      const updatedConversation = [...conversation, { role: "assistant", content: assistantMessage }];

      // Get the last 5 messages for context
      const lastFiveMessages = updatedConversation.slice(-6);

      // Fetch suggested responses based on the updated conversation
      await fetchSuggestedResponses({ conversation: lastFiveMessages, nextCommand });

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

  const fetchAssistantResponse = async (conversation) => {
    try {
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

      const data = await response.json();
      return data.message.content; // Assuming the returned data is in the `content` field
    } catch (e) {
      console.error("Error fetching assistant response", e);
      return "Sorry, something went wrong.";
    }
  };

  const fetchSuggestedResponses = async ({ conversation, nextCommand }) => {
    try {
      const response = await fetch(`/api/openai/chat/suggested-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation, nextCommand, requestedNum: 3 }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Prevent suggestions from containing single or double quotes
      const cleanSuggestions = (data.suggestions || []).map((suggestion) => suggestion.replace(/['"]/g, ""));

      setSuggestedResponses(cleanSuggestions);
    } catch (e) {
      console.error("Error fetching suggested responses", e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setSuggestedResponses([]); // Clear suggestions after user input
    sendMessage(userInput);
    setUserInput("");
  };

  const handleSuggestedResponseClick = (suggestion) => {
    setSuggestedResponses([]); // Clear suggestions after user selects one
    sendMessage(suggestion);
    setUserInput("");
  };

  /* Utility Functions */
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
