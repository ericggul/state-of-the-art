import React, { useState } from "react";
import * as S from "./styles";

export default function RedirectButton({ socket }) {
  function handleRedirect() {
    if (socket.current) {
      socket.current.emit("gartience-new-chaos", { chaos: true });
    }
  }

  return (
    <>
      <S.RedirectButton onClick={handleRedirect}>Start Chaos</S.RedirectButton>
    </>
  );
}
