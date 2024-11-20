import React, { useState } from "react";
import * as S from "./styles";

export default function RedirectButton({ socket }) {
  function handleRedirect() {
    socket.current.emit("omega-new-presentation-command", {
      type: "redirect-to-sota",
    });
  }

  return (
    <>
      <S.RedirectButton onClick={handleRedirect}>Start Chaos</S.RedirectButton>
    </>
  );
}
