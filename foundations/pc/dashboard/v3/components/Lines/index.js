import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useState, useEffect, useRef } from "react";

const KEY_HUE = 200;

export default function Frame() {
  return (
    <S.Container>
      <S.DiagonalLine />
      <S.HorizontalLine />
      <S.HorizontalLine2 />
    </S.Container>
  );
}
