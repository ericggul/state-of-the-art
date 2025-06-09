import { useEffect, useRef, useCallback, useMemo } from 'react';
import useScreenStore from '@/components/screen/store';
import { UserLogger } from '@/utils/logging/userLogger';
import { EVENT_TYPES } from '@/utils/logging/eventTypes';
import { PHASE_TYPES } from '@/utils/logging/config';
import useSocketScreenOrientation from '@/utils/socket/orientation/useSocketScreen';

/**
 * Hook for logging user interactions with zero impact on existing functionality
 * Observer pattern - watches state changes without modifying them
 */
export default function useUserLogger() {
  const loggerRef = useRef(null);
  const previousStateRef = useRef({});
  const lastLogTimeRef = useRef({});
  
  // HCI-focused accelerometer data tracking (gesture patterns)
  const accelerometerDataRef = useRef({
    gestureCount: 0,          // Significant movements (HCI interactions)
    peakMagnitude: 0,         // Highest magnitude in period
    totalSamples: 0,          // Total accelerometer samples
    lastGesture: 0,           // Timestamp of last gesture
    lastLoggedGesture: 0      // Timestamp of last logged gesture event
  });

  // Store state
  const targetMobileId = useScreenStore(state => state.targetMobileId);
  const sessionId = useScreenStore(state => state.sessionId);
  const userName = useScreenStore(state => state.userName);
  const isAccelerometerActive = useScreenStore(state => state.isAccelerometerActive);
  const introState = useScreenStore(state => state.introState);
  const stage = useScreenStore(state => state.stage);
  const isEnding = useScreenStore(state => state.isEnding);
  const currentArchitectures = useScreenStore(state => state.currentArchitectures);
  const mobileVisibility = useScreenStore(state => state.mobileVisibility);

  // EMERGENCY: Force detect ALL store changes by subscribing to the whole store
  const allStoreState = useScreenStore();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [STORE] State changed - key values:', {
        targetMobileId: allStoreState.targetMobileId,
        userName: allStoreState.userName,
        isAccelerometerActive: allStoreState.isAccelerometerActive,
        stage: allStoreState.stage
      });
    }
    
    if (!loggerRef.current?.isActive()) return;
    
    // Force check username changes
    if (allStoreState.userName && allStoreState.userName !== previousStateRef.current.userName) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚨 [USERNAME] Detected via store observer:', allStoreState.userName);
      }
      loggerRef.current.logEvent(EVENT_TYPES.USERNAME_ENTERED, {
        userName: allStoreState.userName
      }, PHASE_TYPES.FRONTEND);
      previousStateRef.current.userName = allStoreState.userName;
    }
    
    // Force check accelerometer changes
    if (allStoreState.isAccelerometerActive !== previousStateRef.current.isAccelerometerActive) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚨 [ACCELEROMETER] State change detected via store observer:', allStoreState.isAccelerometerActive);
      }
      
      if (allStoreState.isAccelerometerActive) {
        loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_ACTIVATED, {
          isActive: true,
          timestamp: Date.now(),
          detectedViaStoreObserver: true
        }, PHASE_TYPES.FRONTEND);
      } else {
        loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_DEACTIVATED, {
          isActive: false,
          timestamp: Date.now(),
          activeDuration: lastLogTimeRef.current.accelerometer ? Date.now() - lastLogTimeRef.current.accelerometer : 0,
          detectedViaStoreObserver: true
        }, PHASE_TYPES.FRONTEND);
      }
      
      previousStateRef.current.isAccelerometerActive = allStoreState.isAccelerometerActive;
    }
  }, [allStoreState]);

  // DEBUG: Log all store values - development only
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [UserLogger DEBUG] Store values:', {
      targetMobileId, sessionId, userName, isAccelerometerActive, introState, 
      stage, isEnding, currentArchitectures, mobileVisibility
    });
  }

  // Accelerometer data processing (HCI-optimized for meaningful interaction patterns)
  const handleAccelerometerData = useCallback((data) => {
    try {
      if (!loggerRef.current?.isActive()) return;
      
      // REMOVED: Mobile ID check - not needed in single mobile system
      
      // ONE-TIME: Log accelerometer activation only once per session
      if (!allStoreState.isAccelerometerActive && !previousStateRef.current.accelerometerLogged) {
        loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_ACTIVATED, {
          isActive: true,
          timestamp: Date.now()
        }, PHASE_TYPES.FRONTEND);
        
        previousStateRef.current.accelerometerLogged = true;
        previousStateRef.current.isAccelerometerActive = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [ACCELEROMETER] Activated - logged once');
        }
      }
      
      const now = Date.now();
      const { acceleration } = data;
      
      if (acceleration && typeof acceleration.x === 'number') {
        // HCI-FOCUSED: Calculate movement magnitude for gesture detection
        const magnitude = Math.sqrt(
          acceleration.x * acceleration.x + 
          acceleration.y * acceleration.y + 
          acceleration.z * acceleration.z
        );
        
        // PEAK DETECTION: Track significant movements (gestures, shakes, taps)
        const isSignificantMovement = magnitude > 15.0; // Threshold for intentional gestures
        const isPeakMovement = magnitude > 25.0; // Threshold for strong gestures/shakes
        
        if (isSignificantMovement) {
          accelerometerDataRef.current.gestureCount++;
          accelerometerDataRef.current.lastGesture = now;
          accelerometerDataRef.current.peakMagnitude = Math.max(
            accelerometerDataRef.current.peakMagnitude || 0, 
            magnitude
          );
        }
        
        accelerometerDataRef.current.totalSamples++;
        
        // HCI LOGGING: Log meaningful interaction patterns every 5 seconds OR on significant events
        const lastAccelLog = lastLogTimeRef.current.accelerometerActivity || 0;
        const timeSinceLastLog = now - lastAccelLog;
        const shouldLogPeriodic = timeSinceLastLog >= 5000; // 5 seconds for HCI analysis
        const shouldLogGesture = isPeakMovement && (now - (accelerometerDataRef.current.lastLoggedGesture || 0)) > 2000;
        
        if ((shouldLogPeriodic && accelerometerDataRef.current.gestureCount > 0) || shouldLogGesture) {
          // ENGAGEMENT CLASSIFICATION: Classify user interaction level
          const engagementLevel = accelerometerDataRef.current.gestureCount > 10 ? 'high' : 
                                 accelerometerDataRef.current.gestureCount > 3 ? 'medium' : 'low';
          
          const interactionPattern = {
            engagementLevel,
            gestureCount: accelerometerDataRef.current.gestureCount,
            peakMagnitude: Math.round((accelerometerDataRef.current.peakMagnitude || 0) * 100) / 100,
            totalSamples: accelerometerDataRef.current.totalSamples,
            periodMs: shouldLogGesture ? 'gesture_triggered' : 5000,
            interactionType: isPeakMovement ? 'strong_gesture' : 'periodic_summary'
          };
          
          loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_ACTIVITY, interactionPattern, PHASE_TYPES.FRONTEND);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('📊 [ACCELEROMETER] HCI Pattern:', engagementLevel, 'gestures:', accelerometerDataRef.current.gestureCount);
          }
          
          // RESET: Reset counters for next period
          accelerometerDataRef.current.gestureCount = 0;
          accelerometerDataRef.current.totalSamples = 0;
          accelerometerDataRef.current.peakMagnitude = 0;
          lastLogTimeRef.current.accelerometerActivity = now;
          
          if (shouldLogGesture) {
            accelerometerDataRef.current.lastLoggedGesture = now;
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('💥 [ACCELEROMETER] Error:', error);
      }
    }
  }, [allStoreState]);

  // Setup orientation socket ALWAYS (not just when accelerometer is active)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 [SOCKET] Setting up orientation socket, accelerometer active:', isAccelerometerActive);
  }
  const orientationSocket = useSocketScreenOrientation({
    handleNewMobileOrientation: handleAccelerometerData  // Always handle data
  });

  // Initialize logger
  useEffect(() => {
    console.log('🏗️ [LOGGER] Initializing logger...');
    if (!loggerRef.current) {
      loggerRef.current = new UserLogger();
      console.log('✅ [LOGGER] Logger created');
    }
  }, []);

  // Session management
  useEffect(() => {
    console.log('🔄 [SESSION] Session effect triggered:', { sessionId, targetMobileId, isActive: loggerRef.current?.isActive() });
    
    if (sessionId && targetMobileId && loggerRef.current && !loggerRef.current.isActive()) {
      console.log('🚀 [SESSION] Starting new session:', sessionId, targetMobileId);
      loggerRef.current.startSession(sessionId, targetMobileId);
      previousStateRef.current = {
        userName: '',
        isAccelerometerActive: false,
        introState: -1,
        stage: '',
        currentArchitectures: [],
        mobileVisibility: false
      };
      
      // Reset timing for new session
      lastLogTimeRef.current = {};
      console.log('✅ [SESSION] Session started successfully');
    }
  }, [sessionId, targetMobileId]);

  // Username logging with proper detection
  useEffect(() => {
    console.log('👤 [USERNAME] Username effect triggered:', {
      userName: `"${userName}"`,
      isActive: loggerRef.current?.isActive(),
      prevUserName: `"${previousStateRef.current.userName || ''}"`
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [USERNAME] Logger not active, skipping username log');
      return;
    }

    const prevUserName = previousStateRef.current.userName || '';
    
    // Log when username is entered or updated (handle both empty->filled and change)
    if (userName && userName !== prevUserName) {
      console.log('🎯 [USERNAME] Logging username entry:', userName);
      loggerRef.current.logEvent(EVENT_TYPES.USERNAME_ENTERED, {
        userName: userName
      }, PHASE_TYPES.FRONTEND);
      
      previousStateRef.current.userName = userName;
      console.log('✅ [USERNAME] Username logged successfully');
    } else {
      console.log('⏭️ [USERNAME] No username change to log');
    }
  }, [userName]);

  // Intro state progression logging
  useEffect(() => {
    console.log('📱 [INTRO] Intro state effect triggered:', {
      introState,
      isActive: loggerRef.current?.isActive(),
      prevIntroState: previousStateRef.current.introState
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [INTRO] Logger not active, skipping intro log');
      return;
    }

    const prevIntroState = previousStateRef.current.introState;
    
    if (introState !== prevIntroState && introState >= 0) {
      console.log('🎯 [INTRO] Logging intro progression:', prevIntroState, '->', introState);
      loggerRef.current.logEvent(EVENT_TYPES.INTRO_PROGRESSION, {
        fromState: prevIntroState,
        toState: introState
      }, PHASE_TYPES.FRONTEND);
      
      previousStateRef.current.introState = introState;
      console.log('✅ [INTRO] Intro state logged successfully');
    } else {
      console.log('⏭️ [INTRO] No intro state change to log');
    }
  }, [introState]);

  // Accelerometer activity logging (throttled to max 1/second)
  useEffect(() => {
    console.log('🏃‍♂️ [ACCEL_STATE] Accelerometer state effect triggered:', {
      isAccelerometerActive,
      isActive: loggerRef.current?.isActive(),
      prevAccelActive: previousStateRef.current.isAccelerometerActive
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [ACCEL_STATE] Logger not active, skipping accelerometer log');
      return;
    }

    const now = Date.now();
    const lastAccelLog = lastLogTimeRef.current.accelerometer || 0;
    const prevAccelActive = previousStateRef.current.isAccelerometerActive;

    // Only log accelerometer changes and throttle activity logs
    if (isAccelerometerActive !== prevAccelActive) {
      if (isAccelerometerActive) {
        // Log when accelerometer becomes active
        console.log('🎯 [ACCEL_STATE] Logging accelerometer activation');
        loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_ACTIVATED, {
          isActive: true,
          timestamp: now
        }, PHASE_TYPES.FRONTEND);
        
        lastLogTimeRef.current.accelerometer = now;
        console.log('✅ [ACCEL_STATE] Accelerometer activation logged');
      } else {
        // Log when accelerometer becomes inactive
        console.log('🎯 [ACCEL_STATE] Logging accelerometer deactivation');
        loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_DEACTIVATED, {
          isActive: false,
          timestamp: now,
          activeDuration: lastLogTimeRef.current.accelerometer ? now - lastLogTimeRef.current.accelerometer : 0
        }, PHASE_TYPES.FRONTEND);
        console.log('✅ [ACCEL_STATE] Accelerometer deactivation logged');
      }
      
      previousStateRef.current.isAccelerometerActive = isAccelerometerActive;
    } else {
      console.log('⏭️ [ACCEL_STATE] No accelerometer state change to log');
    }
  }, [isAccelerometerActive]);

  // Stage transitions
  useEffect(() => {
    console.log('🎭 [STAGE] Stage effect triggered:', {
      stage,
      isActive: loggerRef.current?.isActive(),
      prevStage: previousStateRef.current.stage
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [STAGE] Logger not active, skipping stage log');
      return;
    }

    const prevStage = previousStateRef.current.stage;
    
    if (stage && stage !== prevStage) {
      if (stage === 'Backend') {
        console.log('🎯 [STAGE] Logging transition to backend');
        loggerRef.current.logEvent(EVENT_TYPES.TRANSITION_TO_BACKEND, {
          fromStage: prevStage,
          toStage: stage,
          reason: 'user_inactivity_or_timeout'
        }, PHASE_TYPES.TRANSITION);
        
        loggerRef.current.logEvent(EVENT_TYPES.BACKEND_STARTED, {
          sessionDuration: Date.now() - (loggerRef.current.sessionStartTime || Date.now())
        }, PHASE_TYPES.BACKEND);
        console.log('✅ [STAGE] Backend transition logged');
      }
      
      previousStateRef.current.stage = stage;
    } else {
      console.log('⏭️ [STAGE] No stage change to log');
    }
  }, [stage]);

  // Architecture interactions
  useEffect(() => {
    console.log('🏗️ [ARCH] Architecture effect triggered:', {
      currentArchitectures: currentArchitectures?.length || 0,
      isActive: loggerRef.current?.isActive()
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [ARCH] Logger not active, skipping architecture log');
      return;
    }

    const prevArchitectures = previousStateRef.current.currentArchitectures || [];
    const currentArch = currentArchitectures?.[0];
    const prevArch = prevArchitectures?.[0];

    if (currentArch && currentArch.name !== prevArch?.name) {
      console.log('🎯 [ARCH] Logging architecture interaction:', currentArch.name);
      loggerRef.current.logEvent(EVENT_TYPES.ARCHITECTURE_INTERACTION, {
        architecture: currentArch.name,
        category: currentArch.category,
        year: currentArch.year,
        interactionType: 'scroll' // Default to scroll since we can't determine exact type
      }, PHASE_TYPES.FRONTEND);
      
      previousStateRef.current.currentArchitectures = currentArchitectures;
      console.log('✅ [ARCH] Architecture interaction logged');
    } else {
      console.log('⏭️ [ARCH] No architecture change to log');
    }
  }, [currentArchitectures]);

  // Visibility changes (user leaving/returning)
  useEffect(() => {
    console.log('👁️ [VISIBILITY] Visibility effect triggered:', {
      mobileVisibility,
      isActive: loggerRef.current?.isActive(),
      prevVisibility: previousStateRef.current.mobileVisibility
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [VISIBILITY] Logger not active, skipping visibility log');
      return;
    }

    const prevVisibility = previousStateRef.current.mobileVisibility;
    
    if (mobileVisibility !== prevVisibility) {
      console.log('🎯 [VISIBILITY] Logging visibility change:', mobileVisibility);
      loggerRef.current.logEvent(EVENT_TYPES.VISIBILITY_CHANGE, {
        isVisible: mobileVisibility,
        returnCount: mobileVisibility ? (previousStateRef.current.returnCount || 0) + 1 : previousStateRef.current.returnCount || 0
      }, PHASE_TYPES.FRONTEND);
      
      if (mobileVisibility) {
        previousStateRef.current.returnCount = (previousStateRef.current.returnCount || 0) + 1;
      }
      
      previousStateRef.current.mobileVisibility = mobileVisibility;
      console.log('✅ [VISIBILITY] Visibility change logged');
    } else {
      console.log('⏭️ [VISIBILITY] No visibility change to log');
    }
  }, [mobileVisibility]);

  // Ending phase detection and immediate download
  useEffect(() => {
    console.log('🏁 [ENDING] Ending effect triggered:', {
      isEnding,
      isActive: loggerRef.current?.isActive()
    });
    
    if (!loggerRef.current?.isActive()) {
      console.log('❌ [ENDING] Logger not active, skipping ending log');
      return;
    }

    if (isEnding) {
      console.log('🎯 [ENDING] Logging session end');
      // Log ending start
      loggerRef.current.logEvent(EVENT_TYPES.ENDING_STARTED, {
        totalSessionDuration: Date.now() - (loggerRef.current.sessionStartTime || Date.now())
      }, PHASE_TYPES.ENDING);

      // End session and download immediately (before window.location.reload())
      loggerRef.current.endSession('ending_credits_started');
      console.log('✅ [ENDING] Session ended and logged');
    }
  }, [isEnding]);

  // Return logging status for debugging
  return useMemo(() => ({
    isLogging: loggerRef.current?.isActive() || false,
    sessionId: loggerRef.current?.sessionData?.sessionId || null
  }), [sessionId, targetMobileId]);
} 