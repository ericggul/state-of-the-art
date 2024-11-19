import { useCallback, useState, useMemo } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import { useNameInput } from "../utils/useNameInput";

export default function Intro({ socket, onAccelerometerActivate }) {
  const [introState, setIntroState] = useState(0);
  const { supportsDeviceOrientation, permission } = useAccelerometer();

  const {
    username,
    error,
    isVerifying,
    handleUsernameChange,
    handleUsernameSubmit,
  } = useNameInput({
    socket,
    onSuccess: useCallback(() => setIntroState(1), []),
  });

  // Memoize iOS detection
  const isIOS = useMemo(
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    []
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
      <S.IntroTitle>State-of-the-Art Gallery</S.IntroTitle>
      <div style={{ width: "100%" }}>
        <S.IntroInput
          type="text"
          placeholder="Enter your real name"
          value={username}
          onChange={handleUsernameChange}
          required
          maxLength={20}
          aria-invalid={!!error}
          disabled={isVerifying}
          autoComplete="off"
        />
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      </div>
      <S.IntroButton
        type="submit"
        disabled={!username.trim() || !!error || isVerifying}
      >
        {isVerifying ? "LLM Validating..." : "Continue"}
      </S.IntroButton>
    </S.IntroForm>
  );

  const renderAccelerometerContent = () => (
    <S.IntroContent>
      <S.IntroTitle>Hi, {username}!</S.IntroTitle>
      <S.IntroText>
        To explore the state-of-the-art neural networks, we need access to your
        device's accelerometer.
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
      <S.TopVerticalLine />
      <S.BottomVerticalLine />
      {introState === 0 ? renderIntroForm() : renderAccelerometerContent()}
    </S.IntroContainer>
  );
}
