// Chat.js
import React from "react";
import * as S from "./styles";
import { Message } from "./Message";
import { useChatLogic } from "./utils/useChatLogic";
import { useSuggestedResponses } from "./utils/useSuggestedResponses";
import { useAutoScroll } from "./utils/useAutoScroll";

const Chat = () => {
  const { userInput, setUserInput, messages, inputDisabled, currentStep, showInput, placeholderText, handleSubmit, sendMessage } = useChatLogic();

  const { suggestedResponses, handleSuggestedResponseClick } = useSuggestedResponses(currentStep, sendMessage);

  const messagesEndRef = useAutoScroll(messages);

  return (
    <S.Container>
      <S.Messages>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </S.Messages>

      {currentStep >= 2 && suggestedResponses.length > 0 && (
        <S.SuggestedResponses>
          {suggestedResponses.map((suggestion, index) => (
            <S.SuggestedResponseButton key={index} onClick={() => handleSuggestedResponseClick(suggestion)}>
              {suggestion}
            </S.SuggestedResponseButton>
          ))}
        </S.SuggestedResponses>
      )}

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
