export const formatArchitectureFromStructure = (structure) => {
  if (!structure || !Array.isArray(structure)) return [];

  const formatLayer = (layer) => {
    let formattedLayer = layer.name;

    // Add dimensions if available
    if (layer.dims) {
      formattedLayer += ` [${
        Array.isArray(layer.dims) ? layer.dims.join("×") : layer.dims
      }]`;
    }

    // Add type if available
    if (layer.type) {
      formattedLayer += ` <${layer.type}>`;
    }

    // Add parameters if available
    if (layer.params) {
      const paramStr = Object.entries(layer.params)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      formattedLayer += ` (${paramStr})`;
    }

    return formattedLayer;
  };

  const extractArchitecture = (layers) => {
    return layers
      .map((layer) => {
        const formatted = formatLayer(layer);
        if (layer.sublayers && layer.sublayers.length > 0) {
          return [formatted, ...extractArchitecture(layer.sublayers)].flat();
        }
        return formatted;
      })
      .flat();
  };

  return extractArchitecture(structure);
};
