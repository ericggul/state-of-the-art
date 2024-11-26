import { useState, useEffect } from "react";

export default function useAccelerometer() {
  const [permission, setPermission] = useState(false);
  const [supportsDeviceOrientation, setSupportsDeviceOrientation] =
    useState(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    const hasSupport =
      typeof DeviceMotionEvent !== "undefined" ||
      typeof DeviceOrientationEvent !== "undefined";

    setSupportsDeviceOrientation(hasSupport);

    // Auto-grant for non-iOS devices
    if (hasSupport && !isIOS) {
      setPermission(true);
    }
  }, []);

  const requestAccess = async () => {
    // For non-iOS devices, check if motion sensors are actually supported
    if (!isIOS) {
      const hasMotionSupport =
        (typeof DeviceMotionEvent !== "undefined" &&
          window.DeviceMotionEvent) ||
        (typeof DeviceOrientationEvent !== "undefined" &&
          window.DeviceOrientationEvent);

      if (!hasMotionSupport) {
        const message =
          "Your device doesn't support motion sensors.\n" +
          "You can continue, but the experience will be limited.";
        alert(message);
        setPermission(false);
        return { granted: false, fallback: true };
      }

      // Motion is supported on Android, grant full access
      setPermission(true);
      return { granted: true, fallback: false };
    }

    // iOS-specific permission handling
    try {
      if (typeof DeviceMotionEvent?.requestPermission === "function") {
        const motionState = await DeviceMotionEvent.requestPermission();
        if (motionState !== "granted") {
          throw new Error("motion_denied");
        }
      }

      if (typeof DeviceOrientationEvent?.requestPermission === "function") {
        const orientationState =
          await DeviceOrientationEvent.requestPermission();
        if (orientationState !== "granted") {
          throw new Error("orientation_denied");
        }
      }

      setPermission(true);
      return { granted: true, fallback: false };
    } catch (error) {
      const instructions =
        "To enable motion sensors on iOS:\n" +
        "1. Open the Settings app\n" +
        "2. Scroll down and tap Safari\n" +
        "3. Scroll down to 'Motion & Orientation Access'\n" +
        "4. Toggle it ON\n" +
        "5. Open Safari, tap the 'AA' icon in the address bar\n" +
        "6. Select 'Website Settings' and ensure 'Motion & Orientation Access' is allowed\n" +
        "7. Return to this page and try again";
      throw new Error(`Permission denied. ${instructions}`);
    }
  };

  return { supportsDeviceOrientation, permission, requestAccess };
}
