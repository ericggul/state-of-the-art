import { DEFAULT_MODEL } from "./constants";
import { readCsv } from "./readCsv";

const processArrayFields = (row, fields) => {
  return fields.reduce((acc, field) => {
    if (!acc) acc = [];
    const value = row[field];
    if (value && value !== "") acc.push(value);
    return acc;
  }, []);
};

const convertCsvRowToModel = (row) => {
  if (!row) return null;

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
  };
};

export async function getModelData(currentArchitecture) {
  try {
    // Read and parse CSV
    const csvData = await readCsv("/db/1113.csv");

    console.log(currentArchitecture, csvData);

    if (!currentArchitecture) return DEFAULT_MODEL;

    // Find matching model in CSV
    const matchingRow = csvData.find(
      (row) =>
        row.version === currentArchitecture.version &&
        row.name === currentArchitecture.name
    );

    if (matchingRow) {
      const processedModel = convertCsvRowToModel(matchingRow);
      return {
        ...DEFAULT_MODEL, // Fallback for any missing fields
        ...processedModel, // Override with actual data
      };
    }

    // Return default model if no match found
    return DEFAULT_MODEL;
  } catch (error) {
    console.error("Error processing model data:", error);
    return DEFAULT_MODEL;
  }
}
