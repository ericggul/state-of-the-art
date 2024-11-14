import { useCallback, useState } from "react";
import * as S from "./styles";
import useAccelerometer from "@/utils/hooks/orientation/useAccelerometer";

export default function Intro({ onAccelerometerActivate }) {
  const [introState, setIntroState] = useState(1);
  const [username, setUsername] = useState("");
  const { supportsDeviceOrientation, permission, requestAccess } =
    useAccelerometer();

  const handleUsernameSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (username.trim()) {
        setIntroState(2);
      }
    },
    [username]
  );

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
