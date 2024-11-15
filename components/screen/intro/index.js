import * as S from "./styles";
import { memo, useEffect, useState } from "react";

import useScreenStore from "@/components/screen/store";

export default function Intro() {
  const introState = useScreenStore((state) => state.introState);

  return (
    <>
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
    </>
  );
}

function Intro0() {
  const userName = useScreenStore((state) => state.userName);

  return <S.Container>INTRO 0 {userName}</S.Container>;
}

function Intro1() {
  return <S.Container>INTRO 1</S.Container>;
}
