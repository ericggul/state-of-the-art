import React, { useState } from "react";
import * as S from "./styles";

import ControllerButton from "./controller-button";

import useSocketController from "@/utils/socket/gartience/useSocketController";

const ITEMS = [
  "0. Voice Input",
  "1. Display QR + Voice Input",
  "2. Display QR + Model. Ready to start Chaos",
];

export default function Controller() {
  const socket = useSocketController();

  const [state, setState] = useState(0);

  const handleStateChange = (increment) => {
    setState((st) => Math.min(Math.max(st + increment, 0), 2));
    if (socket.current) {
      socket.current.emit("omega-new-presentation-command", {
        type: "state-adjust",
        state: state + increment,
      });
    }
  };

  return (
    <S.Container>
      <S.StateDisplay>
        <S.Button onClick={() => handleStateChange(-1)}>-</S.Button>
        <S.StateNumber>{state}</S.StateNumber>
        <S.Button onClick={() => handleStateChange(1)}>+</S.Button>
      </S.StateDisplay>
      {state === 2 && <ControllerButton socket={socket} />}

      <S.Guide>
        {ITEMS.map((item, index) => (
          <S.GuideItem key={index} $active={state === index}>
            {item}
          </S.GuideItem>
        ))}
      </S.Guide>
    </S.Container>
  );
}
