"use client";

import { useMemo } from "react";
import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import ArchitectureUI from "@/foundations/frontend/ui";
import { MODELS } from "@/components/controller/constant/models/v2";
import { flattenModels, filterAndRefineModels } from "./utils";

import useScreenStore from "@/components/screen/store";

const CURRENT_TESTING_VERSION = "v4.2.3.3";

export default function ScreenFrontend() {
  const { currentArchitectures } = useScreenStore();

  const version = useMemo(
    () =>
      currentArchitectures.length > 0
        ? currentArchitectures[0].version
        : CURRENT_TESTING_VERSION,
    [currentArchitectures]
  );

  return <Architecture version={version} />;
}

function Architecture({ version = CURRENT_TESTING_VERSION }) {
  const flattenedModels = useMemo(() => flattenModels(MODELS), []);
  const refinedFlattened = useMemo(
    () => filterAndRefineModels(flattenedModels),
    [flattenedModels]
  );
  const relevantModel = useMemo(
    () => flattenedModels.find((model) => model.version === version) || null,
    [flattenedModels, version]
  );

  // console.log(
  //   refinedFlattend,
  //   refinedFlattend.map((model) => model.name)
  // );

  return (
    <S.Container>
      <Architecture3D version={version} />
      {relevantModel && <ArchitectureUI model={relevantModel} />}
    </S.Container>
  );
}
