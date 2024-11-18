import styled from "styled-components";
import { WholeContainer, FlexCenterStyle } from "@/styles";

export const Text = styled.div`
  position: absolute;
  bottom: 2vw;
  font-size: 1.2vw;
  ${FlexCenterStyle}
  letter-spacing: 0.05em;
  line-height: 1.4;
  text-align: center;
  max-width: 85%;
  // font-weight: lighter;

  font-family: "Times New Roman", serif;
  font-style: italic;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 1);

  opacity: 1;
  transition: opacity 0.5s ease-in-out;

  -webkit-text-stroke: 0.02em rgba(255, 255, 255, 0.1);
`;
