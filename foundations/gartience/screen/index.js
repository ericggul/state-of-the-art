import React, { Suspense } from "react";
import * as S from "./styles";
import useSocketScreen from "@/utils/socket/gartience/useSocketScreen";
import useScreenStore from "./store";
import { QRCodeSVG } from "qrcode.react";
import useResize from "@/utils/hooks/useResize";
import Chaos from "./chaos";
import Speech from "./Speech";

export default React.memo(function Screen() {
  const {
    state,
    chaos,
    speech,
    setState,
    setChaos,
    setArchitectures,
    setSpeech,
  } = useScreenStore();

  const socket = useSocketScreen({
    handleNewState: setState,
    handleNewChaos: () => setChaos(true),
    handleNewArchitectures: setArchitectures,
    handleNewSpeech: setSpeech,
  });

  return (
    <Suspense fallback={<div />}>
      <S.Container>
        {state >= 1 && !chaos && <QR />}
        {speech && !chaos && <Speech text={speech?.text || ""} />}
        {chaos && <Chaos />}
      </S.Container>
    </Suspense>
  );
});

const URL = "https://sota-xdlab.net/gartience/mobile";

const QR = React.memo(function QR() {
  const [windowWidth, _] = useResize();
  return (
    <S.QRContainer>
      <QRCodeSVG
        value={URL}
        size={windowWidth * 0.11}
        bgColor="transparent"
        fgColor="white"
      />
    </S.QRContainer>
  );
});
