import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

const relVw = (px) => `${(px / 1920) * 100}vw`;

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background: #000;
  color: white;
  font-family: var(--fira-code);

  canvas {
    width: 100%;
    height: 100%;
  }
`;

const MARGIN_TOP = 45;
const MARGIN_LEFT = 63;

export const UIWrapper = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

export const TopLeft = styled.div`
  position: absolute;
  top: ${relVw(MARGIN_TOP)};
  left: ${relVw(MARGIN_LEFT)};
  font-style: italic;
  font-size: ${relVw(50)};
`;

export const BottomLeft = styled.div`
  position: absolute;
  bottom: ${relVw(MARGIN_TOP)};
  left: ${relVw(MARGIN_LEFT)};
  ${FlexCenterStyle}
  flex-direction: row;
  font-style: italic;
`;

export const Title = styled.h1`
  font-size: ${relVw(200)};
`;

export const TitleRight = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
`;

export const TRTop = styled.h2`
  font-size: ${relVw(60)};
`;
export const TRBottom = styled.h2`
  font-size: ${relVw(80)};
`;

export const BottomRight = styled.div`
  position: absolute;
  bottom: ${relVw(MARGIN_TOP)};
  right: ${relVw(MARGIN_LEFT)};
  font-size: ${relVw(40)};
  p {
    font-size: ${relVw(30)};
  }

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Row = styled.div`
  text-align: left;
`;

{
  /* <>
<S.TopLeft>Neural Network Architcture</S.TopLeft>
<S.BottomLeft>
  <S.Title>VAE</S.Title>
  <S.TitleRight>
    {data.name.fullName && <S.TRTop>{data.name.fullName}</S.TRTop>}
    <S.TRBottom>{`v${data.version}`}</S.TRBottom>
  </S.TitleRight>
</S.BottomLeft>
<S.BottomRight>
  <S.Row>{data.year}</S.Row>
  <S.Row>{data.createdFrom}</S.Row>
  <S.Row>
    {data.citation} <p>Citation</p>
  </S.Row>
  <S.Row>
    <p>{data.description}</p>
  </S.Row>
</S.BottomRight>
</> */
}
