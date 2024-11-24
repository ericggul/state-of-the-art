"use client";

import useSocketController from "@/utils/socket/useSocketController";
import useControllerStore from "./store";

import useControllerVisibility from "@/utils/hooks/useControllerVisibility";

import * as S from "./styles";

import { useEffect } from "react";

export default function Controller() {
  const {
    activeMobileId,
    mobileVisibility,
    currentArchitecture,
    handleNewMobileInit,
    handleNewMobileVisibility: handleNewMobileVisibilityStore,
    handleNewMobileArchitecture,
    stage,
    isReset,
    reset,
  } = useControllerStore();

  const socket = useSocketController({
    handleNewMobileInit,
    handleNewMobileVisibility: (data) => {
      handleNewMobileVisibilityStore(data);
      handleNewMobileVisibilitySocket(data);
    },
    handleNewMobileArchitecture,
  });

  async function handleNewMobileVisibilitySocket(data) {
    try {
      if (socket.current) {
        await socket.current.emit("controller-new-visibility-change", {
          ...data,
          origin: "controller-" + (data.origin || ""),
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  useControllerVisibility();

  useEffect(() => {
    if (isReset) {
      const timeout = setTimeout(() => {
        reset();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isReset]);

  return (
    <S.Container>
      <S.Header>
        <S.Title>Controller Status</S.Title>
        <S.StatusItem>
          <S.StatusIndicator $active={activeMobileId !== null} />
          Mobile ID: {activeMobileId || "No mobile connected"}
        </S.StatusItem>
        <S.StatusItem>
          <S.StatusIndicator $active={mobileVisibility} />
          Mobile Status: {mobileVisibility ? "Active" : "Inactive"}
        </S.StatusItem>
        <S.StatusItem>
          <S.StatusIndicator $active={stage === "Frontend"} />
          Stage: {stage}
        </S.StatusItem>
        <S.StatusItem>
          <S.StatusIndicator $active={!isReset} />
          Reset Status: {isReset ? "Reset" : "Active"}
        </S.StatusItem>
      </S.Header>

      <S.Content>
        <S.Title>Current Architecture</S.Title>
        <S.StatusItem>
          {currentArchitecture?.name || "None selected"}
        </S.StatusItem>
      </S.Content>
    </S.Container>
  );
}
