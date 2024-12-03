import * as S from "./styles";
import useStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

export default function Lines() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);

  return (
    <S.Container>
      <S.DiagonalLine $hue={debouncedHue} />
      <S.HorizontalLine $hue={debouncedHue} />
      <S.HorizontalLine2 $hue={debouncedHue} />
    </S.Container>
  );
}
