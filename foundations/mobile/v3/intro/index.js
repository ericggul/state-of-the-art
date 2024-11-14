import { useCallback } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

export default function Intro({ onAccelerometerActivate }) {
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();

  const handleActivateAccelerometer = useCallback(async () => {
    if (supportsDeviceOrientation) {
      const granted = await requestAccess();
      if (granted) {
        onAccelerometerActivate(true);
      } else {
        alert("Permission denied for accelerometer access");
      }
    } else {
      onAccelerometerActivate(true);
    }
  }, [supportsDeviceOrientation, requestAccess, onAccelerometerActivate]);

  return (
    <S.IntroContainer>
      {/* Future username input will go here */}
      <S.ActivateButton
        onClick={handleActivateAccelerometer}
        disabled={!supportsDeviceOrientation && permission}
      >
        Activate Accelerometer
      </S.ActivateButton>
    </S.IntroContainer>
  );
}
