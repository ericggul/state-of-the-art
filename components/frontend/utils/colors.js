import { TYPE_STYLES } from "@/foundations/frontend/style/type-v6";

// Helper function to convert hex to HSL and extract hue
const hexToHue = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max === min) {
    return 0; // achromatic
  }

  const d = max - min;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
  }

  return Math.round(h * 60);
};

// Helper function to extract hue from color string
const extractHue = (colorString) => {
  if (!colorString) return null;

  // Check if it's a hex color
  if (colorString.startsWith("#")) {
    return hexToHue(colorString);
  }

  // Check if it's HSL/HSLA
  const hslMatch = colorString.match(/hsla?\((\d+)/);
  if (hslMatch) {
    return parseInt(hslMatch[1]);
  }

  // Try to handle RGB/RGBA by converting to HSL
  const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]) / 255;
    const g = parseInt(rgbMatch[2]) / 255;
    const b = parseInt(rgbMatch[3]) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max === min) {
      return 0; // achromatic
    }

    const d = max - min;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    return Math.round(h * 60);
  }

  return null;
};

// Get base hue from TYPE_STYLES for a given category
const getBaseHue = (category, modelName = "") => {
  if (!category) return null;

  // Special case for hopfield_boltzmann category
  if (category === "hopfield_boltzmann") {
    const nameLower = modelName.toLowerCase();
    if (nameLower.includes("hopfield")) {
      return extractHue(TYPE_STYLES.hopfield?.colors?.inner);
    }
    if (nameLower.includes("boltzmann")) {
      return extractHue(TYPE_STYLES.boltzmann?.colors?.inner);
    }
    // Fallback to hopfield if model name doesn't match
    return extractHue(TYPE_STYLES.hopfield?.colors?.inner);
  }

  const style = TYPE_STYLES[category];
  if (!style?.colors?.inner) return null;

  return extractHue(style.colors.inner);
};

// Category to hue mapping with fallbacks
export const getCategoryHue = (category, modelName = "") => {
  const baseHue = getBaseHue(category, modelName);

  return baseHue ?? 0; // Fallback to default hue if category not found
};

// Generate color with the extracted hue
export const getCategoryColor = (category, modelName = "") => {
  const hue = getCategoryHue(category, modelName);
  return `hsla(${hue}, 70%, 45%, 1)`;
};

// Utility function to convert any color to HSLA
export const toHSLA = (color, saturation = 70, lightness = 45, alpha = 1) => {
  const hue = extractHue(color);

  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
};
