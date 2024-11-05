import React, { useState, useEffect } from "react";
import { getModelStructure } from "@/foundations/frontend/arch-models";
import useScreenStore from "@/components/screen/store";

const formatModelName = (name) => {
  return name
    .replace(/\(([^)]+)\)/g, "_$1") // Keep the content inside parentheses
    .replace(/[- ]/g, "_") // Replace hyphens and spaces with underscores
    .replace(/\./g, "") // Remove periods
    .toUpperCase() // Convert to uppercase
    .trim() // Remove any leading/trailing spaces
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, "") // Remove leading/trailing underscores
    .replace(/[^A-Z0-9_]/g, ""); // Remove any remaining special characters
};

export default function TextComponent() {
  const { currentArchitectures } = useScreenStore();
  const [modelName, setModelName] = useState(null);
  const [structure, setStructure] = useState([]);

  useEffect(() => {
    if (currentArchitectures && currentArchitectures.length > 0) {
      const rawModelName = currentArchitectures[0].name;
      const formattedName = formatModelName(rawModelName);

      console.log("Raw name:", rawModelName);
      console.log("Formatted name:", formattedName);

      setModelName(formattedName);
      const modelStructure = getModelStructure(formattedName);

      if (modelStructure) {
        setStructure(modelStructure);
      } else {
        console.warn(
          `No model structure found for ${formattedName} (original: ${rawModelName})`
        );
      }
    }
  }, [currentArchitectures]);

  return <div>{/* Your component JSX */}</div>;
}
