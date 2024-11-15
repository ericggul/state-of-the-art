import styled from "styled-components";
import { WholeContainer, FlexCenterStyle } from "@/styles";

export const Text = styled.div`
  position: absolute;
  bottom: 2vw;
  font-size: 1vw;
  ${FlexCenterStyle}
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.5;
  text-align: center;
  max-width: 90%;
`;
