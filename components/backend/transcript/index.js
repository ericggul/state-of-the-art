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

        // Include date in the timestamp
        const timeStamp = new Date().toLocaleString();

        setDisplayMessage(`[${timeStamp}] ${newMessage}`);
      } catch (error) {
        console.error("Error parsing conversation:", error);
        setDisplayMessage("");
      }
    }
  }, [isblack, deviceIndex]);

  return (
    <S.Text
      style={{
        color: isblack ? "white" : "black",
      }}
    >
      {displayMessage}
    </S.Text>
  );
}

export default React.memo(TranscriptComponent);
