"use client";

import { useEffect } from "react";
import MobileEl from "@/foundations/mobile/v2/wrapper";
import useSocketMobile from "@/utils/socket/useSocketMobile";

import { v4 as uuidv4 } from "uuid";

export default function Mobile() {
  const mobileId = uuidv4();

  const socket = useSocketMobile({
    mobileId,
    handleNewResponse,
  });

  function handleNewResponse(data) {
    console.log("New response from controller:", data);
  }

  return (
    <>
      <MobileEl socket={socket} />
    </>
  );
}
