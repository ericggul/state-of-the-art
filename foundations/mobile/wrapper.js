"use client";

import React from "react";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import ChatUI from "./index";
import AccelerometerHandler from "./accelrometer/handler";
import useChatStore from "@/components/controller/store";

const AccelerometerWrapper = () => {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();
  const { setIsAccelerometerActive, grantAccelerometerAccess } = useChatStore();

  const handleGrantAccess = async () => {
    const granted = await requestAccess();
    setIsAccelerometerActive(granted);
    await grantAccelerometerAccess(granted);
  };

  return (
    <>
      <ChatUI
        supportsDeviceOrientation={supportsDeviceOrientation}
        accelerometerGranted={permission}
        handleGrantAccess={handleGrantAccess}
      />
      <AccelerometerHandler />
    </>
  );
};

export default AccelerometerWrapper;
