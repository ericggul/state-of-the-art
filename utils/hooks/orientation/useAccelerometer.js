import { useState, useEffect } from "react";

export default function useAccelerometer() {
  const [permission, setPermission] = useState(false);
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

  return { supportsDeviceOrientation, permission, requestAccess };
}
