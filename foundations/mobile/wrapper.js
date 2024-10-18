import React from "react";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import ChatUI from "./index";
import AccelerometerHandler from "./accelrometer/handler";
import useMobileStore from "@/components/mobile/store";
import useAccelerometerStore from "@/components/mobile/store/accelerometer";

const AccelerometerWrapper = ({ socket }) => {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();
  const { sendMessage } = useMobileStore();
  const { setIsAccelerometerActive, grantAccelerometerAccess } =
    useAccelerometerStore();

  const handleGrantAccess = async () => {
    const granted = await requestAccess();
    setIsAccelerometerActive(granted);
    await grantAccelerometerAccess(granted, (message) => {
      sendMessage(message, socket);
    });
  };

  return (
    <>
      <ChatUI
        supportsDeviceOrientation={supportsDeviceOrientation}
        accelerometerGranted={permission}
        handleGrantAccess={handleGrantAccess}
        socket={socket}
      />
      <AccelerometerHandler />
    </>
  );
};

export default AccelerometerWrapper;
