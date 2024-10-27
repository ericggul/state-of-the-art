import React, { useMemo } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v2";

export default function Grid() {
  const { currentArchitectures } = useScreenStore();

  const highlightedVersions = useMemo(() => {
    return currentArchitectures.map((arch) => arch.version);
  }, [currentArchitectures]);

  return (
    <S.Container>
      <S.GridWrapper>
        {OBJECT_ARRAY.map((model) => (
          <S.GridItem
            key={model.version}
            $isHighlighted={highlightedVersions.includes(model.version)}
          >
            <S.ModelName>{model.name}</S.ModelName>
            <S.ModelVersion>{model.version}</S.ModelVersion>
          </S.GridItem>
        ))}
      </S.GridWrapper>
    </S.Container>
  );
}
