import styled from "styled-components";

const relVw = (px) => `${(px / 390) * 100}vw`; // Responsive to mobile dimensions

// Full screen container with centered text
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  color: white;
  font-family: "Cardo", serif;
  height: 100vh;
  width: 100vw;
  padding: ${relVw(20)} ${relVw(16)};
`;

export const InputForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${relVw(8)} 0;
  margin-top: ${relVw(16)};
  box-sizing: border-box;
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: ${relVw(10)};
  margin-right: ${relVw(10)};
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-family: "Cardo", serif;
  text-align: center;
  background: black;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

export const Button = styled.button`
  padding: ${relVw(10)} ${relVw(16)};
  background-color: #444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-family: "Cardo", serif;

  &:disabled {
    background-color: grey;
  }
`;

export const Messages = styled.div`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch; /* Align messages to start (left or right depending on the message) */
  padding: ${relVw(10)} 0;
  overflow-y: auto;
  white-space: pre-wrap;
  box-sizing: border-box;
`;

// User message aligned to the right (without background)
export const UserMessage = styled.div`
  margin: ${relVw(8)} ${relVw(16)};
  padding: ${relVw(8)} ${relVw(16)};
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
  margin: ${relVw(8)} ${relVw(16)};
  padding: ${relVw(8)} ${relVw(16)};
  border-radius: 15px;
  color: #aaa;
  font-size: 1rem;
  font-family: "Cardo", serif;
  max-width: 75%;
  align-self: flex-start; /* Align message to the left */
  text-align: left;
`;

export const CodeMessage = styled.div`
  margin: ${relVw(8)} ${relVw(16)};
  padding: ${relVw(10)} ${relVw(16)};
  border-radius: 15px;
  color: #b8b8b8;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  max-width: 80%;
  text-align: left;

  & > div {
    margin-top: ${relVw(4)};
  }

  span {
    color: #888;
    margin-right: ${relVw(8)};
  }
`;
