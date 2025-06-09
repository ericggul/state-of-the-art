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
          console.log('Latest log:', logs[0]);
          return logs[0];
        } else {
          console.log('No logs found');
          return null;
        }
      }
    };
    console.log('📊 SoTA Log Management available via window.sotaLogs');
  });
}

export const enableAutoDownload = () => {
  try {
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