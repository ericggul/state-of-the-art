import { EVENT_TYPES, INTERACTION_TYPES, ENGAGEMENT_LEVELS } from './eventTypes.js';
import { LOGGING_CONFIG, PHASE_TYPES, isAutoDownloadEnabled } from './config.js';
import { downloadJSON, generateFilename, cleanupOldLogs, saveToLocalStorage, getStoredLogs, clearOldLogs } from './downloadManager.js';

/**
 * UserLogger class for tracking user interactions in SoTA artwork
 * Focuses on user behavior, not backend AI conversations
 */
export class UserLogger {
  constructor() {
    this.events = [];
    this.sessionStartTime = null;
    this.sessionData = null;
    this.isLogging = false;
    this.architectureCount = 0;
    this.scrollCount = 0;
    this.tapCount = 0;
    this.accelerometerStartTime = null;
    this.lastInactivityTime = null;
  }

  /**
   * Starts a new logging session
   * @param {string} sessionId - Unique session identifier
   * @param {string} mobileId - Mobile device identifier
   */
  startSession(sessionId, mobileId) {
    try {
      if (!LOGGING_CONFIG.ENABLED) return;

      this.sessionStartTime = Date.now();
      this.isLogging = true;
      this.events = [];
      this.architectureCount = 0;
      this.scrollCount = 0;
      this.tapCount = 0;
      this.accelerometerStartTime = null;
      this.lastInactivityTime = null;

      this.sessionData = {
        sessionId,
        mobileId,
        absoluteStartTime: new Date(this.sessionStartTime).toISOString(),
        userName: '',
        events: [],
        summary: {}
      };

      this.logEvent(EVENT_TYPES.SESSION_START, {
        sessionId,
        mobileId
      }, PHASE_TYPES.FRONTEND);

      if (LOGGING_CONFIG.DEBUG) {
        console.log('🚀 User logging session started:', sessionId);
      }

    } catch (error) {
      this.handleError('startSession', error);
    }
  }

  /**
   * Logs a user interaction event
   * @param {string} eventType - Type of event from EVENT_TYPES
   * @param {Object} data - Event-specific data
   * @param {string} phase - Current phase from PHASE_TYPES
   */
  logEvent(eventType, data = {}, phase = PHASE_TYPES.FRONTEND) {
    try {
      if (!LOGGING_CONFIG.ENABLED) return;
      
      // Allow SESSION_END events even if isLogging is false (for final logging)
      if (!this.isLogging && eventType !== EVENT_TYPES.SESSION_END) return;

      const now = Date.now();
      const relativeTimestamp = this.sessionStartTime ? now - this.sessionStartTime : 0;

      const event = {
        eventType,
        relativeTimestamp,
        absoluteTimestamp: new Date(now).toISOString(),
        phase,
        data: { ...data }
      };

      this.events.push(event);

      // Update counters for summary
      this.updateCounters(eventType, data);

      // Prevent memory overflow
      if (this.events.length > LOGGING_CONFIG.MAX_EVENTS) {
        this.events.shift();
      }

      if (LOGGING_CONFIG.DEBUG) {
        console.log('📝 Event logged:', eventType, data);
      }

    } catch (error) {
      this.handleError('logEvent', error);
    }
  }

  /**
   * Updates internal counters for summary generation
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  updateCounters(eventType, data) {
    try {
      switch (eventType) {
        case EVENT_TYPES.ARCHITECTURE_INTERACTION:
          this.architectureCount++;
          if (data.interactionType === INTERACTION_TYPES.SCROLL) {
            this.scrollCount++;
          } else if (data.interactionType === INTERACTION_TYPES.TAP) {
            this.tapCount++;
          }
          break;
        case EVENT_TYPES.ACCELEROMETER_ACTIVATED:
          if (data.isActive) {
            this.accelerometerStartTime = Date.now();
          }
          break;
        case EVENT_TYPES.USERNAME_ENTERED:
          if (this.sessionData) {
            this.sessionData.userName = data.userName || '';
          }
          break;
        case EVENT_TYPES.USER_INACTIVITY_START:
          this.lastInactivityTime = Date.now();
          break;
      }
    } catch (error) {
      this.handleError('updateCounters', error);
    }
  }

  /**
   * Generates HCI-focused summary of user session
   * @returns {Object} Summary object
   */
  generateSummary() {
    try {
      const sessionEndTime = Date.now();
      const totalDuration = sessionEndTime - this.sessionStartTime;

      // Find key phases
      const frontendEvents = this.events.filter(e => e.phase === PHASE_TYPES.FRONTEND);
      const backendStart = this.events.find(e => e.eventType === EVENT_TYPES.BACKEND_STARTED);
      const endingStart = this.events.find(e => e.eventType === EVENT_TYPES.ENDING_STARTED);

      // Calculate phase durations
      const frontendDuration = backendStart ? backendStart.relativeTimestamp : totalDuration;
      const backendDuration = backendStart && endingStart ? 
        endingStart.relativeTimestamp - backendStart.relativeTimestamp : 0;
      const endingDuration = endingStart ? 
        totalDuration - endingStart.relativeTimestamp : 0;

      // Calculate accelerometer usage
      const accelerometerDuration = this.accelerometerStartTime ? 
        Math.min(totalDuration, sessionEndTime - this.accelerometerStartTime) : 0;

      // Determine engagement level
      const engagementLevel = this.determineEngagementLevel(
        this.architectureCount, 
        accelerometerDuration, 
        frontendDuration
      );

      return {
        totalDuration,
        sessionPhases: {
          frontend: { duration: frontendDuration, percentage: (frontendDuration / totalDuration) * 100 },
          backend: { duration: backendDuration, percentage: (backendDuration / totalDuration) * 100 },
          ending: { duration: endingDuration, percentage: (endingDuration / totalDuration) * 100 }
        },
        userEngagement: {
          architecturesExplored: this.architectureCount,
          totalScrollInteractions: this.scrollCount,
          totalTapInteractions: this.tapCount,
          accelerometerActiveDuration: accelerometerDuration,
          accelerometerEngagementLevel: engagementLevel,
          totalInteractions: this.scrollCount + this.tapCount
        },
        userBehaviorPattern: {
          explorationStyle: this.determineExplorationStyle(),
          interactionBalance: this.calculateInteractionBalance(),
          engagementLevel
        }
      };
    } catch (error) {
      this.handleError('generateSummary', error);
      return {};
    }
  }

  /**
   * Determines user engagement level based on interactions
   * @param {number} architectures - Number of architectures explored
   * @param {number} accelerometerTime - Time spent using accelerometer
   * @param {number} frontendTime - Total frontend time
   * @returns {string} Engagement level
   */
  determineEngagementLevel(architectures, accelerometerTime, frontendTime) {
    try {
      const architectureRate = architectures / (frontendTime / 1000);
      const accelerometerRatio = accelerometerTime / frontendTime;

      if (architectureRate > 0.2 && accelerometerRatio > 0.3) {
        return ENGAGEMENT_LEVELS.HIGH;
      } else if (architectureRate > 0.1 || accelerometerRatio > 0.1) {
        return ENGAGEMENT_LEVELS.MODERATE;
      } else if (architectures > 0) {
        return ENGAGEMENT_LEVELS.LOW;
      }
      return ENGAGEMENT_LEVELS.NONE;
    } catch (error) {
      return ENGAGEMENT_LEVELS.LOW;
    }
  }

  /**
   * Determines exploration style based on interaction patterns
   * @returns {string} Exploration style
   */
  determineExplorationStyle() {
    try {
      const totalInteractions = this.scrollCount + this.tapCount;
      if (totalInteractions === 0) return 'no_exploration';

      const scrollRatio = this.scrollCount / totalInteractions;
      if (scrollRatio > 0.8) return 'gradual_exploration';
      if (scrollRatio < 0.3) return 'focused_selection';
      return 'mixed_exploration';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Calculates interaction balance percentages
   * @returns {Object} Interaction balance
   */
  calculateInteractionBalance() {
    try {
      const total = this.scrollCount + this.tapCount;
      if (total === 0) {
        return { scrolling: 0, tapping: 0, accelerometer: 0 };
      }

      return {
        scrolling: Math.round((this.scrollCount / total) * 100),
        tapping: Math.round((this.tapCount / total) * 100),
        accelerometer: 0 // Will be calculated separately if needed
      };
    } catch (error) {
      return { scrolling: 0, tapping: 0, accelerometer: 0 };
    }
  }

  /**
   * Ends the logging session and triggers download
   * @param {string} reason - Reason for session end
   */
  endSession(reason = 'unknown') {
    try {
      if (!LOGGING_CONFIG.ENABLED || !this.isLogging) return;

      // Prevent double-ending
      this.isLogging = false;

      this.logEvent(EVENT_TYPES.SESSION_END, {
        reason,
        totalDuration: Date.now() - this.sessionStartTime
      }, PHASE_TYPES.RESET);

      // Generate final log data
      const finalData = {
        ...this.sessionData,
        events: this.events,
        summary: this.generateSummary()
      };

      // Download log file
      const filename = generateFilename(
        this.sessionData.sessionId,
        this.sessionData.userName,
        new Date().toISOString().replace(/[:.]/g, '-')
      );

      const downloadSuccess = downloadJSON(finalData, filename);

      if (LOGGING_CONFIG.DEBUG) {
        console.log('🏁 User logging session ended:', reason, downloadSuccess ? '✅ Saved' : '❌ Save failed');
      }

      // Clean up old logs (keep last 20 sessions)
      try {
        cleanupOldLogs(20);
      } catch (error) {
        // Silent cleanup failure
      }

      // Clean up current session
      this.events = [];
      this.sessionData = null;

    } catch (error) {
      this.handleError('endSession', error);
    }
  }

  /**
   * Error handler for logging operations
   * @param {string} method - Method where error occurred
   * @param {Error} error - Error object
   */
  handleError(method, error) {
    try {
      if (LOGGING_CONFIG.DEBUG) {
        console.warn(`⚠️ UserLogger.${method} error:`, error);
      }

      // Log the error as an event if logging is active
      if (this.isLogging) {
        this.events.push({
          eventType: EVENT_TYPES.LOGGING_ERROR,
          relativeTimestamp: Date.now() - this.sessionStartTime,
          absoluteTimestamp: new Date().toISOString(),
          phase: 'error',
          data: {
            method,
            error: error.message
          }
        });
      }
    } catch (nestedError) {
      // Fail silently to prevent infinite loops
      if (LOGGING_CONFIG.DEBUG) {
        console.warn('⚠️ Error in error handler:', nestedError);
      }
    }
  }

  /**
   * Checks if logging is currently active
   * @returns {boolean} Logging status
   */
  isActive() {
    return LOGGING_CONFIG.ENABLED && this.isLogging;
  }

  /**
   * Force stops logging (emergency stop)
   */
  forceStop() {
    try {
      this.isLogging = false;
      this.events = [];
      this.sessionData = null;
      
      if (LOGGING_CONFIG.DEBUG) {
        console.log('🛑 User logging force stopped');
      }
    } catch (error) {
      // Fail silently
    }
  }

  downloadLogs() {
    try {
      // Only attempt download if auto download is enabled
      if (!isAutoDownloadEnabled()) {
        this.logDebug('Auto download not enabled, skipping download');
        return;
      }

      if (!this.sessionData || this.events.length === 0) {
        this.logDebug('No data to download');
        return;
      }

      const data = this.generateReportData();
      const filename = generateFilename(this.sessionData.username, this.sessionData.sessionId);

      // Save to localStorage as primary method
      saveToLocalStorage(data, this.sessionData.sessionId);
      
      // Try to download file as secondary method
      downloadJSON(data, filename);
      
      // Clean up old logs
      cleanupOldLogs();
      
      this.logDebug('Logs downloaded successfully');
    } catch (error) {
      this.logDebug('Download error:', error);
    }
  }
} 