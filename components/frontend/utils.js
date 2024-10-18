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
