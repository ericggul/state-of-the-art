import { TYPE_STYLES } from "@/foundations/frontend/style/type-v4";

// Helper function to extract hue from hsl/hsla string
const extractHue = (hslString) => {
  const match = hslString.match(/hsl\((\d+)/);
  return match ? parseInt(match[1]) : null;
};

// Get base hue from TYPE_STYLES for a given category
const getBaseHue = (category) => {
  if (!category) return null;

  const style = TYPE_STYLES[category];
  if (!style?.colors?.inner) return null;

  // Extract hue from the inner color (most consistent color definition)
  return extractHue(style.colors.inner);
};

// Category to hue mapping with fallbacks
export const getCategoryHue = (category) => {
  const baseHue = getBaseHue(category);

  if (baseHue !== null) {
    return baseHue;
  }

  // Fallback to default hue if category not found
  return 0;
};

// Generate color with the extracted hue
export const getCategoryColor = (category) => {
  const hue = getCategoryHue(category);
  return `hsla(${hue}, 70%, 45%, 1)`;
};
