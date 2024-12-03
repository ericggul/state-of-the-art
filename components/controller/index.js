"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import useSocketController from "@/utils/socket/useSocketController";
import useControllerStore from "./store";
import useControllerVisibility from "@/utils/hooks/useControllerVisibility";
import * as S from "./styles";
import useAutoReset from "./utils/useAutoReset";

export default function Controller() {
  const {
    activeMobileId,
    mobileVisibility,
    currentArchitecture,
    handleNewMobileInit: handleNewMobileInitStore,
    handleNewMobileVisibility: handleNewMobileVisibilityStore,
    handleNewMobileArchitecture,
    stage,
    isReset,
    reset,
  } = useControllerStore();

  // Add state for sessionId
  const [sessionId, setSessionId] = useState(null);

  // Generate and emit session ID on mount
  useEffect(() => {
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    console.log("Generated new session ID:", newSessionId);
    emitSocketEvent("controller-new-sessionId", { sessionId: newSessionId });
  }, []);

  // Format the timestamp
  const formattedSessionTime = useMemo(() => {
    if (!sessionId) return "";
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

  // Socket setup with handlers
  const socket = useSocketController({
    handleNewMobileInit: (data) => {
      emitSocketEvent("controller-new-init", data);
      handleNewMobileInitStore(data);
    },
    handleNewMobileVisibility: (data) => {
      handleNewMobileVisibilityStore(data);
      // emitSocketEvent("controller-new-visibility-change", {
      //   ...data,
      //   origin: "controller-" + (data.origin || ""),
      // });
    },
    handleNewMobileArchitecture,
  });

  // Helper function for socket emissions
  const emitSocketEvent = async (event, data) => {
    try {
      if (socket.current) {
        await socket.current.emit(event, data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Effects
  useControllerVisibility();

  // useEffect(() => {
  //   if (isReset) {
  //     emitSocketEvent("controller-new-stage-and-reset", {
  //       isReset,
  //       type: "reset",
  //     });
  //     const timeout = setTimeout(reset, 5000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [isReset]);

  useEffect(() => {
    // emitSocketEvent("controller-new-stage-and-reset", { stage, type: "stage" });
  }, [stage]);

  const timeoutRef = useRef(null);
  const handleForceReset = () => {
    emitSocketEvent("controller-new-stage-and-reset", {
      isReset: true,
      type: "reset",
      force: true,
    });
    timeoutRef.current = setTimeout(reset, 2000);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Add auto reset hook
  useAutoReset({
    stage,
    handleForceReset,
  });

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
        <StatusItem
          active={!isReset}
          label="Reset Status"
          value={isReset ? "Reset" : "Active"}
        />
        <S.ResetButton onClick={handleForceReset}>
          Force Reset All Screens
        </S.ResetButton>
      </S.Header>

      <S.Content>
        <S.Title>Current Architecture</S.Title>
        <S.StatusItem>
          {currentArchitecture?.name || "None selected"}
        </S.StatusItem>
      </S.Content>
    </S.Container>
  );
}
