import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

const relVw = (px) => `${(px / 1920) * 100}vw`;

const MARGIN_TOP = 35;
const MARGIN_BOTTOM = 10;
const MARGIN_LEFT = 63;
const MARGIN_LOWER_BOTTOM = 50;

export const UIWrapper = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

    pointer-events: none !important;
  font-family: var(--cardo);
`;

export const TopLeft = styled.div`
  position: absolute;
  top: ${relVw(MARGIN_TOP)};
  left: ${relVw(MARGIN_LEFT)};
  font-style: italic;
  font-size: ${relVw(25)};
`;

export const BottomLeft = styled.div`
  position: absolute;
  bottom: ${relVw(MARGIN_BOTTOM)};
  left: ${relVw(MARGIN_LEFT)};
  ${FlexCenterStyle}
  flex-direction: row;
  font-style: italic;
`;

export const Title = styled.div`
  font-size: ${relVw(100)};
  margin-right: ${relVw(40)};
`;

export const TitleRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  position: relative;
  height: ${relVw(95)};
`;

export const TRTop = styled.div`
  font-size: ${relVw(25)};
  position: absolute;
  top: 0;
  min-width: ${relVw(600)};
`;
export const TRBottom = styled.div`
  font-size: ${relVw(50)};
  position: absolute;
  bottom: 0;
`;

export const BottomRight = styled.div`
  position: absolute;
  bottom: ${relVw(MARGIN_LOWER_BOTTOM)};
  right: ${relVw(60)};
  width: ${relVw(300)};
  font-size: ${relVw(20)};
  line-height: 1;
  p,
  span {
    font-size: ${relVw(15)};
  }

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  text-align: right;
`;

export const Row = styled.div`
  margin-bottom: ${relVw(10)};
`;

export const TopReverse = styled.div`
  ${FlexCenterStyle}
  ${WholeContainer}
  z-index: 1;
  background: linear-gradient(black, pink);
  mix-blend-mode: difference;
  -webkit-mix-blend-mode: difference;

  pointer-events: none;
`;
