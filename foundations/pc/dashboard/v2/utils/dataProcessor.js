import { DEFAULT_MODEL } from "./constants";
import { readCsv } from "./readCsv";
import { getModelStructure } from "@/foundations/frontend/arch-models";
import { formatArchitectureFromStructure } from "./architectureFormatter";

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
      // If it's a string representation of an array
      if (field.startsWith("[") && field.endsWith("]")) {
        // Replace various types of quotes with standard double quotes
        const cleaned = field.replace(/[`'“”‘’]/g, '"');

        // Attempt to parse the cleaned string as JSON
        try {
          return JSON.parse(cleaned);
        } catch {
          // If JSON parsing fails, split the string manually
          return cleaned
            .slice(1, -1) // Remove outer [ ]
            .split(",")
            .map(
              (item) => item.trim().replace(/^"|"$/g, "") // Remove leading and trailing quotes
            );
        }
      }

      // For other string cases, attempt JSON parsing
      return JSON.parse(field);
    }

    // Return the field as-is if it's neither an array nor a string
    return field;
  } catch (error) {
    // Final fallback: split the string manually
    if (field.startsWith("[") && field.endsWith("]")) {
      return field
        .slice(1, -1)
        .split(",")
        .map(
          (item) =>
            item
              .trim()
              .replace(/[`'“”‘’]/g, "")
              .replace(/^"|"$/g, "") // Remove quotes
        );
    }
    return [];
  }
};

const convertCsvRowToModel = (row, modelName) => {
  if (!row) return null;

  const formattedName = formatModelName(modelName);
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
    images: {
      model: row.model_image,
      graph: row.graph_image,
    },
    architecture,
  };
};

export async function getModelData(currentArchitecture) {
  try {
    const csvData = await readCsv("/db/1113.csv");
    const matchingRow = csvData.find(
      (row) =>
        row.name === currentArchitecture.name &&
        row.version === currentArchitecture.version
    );

    if (matchingRow) {
      return convertCsvRowToModel(matchingRow, currentArchitecture.name);
    }

    return {
      ...DEFAULT_MODEL,
      id: currentArchitecture.version,
      name: currentArchitecture.name,
      architecture: getArchitectureData(currentArchitecture.name),
    };
  } catch (error) {
    return {
      ...DEFAULT_MODEL,
      id: currentArchitecture.version,
      name: currentArchitecture.name,
      architecture: getArchitectureData(currentArchitecture.name),
    };
  }
}
