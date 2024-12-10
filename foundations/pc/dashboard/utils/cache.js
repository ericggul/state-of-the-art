import Papa from "papaparse";

let csvCache = null;
let lastUrl = null;

export const getCachedCsvData = async (fileUrl) => {
  // Reset cache if URL changes
  if (lastUrl !== fileUrl) {
    csvCache = null;
    lastUrl = fileUrl;
  }

  if (csvCache) {
    return csvCache;
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const { data } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    csvCache = data;
    return data;
  } catch (error) {
    console.error("Error loading CSV:", error);
    return [];
  }
};
