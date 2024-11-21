import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const ScrollContainer = styled.div`
  ${WholeContainer};
  position: fixed;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #1e1e1e;
`;

export const Container = styled.div`
  ${FlexCenterStyle};
  flex-direction: column;
  font-family: "DM Sans", sans-serif;
  color: white;
  z-index: 200;
  padding: 20px;
  min-height: 100%;
`;

export const Header = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background: #1e1e1e;
  z-index: 10;
  padding: 10px 0;
`;

export const Content = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 60px; // Add bottom padding for mobile
`;

export const StateDisplay = styled.div`
  ${FlexCenterStyle};
  width: 100%;
  padding: 20px 0;
  margin: 20px 0;
  z-index: 500;
`;

export const Button = styled.button`
  width: 60px;
  height: 60px;
  border: 2px solid white;
  background: transparent;
  color: white;
  font-size: 24px;
  border-radius: 50%;
  ${FlexCenterStyle};
  margin: 0 20px;

  &:active {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const StateNumber = styled.div`
  font-size: 48px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
`;

export const Guide = styled.div`
  width: 100%;
  margin-top: 20px;
  padding: 20px;
`;

export const GuideItem = styled.div`
  padding: 12px 0;
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  font-size: 16px;
  transition: opacity 0.3s ease;

  ${(props) =>
    props.$active &&
    css`
      font-weight: bold;
      font-size: 18px;
    `}
`;
