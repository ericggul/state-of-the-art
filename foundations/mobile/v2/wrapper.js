import React from "react";

import AccelerometerHandler from "./accelrometer";

import UI from "./index";

const AccelerometerWrapper = ({ socket, mobileId }) => {
  return (
    <>
      <UI socket={socket} />
      <AccelerometerHandler mobileId={mobileId} />
    </>
  );
};

export default AccelerometerWrapper;
