export const formatArchitectureFromStructure = (structure) => {
  if (!structure || !Array.isArray(structure)) return [];

  // Helper to get base layer type without parameters
  const getBaseLayerType = (layer) => {
    const typeMatch = layer.name.match(/<(\w+)>/);
    return typeMatch ? typeMatch[1] : layer.type || "layer";
  };

  // Simplify the architecture into 3-6 main components
  const simplifyArchitecture = (layers) => {
    if (layers.length <= 6) return layers;

    // Always keep input and output
    const input = layers[0];
    const output = layers[layers.length - 1];

    // Group middle layers by type
    const middleLayers = layers.slice(1, -1);
    const groupedLayers = middleLayers.reduce((acc, layer) => {
      const type = getBaseLayerType(layer);
      if (!acc[type]) acc[type] = [];
      acc[type].push(layer);
      return acc;
    }, {});

    // Create simplified middle representation
    const simplifiedMiddle = Object.entries(groupedLayers).map(
      ([type, layers]) => ({
        name: `${type.toUpperCase()} Block`,
        type: type,
        count: layers.length,
      })
    );

    // Format the final layers
    const formatSimpleLayer = (layer) => {
      if (layer.count) {
        return `${layer.name} (×${layer.count})`;
      }
      return layer.name;
    };

    return [input, ...simplifiedMiddle, output].map(formatSimpleLayer);
  };

  const extractArchitecture = (layers) => {
    const detailedLayers = layers.map((layer) => layer.name).flat();

    return simplifyArchitecture(detailedLayers);
  };

  return extractArchitecture(structure);
};
