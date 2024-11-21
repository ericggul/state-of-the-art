import styled from "styled-components";

export const Text = styled.div`
  position: absolute;
  bottom: 2vh;
  font-size: 4vw; // Larger font for mobile
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 0.05em;
  line-height: 1.4;
  text-align: center;
  max-width: 90%;

  font-family: var(--cardo), serif;
  font-style: italic;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(255, 255, 255, 1);

  opacity: 1;
  transition: opacity 0.5s ease-in-out;

  -webkit-text-stroke: 0.02em rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    font-size: 3vw; // Slightly smaller for tablets
    bottom: 4vh;
  }
`;
