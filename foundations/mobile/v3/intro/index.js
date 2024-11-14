import { useCallback, useState, useEffect } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

export default function Intro({ socket, onAccelerometerActivate }) {
  const [introState, setIntroState] = useState(1);
  const [username, setUsername] = useState("");
  const { supportsDeviceOrientation, permission } = useAccelerometer();

  // Detect if device is iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Emit intro state changes
  useEffect(() => {
    if (socket?.current) {
      socket.current.emit("mobile-new-intro", {
        type: "state_change",
        introState,
      });
    }
  }, [introState, socket]);

  const handleUsernameSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (username.trim()) {
        // Emit username submission
        if (socket?.current) {
          socket.current.emit("mobile-new-intro", {
            type: "username_submit",
            username: username.trim(),
          });
        }
        setIntroState(2);
      }
    },
    [username, socket]
  );

  const handleAccelerometerActivation = async () => {
    try {
      // Check if device supports motion sensors
      if (!window.DeviceOrientationEvent && !window.DeviceMotionEvent) {
        alert("Sorry, your device does not support motion sensors");
        return;
      }

      // For iOS devices
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          onAccelerometerActivate(true);
        } else {
          alert("Permission denied for motion sensors");
        }
      } else {
        // For Android and devices that don't need explicit permission
        onAccelerometerActivate(true);
      }
    } catch (error) {
      console.error("Error activating accelerometer:", error);
      alert("Error activating motion sensors. Please try again.");
    }
  };

  console.log("supportsDeviceOrientation:", supportsDeviceOrientation);
  console.log("permission:", permission);

  return (
    <S.IntroContainer>
      {introState === 1 ? (
        <S.IntroForm onSubmit={handleUsernameSubmit}>
          <S.IntroTitle>Welcome to Neural Network Explorer</S.IntroTitle>
          <S.IntroInput
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={20}
          />
          <S.IntroButton type="submit" disabled={!username.trim()}>
            Continue
          </S.IntroButton>
        </S.IntroForm>
      ) : (
        <S.IntroContent>
          <S.IntroTitle>Hi, {username}!</S.IntroTitle>
          <S.IntroText>
            To explore neural networks, we need access to your device's
            accelerometer.
          </S.IntroText>
          <S.ActivateButton
            onClick={handleAccelerometerActivation}
            disabled={isIOS && permission === "denied"}
          >
            Activate Accelerometer
          </S.ActivateButton>
        </S.IntroContent>
      )}
    </S.IntroContainer>
  );
}
