import React, { useMemo, useState, useEffect } from "react";
import * as S from "./styles";
import useBackendStore from "@/components/backend/store";

function TranscriptComponent() {
  const conversations = useBackendStore((state) => state.conversations);
  const isblack = useBackendStore((state) => state.isblack);
  const [displayMessage, setDisplayMessage] = useState("");

  // Update displayMessage only when isblack becomes false
  useEffect(() => {
    if (!isblack) {
      try {
        const newMessage =
          conversations?.[conversations.length - 1]?.message?.content ?? "";
        setDisplayMessage(newMessage);
      } catch (error) {
        console.error("Error parsing conversation:", error);
        setDisplayMessage("");
      }
    }
  }, [isblack]);

  return <S.Text>{displayMessage}</S.Text>;
}

export default React.memo(TranscriptComponent);
