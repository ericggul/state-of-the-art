import { LOGGING_CONFIG } from './config.js';

/**
 * Saves JSON data automatically without requiring user interaction
 * Uses localStorage as primary method for unattended art installation
 * @param {Object} data - The data to save
 * @param {string} filename - The filename to use
 * @returns {boolean} - Success status
 */
export const downloadJSON = (data, filename) => {
  try {
    if (!LOGGING_CONFIG.ENABLED) {
      return false;
    }

    // PRIMARY: Save to localStorage (no permissions required)
    const localStorageSuccess = saveToLocalStorage(data, filename);
    
    // SECONDARY: Try automatic download (may fail in unattended mode)
    let downloadSuccess = false;
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      
      // Force click multiple times to ensure download
      document.body.appendChild(a);
      
      // Try multiple click approaches
      a.click();
      
      // Alternative click method
      setTimeout(() => {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        a.dispatchEvent(event);
      }, 10);
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      downloadSuccess = true;
    } catch (downloadError) {
      if (LOGGING_CONFIG.DEBUG) {
        console.warn('⚠️ Auto-download failed (expected in unattended mode):', downloadError);
      }
    }
    
    if (LOGGING_CONFIG.DEBUG && process.env.NODE_ENV === 'development') {
      console.log('💾 Log saved:', filename, {
        sessionId: data.sessionData?.sessionId,
        username: data.sessionData?.userName,
        events: data.sessionData?.events?.length || 0
      });
    }
    
    return localStorageSuccess; // Return true if localStorage worked
  } catch (error) {
    console.error('Download failed:', error);
    
    // Emergency fallback: copy to clipboard
    try {
      const jsonString = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(jsonString);
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Download failed, data copied to clipboard instead');
      }
    } catch (clipboardError) {
      // Silent failure
    }
    
    return false;
  }
};

/**
 * Saves data to localStorage (primary storage method for unattended installation)
 * @param {Object} data - The data to save
 * @param {string} filename - The filename key
 * @returns {boolean} - Success status
 */
export const saveToLocalStorage = (data, filename) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `sota_session_log_${timestamp}`;
    const logEntry = {
      filename,
      timestamp,
      data
    };
    
    localStorage.setItem(key, JSON.stringify(logEntry, null, 2));
    
        if (LOGGING_CONFIG.DEBUG && process.env.NODE_ENV === 'development') {
      console.log('💾 Log saved to localStorage:', key);
    }
    
    return true;
  } catch (error) {
    if (LOGGING_CONFIG.DEBUG) {
      console.warn('❌ localStorage save failed:', error);
    }
    return false;
  }
};

/**
 * Generates filename for log download
 * @param {string} sessionId - Session identifier
 * @param {string} userName - User name
 * @param {string} timestamp - Timestamp string
 * @returns {string} - Formatted filename
 */
export const generateFilename = (sessionId, userName = '', timestamp = '') => {
  try {
    const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown';
    const safeTimestamp = timestamp || new Date().toISOString().replace(/[:.]/g, '-');
    
    return `${LOGGING_CONFIG.FILE_PREFIX}_${sessionId}_${safeUserName}_${safeTimestamp}.json`;
  } catch (error) {
    // Fallback filename
    return `${LOGGING_CONFIG.FILE_PREFIX}_${sessionId || Date.now()}_${Date.now()}.json`;
  }
};

/**
 * Retrieves all stored logs from localStorage
 * @returns {Array} Array of log entries
 */
export const getAllStoredLogs = () => {
  try {
    const logs = [];
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key.startsWith('sota_session_log_')) {
        try {
          const logEntry = JSON.parse(localStorage.getItem(key));
          logs.push({
            key,
            ...logEntry
          });
        } catch (parseError) {
          console.warn('Failed to parse log entry:', key);
        }
      }
    }
    
    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return logs;
  } catch (error) {
    console.warn('Failed to retrieve stored logs:', error);
    return [];
  }
};

/**
 * Exports all stored logs as a single downloadable file
 * @returns {boolean} Success status
 */
export const exportAllLogs = () => {
  try {
    const logs = getAllStoredLogs();
    if (logs.length === 0) {
      if (process.env.NODE_ENV === 'development') {
      console.log('No logs to export');
    }
      return false;
    }
    
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      totalSessions: logs.length,
      logs: logs
    };
    
    const filename = `sota_all_sessions_export_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    // Try download first, then localStorage
    try {
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      
      if (process.env.NODE_ENV === 'development') {
      console.log('📁 All logs exported successfully:', filename);
    }
      return true;
    } catch (downloadError) {
      console.warn('Export download failed, saving to localStorage:', downloadError);
      const exportKey = `sota_export_${Date.now()}`;
      localStorage.setItem(exportKey, JSON.stringify(exportData, null, 2));
      if (process.env.NODE_ENV === 'development') {
      console.log('📁 All logs exported to localStorage:', exportKey);
    }
      return true;
    }
  } catch (error) {
    console.warn('Failed to export logs:', error);
    return false;
  }
};

/**
 * Clears old log entries (keep only last N sessions)
 * @param {number} keepCount - Number of recent sessions to keep
 */
export const cleanupOldLogs = (keepCount = 10) => {
  try {
    const logs = getAllStoredLogs();
    if (logs.length <= keepCount) return;
    
    // Remove older logs
    const logsToRemove = logs.slice(keepCount);
    for (const log of logsToRemove) {
      localStorage.removeItem(log.key);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧹 Cleaned up ${logsToRemove.length} old log entries, kept ${keepCount} recent ones`);
    }
  } catch (error) {
    console.warn('Failed to cleanup old logs:', error);
  }
}; 