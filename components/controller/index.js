"use client";

import useSocketController from "@/utils/socket/useSocketController";
import useControllerStore from "./store";

import useControllerVisibility from "@/utils/hooks/useControllerVisibility";

import * as S from "./styles";

export default function Controller() {
  const {
    activeMobileId,
    isMobileVisible,
    currentArchitecture,
    handleNewMobileInit,
    handleNewMobileVisibility: handleNewMobileVisibilityStore,
    handleNewMobileArchitecture,
    stage,
    isReset,
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

  return (
    <S.Container>
      <S.Header>
        <S.Title>Controller Status</S.Title>
        <S.StatusItem>
          <S.StatusIndicator $active={activeMobileId !== null} />
          Mobile ID: {activeMobileId || "No mobile connected"}
        </S.StatusItem>
        <S.StatusItem>
          <S.StatusIndicator $active={isMobileVisible} />
          Mobile Status: {isMobileVisible ? "Active" : "Inactive"}
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
