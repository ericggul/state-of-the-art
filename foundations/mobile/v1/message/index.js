// Message.js
import React from "react";
import * as S from "./styles";

export const Message = ({ role, text }) => {
  switch (role) {
    case "user":
      return <S.UserMessage>{text}</S.UserMessage>;
    case "assistant":
      return <S.AssistantMessage>{text}</S.AssistantMessage>;
    default:
      return null;
  }
};
