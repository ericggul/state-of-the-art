import styled from "styled-components";

import { FlexCenterStyle, WholeContainer } from "@/styles";

export const IntroContainer = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

export const ActivateButton = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }
`;
