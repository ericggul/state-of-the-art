"use client";

import { useMemo } from "react";
import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import ArchitectureUI from "@/foundations/frontend/ui";
import { MODELS } from "@/components/controller/constant/models/v3";
import { flattenModels, filterAndRefineModels } from "./utils";
import useDebounce from "@/utils/hooks/useDebounce";

import useScreenStore from "@/components/screen/store";

const CURRENT_TESTING_VERSION = "v4.3.5";
const DEBOUNCE_DELAY = 1000; // 300ms delay, adjust as needed

export default function ScreenFrontend({ isTesting, initVersion = null }) {
  const { currentArchitectures, isProjector } = useScreenStore();

  const version = useMemo(
    () =>
      currentArchitectures.length > 0
        ? currentArchitectures[0].version
        : initVersion,
    [currentArchitectures, initVersion]
  );

  // console.log(version, currentArchitectures);

  return (
    <Architecture
      version={version}
      isTesting={isTesting}
      isProjector={isProjector}
    />
  );
}

function Architecture({
  version = CURRENT_TESTING_VERSION,
  isTesting,
  isProjector,
}) {
  const flattenedModels = useMemo(() => flattenModels(MODELS), []);
  const refinedFlattened = useMemo(
    () => filterAndRefineModels(flattenedModels),
    [flattenedModels]
  );
  const relevantModel = useMemo(
    () => flattenedModels.find((model) => model.version === version) || null,
    [flattenedModels, version]
  );

  const debouncedVersion = useDebounce(version, DEBOUNCE_DELAY);

  // console.log(
  //   refinedFlattened,
  //   refinedFlattened.map((model) => model.name)
  // );

  return (
    <S.Container>
      <Architecture3D version={debouncedVersion} isTesting={isTesting} />
      {relevantModel && isProjector && <ArchitectureUI model={relevantModel} />}
      {/* <S.Overlay /> */}
    </S.Container>
  );
}
