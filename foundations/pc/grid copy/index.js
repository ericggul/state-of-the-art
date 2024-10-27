import React, { useMemo } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { MODELS } from "@/components/controller/constant/models/v2";

export default function Grid() {
  const { currentArchitectures } = useScreenStore();

  const highlightedVersions = useMemo(() => {
    return currentArchitectures.map((arch) => arch.version);
  }, [currentArchitectures]);

  return (
    <S.Container>
      {Object.entries(MODELS).map(([groupName, groupModels]) => (
        <S.GroupContainer key={groupName}>
          <S.GroupTitle>{groupName}</S.GroupTitle>
          <S.GridWrapper>
            {Object.entries(groupModels).map(([version, model]) => (
              <S.GridItem
                key={version}
                $isHighlighted={highlightedVersions.includes(version)}
              >
                <S.ModelName>{model.name}</S.ModelName>
                <S.ModelVersion>{version}</S.ModelVersion>
              </S.GridItem>
            ))}
          </S.GridWrapper>
        </S.GroupContainer>
      ))}
    </S.Container>
  );
}
