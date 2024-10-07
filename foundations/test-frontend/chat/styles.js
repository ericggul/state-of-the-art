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
`;

// Container for the messages with scrolling capability
export const Messages = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  padding: ${vw(10)} 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  white-space: pre-wrap;
`;

// Form containing the input and send button
export const InputForm = styled.form`
  display: flex;
  width: 100%;
  padding: ${vw(8)} 0;
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
  padding: ${vw(10)} ${vw(16)};
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-family: "Cardo", serif;
  cursor: pointer;

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

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

// Code message block with preserved formatting
export const CodeMessage = styled.pre`
  margin: ${vw(8)} ${vw(16)};
  padding: ${vw(10)} ${vw(16)};
  border-radius: 15px;
  color: #b8b8b8;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  max-width: 80%;
  white-space: pre-wrap;
  word-wrap: break-word;

  & > div {
    margin-top: ${vw(4)};
  }

  span {
    color: #888;
    margin-right: ${vw(8)};
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
  background-color: #333;
  color: #fff;
  border: 1px solid #444;
  border-radius: 12px;
  padding: ${vw(6)} ${vw(12)};
  margin: ${vw(4)};
  font-size: 0.9rem;
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
