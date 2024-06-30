import { useState, useEffect } from "react";

export default function useDeviceOrientationSupported({ requestPermission }) {
  const [supportsDeviceOrientation, setSupportsDeviceOrientation] = useState(false);

  useEffect(() => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      setSupportsDeviceOrientation(true);
    } else {
      setSupportsDeviceOrientation(false);
    }
  }, []);

  const [permission, setPermission] = useState(false);

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

  return { supports: supportsDeviceOrientation, permission };
}
