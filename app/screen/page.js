"use client";

import { useEffect, useRef } from "react";
import useSocket from "@/utils/hooks/socket/useSocketScreen";

export default function Screen() {
  const socket = useSocket({ handleHelloWorld });

  function handleHelloWorld(data) {
    console.log(data);
  }

  useEffect(() => {}, []);

  function handleClick() {
    if (socket && socket.current) {
      socket.current.emit("hello-world", "Hello world from screen");
    }
  }

  return <div onClick={handleClick}>HELLO</div>;
}
