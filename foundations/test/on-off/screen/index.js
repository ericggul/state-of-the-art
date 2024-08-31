import * as S from "./styles";

import useSocket from "@/utils/socket/on-off/useSocketScreen";

export default function El() {
  const socket = useSocket({
    handleNewMobileConnect,
    handleNewMobileDisconnect,
  });

  function handleNewMobileConnect(data) {
    console.log("new mobile connected", data);
  }

  function handleNewMobileDisconnect(data) {
    console.log("new mobile disconnected", data);
  }

  return <S.Container></S.Container>;
}
