"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";
import useAutoReset from "./utils/useAutoReset";

const Ending = dynamic(() => import("@/components/screen/ending"));

export default function Controller({ socket }) {
  const {
    targetMobileId: activeMobileId,
    mobileVisibility,
    currentArchitectures,
    stage,
    isEnding,
  } = useScreenStore();

  const [sessionId, setSessionId] = useState(Date.now().toString());

  const formattedSessionTime = useMemo(() => {
    if (!sessionId) return "";

    try {
      socket.current.emit("controller-new-session-id", { sessionId });
    } catch (e) {
      console.log(e);
    }

    const date = new Date(parseInt(sessionId));
    return date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, [sessionId]);

  const handleForceReset = () => {
    socket.current?.emit("controller-new-stage-and-reset", {
      isReset: true,
      type: "reset",
      force: true,
    });
    setTimeout(() => window.location.reload(), 2000);
  };

  // Use the auto-reset hook
  useAutoReset({ stage, handleForceReset });

  // Status indicator helper
  const StatusItem = ({ active, label, value }) => (
    <S.StatusItem>
      <S.StatusIndicator $active={active} />
      {label}: {value}
    </S.StatusItem>
  );

  return (
    <S.Container>
      <S.Header>
        <S.Title>Controller Status</S.Title>
        <StatusItem
          active={true}
          label="Session ID"
          value={`${sessionId || "Not generated"} (${formattedSessionTime})`}
        />
        <StatusItem
          active={activeMobileId !== null}
          label="Mobile ID"
          value={activeMobileId || "No mobile connected"}
        />
        <StatusItem
          active={mobileVisibility}
          label="Mobile Status"
          value={mobileVisibility ? "Active" : "Inactive"}
        />
        <StatusItem active={stage === "Frontend"} label="Stage" value={stage} />

        <S.ResetButton onClick={handleForceReset}>
          Force Reset All Screens
        </S.ResetButton>
      </S.Header>

      <S.Content>
        <S.Title>Current Architecture</S.Title>
        <S.StatusItem>
          {currentArchitectures?.[0]?.name || "None selected"}
        </S.StatusItem>
      </S.Content>
      {isEnding && <Ending />}
    </S.Container>
  );
}
