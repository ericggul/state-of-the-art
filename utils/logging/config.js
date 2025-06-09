// Logging Configuration
export const LOGGING_CONFIG = {
  // Feature flag - can be easily disabled
  ENABLED: true,
  
  // Environment settings
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  
  // File naming
  FILE_PREFIX: "sota_session",
  
  // Timeouts and performance
  DEBOUNCE_MS: 100,
  MAX_EVENTS: 1000,
  
  // Error handling
  SILENT_FAILURE: true,
  FALLBACK_TO_LOCALSTORAGE: true,
  
  // Debug mode (only in development)
  DEBUG: process.env.NODE_ENV !== "production",
  
  enabled: true,
  debugMode: false,
  autoDownload: false,
  storageKey: 'sota_user_logs',
  autoDownloadKey: 'sota_auto_download_enabled',
  maxStoredSessions: 20,
};

export const PHASE_TYPES = {
  FRONTEND: "frontend",
  TRANSITION: "transition", 
  BACKEND: "backend",
  ENDING: "ending",
  RESET: "reset",
};

// Expose log management functions to window object in development
if (typeof window !== 'undefined' && !LOGGING_CONFIG.IS_PRODUCTION) {
  import('./downloadManager.js').then(({ getAllStoredLogs, exportAllLogs, cleanupOldLogs }) => {
    window.sotaLogs = {
      getAllLogs: getAllStoredLogs,
      exportAll: exportAllLogs,
      cleanup: cleanupOldLogs,
      viewLatest: () => {
        const logs = getAllStoredLogs();
        if (logs.length > 0) {
          return logs[0];
        } else {
          return null;
        }
      }
    };
  });
}

export const enableAutoDownload = () => {
  try {
    // 1. 여러 더미 파일을 연속으로 다운로드해서 브라우저가 자동 다운로드 허용을 묻도록 유도
    const downloadMultipleDummies = () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const dummyData = { 
            message: `SoTA 다운로드 테스트 파일 ${i + 1}/3`,
            timestamp: new Date().toISOString(),
            note: "이 파일들은 브라우저 설정용이므로 삭제해도 됩니다."
          };
          
          const blob = new Blob([JSON.stringify(dummyData, null, 2)], { 
            type: 'application/json' 
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sota_auto_download_test_${i + 1}.json`;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, i * 100); // 100ms 간격으로 다운로드
      }
    };

    // 즉시 여러 파일 다운로드 시작
    downloadMultipleDummies();
    
    // 권한 플래그 저장
    localStorage.setItem(LOGGING_CONFIG.autoDownloadKey, 'true');
    
    return true;
  } catch (error) {
    console.error('Failed to enable auto download:', error);
    return false;
  }
};

export const isAutoDownloadEnabled = () => {
  try {
    return localStorage.getItem(LOGGING_CONFIG.autoDownloadKey) === 'true';
  } catch (error) {
    console.error('Failed to check auto download status:', error);
    return false;
  }
};

export const disableAutoDownload = () => {
  try {
    localStorage.removeItem(LOGGING_CONFIG.autoDownloadKey);
    return true;
  } catch (error) {
    console.error('Failed to disable auto download:', error);
    return false;
  }
}; 