import { getModelStructure } from "@/foundations/frontend/arch-models";
import { useState, useEffect } from "react";
import useDebounce from "@/utils/hooks/useDebounce";

export const flattenModels = (models) => {
  let flattened = [];

  const flatten = (obj, prefix = "") => {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        const currentVersion = prefix ? `${prefix}.${key}` : key;
        flattened.push({
          name: value.name || "",
          version: key,
          year: value.year || "",
          place: value.place || "",
          citation: value.citation || "",
          explanation: value.explanation || "",
        });
        flatten(value, currentVersion);
      }
    }
  };

  flatten(models);
  return flattened;
};

export const filterAndRefineModels = (models) =>
  models
    .filter(
      (model) =>
        model.name !== "" &&
        (model.year !== "" ||
          model.place !== "" ||
          model.citation !== "" ||
          model.explanation !== "")
    )
    .map((model) => ({ name: model.name, version: model.version }));

export const filterModels = (models) =>
  models.filter(
    (model) =>
      model.name !== "" &&
      (model.year !== "" ||
        model.place !== "" ||
        model.citation !== "" ||
        model.explanation !== "")
  );

const formatModelName = (name) => {
  return name
    .replace(/\(([^)]+)\)/g, "_$1")
    .replace(/[- ]/g, "_")
    .replace(/\./g, "")
    .toUpperCase()
    .trim()
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .replace(/[^A-Z0-9_]/g, "");
};

export const useModelStructure = (
  currentArchitectures,
  debounceDelay = 1000
) => {
  const [rawModelName, setRawModelName] = useState(null);
  const [rawStructure, setRawStructure] = useState([]);

  const debouncedModelName = useDebounce(rawModelName, debounceDelay);
  const debouncedStructure = useDebounce(rawStructure, debounceDelay);

  useEffect(() => {
    if (currentArchitectures?.length > 0) {
      const tempModelName = currentArchitectures[0].name;
      const formattedName = formatModelName(tempModelName);

      setRawModelName(formattedName);
      const modelStructure = getModelStructure(formattedName) || [];

      setRawStructure(modelStructure);
    }
  }, [currentArchitectures]);

  return {
    visualization: {
      modelName: debouncedModelName,
      structure: debouncedStructure,
    },
    modelName: debouncedModelName,
    structure: debouncedStructure,
  };
};
