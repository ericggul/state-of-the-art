import styled, { css } from "styled-components";

export const RedirectButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;

  &:active {
    background: #cc3333;
  }
`;
