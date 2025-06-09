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
        alert(`✅ 자동 다운로드 활성화 중...\n\n🔥 중요! 브라우저에서 "여러 파일 다운로드 허용" 팝업이 나타나면 반드시 "허용"을 클릭하세요!\n\n📁 테스트 파일 3개가 다운로드됩니다 (삭제해도 됩니다)\n🔄 설정 완료 후 모든 세션 로그가 자동 다운로드됩니다\n\n⚙️ 만약 팝업이 안 나타나면:\nChrome: 주소창 옆 다운로드 아이콘 → 설정 → "${window.location.hostname}" 허용\nSafari: 설정 → 웹사이트 → 다운로드 → "${window.location.hostname}" 허용`);
      }
    } catch (error) {
      console.error('Failed to enable auto download:', error);
      alert('❌ 자동 다운로드 활성화에 실패했습니다.');
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

        {autoDownloadEnabled && (
          <div style={{ backgroundColor: '#E8F5E8', padding: '10px', marginBottom: '10px', borderRadius: '4px', fontSize: '12px', color: '#2E7D32' }}>
            ✅ 자동 다운로드 활성화됨<br/>
            💡 팁: 브라우저에서 "여러 파일 다운로드" 차단 시<br/>
            Chrome: 주소창 옆 다운로드 아이콘 → 설정<br/>
            Safari: 설정 → 웹사이트 → 다운로드
          </div>
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
