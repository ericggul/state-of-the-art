import React from "react";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import AccelerometerHandler from "./accelrometer/handler";

import UI from "./index";

const AccelerometerWrapper = ({ socket }) => {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();

  return (
    <>
      <UI socket={socket} />
      <AccelerometerHandler />
    </>
  );
};

export default AccelerometerWrapper;
