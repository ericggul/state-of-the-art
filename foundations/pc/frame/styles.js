import styled from "styled-components";
import { WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
`;

export const VerticalLine = styled.div`
  position: absolute;
  width: 0.1vw;
  height: 92vh;
  top: 0;
  left: 3vw;
  background: #fff;
`;

export const HorizontalLine = styled.div`
  position: absolute;
  height: 0.1vw;
  width: 45vw;
  top: 4vw;
  left: 0;
  background: #fff;
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  height: 0.1vw;
  width: 25vw;
  top: 4vw;
  left: 50vw;
  background: #fff;

  //circle at the start of the line
  &::before {
    content: "";
    position: absolute;
    width: 1vw;
    height: 1vw;
    border-radius: 50%;
    background: #fff;
    top: 0;
    left: -0.5vw;
    transform: translateY(-50%);
  }
`;

export const ModelTitle = styled.div`
  position: absolute;
  background: black;

  left: 4.5vw;
  top: 4vw;
  padding: 1vw;
  transform: translateY(-50%);
`;

export const Title = styled.h1`
  font-size: 4vw;
`;
