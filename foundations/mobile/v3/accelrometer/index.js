import React, { useEffect, useState } from "react";
import useSocketMobileOrientation from "@/utils/socket/orientation/useSocketMobile";
// import useAccSpikeTracker from "@/utils/hooks/orientation/useAccSpikeTracker";

const AccelerometerHandler = ({
  mainSocket,
  mobileId,
  isAccelerometerActive,
}) => {
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });

  const orientationSocket = useSocketMobileOrientation({
    mobileId,
    isAccelerometerActive,
  });

  // const { spike, spikeCount } = useAccSpikeTracker({
  //   accData: acceleration,
  //   orientationSocket,
  // });

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
    if (isAccelerometerActive && orientationSocket.current) {
      try {
        orientationSocket.current.emit("mobile-orientation-update", {
          mobileId,
          orientation,
          acceleration,
        });
      } catch (e) {
        console.error("Error emitting orientation update:", e);
      }
    }
  }, [
    orientation,
    acceleration,
    isAccelerometerActive,
    mobileId,
    orientationSocket,
  ]);

  return null; // This is now a purely logical component
};

export default AccelerometerHandler;
