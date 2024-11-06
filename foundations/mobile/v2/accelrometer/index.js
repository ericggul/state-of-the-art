import React, { useEffect, useState, useCallback } from "react";
import useSocketMobileOrientation from "@/utils/socket/orientation/useSocketMobile";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
// import useAccSpikeTracker from "@/utils/hooks/orientation/useAccSpikeTracker";
import { AccelerometerContainer, ActivateButton } from "./styles";

const AccelerometerHandler = ({ mobileId }) => {
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [showContainer, setShowContainer] = useState(true);

  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();

  const socket = useSocketMobileOrientation({
    mobileId,
    isAccelerometerActive,
  });

  // const { spike, spikeCount } = useAccSpikeTracker({
  //   accData: acceleration,
  //   socket,
  // });

  const activateAccelerometer = useCallback(async () => {
    if (supportsDeviceOrientation) {
      const granted = await requestAccess();
      if (granted) {
        setIsAccelerometerActive(true);
        setShowContainer(false);
      } else {
        alert("Permission denied for accelerometer access");
      }
    } else {
      setIsAccelerometerActive(true);
      setShowContainer(false);
    }
  }, [supportsDeviceOrientation, requestAccess]);

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
        console.error("Error emitting orientation update:", e);
      }
    }
  }, [orientation, acceleration, isAccelerometerActive, mobileId, socket]);

  return (
    <AccelerometerContainer $show={showContainer}>
      <ActivateButton
        onClick={activateAccelerometer}
        disabled={!supportsDeviceOrientation && permission}
      >
        Activate Accelerometer
      </ActivateButton>
    </AccelerometerContainer>
  );
};

export default AccelerometerHandler;
