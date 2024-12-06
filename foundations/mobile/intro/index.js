import { useCallback, useMemo } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";
import { useNameInput } from "../utils/useNameInput";
import IntroForm from "./components/IntroForm";
import AccelerometerContent from "./components/AccelerometerContent";

const isIOSDevice =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export default function Intro({
  socket,
  onAccelerometerActivate,
  onUsernameSubmit,
  initialUsername,
  introState,
  mobileId,
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
      console.log(error.message);
      onAccelerometerActivate(false);
    }
  }, [onAccelerometerActivate, requestAccess]);

  function emitAccelerometerActivation(result) {
    if (!socket.current) return;
    socket.current.emit("mobile-new-intro", {
      type: "accelerometer_activation",
      activated: result.granted,
      mobileId,
    });
  }

  return (
    <S.IntroContainer>
      <S.TopVerticalLine />
      <S.BottomVerticalLine />
      {introState === 0 ? (
        <IntroForm nameInputProps={nameInputProps} />
      ) : (
        <AccelerometerContent
          username={nameInputProps.username}
          isIOS={isIOS}
          handleAccelerometerActivation={handleAccelerometerActivation}
        />
      )}
    </S.IntroContainer>
  );
}
