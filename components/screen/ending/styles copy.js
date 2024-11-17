import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  font-family: "Times New Roman", Times, serif;
  font-size: 1.5vw;
  z-index: 1;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: -1;

    /* Initial fade in */
    transition: all 3s ease-in-out;
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);

    /* Initial fade in + Long transition to black */
    ${({ $isVisible }) =>
      $isVisible &&
      `
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      animation: darkenBackground 10s 3s forwards;
    `}
  }

  @keyframes darkenBackground {
    from {
      background: rgba(0, 0, 0, 0.5);
    }
    to {
      background: rgba(0, 0, 0, 1);
    }
  }

  // Content wrapper
  h1,
  p {
    color: white;
    transition: opacity 3s ease-in-out;
    margin-top: 3vw;
    opacity: ${({ $isVisible, $isFadingOut }) =>
      $isFadingOut ? 0 : $isVisible ? 1 : 0};
  }

  h1 {
    margin-top: 0;
  }
`;
