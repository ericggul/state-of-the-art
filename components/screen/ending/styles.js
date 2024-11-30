import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  z-index: 1;

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    transition: all 3s ease-in-out;
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);

    ${({ $isVisible }) =>
      $isVisible &&
      `
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      animation: darkenBackground 13s 6s forwards;
    `}
  }

  @keyframes darkenBackground {
    to {
      background: rgba(0, 0, 0, 1);
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 80vw;
  padding: 0 2vw;
  opacity: ${({ $isVisible, $isFadingOut }) =>
    $isFadingOut ? 0 : $isVisible ? 1 : 0};
  transition: opacity 3s ease-in-out;
`;

export const Title = styled.h1`
  font-size: 3vw;
  font-weight: 300;
  margin: 0;
  color: white;
  animation: ${fadeUp} 1s ease-out forwards;
`;

export const Subtitle = styled.h2`
  font-size: 2vw;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 3vw;
  animation: ${fadeUp} 1s ease-out 0.2s forwards;
  opacity: 0;
`;

export const Section = styled.div`
  margin: 1.5vw 0;
  animation: ${fadeUp} 1s ease-out 0.4s forwards;
  opacity: 0;
`;

export const Text = styled.p`
  font-size: 1.2vw;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.4vw 0;
  font-weight: 300;
  line-height: 1.4;
`;

export const TechStack = styled(Text)`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1vw;
  margin-top: 0.8vw;
`;

export const Institution = styled(Text)`
  color: white;
  font-weight: 400;
  margin-bottom: 0.2vw;
  line-height: 1.6;
  font-size: 1.2vw;
`;

export const InstitutionDepartment = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  margin-bottom: 1vw;
  line-height: 1.6;
  font-size: 0.9vw;
`;

export const Credit = styled(Text)`
  font-size: 0.8vw;
  margin: 0.2vw 0;

  strong {
    font-weight: 500;
    color: white;
  }
`;

export const Spacer = styled.div`
  height: 0.8vw;
`;

export const Link = styled.a`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.8vw;
  margin: 1vw 0;
  transition: color 0.3s ease;
  animation: ${fadeUp} 1s ease-out 0.6s forwards;
  opacity: 0;

  &:hover {
    color: white;
  }
`;

export const EndText = styled.div`
  font-size: 1vw;
  color: white;
  margin-top: 2vw;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: ${fadeUp} 1s ease-out 0.8s forwards;
  opacity: 0;
`;
