import * as S from "./styles";
import { memo } from "react";
import useScreenStore from "@/components/screen/store";
import { useAudio } from "@/utils/hooks/audio/useAudio";

const Intro0 = memo(function Intro0() {
  const userName = useScreenStore((state) => state.userName);
  return <S.Container>Welcome {userName}</S.Container>;
});

const Intro1 = memo(function Intro1() {
  return <S.Container>Please activate your accelerometer</S.Container>;
});

const Intro2 = memo(function Intro2() {
  return <S.Container>Scroll down on your phone</S.Container>;
});

const TurnPhone = memo(function TurnPhone() {
  return <S.Container>Please turn your phone back on</S.Container>;
});

function Intro() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);

  const isPlaying = introState < 2;
  const { audioRef, SOUND_URL } = useAudio({ isPlaying, isProjector });

  return (
    <S.Wrapper
      style={{
        opacity: introState >= 3 ? 0 : 1,
        background: introState >= 2 ? "transparent" : "black",
      }}
    >
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
      {!mobileVisibility && introState <= 2 && <TurnPhone />}
      {isProjector && (
        <audio ref={audioRef} src={SOUND_URL} autoPlay={false} loop />
      )}
    </S.Wrapper>
  );
}

export default memo(Intro);
