import React, { useState } from "react";
import * as S from "./styles";

import ControllerButton from "./button";
import Voice from "./voice";
import ArchitectureSelector from "./components/ArchitectureSelector";

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
      socket.current.emit("gartience-new-state", state + increment);
    }
  };

  return (
    <S.ScrollContainer>
      <S.Container>
        <S.Header>
          <S.StateDisplay>
            <S.Button onClick={() => handleStateChange(-1)}>-</S.Button>
            <S.StateNumber>{state}</S.StateNumber>
            <S.Button onClick={() => handleStateChange(1)}>+</S.Button>
          </S.StateDisplay>
        </S.Header>

        <S.Content>
          {state === 1 && <ArchitectureSelector socket={socket} />}
          {state === 2 && <ControllerButton socket={socket} />}
          <Voice socket={socket} />
          <S.Guide>
            {ITEMS.map((item, index) => (
              <S.GuideItem key={index} $active={state === index}>
                {item}
              </S.GuideItem>
            ))}
          </S.Guide>
        </S.Content>
      </S.Container>
    </S.ScrollContainer>
  );
}
