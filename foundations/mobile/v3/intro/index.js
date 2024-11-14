import { useCallback, useState, useEffect } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

export default function Intro({ socket, onAccelerometerActivate }) {
  const [introState, setIntroState] = useState(1);
  const [username, setUsername] = useState("");
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();

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

  const handleActivateAccelerometer = useCallback(async () => {
    if (supportsDeviceOrientation) {
      const granted = await requestAccess();
      if (granted) {
        // Emit accelerometer activation
        if (socket?.current) {
          socket.current.emit("mobile-new-intro", {
            type: "accelerometer_activation",
            granted: true,
            supportsDeviceOrientation,
          });
        }
        onAccelerometerActivate(true);
      } else {
        // Emit accelerometer denial
        if (socket?.current) {
          socket.current.emit("mobile-new-intro", {
            type: "accelerometer_activation",
            granted: false,
            supportsDeviceOrientation,
          });
        }
        alert("Permission denied for accelerometer access");
      }
    } else {
      // Emit accelerometer activation for non-supporting devices
      if (socket?.current) {
        socket.current.emit("mobile-new-intro", {
          type: "accelerometer_activation",
          granted: true,
          supportsDeviceOrientation: false,
        });
      }
      onAccelerometerActivate(true);
    }
  }, [
    supportsDeviceOrientation,
    requestAccess,
    onAccelerometerActivate,
    socket,
  ]);

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
            onClick={handleActivateAccelerometer}
            disabled={!supportsDeviceOrientation && permission}
          >
            Activate Accelerometer
          </S.ActivateButton>
        </S.IntroContent>
      )}
    </S.IntroContainer>
  );
}
