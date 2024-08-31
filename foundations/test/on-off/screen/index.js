import * as S from "./styles";

import useSocket from "@/utils/socket/on-off/useSocketScreen";

export default function El() {
  const socket = useSocket({
    handleNewMobileConnect,
    handleNewMobileDisconnect,
    handleNewVisibilityChange,
  });

  function handleNewMobileConnect(data) {
    console.log("new mobile connected", data);
  }

  function handleNewMobileDisconnect(data) {
    console.log("new mobile disconnected", data);
  }

  function handleNewVisibilityChange(data) {
    console.log("new visibility change", data);
  }

  return <S.Container></S.Container>;
}
