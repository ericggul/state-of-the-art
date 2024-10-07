import styled from "styled-components";

const relVw = (px) => `${(px / 390) * 100}vw`; // Responsive to mobile dimensions

// Full screen container with centered text, removing any overflow issues
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Space evenly between messages and input */
  align-items: center;
  background: #000;
  color: white;
  font-family: "Cardo", serif;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* Prevent overflow */
  padding: 0;
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
  background: #1e1e1e;
  transition: background-color 0.3s ease;

  &:focus {
    outline: none;
    background-color: #333;
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

  &:hover {
    background-color: #666;
  }

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
  padding: ${relVw(10)} ${relVw(16)};
  overflow-y: auto; /* Enable scrolling for messages */
  white-space: pre-wrap;
  box-sizing: border-box;
`;

// User message aligned to the right (minimalist, without background)
export const UserMessage = styled.div`
  margin: ${relVw(8)} ${relVw(16)};
  padding: ${relVw(8)} ${relVw(16)};
  font-style: italic;
  font-size: 1rem;
  font-family: "Cardo", serif;
  color: #fff;
  max-width: 75%;
  align-self: flex-end;
  text-align: right;
  border-bottom: 1px solid #444;
`;

// Assistant message aligned to the left (minimalist, without background)
export const AssistantMessage = styled.div`
  margin: ${relVw(8)} ${relVw(16)};
  padding: ${relVw(8)} ${relVw(16)};
  font-size: 1rem;
  font-family: "Cardo", serif;
  color: #aaa;
  max-width: 75%;
  align-self: flex-start;
  text-align: left;
  border-bottom: 1px solid #444;
`;

export const CodeMessage = styled.div`
  margin: ${relVw(8)} ${relVw(16)};
  padding: ${relVw(10)} ${relVw(16)};
  color: #b8b8b8;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  max-width: 80%;
  text-align: left;
  border-left: 3px solid #444;
  padding-left: 12px;

  & > div {
    margin-top: ${relVw(4)};
  }

  span {
    color: #888;
    margin-right: ${relVw(8)};
  }
`;

// VoiceButton with color changes for recording state
export const VoiceButton = styled.button`
  background: ${(props) => (props.$isRecording ? "#ff4444" : "#4CAF50")}; /* Red for recording, green for idle */
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

// InputForm that stays at the bottom and centers elements
export const InputForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${relVw(8)} ${relVw(16)};
  background: #1e1e1e;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #333;
  position: fixed;
  bottom: 0; /* Fixes input form to the bottom of the screen */
  left: 0; /* Ensures it stays aligned with the viewport */
`;

export const VoiceStatus = styled.div`
  background-color: #1e1e1e;
  color: ${(props) => (props.$isRecording ? "#ff4444" : "#4CAF50")}; /* Red text when recording, green when idle */
  font-family: "Cardo", serif;
  font-size: 1rem;
  padding: ${relVw(8)};
  margin: ${relVw(8)} 0;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  transition: color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  /* Optionally add some animation for recording state */
  ${(props) =>
    props.$isRecording &&
    `
    animation: pulse 1.5s infinite;
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `}
`;
