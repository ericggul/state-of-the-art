import Papa from "papaparse";

export async function readCsv(fileUrl) {
  const response = await fetch(fileUrl);
  const text = await response.text();
  const { data } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // Automatically converts numerical values
  });
  return data;
}
