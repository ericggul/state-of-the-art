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

const backends = {
  0: Backend0,
  1: Backend1,
  2: Backend2,
  3: Backend3,
  4: Backend4,
};

export default function TestBackend() {
  const { isblack, level, setLevel, subLevel } = useStore();
  const [timeUnit, setTimeUnit] = useState(1);
  const [followLevel, setFollowLevel] = useState(true);
  const [fixedLevel, setFixedLevel] = useState(level);

  useConversation();
  useAudio();

  // Update fixedLevel when followLevel is turned on
  useEffect(() => {
    if (followLevel) {
      setFixedLevel(level);
    }
  }, [followLevel, level]);

  // Use either the store level or fixed level based on followLevel setting
  const currentLevel = followLevel ? level : fixedLevel;
  const BackendComponent =
    currentLevel >= 4 ? Backend4 : backends[currentLevel];

  return (
    <S.TestContainer>
      <S.Controls>
        <S.ControlGroup>
          <S.Title>Backend Test Environment</S.Title>
          <Link href="/">
            <S.BackButton>← Back to Main</S.BackButton>
          </Link>
        </S.ControlGroup>

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
            Level {currentLevel >= 4 ? "4+" : currentLevel}
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
                  setFixedLevel(numId);
                }
              }}
              $active={
                currentLevel >= 4
                  ? Number(id) >= 4
                  : currentLevel === Number(id)
              }
              $disabled={followLevel}
            >
              Backend {id >= 4 ? "4+" : id}
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

      <S.Viewport style={{ background: isblack ? "black" : "white" }}>
        <BackendComponent
          range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
          visible={true}
          timeUnit={timeUnit}
        />
      </S.Viewport>
    </S.TestContainer>
  );
}
