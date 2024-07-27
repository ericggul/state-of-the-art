import { useState, useEffect, useRef } from "react";
import useSocket from "utils/socket/orientation/useSocketScreen";

export default function DeviceOrientationControls() {
  const socket = useSocket({ handleNewMobileOrientation });

  function handleNewMobileOrientation(data) {
    console.log("new mobile orientation", data);
  }

  return null;
}
