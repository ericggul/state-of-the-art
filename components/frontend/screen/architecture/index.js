import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/archi/3d";
import ArchitectureUI from "@/foundations/frontend/archi/ui";

export default function Architecture({ version = "v1.1" }) {
  return (
    <S.Container>
      <Architecture3D />
      <ArchitectureUI />
    </S.Container>
  );
}
