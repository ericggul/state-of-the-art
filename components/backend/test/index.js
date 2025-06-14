"use client";

import React, { useState, useEffect } from "react";
import * as S from "./styles";
import Link from "next/link";
import useAudio from "@/components/backend/utils/useAudio";
import useConversation from "@/components/backend/utils/useConversation";
import useStore from "@/components/backend/store";
import Backend0 from "@/foundations/backend/0";
import Backend1 from "@/foundations/backend/1";
import Backend2 from "@/foundations/backend/2";
import Backend3 from "@/foundations/backend/3";
import Backend4 from "@/foundations/backend/4";

import IframeComponent from "@/components/backend/iframe";

const backends = {
  0: Backend0,
  1: Backend1,
  2: Backend2,
  3: Backend3,
  4: Backend4,
  5: Backend4,
  6: Backend4,
};

export default function TestBackend() {
  const { isblack, level, setLevel, subLevel, setLoop } = useStore();
  const [timeUnit, setTimeUnit] = useState(1);
  const [followLevel, setFollowLevel] = useState(true);
  const [fixedLevel, setFixedLevel] = useState(level);

  useConversation({ socket: null });
  useAudio();

  // Update fixedLevel when followLevel is turned on
  useEffect(() => {
    if (followLevel) {
      setFixedLevel(level);
    }
  }, [followLevel, level]);

  // Use either the store level or fixed level based on followLevel setting
  const currentLevel = followLevel ? level : fixedLevel;
  // Clamp the level to maximum of 6
  const clampedLevel = currentLevel >= 6 ? 6 : currentLevel;
  const BackendComponent = backends[clampedLevel];

  return (
    <S.TestContainer>
      {/* <IframeComponent /> */}
      <S.Controls>
        <S.ControlGroup>
          <S.Label>Level Control:</S.Label>
          <S.Button
            onClick={() => setFollowLevel(!followLevel)}
            $active={followLevel}
          >
            {followLevel ? "Following Level" : "Fixed Level"}
          </S.Button>
        </S.ControlGroup>

        <S.ControlGroup>
          <S.Label>Current Level:</S.Label>
          <S.LevelDisplay>
            Level {currentLevel >= 6 ? "6+" : currentLevel}
            <S.SubLevel>(SubLevel {subLevel})</S.SubLevel>
          </S.LevelDisplay>
        </S.ControlGroup>

        <S.ControlGroup>
          <S.Label>Select Backend:</S.Label>
          {Object.keys(backends).map((id) => (
            <S.Button
              key={id}
              onClick={() => {
                const numId = Number(id);
                if (followLevel) {
                  setLevel(numId);
                } else {
                  setLoop(numId * 3);
                  setFixedLevel(numId);
                }
              }}
              $active={
                Number(id) === 6
                  ? currentLevel >= 6
                  : currentLevel === Number(id)
              }
              $disabled={followLevel}
            >
              Backend {id === "6" ? "6+" : id}
            </S.Button>
          ))}
        </S.ControlGroup>

        <S.ControlGroup>
          <S.Label>Time Unit:</S.Label>
          <S.Input
            type="number"
            value={timeUnit}
            onChange={(e) => setTimeUnit(Number(e.target.value))}
            min={0.1}
            max={10}
            step={0.1}
          />
        </S.ControlGroup>
      </S.Controls>

      <S.Viewport>
        <BackendComponent
          range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
          visible={true}
          timeUnit={timeUnit}
        />
      </S.Viewport>
    </S.TestContainer>
  );
}
