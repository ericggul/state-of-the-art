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
            "State-of-Art Gallery" Would Like to Access Motion and Orientation
          </S.IOSDialogTitle>
          <S.IOSDialogMessage>
            This lets you explore the gallery through device motion and
            orientation.
          </S.IOSDialogMessage>
          <S.IOSButtonGroup>
            <S.IOSButton
              onClick={() => alert("Please allow motion access to continue")}
            >
              Cancel
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
