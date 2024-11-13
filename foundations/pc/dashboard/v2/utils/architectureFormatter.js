export const formatArchitectureFromStructure = (structure) => {
  if (!structure || !Array.isArray(structure)) return [];

  // Helper to get base layer type without parameters
  const getBaseLayerType = (layer) => {
    if (!layer) {
      return "unknown";
    }

    let type = "";

    if (typeof layer === "object") {
      type = layer.type || layer.name || "";
    } else if (typeof layer === "string") {
      type = layer;
    } else {
      return "unknown";
    }

    // Extract base type from type string
    const match = type.match(/([a-zA-Z]+)/);
    return match ? match[1].toLowerCase() : "unknown";
  };

  // Simplify the architecture into main components
  const simplifyArchitecture = (layers) => {
    if (!Array.isArray(layers)) {
      return ["Input", "Processing", "Output"];
    }

    const uniqueTypes = [];

    layers.forEach((layer) => {
      const baseType = getBaseLayerType(layer);

      if (
        baseType &&
        baseType !== "unknown" &&
        !uniqueTypes.includes(baseType)
      ) {
        uniqueTypes.push(baseType);
      }
    });

    return uniqueTypes.length > 0
      ? uniqueTypes
      : ["Input", "Processing", "Output"];
  };

  // Flatten nested layers if necessary
  const flattenLayers = (layers) => {
    let result = [];

    layers.forEach((layer) => {
      if (Array.isArray(layer)) {
        result = result.concat(flattenLayers(layer));
      } else {
        result.push(layer);
      }
    });

    return result;
  };

  // Extract architecture
  const extractArchitecture = (layers) => {
    const flatLayers = flattenLayers(layers);
    return simplifyArchitecture(flatLayers);
  };

  return extractArchitecture(structure);
};
