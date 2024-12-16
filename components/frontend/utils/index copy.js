import { getModelStructure } from "@/foundations/frontend/arch-models";
import { useState, useEffect, useRef } from "react";
import useDebounce from "@/utils/hooks/useDebounce";
import { getCategoryColor, getCategoryHue } from "./colors";

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
          category: value.category || "",
          hue: getCategoryHue(value.category, value.name || ""),
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
  const [modelName, setModelName] = useState(null);
  const [structure, setStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const prevArchRef = useRef();

  const debouncedModelName = useDebounce(modelName, debounceDelay);
  const debouncedStructure = useDebounce(structure, debounceDelay);

  // Start loading when architectures change
  useEffect(() => {
    if (
      currentArchitectures?.length > 0 &&
      currentArchitectures[0].name !== prevArchRef.current
    ) {
      setIsLoading(true);
      prevArchRef.current = currentArchitectures[0].name;

      const rawModelName = currentArchitectures[0].name;
      const formattedName = formatModelName(rawModelName);

      setModelName(formattedName);
      const modelStructure = getModelStructure(formattedName);

      if (modelStructure) {
        setStructure(modelStructure);
      } else {
        console.warn(
          `No model structure found for ${formattedName} (original: ${rawModelName})`
        );
        setStructure([]);
      }
    }
  }, [currentArchitectures]);

  return {
    visualization: {
      modelName: debouncedModelName,
      structure: debouncedStructure,
      isLoading,
    },
    modelName,
    structure,
    isLoading,
    setIsLoading, // Export this to allow ModelContainer to control loading state
  };
};
