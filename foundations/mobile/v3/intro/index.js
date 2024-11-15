import { useCallback, useState, useEffect, useMemo } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

export default function Intro({ socket, onAccelerometerActivate }) {
  const [introState, setIntroState] = useState(0);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { supportsDeviceOrientation, permission } = useAccelerometer();

  // Memoize iOS detection
  const isIOS = useMemo(
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    []
  );

  // Validate username
  const validateUsername = useCallback((value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
      return "Please use only Latin letters";
    }

    return "";
  }, []);

  // Handle input change
  const handleUsernameChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setUsername(newValue);
      setError(validateUsername(newValue));

      // Emit username update
      if (socket?.current) {
        socket.current.emit("mobile-new-intro", {
          type: "username_update",
          username: newValue.trim(),
        });
      }
    },
    [validateUsername, socket]
  );

  // Emit intro state changes
  // useEffect(() => {
  //   const currentSocket = socket?.current;
  //   if (currentSocket) {
  //     currentSocket.emit("mobile-new-intro", {
  //       type: "state_change",
  //       introState,
  //     });
  //   }
  // }, [introState, socket]);

  const handleUsernameSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedUsername = username.trim();
      const validationError = validateUsername(trimmedUsername);

      if (validationError) {
        setError(validationError);
        return;
      }

      if (socket?.current) {
        socket.current.emit("mobile-new-intro", {
          type: "username_submit",
          username: trimmedUsername,
        });
      }
      setIntroState(1);
    },
    [username, socket, validateUsername]
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
          emitAccelerometerActivation();
          onAccelerometerActivate(true);
        } else {
          alert("Permission denied for motion sensors");

          ////TO DO: WHICH LOGIC HERE?
          emitAccelerometerActivation();
          onAccelerometerActivate(true);
        }
      } else {
        emitAccelerometerActivation();
        onAccelerometerActivate(true);
      }
    } catch (error) {
      console.error("Error activating accelerometer:", error);
      alert("Error activating motion sensors.");

      ////TO DO: WHICH LOGIC HERE?
      emitAccelerometerActivation();
      onAccelerometerActivate(true);
    }
  }, [onAccelerometerActivate]);

  function emitAccelerometerActivation() {
    socket.current.emit("mobile-new-intro", {
      type: "accelerometer_activation",
      activated: true,
    });
  }

  const renderIntroForm = () => (
    <S.IntroForm onSubmit={handleUsernameSubmit}>
      <S.IntroTitle>Welcome to Neural Network Explorer</S.IntroTitle>
      <div style={{ width: "100%" }}>
        <S.IntroInput
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={handleUsernameChange}
          required
          maxLength={20}
          aria-invalid={!!error}
        />
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      </div>
      <S.IntroButton type="submit" disabled={!username.trim() || !!error}>
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
      {introState === 0 ? renderIntroForm() : renderAccelerometerContent()}
    </S.IntroContainer>
  );
}
