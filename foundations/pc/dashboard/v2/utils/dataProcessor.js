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
    .replace(/[- ]/g, "_")
    .replace(/\./g, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .toUpperCase()
    .trim();
};

const convertCsvRowToModel = (row) => {
  if (!row) return null;

  // Get architecture data based on version prefix
  const versionPrefix = row.version.split(".")[0].replace("v", ""); // e.g., "v2" -> "2"
  const modelStructure = getModelStructure(
    `${formatModelName(row.name)}_V${versionPrefix}`
  );
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

  // Convert string arrays to actual arrays
  const labels = row.labels ? JSON.parse(row.labels.replace(/'/g, '"')) : [];
  const data = row.data ? JSON.parse(row.data.replace(/'/g, '"')) : [];

  return {
    id: row.version || null,
    category: row.category || null,
    name: row.name || null,
    year: row.year || null,
    paperName: row.paperName || null,
    authors: row.authors || null,
    institution: row.institution || null,
    paper: row.citations_APA || null,
    relatedPapers: relatedPapers,
    explanation: row.explanation || null,
    highlights: highlights,
    limitations: limitations,
    citations: row.citationsNumber ? parseFloat(row.citationsNumber) : null,
    performance: {
      metric: row.metric || null,
      yAxisLabel: row.yAxisLabel || null,
      labels: labels,
      data: data,
      format: row.format || null,
    },
    image: row.model_image || null,
    architecture,
  };
};

export async function getModelData(currentArchitecture) {
  try {
    const csvData = await readCsv("/db/1113.csv");

    if (!currentArchitecture) return DEFAULT_MODEL;

    // Find row by version (id)
    const matchingRow = csvData.find(
      (row) => row.version === currentArchitecture.version
    );

    if (matchingRow) {
      const processedModel = convertCsvRowToModel(matchingRow);
      return {
        ...DEFAULT_MODEL,
        ...processedModel,
      };
    }

    return DEFAULT_MODEL;
  } catch (error) {
    console.error("Error processing model data:", error);
    return DEFAULT_MODEL;
  }
}
