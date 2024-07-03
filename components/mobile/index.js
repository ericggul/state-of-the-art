"use client";

import * as S from "./styles";

import { useEffect, useRef } from "react";
import useSocket from "@/utils/hooks/socket/useSocketMobile";

//uuid v4
import { v4 as uuidv4 } from "uuid";

export default function Mobile() {
  const mobileId = useRef(uuidv4());

  const socket = useSocket({
    mobileId: mobileId.current,
  });

  return <S.Container>Testing Screen</S.Container>;
}
