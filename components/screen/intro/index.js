import * as S from "./styles";
import { memo, useState, useEffect } from "react";
import useScreenStore from "@/components/screen/store";
import { useAudio } from "@/utils/hooks/audio/useAudio";

const SOUND_URL = "/audio/intro/intro1208.wav";

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

const Intro4 = memo(function Intro4() {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <S.Container
      style={{
        background: `rgba(0, 0, 0, .5)`,
        backdropFilter: `blur(5px)`,
        WebkitBackdropFilter: `blur(5px)`,
      }}
    >
      <p>Scroll down on your phone to continue</p>
      <p>Experience resets in {countdown} seconds</p>
    </S.Container>
  );
});

const TurnPhone = memo(function TurnPhone() {
  return <S.Container>Please turn your phone back on</S.Container>;
});

function Intro() {
  const introState = useScreenStore((state) => state.introState);
  const isProjector = useScreenStore((state) => state.isProjector);
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);

  const isPlaying = introState < 2;
  const { audioRef } = useAudio({ isPlaying, isProjector });

  return (
    <S.Wrapper
      style={{
        opacity: introState === 3 ? 0 : 1,
        background: introState >= 2 ? "transparent" : "black",
      }}
    >
      {introState === 0 && <Intro0 />}
      {introState === 1 && <Intro1 />}
      {introState === 2 && <Intro2 />}
      {introState === 4 && <Intro4 />}
      {!mobileVisibility && introState <= 2 && <TurnPhone />}
      {isProjector && (
        <audio ref={audioRef} src={SOUND_URL} autoPlay={false} loop />
      )}
    </S.Wrapper>
  );
}

export default memo(Intro);
