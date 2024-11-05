import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MODELS,
  LAYER_CONFIGS,
  getModelStructure,
} from "@/foundations/frontend/arch-models";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";

import {
  flattenModels,
  filterAndRefineModels,
} from "@/components/frontend/utils";
import useDebounce from "@/utils/hooks/useDebounce";

import { OBJECT_ARRAY } from "@/components/controller/constant/models/v3";

const CURRENT_TESTING_VERSION = "v4.3.5";

const DEBOUNCE_DELAY = 1000; // 300ms delay, adjust as needed

function convertToVariableName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, ""); // Remove leading and trailing underscores
}

// Utility function to map version to model name
function getModelNameFromVersion(version) {
  const model = OBJECT_ARRAY.find((item) => item.version === version);
  return model ? convertToVariableName(model.name) : null;
}

export default function TextVis() {
  const { currentArchitectures, isProjector } = useScreenStore();

  const version = useMemo(
    () =>
      currentArchitectures.length > 0
        ? currentArchitectures[0].version
        : CURRENT_TESTING_VERSION,
    [currentArchitectures]
  );

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

  console.log(debouncedVersion);

  const [modelName, setModelName] = useState("");
  const [structure, setStructure] = useState([]);

  useEffect(() => {
    const name = getModelNameFromVersion(version);
    if (name) {
      setModelName(name);
      const modelStructure = getModelStructure(name);
      setStructure(modelStructure);
    } else {
      console.warn(`No model found for version: ${version}`);
    }
  }, [version]);

  console.log(modelName, structure);

  return <S.Container></S.Container>;
}
