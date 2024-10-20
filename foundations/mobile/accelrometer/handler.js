import React, { useEffect, useState } from "react";
import useAccelerometerStore from "@/components/mobile/store/accelerometer";
import useSocketMobileOrientation from "@/utils/socket/orientation/useSocketMobile";
import useMobileStore from "@/components/mobile/store"; // Import the mobile store

const AccelerometerHandler = () => {
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const { isAccelerometerActive } = useAccelerometerStore();
  const { mobileId } = useMobileStore(); // Get the mobileId from the store

  const socket = useSocketMobileOrientation({
    mobileId,
    isAccelerometerActive,
  }); // Pass mobileId to the hook

  useEffect(() => {
    const orientationDetector = (e) => {
      setOrientation({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
      });
    };

    const accelerationDetector = (e) => {
      setAcceleration({
        x: e.accelerationIncludingGravity.x,
        y: e.accelerationIncludingGravity.y,
        z: e.accelerationIncludingGravity.z,
      });
    };

    if (isAccelerometerActive) {
      window.addEventListener("deviceorientation", orientationDetector);
      window.addEventListener("devicemotion", accelerationDetector);
    }

    return () => {
      window.removeEventListener("deviceorientation", orientationDetector);
      window.removeEventListener("devicemotion", accelerationDetector);
    };
  }, [isAccelerometerActive]);

  useEffect(() => {
    if (isAccelerometerActive && socket.current) {
      try {
        socket.current.emit("mobile-orientation-update", {
          mobileId,
          orientation,
          acceleration,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [orientation, acceleration, isAccelerometerActive, mobileId, socket]);

  return null; // This component doesn't render anything
};

export default AccelerometerHandler;
