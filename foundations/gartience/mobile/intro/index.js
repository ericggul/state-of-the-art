import React, { useCallback, useState, useMemo } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer-gartience";
import { useNameInput } from "./utils/useNameInput";
import AnimatedTitle from "./components/AnimatedTitle";

import useMobileStore from "@/foundations/gartience/mobile/store";

// Move outside component
const isIOSDevice =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream;

export default React.memo(function Intro({
  socket,
  onAccelerometerActivate,
  onUsernameSubmit,
  initialUsername,
}) {
  const [introState, setIntroState] = useState(0);
  const { supportsDeviceOrientation, permission } = useAccelerometer();
  const isIOS = useMemo(() => isIOSDevice, []);

  const nameInputProps = useNameInput({
    socket,
    onSuccess: useCallback(
      (username) => {
        setIntroState(1);
        onUsernameSubmit(username);
      },
      [onUsernameSubmit]
    ),
    initialUsername,
  });

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
    <S.IntroForm onSubmit={nameInputProps.handleUsernameSubmit}>
      <AnimatedTitle text="State-of-the-Art Gallery" />
      <div style={{ width: "100%" }}>
        <S.IntroInput
          type="text"
          placeholder="Enter your first name"
          value={nameInputProps.username}
          onChange={nameInputProps.handleUsernameChange}
          onBlur={nameInputProps.handleBlur}
          onKeyPress={nameInputProps.handleKeyPress}
          required
          maxLength={20}
          aria-invalid={!!nameInputProps.error}
          disabled={nameInputProps.isVerifying}
          autoComplete="off"
          enterKeyHint="done"
        />
        {nameInputProps.error && (
          <S.ErrorMessage>{nameInputProps.error}</S.ErrorMessage>
        )}
      </div>
      <S.IntroButton
        type="submit"
        disabled={
          !nameInputProps.username.trim() ||
          !!nameInputProps.error ||
          nameInputProps.isVerifying
        }
      >
        {nameInputProps.isVerifying
          ? "GPT Validating your name..."
          : "Continue"}
      </S.IntroButton>
    </S.IntroForm>
  );

  const renderAccelerometerContent = () => (
    <S.IntroContent>
      <AnimatedTitle
        text={`Hi, ${nameInputProps.username}!`}
        baseDelay={0.3} // Delay start of animation
      />
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
});
