"use client";

import * as S from "./styles";

import { useEffect, useRef } from "react";
import useSocket from "@/utils/hooks/socket/useSocketMobile";

export default function Mobile() {
  const socket = useSocket({ handleHelloWorld });

  function handleHelloWorld(data) {
    console.log(data);
  }

  useEffect(() => {}, []);

  function handleClick() {
    if (socket && socket.current) {
      socket.current.emit("hello-world", "Hello world from mobile");
    }
  }

  return <S.Container onClick={handleClick}>Testing Screen</S.Container>;
}
