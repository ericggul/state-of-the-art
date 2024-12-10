import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import useSocketMobileOrientation from "@/utils/socket/orientation/useSocketMobile";
import useAccSpikeTracker from "@/utils/hooks/orientation/useAccSpikeTracker";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

const INITIAL_SENSOR_STATE = { x: 0, y: 0, z: 0 };
const INITIAL_ORIENTATION_STATE = { alpha: 0, beta: 0, gamma: 0 };

const AccelerometerHandler = memo(function AccelerometerHandler({
  mobileId,
  isAccelerometerActive,
  handleError,
}) {
  const [orientation, setOrientation] = useState(INITIAL_ORIENTATION_STATE);
  const [acceleration, setAcceleration] = useState(INITIAL_SENSOR_STATE);
  const { permission, requestAccess } = useAccelerometer();
  const hasRequestedPermission = useRef(false);

  const socket = useSocketMobileOrientation({
    mobileId,
    isAccelerometerActive,
  });

  useAccSpikeTracker({
    accData: acceleration,
    socket,
  });

  const orientationDetector = useCallback((e) => {
    setOrientation({
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  }, []);

  const accelerationDetector = useCallback((e) => {
    setAcceleration({
      x: e.accelerationIncludingGravity.x,
      y: e.accelerationIncludingGravity.y,
      z: e.accelerationIncludingGravity.z,
    });
  }, []);

  // Handle permission errors
  useEffect(() => {
    if (!isAccelerometerActive || hasRequestedPermission.current) return;

    const handlePermissionError = async () => {
      try {
        hasRequestedPermission.current = true;

        // Check if we need to request permissions (iOS)
        if (typeof DeviceOrientationEvent?.requestPermission === "function") {
          const orientationPermission =
            await DeviceOrientationEvent.requestPermission();
          if (orientationPermission !== "granted") {
            console.warn("Orientation permission not granted");
            return;
          }
        }

        if (typeof DeviceMotionEvent?.requestPermission === "function") {
          const motionPermission = await DeviceMotionEvent.requestPermission();
          if (motionPermission !== "granted") {
            console.warn("Motion permission not granted");
            return;
          }
        }
      } catch (error) {
        handleError();
        console.error("Error requesting sensor permissions:", error);

        // Emit error to socket if needed
        if (socket.current) {
          socket.current.emit("mobile-sensor-error", {
            mobileId,
            error: "Permission denied for motion sensors",
          });
        }
      }
    };

    handlePermissionError();
  }, [isAccelerometerActive, mobileId, socket]);

  // Setup sensor listeners
  useEffect(() => {
    if (!isAccelerometerActive) return;

    try {
      window.addEventListener("deviceorientation", orientationDetector);
      window.addEventListener("devicemotion", accelerationDetector);

      return () => {
        window.removeEventListener("deviceorientation", orientationDetector);
        window.removeEventListener("devicemotion", accelerationDetector);
      };
    } catch (e) {
      console.error("Error setting up sensor listeners:", e);

      // Emit error to socket if needed
      if (socket.current) {
        socket.current.emit("mobile-sensor-error", {
          mobileId,
          error: "Failed to initialize motion sensors",
        });
      }
    }
  }, [orientationDetector, accelerationDetector, isAccelerometerActive]);

  // Emit sensor data
  useEffect(() => {
    if (!socket.current || !isAccelerometerActive) return;

    try {
      socket.current.emit("mobile-orientation-update", {
        mobileId,
        orientation,
        acceleration,
      });
    } catch (e) {
      console.error("Error emitting orientation update:", e);
    }
  }, [orientation, acceleration, mobileId, socket, isAccelerometerActive]);

  return null;
});

export default AccelerometerHandler;
