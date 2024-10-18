import styled from "styled-components";

// Function to convert pixels to viewport width units for responsiveness
const vw = (px) => `${(px / 390) * 100}vw`;

// Main container that fills the viewport
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #000;
  color: #fff;
  font-family: "Cardo", serif;
  height: 100vh;
  width: 100vw;
  padding: ${vw(20)} ${vw(16)};
  box-sizing: border-box;

  transition: all 0.5s;
`;

// Container for the messages with scrolling capability
export const Messages = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  padding: ${vw(10)} 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; // Change from flex-end to flex-start
  box-sizing: border-box;
  white-space: pre-wrap;

  transition: all 0.5s;

  // Add these styles for better scrolling
  max-height: calc(100vh - ${vw(150)}); // Adjust the value as needed
  scrollbar-width: thin;
  scrollbar-color: #444 #000;

  &::-webkit-scrollbar {
    width: ${vw(8)};
  }

  &::-webkit-scrollbar-track {
    background: #000;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: ${vw(4)};
    border: ${vw(2)} solid #000;
  }
`;

// Suggested responses container
export const SuggestedResponses = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: ${vw(10)} ${vw(16)};
`;

// Suggested response button styling
export const SuggestedResponseButton = styled.button`
  background-color: #111;
  color: #aaa;
  border: 1px solid #444;
  border-radius: 8px;
  padding: ${vw(4)} ${vw(8)};
  margin: ${vw(4)} ${vw(4)};
  font-size: 0.8rem;
  font-family: "Cardo", serif;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out;

  &:hover {
    background-color: #555;
    border-color: #666;
  }

  &:active {
    background-color: #777;
    border-color: #888;
  }

  &:focus {
    outline: none;
    border-color: #aaa;
  }
`;

// Form containing the input and send button
export const InputForm = styled.form`
  display: flex;
  width: 100%;
  padding: ${vw(8)} ${vw(20)};
  box-sizing: border-box;
  align-items: center;
`;

// Text input for user messages
export const Input = styled.input`
  flex-grow: 1;
  padding: ${vw(10)};
  margin-right: ${vw(10)};
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #000;
  color: #fff;
  font-size: 1rem;
  font-family: "Cardo", serif;
  text-align: center;
  box-shadow: inset 0 0 0.1rem white;

  //placeholder
  &::placeholder {
    font-size: 0.85rem;
  }

  &:focus {
    outline: none;
    border-color: #888;
  }

  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

// Send button
export const Button = styled.button`
  padding: ${vw(10)} ${vw(20)};

  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-family: "Cardo", serif;
  cursor: pointer;
  font-style: italic;

  &:disabled {
    background-color: black;
    opacity: 0.3;

    transition: all 0.5s;
    cursor: not-allowed;
  }
`;
