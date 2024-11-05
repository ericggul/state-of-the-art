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
  height: 100%;
  overflow-y: scroll;
  overflow-x: auto;
  white-space: pre;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .tree-line {
    color: #666;
    user-select: none;
  }

  .tree-content {
    display: inline-flex;
    align-items: center;
    min-height: 1.5em;
  }

  .dims {
    color: #00ff00;
    margin-left: 8px;
  }

  .type {
    color: #888;
    margin-left: 8px;
  }

  .params {
    color: #ff00ff;
    margin-left: 8px;
    font-size: 12px;
  }

  .grid {
    color: #ffff00;
    margin-left: 8px;
    font-size: 12px;
  }

  .depth-0 {
    color: #00ffff;
  }
  .depth-1 {
    color: #00ccff;
  }
  .depth-2 {
    color: #0099ff;
  }
  .depth-3 {
    color: #0066ff;
  }
  .depth-4 {
    color: #0033ff;
  }

  .model-structure {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.2rem;
  }
`;
