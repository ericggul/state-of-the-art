import React, { useMemo, useState, useEffect } from "react";
import * as S from "./styles";
import useBackendStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";

function TranscriptComponent() {
  const conversations = useBackendStore((state) => state.conversations);
  const isblack = useBackendStore((state) => state.isblack);
  const deviceIndex = useScreenStore((state) => state.deviceIndex);

  const [displayMessage, setDisplayMessage] = useState("");

  // Update displayMessage only when isblack becomes false
  useEffect(() => {
    if (!isblack) {
      try {
        const targetConversation = conversations.filter(
          (conversation) => conversation.deviceIndex == deviceIndex
        );
        const newMessage =
          targetConversation?.[targetConversation.length - 1]?.message
            ?.content ?? "";
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
