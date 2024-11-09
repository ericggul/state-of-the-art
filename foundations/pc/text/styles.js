import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000000;
  padding: 2rem;
  font-family: "Fira Code", monospace;
`;

export const Canvas = styled.div`
  ${WholeContainer}
  width: 120vw;
  // right: 0;
  left: 0vw;
  opacity: 0.5;

  canvas {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`;

const scrollbarHide = css`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const depthColors = {
  0: "#00ffff",
  1: "#00ccff",
  2: "#0099ff",
  3: "#0066ff",
  4: "#0033ff",
};

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
  ${scrollbarHide}

  z-index: 100;

  .tree-line {
    color: #666;
    user-select: none;

    .branch-char {
      color: #888;
      font-weight: bold;
    }
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

  ${Object.entries(depthColors).map(
    ([depth, color]) => css`
      .depth-${depth} {
        color: ${color};
      }
    `
  )}

  .model-structure {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.2rem;
  }
`;
