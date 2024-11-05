import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000000;
  padding: 2rem;
  font-family: "Fira Code", monospace;
`;

export const StructureText = styled.pre`
  color: #00ffff;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  width: 100%;
  overflow-x: auto;
  white-space: pre;

  .type {
    color: #888;
    margin-left: 8px;
  }

  .model-structure {
    display: flex;
    flex-direction: column;
  }
`;
