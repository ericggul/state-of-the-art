import { useState, useEffect } from "react";

export default function useDeviceOrientation({ requestPermission }) {
  const [permission, setPermission] = useState(false);
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  function orientationDetector(e) {
    e.preventDefault();
    setOrientation({
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  }

  useEffect(() => {
    if (requestPermission) {
      permissionGrant();
    }
  }, [requestPermission]);

  function permissionGrant() {
    try {
      if (typeof DeviceOrientationEvent.requestPermission !== "function") {
        setPermission(true);
        return;
      }
      DeviceOrientationEvent.requestPermission()
        .then((res) => {
          if (res === "granted") {
            setPermission(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (permission) {
      window.addEventListener("deviceorientation", orientationDetector);
      return () => {
        window.removeEventListener("deviceorientation", orientationDetector);
      };
    }
  }, [permission]);

  return { permission, orientation };
}
