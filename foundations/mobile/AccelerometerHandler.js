import React, { useEffect, useState } from "react";
import useChatStore from "@/components/controller/store";

const AccelerometerHandler = () => {
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const { isAccelerometerActive } = useChatStore();

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
    if (isAccelerometerActive) {
      console.log("Device Orientation:", orientation);
      // Here you can implement any logic that needs to use the orientation data
      // without affecting the ChatUI component
    }
  }, [orientation, isAccelerometerActive]);

  return null; // This component doesn't render anything
};

export default AccelerometerHandler;
