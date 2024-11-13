export const formatArchitectureFromStructure = (structure) => {
  if (!structure || !Array.isArray(structure)) return [];

  // Helper to get base layer type without parameters
  const getBaseLayerType = (layer) => {
    if (!layer || typeof layer !== "object") {
      return "unknown";
    }

    // Add null check before accessing layer.type
    const type = layer?.type || "";
    const match = type.match(/([a-zA-Z]+)/);
    return match ? match[1].toLowerCase() : "unknown";
  };

  // Simplify the architecture into 3-6 main components
  const simplifyArchitecture = (architecture) => {
    if (!Array.isArray(architecture)) {
      return ["Input", "Processing", "Output"];
    }

    return architecture.reduce((acc, layer) => {
      const baseType = getBaseLayerType(layer);
      if (baseType && !acc.includes(baseType)) {
        acc.push(baseType);
      }
      return acc;
    }, []);
  };

  const extractArchitecture = (layers) => {
    const detailedLayers = layers.map((layer) => layer.name).flat();

    return simplifyArchitecture(detailedLayers);
  };

  return extractArchitecture(structure);
};
