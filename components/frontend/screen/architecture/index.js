import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/architecture-3d";
import ArchitectureUI from "@/foundations/frontend/architecture-ui";

export default function Architecture() {
  return (
    <S.Container>
      <Architecture3D />
      <ArchitectureUI />
    </S.Container>
  );
}
