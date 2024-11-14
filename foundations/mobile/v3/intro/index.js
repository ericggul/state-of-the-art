import { useCallback, useState, useEffect, useMemo } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

export default function Intro({ socket, onAccelerometerActivate }) {
  const [introState, setIntroState] = useState(1);
  const [username, setUsername] = useState("");
  const { supportsDeviceOrientation, permission } = useAccelerometer();

  // Memoize iOS detection
  const isIOS = useMemo(
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    []
  );

  // Emit intro state changes
  useEffect(() => {
    const currentSocket = socket?.current;
    if (currentSocket) {
      currentSocket.emit("mobile-new-intro", {
        type: "state_change",
        introState,
      });
    }
  }, [introState, socket]);

  const handleUsernameSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedUsername = username.trim();
      if (trimmedUsername) {
        if (socket?.current) {
          socket.current.emit("mobile-new-intro", {
            type: "username_submit",
            username: trimmedUsername,
          });
        }
        setIntroState(2);
      }
    },
    [username, socket]
  );

  const handleAccelerometerActivation = useCallback(async () => {
    try {
      const hasMotionSupport =
        window.DeviceOrientationEvent || window.DeviceMotionEvent;
      if (!hasMotionSupport) {
        alert("Sorry, your device does not support motion sensors");
        return;
      }

      const isIOSPermissionAPI =
        typeof DeviceMotionEvent.requestPermission === "function";
      if (isIOSPermissionAPI) {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          onAccelerometerActivate(true);
        } else {
          alert("Permission denied for motion sensors");
        }
      } else {
        onAccelerometerActivate(true);
      }
    } catch (error) {
      console.error("Error activating accelerometer:", error);
      alert("Error activating motion sensors. Please try again.");
    }
  }, [onAccelerometerActivate]);

  const renderIntroForm = () => (
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
  );

  const renderAccelerometerContent = () => (
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
  );

  return (
    <S.IntroContainer>
      {introState === 1 ? renderIntroForm() : renderAccelerometerContent()}
    </S.IntroContainer>
  );
}
