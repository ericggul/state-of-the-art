import React from "react";

import AccelerometerHandler from "./accelrometer";

import UI from "./index";

const AccelerometerWrapper = ({ socket, mobileId }) => {
  return (
    <>
      <UI socket={socket} mobileId={mobileId} />
      <AccelerometerHandler mobileId={mobileId} />
    </>
  );
};

export default AccelerometerWrapper;
