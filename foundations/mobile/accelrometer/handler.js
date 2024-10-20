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

    if (isAccelerometerActive) {
      window.addEventListener("deviceorientation", orientationDetector);
    }

    return () => {
      window.removeEventListener("deviceorientation", orientationDetector);
    };
  }, [isAccelerometerActive]);

  useEffect(() => {
    if (isAccelerometerActive && socket.current) {
      console.log("Device Orientation:", orientation);
      try {
        // Send the orientation data to the server
        socket.current.emit("mobile-orientation-update", {
          mobileId,
          orientation,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [orientation, isAccelerometerActive, mobileId, socket]);

  return null; // This component doesn't render anything
};

export default AccelerometerHandler;
