import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/archi/3d/v1";
import ArchitectureUI from "@/foundations/frontend/archi/ui";
import { MODELS } from "@/components/controller/constant/models/v1";

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

export default function Architecture({ version = "v4.0.2.1" }) {
  // Flatten the MODELS object
  const flattenedModels = flattenModels(MODELS);
  const refinedFlattend = flattenedModels
    .filter((model) => model.name !== "")
    .map((model) => ({ name: model.name, version: model.version }));

  console.log(
    refinedFlattend,

    //array with only name
    refinedFlattend.map((model) => model.name)
  );
  // Find relevant model from the flattened array matching with the version
  const relevantModel =
    flattenedModels.find((model) => model.version === version) ||
    flattenedModels[2];

  return (
    <S.Container>
      <Architecture3D model={relevantModel} />
      <ArchitectureUI model={relevantModel} />
    </S.Container>
  );
}
