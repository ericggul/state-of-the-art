import * as S from "./styles";
import Architecture3D from "@/foundations/frontend/archi-3d/v4";
import ArchitectureUI from "@/foundations/frontend/archi-ui";
//constant
import { MODELS } from "@/components/controller/constant/models/v2";

import { useState, useEffect } from "react";

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

//lenet v3.1.1
//lenet5 v3.1.2
//alexnet v3.2.1
//vgg v3.2.2
//transformer v4.2
//gpt v4.2.3.1

const CURRENT_TESTING_VERSION = "v4.2.3.1";
const VERSION_TO_MORPH = "v3.2.2";

export default function Architecture({ version = "v4.0.2.1" }) {
  // Flatten the MODELS object
  const flattenedModels = flattenModels(MODELS);
  const refinedFlattend = flattenedModels
    .filter(
      (model) =>
        model.name !== "" &&
        (model.year !== "" ||
          model.place !== "" ||
          model.citation !== "" ||
          model.explanation !== "")
    )
    .map((model) => ({ name: model.name, version: model.version }));

  console.log(
    refinedFlattend,
    refinedFlattend.map((model) => model.name)
  );

  // Find relevant model from the flattened array matching with the version
  const relevantModel =
    flattenedModels.find((model) => model.version === version) ||
    flattenedModels[2];

  const [testVersion, setTestVersion] = useState(CURRENT_TESTING_VERSION);
  const [styleIndex, setStyleIndex] = useState(0);

  //testing: every 5s change the version
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     //back and forth from two versions
  //     if (testVersion === CURRENT_TESTING_VERSION) {
  //       setTestVersion(VERSION_TO_MORPH);
  //     } else {
  //       setTestVersion(CURRENT_TESTING_VERSION);
  //     }
  //   }, 3000);
  //   return () => clearTimeout(timeout);
  // }, [testVersion]);

  return (
    <S.Container>
      <Architecture3D version={testVersion} styleIndex={styleIndex} />
      <ArchitectureUI model={relevantModel} />
    </S.Container>
  );
}
