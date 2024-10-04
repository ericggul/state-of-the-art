import * as S from "./styles";
import { QRCodeSVG } from "qrcode.react";
import useResize from "@/utils/hooks/useResize";

const URL = "https://ddp-ai-ccbec1406e0e.herokuapp.com/mobile?v=0";

export default function Intro({ layerIdx }) {
  const [windowWidth, _] = useResize();

  return (
    <S.Container>
      <QRCodeSVG value={URL} size={windowWidth * 0.15} bgColor="transparent" fgColor="white" />
    </S.Container>
  );
}
