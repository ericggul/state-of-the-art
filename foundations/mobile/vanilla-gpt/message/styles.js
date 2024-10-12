import styled from "styled-components";

// Function to convert pixels to viewport width units for responsiveness
const vw = (px) => `${(px / 390) * 100}vw`;

// User message aligned to the right (without background)
export const UserMessage = styled.div`
  margin: ${vw(8)} ${vw(16)};
  padding: ${vw(8)} ${vw(16)};
  border-radius: 15px;
  color: #fff;
  font-style: italic;
  font-size: 1rem;
  font-family: "Cardo", serif;
  max-width: 75%;
  align-self: flex-end; /* Align message to the right */
  text-align: right;
`;

// Assistant message aligned to the left (without background)
export const AssistantMessage = styled.div`
  margin: ${vw(8)} ${vw(16)};
  padding: ${vw(8)} ${vw(16)};
  border-radius: 15px;
  color: #aaa;
  font-size: 1rem;
  font-family: "Cardo", serif;
  max-width: 75%;
  align-self: flex-start; /* Align message to the left */
  text-align: left;
`;
