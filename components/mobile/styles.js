import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
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
