import { useCallback, useMemo } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import { useNameInput } from "../utils/useNameInput";
import AnimatedTitle from "./components/AnimatedTitle";

// Move outside component
const isIOSDevice =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export default function Intro({
  socket,
  onAccelerometerActivate,
  onUsernameSubmit,
  initialUsername,
  introState,
  mobileId = "",
}) {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();
  const isIOS = useMemo(() => isIOSDevice, []);

  const handleSuccess = useCallback(
    (username) => {
      onUsernameSubmit(username);
    },
    [onUsernameSubmit]
  );

  const nameInputProps = useNameInput({
    socket,
    onSuccess: handleSuccess,
    initialUsername,
    mobileId,
  });

  const handleAccelerometerActivation = useCallback(async () => {
    try {
      const result = await requestAccess();

      emitAccelerometerActivation(result);
      onAccelerometerActivate(result.granted);

      if (result.fallback) {
        onAccelerometerActivate(false);
      }
    } catch (error) {
      console.error("Error activating accelerometer:", error);
      alert(error.message);
      onAccelerometerActivate(false);
    }
  }, [onAccelerometerActivate, requestAccess]);

  function emitAccelerometerActivation(result) {
    socket.current.emit("mobile-new-intro", {
      type: "accelerometer_activation",
      activated: result.granted,
      mobileId,
    });
  }

  const renderIntroForm = () => (
    <S.IntroForm onSubmit={nameInputProps.handleUsernameSubmit}>
      <AnimatedTitle text="State-of-the-Art Gallery" />
      <div style={{ width: "90%" }}>
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
        style={{ width: "90%" }}
      >
        {nameInputProps.isVerifying
          ? "GPT Validating your name..."
          : "Continue"}
      </S.IntroButton>
    </S.IntroForm>
  );

  const renderAccelerometerContent = () => (
    <S.IntroContent>
      {nameInputProps.username && (
        <AnimatedTitle
          text={`Hi, ${nameInputProps.username}!`}
          baseDelay={0.3} // Delay start of animation
        />
      )}
      <S.IntroText>
        Experience the gallery in its full interactive form by <b>ALLOWING</b>{" "}
        your device's motion sensors.
      </S.IntroText>
      <S.ActivateButton onClick={handleAccelerometerActivation}>
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
