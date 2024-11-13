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
    .replace(/[- ]/g, "") // Remove spaces and hyphens
    .replace(/\./g, "") // Remove periods
    .replace(/[^A-Za-z0-9]/g, "") // Remove any other special characters
    .toUpperCase() // Convert to uppercase
    .trim(); // Remove whitespace
};

const getArchitectureData = (modelName) => {
  const formattedName = formatModelName(modelName);
  console.log("Looking up architecture for:", formattedName);

  const modelStructure = getModelStructure(formattedName);
  return modelStructure
    ? formatArchitectureFromStructure(modelStructure)
    : DEFAULT_MODEL.architecture;
};

// Helper to safely parse array strings from CSV
const parseArrayField = (field) => {
  if (!field || field === "") return [];
  try {
    // Handle both string arrays and actual arrays
    if (typeof field === "string") {
      // Replace single quotes with double quotes
      const cleaned = field.replace(/'/g, '"');
      return JSON.parse(cleaned);
    }
    return field;
  } catch (error) {
    console.warn("Failed to parse array field:", field);
    return [];
  }
};

const convertCsvRowToModel = (row, modelName) => {
  if (!row) return null;

  // Get architecture data
  const formattedName = formatModelName(modelName);
  const modelStructure = getModelStructure(formattedName);
  const architecture = modelStructure
    ? formatArchitectureFromStructure(modelStructure)
    : DEFAULT_MODEL.architecture;

  // Process arrays
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

  // Parse arrays safely
  let labels = [],
    data = [];
  try {
    labels = row.labels ? JSON.parse(row.labels.replace(/'/g, '"')) : [];
    data = row.data ? JSON.parse(row.data.replace(/'/g, '"')) : [];
  } catch (error) {
    console.warn("Error parsing performance data:", error);
  }

  // Debug log
  console.log("Processing CSV row:", row);

  return {
    id: row.version || currentArchitecture.version,
    name: row.name,
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
      metric: row.metric,
      yAxisLabel: row.yAxisLabel,
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
    console.log("Current Architecture:", currentArchitecture); // Debug log

    const csvData = await readCsv("/db/1113.csv");
    console.log("CSV Data:", csvData); // Debug log

    const matchingRow = csvData.find(
      (row) =>
        row.name === currentArchitecture.name &&
        row.version === currentArchitecture.version
    );

    console.log("Matching Row:", matchingRow); // Debug log

    if (matchingRow) {
      const processedModel = convertCsvRowToModel(
        matchingRow,
        currentArchitecture.name
      );
      console.log("Processed Model:", processedModel); // Debug log
      return processedModel;
    }

    // Fallback to default with current architecture
    return {
      ...DEFAULT_MODEL,
      id: currentArchitecture.version,
      name: currentArchitecture.name,
      architecture: getArchitectureData(currentArchitecture.name),
    };
  } catch (error) {
    console.error("Error processing model data:", error);
    return {
      ...DEFAULT_MODEL,
      id: currentArchitecture.version,
      name: currentArchitecture.name,
      architecture: getArchitectureData(currentArchitecture.name),
    };
  }
}
