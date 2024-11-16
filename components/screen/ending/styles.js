import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;

  font-family: "Times New Roman", Times, serif;

  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);

  -webkit-backdrop-filter: blur(5px);
  font-size: 1.5vw;

  opacity: 0;
  transition: opacity 1s ease-in-out;

  ${({ $isVisible, $isFadingOut }) => `
    opacity: ${$isVisible && !$isFadingOut ? 1 : 0};
  `}

  p {
    margin-top: 3vw;
  }
`;
