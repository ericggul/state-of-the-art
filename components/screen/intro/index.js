import * as S from "./styles";
import { memo } from "react";
import useScreenStore from "@/components/screen/store";
import useMembraneSynth from "@/utils/hooks/audio/useMembraneSynth";

const Intro0 = memo(function Intro0() {
  const userName = useScreenStore((state) => state.userName);
  useMembraneSynth(userName);

  return <S.Container>INTRO 0 {userName}</S.Container>;
});

const Intro1 = memo(function Intro1() {
  return <S.Container>INTRO 1</S.Container>;
});

const Intro2 = memo(function Intro2() {
  return <S.Container>Scroll down on your phone</S.Container>;
});

function Intro() {
  const introState = useScreenStore((state) => state.introState);
  console.log(introState);

  return (
    <>
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
    </>
  );
}

export default memo(Intro);
