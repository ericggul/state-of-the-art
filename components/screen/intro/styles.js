import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  color: white;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 1) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;
