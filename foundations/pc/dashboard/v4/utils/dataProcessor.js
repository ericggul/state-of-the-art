import { DEFAULT_MODEL } from "./constants";
import { readCsv } from "./readCsv";
import { getModelStructure } from "@/foundations/frontend/arch-models";
import { formatArchitectureFromStructure } from "./architectureFormatter";
import { getCachedCsvData } from "./cache";

const processArrayFields = (row, fields) => {
  return fields.reduce((acc, field) => {
    if (!acc) acc = [];
    const value = row[field];
    if (value && value !== "") acc.push(value);
    return acc;
  }, []);
};

const formatModelName = (name) => {
  return name
    .replace(/[- ]/g, "")
    .replace(/\./g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .trim();
};

const getArchitectureData = (modelName) => {
  const formattedName = formatModelName(modelName);
  const modelStructure = getModelStructure(formattedName);
  return modelStructure
    ? formatArchitectureFromStructure(modelStructure)
    : DEFAULT_MODEL.architecture;
};

const parseArrayField = (field) => {
  if (!field || field === "") return [];

  try {
    if (Array.isArray(field)) return field;

    if (typeof field === "string") {
      let cleaned = field.trim();

      // Replace different quote styles with double quotes
      cleaned = cleaned.replace(/[`'“”‘’]/g, '"');

      // Handle edge cases with misplaced brackets or quotes
      if (!cleaned.startsWith("[")) cleaned = `[${cleaned}`;
      if (!cleaned.endsWith("]")) cleaned = `${cleaned}]`;

      // Attempt to parse the cleaned string
      try {
        return JSON.parse(cleaned);
      } catch (jsonError) {
        // Fallback: Split manually
        return cleaned
          .replace(/^\[|\]$/g, "") // Remove outer brackets
          .split(",")
          .map(
            (item) => item.trim().replace(/^"|"$/g, "") // Remove leading and trailing quotes
          );
      }
    }

    // Return the field as-is if it's neither an array nor a string
    return field;
  } catch (error) {
    console.error("Error parsing array field:", error);
    return [];
  }
};

const convertCsvRowToModel = (row, currentArchitecture) => {
  if (!row) return null;

  const formattedName = formatModelName(currentArchitecture.name);
  const modelStructure = getModelStructure(formattedName);
  const architecture = modelStructure
    ? formatArchitectureFromStructure(modelStructure)
    : DEFAULT_MODEL.architecture;

  const relatedPapers = processArrayFields(row, [
    "relatedPapers_1",
    "relatedPapers_1.1",
  ]);
  const highlights = processArrayFields(row, [
    "highlights-1",
    "highlights-2",
    "highlights-3",
  ]);
  const limitations = processArrayFields(row, [
    "limitations-1",
    "limitations-2",
    "limitations-3",
  ]);

  const labels = parseArrayField(row.labels);
  const data = parseArrayField(row.data);

  return {
    id: row.version || currentArchitecture.version,
    name: row.name?.replace(/'/g, ""),
    category: row.category,
    year: parseInt(row.year),
    authors: row.authors,
    institution: row.institution,
    paper: row.citations_APA,
    explanation: row.explanation,
    highlights,
    limitations,
    relatedPapers,
    citations: row.citationsNumber ? parseFloat(row.citationsNumber) : null,
    stats: {
      parameters: row.parameters || null,
      computeUsed: row.computeUsed || null,
      inferenceSpeed: row.inferenceSpeed || null,
      memoryUsage: row.memoryUsage || null,
      trainTime: row.trainTime || null,
      carbonFootprint: row.carbonFootprint || null,
    },
    performance: {
      metric: row.metric || "Accuracy",
      yAxisLabel: row.yAxisLabel || "Accuracy (%)",
      labels,
      data,
      format: row.format || "%",
    },
    image: row.model_image,
    architecture,
  };
};

export async function getModelData(currentArchitecture) {
  if (!currentArchitecture?.name) {
    console.error("Invalid currentArchitecture:", currentArchitecture);
    return DEFAULT_MODEL;
  }

  try {
    const csvData = await getCachedCsvData("/db/1122.csv");

    if (!csvData || csvData.length === 0) {
      console.error("No CSV data loaded");
      throw new Error("No CSV data available");
    }

    console.log(
      `Looking for model: ${currentArchitecture.name} (${currentArchitecture.version})`
    );

    const matchingRow = csvData.find(
      (row) =>
        row.name === currentArchitecture.name &&
        row.version === currentArchitecture.version
    );

    if (matchingRow) {
      return convertCsvRowToModel(matchingRow, currentArchitecture);
    }

    console.warn(`No matching data found for ${currentArchitecture.name}`);
    return {
      ...DEFAULT_MODEL,
      id: currentArchitecture.version,
      name: currentArchitecture.name,
      architecture: getArchitectureData(currentArchitecture.name),
    };
  } catch (error) {
    console.error("Error in getModelData:", error);
    return {
      ...DEFAULT_MODEL,
      id: currentArchitecture.version,
      name: currentArchitecture.name,
      architecture: getArchitectureData(currentArchitecture.name),
    };
  }
}
