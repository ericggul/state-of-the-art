import styled from "styled-components";

export const Text = styled.div`
  position: absolute;
  top: 2vh;
  font-size: 4vw; // Larger font for mobile
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 90%;
  font-family: var(--cardo), serif;
  color: #000;

  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;
