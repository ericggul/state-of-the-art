import styled, { css } from "styled-components";

export const RedirectButton = styled.button`
  position: fixed;
  top: 0;
  right: 0;
  padding: 20px 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;
  width: 100%;

  &:active {
    background: #cc3333;
  }
`;
