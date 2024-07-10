import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Modal = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
`;

export const Input = styled.input`
  margin: 1rem 0;

  width: 16rem;
  height: 2rem;
  ${FlexCenterStyle};
  border: none;
  border-bottom: 1px solid #888;
  border-radius: 0;

  background: transparent;
  color: white;
  font-size: 1.5rem;

  text-align: center;

  //when focus no border
  &:focus {
    outline: none;
    border-bottom: 1px solid white;
  }
`;

export const Button = styled.div`
  border: 1px solid white;
  padding: 0.3rem 1rem;
  margin: 1rem 0;
`;

export const TrainButton = styled.div`
  z-index: 10;

  position: absolute;
  bottom: 3rem;
  ${FlexCenterStyle}
  font-size: 1rem;
  // box-shadow: inset 0 0 0.5rem hsla(240, 100%, 60%, 1), 0 0 1rem hsla(240, 100%, 60%, 1);
  color: hsl(240, 80%, 70%);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
`;
