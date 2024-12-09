import * as S from "./styles";
import useStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

export default function Lines() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);

  return (
    <S.Container>
      <S.DiagonalLine
        $hue={debouncedHue}
        style={{
          transform: `translate(-50%, -50%) rotate(${
            -50 - debouncedHue / 6
          }deg)`,
        }}
      />
      <S.DiagonalLine2
        $hue={debouncedHue}
        style={{
          transform: `translate(-50%, -50%) rotate(${
            -110 + debouncedHue / 5
          }deg)`,
        }}
      />

      <S.HorizontalLine $hue={debouncedHue} />
      <S.HorizontalLine2 $hue={debouncedHue} />
    </S.Container>
  );
}
