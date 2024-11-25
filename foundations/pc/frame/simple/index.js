import * as S from "./styles";
import useStore from "@/components/screen/store";

export default function Frame() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);

  return (
    <S.Container>
      <S.VerticalLine />
      <S.HorizontalLine />
      <S.HorizontalLine2 />

      {currentArchitectures && currentArchitectures.length > 0 && (
        <S.ModelTitle>
          <S.Title>{currentArchitectures[0].name}</S.Title>
        </S.ModelTitle>
      )}
    </S.Container>
  );
}
