import { useEffect, useRef, useCallback } from 'react';
import useScreenStore from '@/components/screen/store';
import { UserLogger } from '@/utils/logging/userLogger.js';
import { EVENT_TYPES, INTERACTION_TYPES } from '@/utils/logging/eventTypes.js';
import { PHASE_TYPES } from '@/utils/logging/config.js';

/**
 * Hook to observe store changes and log user interactions
 * CRITICAL: This hook only observes, never modifies existing state or functionality
 */
const useUserLogger = () => {
  const loggerRef = useRef(null);
  const previousStateRef = useRef({});
  
  // Initialize logger once
  if (!loggerRef.current) {
    loggerRef.current = new UserLogger();
  }

  // Get all necessary state from store (read-only observation)
  const targetMobileId = useScreenStore(state => state.targetMobileId);
  const userName = useScreenStore(state => state.userName);
  const stage = useScreenStore(state => state.stage);
  const isEnding = useScreenStore(state => state.isEnding);
  const introState = useScreenStore(state => state.introState);
  const isAccelerometerActive = useScreenStore(state => state.isAccelerometerActive);
  const currentArchitectures = useScreenStore(state => state.currentArchitectures);
  const mobileVisibility = useScreenStore(state => state.mobileVisibility);
  const sessionId = useScreenStore(state => state.sessionId);
  const lastInteractionTime = useScreenStore(state => state.lastInteractionTime);
  const iteration = useScreenStore(state => state.iteration);

  // Detect session start (when targetMobileId first becomes non-null)
  useEffect(() => {
    try {
      const prevMobileId = previousStateRef.current.targetMobileId;
      
      if (targetMobileId && !prevMobileId && !loggerRef.current.isActive()) {
        // Session starting - mobile connected for first time
        loggerRef.current.startSession(sessionId, targetMobileId);
      }
      
      previousStateRef.current.targetMobileId = targetMobileId;
    } catch (error) {
      // Silent failure - never affect main application
    }
  }, [targetMobileId, sessionId]);

  // Detect username entry
  useEffect(() => {
    try {
      const prevUserName = previousStateRef.current.userName;
      
      if (userName && userName !== prevUserName && loggerRef.current.isActive()) {
        loggerRef.current.logEvent(EVENT_TYPES.USERNAME_ENTERED, {
          userName
        });
      }
      
      previousStateRef.current.userName = userName;
    } catch (error) {
      // Silent failure
    }
  }, [userName]);

  // Detect accelerometer activation
  useEffect(() => {
    try {
      const prevAccelerometer = previousStateRef.current.isAccelerometerActive;
      
      if (isAccelerometerActive !== prevAccelerometer && loggerRef.current.isActive()) {
        loggerRef.current.logEvent(EVENT_TYPES.ACCELEROMETER_ACTIVATED, {
          isActive: isAccelerometerActive
        });
      }
      
      previousStateRef.current.isAccelerometerActive = isAccelerometerActive;
    } catch (error) {
      // Silent failure
    }
  }, [isAccelerometerActive]);

  // Detect intro state progression
  useEffect(() => {
    try {
      const prevIntroState = previousStateRef.current.introState;
      
      if (introState !== prevIntroState && loggerRef.current.isActive()) {
        loggerRef.current.logEvent(EVENT_TYPES.INTRO_PROGRESSION, {
          fromState: prevIntroState,
          toState: introState
        });
      }
      
      previousStateRef.current.introState = introState;
    } catch (error) {
      // Silent failure
    }
  }, [introState]);

  // Detect architecture interactions (scrolling/selection)
  useEffect(() => {
    try {
      const prevArchitectures = previousStateRef.current.currentArchitectures;
      
      if (currentArchitectures && currentArchitectures.length > 0 && loggerRef.current.isActive()) {
        const currentArch = currentArchitectures[0];
        const prevArch = prevArchitectures && prevArchitectures[0];
        
        if (!prevArch || currentArch.name !== prevArch.name) {
          // Architecture changed - user scrolled or tapped
          loggerRef.current.logEvent(EVENT_TYPES.ARCHITECTURE_INTERACTION, {
            architecture: currentArch.name,
            category: currentArch.category,
            year: currentArch.year,
            interactionType: INTERACTION_TYPES.SCROLL // Default to scroll since most interactions are scroll
          });
        }
      }
      
      previousStateRef.current.currentArchitectures = currentArchitectures;
    } catch (error) {
      // Silent failure
    }
  }, [currentArchitectures]);

  // Detect visibility changes (user leaving/returning)
  useEffect(() => {
    try {
      const prevVisibility = previousStateRef.current.mobileVisibility;
      
      if (mobileVisibility !== prevVisibility && loggerRef.current.isActive()) {
        if (mobileVisibility === false && prevVisibility === true) {
          // User left the interface - start of inactivity
          loggerRef.current.logEvent(EVENT_TYPES.USER_INACTIVITY_START, {
            lastInteractionTime
          });
        } else if (mobileVisibility === true && prevVisibility === false) {
          // User returned - log visibility change
          loggerRef.current.logEvent(EVENT_TYPES.VISIBILITY_CHANGE, {
            isVisible: true,
            returnCount: iteration
          });
        }
      }
      
      previousStateRef.current.mobileVisibility = mobileVisibility;
    } catch (error) {
      // Silent failure
    }
  }, [mobileVisibility, lastInteractionTime, iteration]);

  // Detect stage transitions (Frontend -> Backend, Backend -> Ending)
  useEffect(() => {
    try {
      const prevStage = previousStateRef.current.stage;
      
      if (stage !== prevStage && loggerRef.current.isActive()) {
        if (stage === 'Backend' && prevStage === 'Frontend') {
          // Frontend to Backend transition
          loggerRef.current.logEvent(EVENT_TYPES.TRANSITION_TO_BACKEND, {
            reason: 'inactivity_timeout',
            frontendDuration: Date.now() - loggerRef.current.sessionStartTime
          }, PHASE_TYPES.TRANSITION);
          
          // Log backend start
          loggerRef.current.logEvent(EVENT_TYPES.BACKEND_STARTED, {
            message: 'abstract_conversation_phase_started'
          }, PHASE_TYPES.BACKEND);
        }
      }
      
      previousStateRef.current.stage = stage;
    } catch (error) {
      // Silent failure
    }
  }, [stage]);

  // Detect ending start - CRITICAL: Download log BEFORE reset wipes everything
  useEffect(() => {
    try {
      const prevEnding = previousStateRef.current.isEnding;
      
      if (isEnding && !prevEnding && loggerRef.current.isActive()) {
        // Log the ending event
        loggerRef.current.logEvent(EVENT_TYPES.ENDING_STARTED, {
          totalSessionDuration: Date.now() - loggerRef.current.sessionStartTime
        }, PHASE_TYPES.ENDING);
        
        // IMMEDIATELY download the log before reset wipes everything
        loggerRef.current.endSession('ending_credits_started');
      }
      
      previousStateRef.current.isEnding = isEnding;
    } catch (error) {
      // Silent failure
    }
  }, [isEnding]);

  // Detect session end (when targetMobileId becomes null) - This might not fire due to reset
  useEffect(() => {
    try {
      const prevMobileId = previousStateRef.current.targetMobileId;
      
      if (!targetMobileId && prevMobileId && loggerRef.current.isActive()) {
        // Session ending - mobile disconnected (fallback, may not fire due to reset)
        loggerRef.current.endSession('mobile_disconnected');
      }
    } catch (error) {
      // Silent failure
    }
  }, [targetMobileId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (loggerRef.current && loggerRef.current.isActive()) {
          loggerRef.current.endSession('component_unmount');
        }
      } catch (error) {
        // Silent failure
      }
    };
  }, []);

  // Return logger instance for potential manual operations (read-only)
  return {
    logger: loggerRef.current,
    isLogging: loggerRef.current?.isActive() || false
  };
};

export default useUserLogger; 