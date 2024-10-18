import React from "react";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import ChatUI from "./index";
import AccelerometerHandler from "./accelrometer/handler";
import useChatStore from "@/components/controller/store";
import useAccelerometerStore from "@/components/mobile/store/accelerometer";

const AccelerometerWrapper = () => {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();
  const { sendMessage } = useChatStore();
  const { setIsAccelerometerActive, grantAccelerometerAccess } =
    useAccelerometerStore();

  const handleGrantAccess = async () => {
    const granted = await requestAccess();
    setIsAccelerometerActive(granted);
    await grantAccelerometerAccess(granted, sendMessage);
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
