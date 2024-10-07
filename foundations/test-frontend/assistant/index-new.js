import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { AssistantStream } from "openai/lib/AssistantStream";

import VoiceRecorder from "./voice-recorder";

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

const Chat = ({ functionCallHandler = () => Promise.resolve("") }) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat automatically
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a new threadID when the component mounts
  useEffect(() => {
    const createThread = async () => {
      try {
        const res = await fetch(`/api/openai/assistants/threads`, {
          method: "POST",
        });
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        const data = await res.json();
        setThreadId(data.threadId);
      } catch (err) {
        console.error("Error creating thread:", err.message);
      }
    };
    createThread();
  }, []);

  const sendMessage = async (text) => {
    try {
      const response = await fetch(`/api/openai/assistants/threads/${threadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    try {
      const response = await fetch(`/api/openai/assistants/threads/${threadId}/actions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } catch (err) {
      console.error("Error submitting action result:", err.message);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!userInput.trim()) return;
  //   sendMessage(userInput);
  //   setMessages((prevMessages) => [...prevMessages, { role: "user", text: userInput }]);
  //   setUserInput("");
  //   setInputDisabled(true);
  //   scrollToBottom();
  // };

  /* Stream Event Handlers */

  // Handle new assistant message creation
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // Handle assistant message text updates
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
  };

  // Handle image rendering
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  // Handle tool call creation
  const toolCallCreated = (toolCall) => {
    if (toolCall.type !== "code_interpreter") return;
    appendMessage("code", "");
  };

  // Handle tool call delta updates
  const toolCallDelta = (delta) => {
    if (delta.type !== "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // Handle action requests and function calls
  const handleRequiresAction = async (event) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // Re-enable input after action is completed
  const handleRunCompleted = () => {
    setInputDisabled(false);
  };

  // Handle the readable stream and stream events
  const handleReadableStream = (stream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action") {
        handleRequiresAction(event);
      }
      if (event.event === "thread.run.completed") {
        handleRunCompleted();
      }
    });
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

  const handleVoiceTranscription = (transcribedText) => {
    setUserInput(transcribedText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    // Add the logic for handling user message submission
    setMessages((prev) => [...prev, { role: "user", text: userInput }]);
    setUserInput(""); // Clear the input after sending
    scrollToBottom();
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
        <VoiceRecorder onTranscriptionComplete={handleVoiceTranscription} />
        <S.Button type="submit" disabled={inputDisabled}>
          Send {/* Simple text instead of the Send icon */}
        </S.Button>
      </S.InputForm>
    </S.Container>
  );
};

export default Chat;
