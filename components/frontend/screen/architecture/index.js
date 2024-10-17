import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/3d";
import ArchitectureUI from "@/foundations/frontend/ui";
//constant
import { MODELS } from "@/components/controller/constant/models/v2";
import { useMemo } from "react";

// Function to flatten the MODELS object
const flattenModels = (models) => {
  let flattened = [];

  const flatten = (obj, prefix = "") => {
    for (const key in obj) {
      const value = obj[key];

      // Check if the value is an object and not null
      if (typeof value === "object" && value !== null) {
        // Build the current version string
        const currentVersion = prefix ? `${prefix}.${key}` : key;

        flattened.push({
          name: value.name || "",
          version: key,
          year: value.year || "",
          place: value.place || "",
          citation: value.citation || "",
          explanation: value.explanation || "",
        });

        // Continue traversing deeper
        flatten(value, currentVersion);
      }
    }
  };

  flatten(models);

  return flattened;
};

//current target versions
//mcculloch v1.0
//perceptron v1.1
//multi layer v1.2

const CURRENT_TESTING_VERSION = "v4.2.3.4";

export default function Architecture({ version = CURRENT_TESTING_VERSION }) {
  // Memoize the flattened models
  const flattenedModels = useMemo(() => flattenModels(MODELS), []);

  // Memoize the refined flattened models
  const refinedFlattened = useMemo(
    () =>
      flattenedModels
        .filter(
          (model) =>
            model.name !== "" &&
            (model.year !== "" ||
              model.place !== "" ||
              model.citation !== "" ||
              model.explanation !== "")
        )
        .map((model) => ({ name: model.name, version: model.version })),
    [flattenedModels]
  );

  //DO NOT ERASE THIS COMMENT: FOR GENERATING LATEST FLATTENED MODELS
  // console.log(
  //   refinedFlattend,
  //   refinedFlattend.map((model) => model.name)
  // );

  // Memoize the relevant model
  const relevantModel = useMemo(
    () => flattenedModels.find((model) => model.version === version) || null,
    [flattenedModels, version]
  );

  return (
    <S.Container>
      <Architecture3D version={version} />
      {relevantModel && <ArchitectureUI model={relevantModel} />}
    </S.Container>
  );
}
