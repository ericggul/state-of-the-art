import { useState, useEffect } from "react";

export default function useAccelerometer() {
  const [permission, setPermission] = useState(false);
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [supportsDeviceOrientation, setSupportsDeviceOrientation] =
    useState(false);

  useEffect(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      setSupportsDeviceOrientation(true);
    } else {
      setSupportsDeviceOrientation(false);
      setPermission(true); // Auto-grant for non-iOS devices
    }
  }, []);

  function orientationDetector(e) {
    setOrientation({
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  }

  useEffect(() => {
    if (permission) {
      window.addEventListener("deviceorientation", orientationDetector);
      return () => {
        window.removeEventListener("deviceorientation", orientationDetector);
      };
    }
  }, [permission]);

  const requestAccess = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const permissionState =
          await DeviceOrientationEvent.requestPermission();
        setPermission(permissionState === "granted");
        return permissionState === "granted";
      } catch (error) {
        console.error("Error requesting device orientation permission:", error);
        return false;
      }
    } else {
      setPermission(true);
      return true;
    }
  };

  return { supportsDeviceOrientation, permission, orientation, requestAccess };
}
