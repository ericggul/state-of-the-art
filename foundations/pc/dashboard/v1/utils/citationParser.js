export class CitationParser {
  static parseAPA(citation) {
    try {
      const regex = /^(.+?)\s*\((\d{4})\)\.\s*([^\.]+)\.(.+)$/;
      const match = citation.match(regex);

      if (!match) {
        throw new Error("Invalid APA citation format");
      }

      const [_, authors, year, title, publication] = match;

      // Parse authors
      const authorList = authors
        .split(",")
        .map((author) => author.trim())
        .join(", ")
        .replace(/,([^,]*)$/, " &$1"); // Replace last comma with &

      return {
        authors: authorList,
        year: year,
        title: title.trim(),
        publication: publication.trim(),
        isValid: true,
      };
    } catch (error) {
      console.warn(`Citation parsing error: ${error.message}`);
      return {
        authors: "Unknown Author(s)",
        year: "n.d.",
        title: citation, // Use full citation as title for fallback
        publication: "",
        isValid: false,
      };
    }
  }

  static formatForDisplay(parsedCitation) {
    if (!parsedCitation.isValid) {
      return parsedCitation.title; // Return original citation if parsing failed
    }

    // Format for display while maintaining the same visual style
    return `${parsedCitation.title} - ${parsedCitation.authors} - ${parsedCitation.year}`;
  }
}
