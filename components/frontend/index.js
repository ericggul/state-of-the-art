"use client";

import { useMemo } from "react";
import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import ArchitectureUI from "@/foundations/frontend/ui";
import { MODELS } from "@/components/controller/constant/models/v3";
import { flattenModels, filterAndRefineModels } from "./utils";
import useDebounce from "@/utils/hooks/useDebounce";

import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "./utils";

const CURRENT_TESTING_VERSION = "v4.3.5";
const DEBOUNCE_DELAY = 1000; // 300ms delay, adjust as needed

export default function ScreenFrontend({ isTesting, initVersion = null }) {
  const { currentArchitectures } = useScreenStore();
  const { visualization } = useModelStructure(currentArchitectures);

  const version = currentArchitectures?.[0]?.version || initVersion;

  return (
    <S.Container>
      <Architecture3D
        version={version}
        isTesting={isTesting}
        modelName={visualization.modelName}
        structure={visualization.structure}
      />
      {currentArchitectures?.[0] && (
        <ArchitectureUI model={currentArchitectures[0]} />
      )}
    </S.Container>
  );
}
