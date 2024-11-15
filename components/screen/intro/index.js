import * as S from "./styles";
import { memo } from "react";
import useScreenStore from "@/components/screen/store";
import useMembraneSynth from "@/utils/hooks/audio/useMembraneSynth";

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
  useMembraneSynth(userName);

  return <S.Container>INTRO 0 {userName}</S.Container>;
}

function Intro1() {
  return <S.Container>INTRO 1</S.Container>;
}
