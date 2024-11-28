import React, { useEffect, useState, useCallback } from "react";
import useSocketMobileOrientation from "@/utils/socket/orientation/useSocketMobile";
import useAccSpikeTracker from "@/utils/hooks/orientation/useAccSpikeTracker";

const INITIAL_SENSOR_STATE = { x: 0, y: 0, z: 0 };
const INITIAL_ORIENTATION_STATE = { alpha: 0, beta: 0, gamma: 0 };

const AccelerometerHandler = ({ mobileId, isAccelerometerActive }) => {
  const [orientation, setOrientation] = useState(INITIAL_ORIENTATION_STATE);
  const [acceleration, setAcceleration] = useState(INITIAL_SENSOR_STATE);

  const socket = useSocketMobileOrientation({
    mobileId,
    isAccelerometerActive,
  });

  // Add spike tracking
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

  // Setup sensor listeners
  useEffect(() => {
    try {
      console.log("24 useEffect");
      window.addEventListener("deviceorientation", orientationDetector);
      window.addEventListener("devicemotion", accelerationDetector);

      return () => {
        window.removeEventListener("deviceorientation", orientationDetector);
        window.removeEventListener("devicemotion", accelerationDetector);
      };
    } catch (e) {
      console.log(e);
    }
  }, [orientationDetector, accelerationDetector]);

  // Emit sensor data
  useEffect(() => {
    if (!socket.current) return;

    try {
      socket.current.emit("mobile-orientation-update", {
        mobileId,
        orientation,
        acceleration,
      });
    } catch (e) {
      console.error("Error emitting orientation update:", e);
    }
  }, [orientation, acceleration, mobileId, socket]);

  return null;
};

export default AccelerometerHandler;
