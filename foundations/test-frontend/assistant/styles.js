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
  text-align: center; /* Centered text */
`;

export const InputForm = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${relVw(8)} 0;
  background: #1c1c1c;
  border-radius: 10px;
  margin-top: ${relVw(16)};
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: ${relVw(10)};
  margin-right: ${relVw(10)};
  border: none;
  border-radius: 8px;
  background-color: #333;
  color: white;
  font-size: 1rem;
  font-family: "Cardo", serif;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #888;
    background-color: #444;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center; /* Center-aligning messages */
  padding: ${relVw(10)} 0;
  overflow-y: auto;
  white-space: pre-wrap;
`;

export const UserMessage = styled.div`
  margin: ${relVw(8)} 0;
  padding: ${relVw(8)} ${relVw(16)};
  background-color: #333;
  border-radius: 15px;
  color: #fff;
  font-style: italic;
  font-size: 1rem;
  font-family: "Cardo", serif;
  max-width: 75%;
  text-align: center;
`;

export const AssistantMessage = styled.div`
  margin: ${relVw(8)} 0;
  padding: ${relVw(8)} ${relVw(16)};
  background-color: #1e1e1e;
  border-radius: 15px;
  color: #aaa;
  font-size: 1rem;
  font-family: "Cardo", serif;
  max-width: 75%;
  text-align: center;
`;

export const CodeMessage = styled.div`
  margin: ${relVw(8)} 0;
  padding: ${relVw(10)} ${relVw(16)};
  background-color: #282828;
  border-radius: 15px;
  color: #b8b8b8;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  max-width: 80%;
  text-align: center;

  & > div {
    margin-top: ${relVw(4)};
  }

  span {
    color: #888;
    margin-right: ${relVw(8)};
  }
`;
