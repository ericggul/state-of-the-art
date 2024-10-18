"use client";

import MobileEl from "@/foundations/mobile/wrapper";
import useSocketMobile from "@/utils/socket/useSocketMobile";

export default function Mobile() {
  const socket = useSocketMobile({
    mobileId: "1",
    handleNewResponse,
  });

  function handleNewResponse(data) {
    console.log("new response", data);
  }

  return (
    <>
      <MobileEl />
    </>
  );
}
