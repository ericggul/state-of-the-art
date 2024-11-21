import React, { useState, useEffect } from "react";
import * as S from "./styles";

function Transcript({ conversations, isblack }) {
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (!isblack && conversations.length > 0) {
      try {
        const newMessage =
          conversations[conversations.length - 1].message.content;
        setDisplayMessage(newMessage);
      } catch (error) {
        console.error("Error parsing conversation:", error);
        setDisplayMessage("");
      }
    }
  }, [isblack, conversations]);

  return (
    <S.Text
      style={{
        color: isblack ? "#fff" : "#000",
      }}
    >
      {displayMessage}
    </S.Text>
  );
}

export default React.memo(Transcript);
