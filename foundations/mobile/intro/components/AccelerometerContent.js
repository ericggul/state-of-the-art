import AnimatedTitle from "./AnimatedTitle";
import * as S from "@/foundations/mobile/intro/styles";

export default function AccelerometerContent({
  username,
  isIOS,
  handleAccelerometerActivation,
}) {
  return (
    <S.IntroContent>
      {username && <AnimatedTitle text={`Hi, ${username}!`} baseDelay={0.3} />}
      {isIOS ? (
        <S.IOSDialogContainer>
          <S.IOSDialogTitle>
            "State-of-the-Art" Would Like to Access Motion and Orientation
          </S.IOSDialogTitle>
          <S.IOSDialogMessage>
            This lets you explore the gallery immersively. Your data is secured
            and not shared with anyone.
          </S.IOSDialogMessage>
          <S.IOSButtonGroup>
            <S.IOSButton
              onClick={() =>
                alert(
                  "We definitely recommend you to allow for an immersive experience"
                )
              }
            >
              Not Now
            </S.IOSButton>
            <S.IOSButton $primary onClick={handleAccelerometerActivation}>
              Allow
            </S.IOSButton>
          </S.IOSButtonGroup>
        </S.IOSDialogContainer>
      ) : (
        <>
          <S.IntroText>
            Experience the gallery in its full interactive form by{" "}
            <b>ALLOWING</b> your device's motion sensors.
          </S.IntroText>
          <S.ActivateButton onClick={handleAccelerometerActivation}>
            Activate Accelerometer
          </S.ActivateButton>
        </>
      )}
    </S.IntroContent>
  );
}
