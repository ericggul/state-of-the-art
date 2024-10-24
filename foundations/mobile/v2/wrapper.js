import React from "react";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import AccelerometerHandler from "./accelrometer/handler";

const AccelerometerWrapper = ({ socket }) => {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();

  return (
    <>
      <AccelerometerHandler />
    </>
  );
};

export default AccelerometerWrapper;
