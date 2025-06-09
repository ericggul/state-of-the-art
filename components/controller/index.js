"use client";

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";
import useAutoReset from "./utils/useAutoReset";
import { enableAutoDownload, isAutoDownloadEnabled } from "@/utils/logging/config";

const Ending = dynamic(() => import("@/components/screen/ending"));

export default function Controller({ socket }) {
  const {
    targetMobileId: activeMobileId,
    mobileVisibility,
    currentArchitectures,
    stage,
    isEnding,
    setSessionId,
  } = useScreenStore();

  const sessionId = useMemo(() => Date.now().toString(), []);
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setSessionId(sessionId);
      try {
        // Initial delay of 5 seconds
        const initialTimeoutId = setTimeout(() => {
          socket.current.emit("controller-new-sessionId", { sessionId });
        }, 5000);

        // Set up 60-second interval after initial delay
        const intervalId = setInterval(() => {
          if (stage === "Idle") {
            socket.current.emit("controller-new-sessionId", { sessionId });
          }
        }, 60000);

        // Clean up both timers
        return () => {
          clearTimeout(initialTimeoutId);
          clearInterval(intervalId);
        };
      } catch (e) {
        console.log(e);
      }
    }
  }, [sessionId, setSessionId, stage]);

  useEffect(() => {
    setAutoDownloadEnabled(isAutoDownloadEnabled());
  }, []);

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

  const handleForceReset = () => {
    socket.current?.emit("controller-new-stage-and-reset", {
      isReset: true,
      type: "reset",
      force: true,
    });
    try {
      socket.current?.emit("controller-force-reset-active-mobile");
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => window.location.reload(true), 2000);
  };

  const handleEnableAutoDownload = () => {
    try {
      const success = enableAutoDownload();
      if (success) {
        setAutoDownloadEnabled(true);
        alert('자동 다운로드가 활성화되었습니다! 이제 세션이 끝날 때마다 로그가 자동으로 다운로드됩니다.');
      }
    } catch (error) {
      console.error('Failed to enable auto download:', error);
    }
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

        {!autoDownloadEnabled && (
          <S.ResetButton onClick={handleEnableAutoDownload} style={{ backgroundColor: '#4CAF50', marginBottom: '10px' }}>
            로그 자동 다운로드 활성화
          </S.ResetButton>
        )}

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
      {isEnding && <Ending socket={socket} isController={true} />}
    </S.Container>
  );
}
