// Color conversion utilities

/**
 * Convert HSV to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} v - Value (0-1)
 * @returns {object} RGB values {r, g, b} (0-255)
 */
export function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Convert RGB to hex string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Calculate color similarity using Euclidean distance in RGB space
 * @param {object} color1 - First color {r, g, b}
 * @param {object} color2 - Second color {r, g, b}
 * @returns {number} Similarity percentage (0-100)
 */
export function calculateColorSimilarity(color1, color2) {
  const distance = Math.sqrt(
    Math.pow(color2.r - color1.r, 2) +
    Math.pow(color2.g - color1.g, 2) +
    Math.pow(color2.b - color1.b, 2)
  );
  
  // Maximum possible distance in RGB space is sqrt(255^2 + 255^2 + 255^2) ≈ 441
  const maxDistance = Math.sqrt(255 * 255 * 3);
  const similarity = 100 - (distance / maxDistance) * 100;
  
  return Math.max(0, Math.min(100, similarity));
}

/**
 * Generate a random RGB color that exists in the color wheel
 * The color wheel has: hue (0-360°), saturation (0-1), value (always 1)
 * @returns {object} Random color {r, g, b}
 */
export function generateRandomColor() {
  // Generate random hue (0-360 degrees)
  const hue = Math.random() * 360;
  
  // Generate random saturation (0-1)
  const saturation = Math.random();
  
  // Value is always 1 in our color wheel (maximum brightness)
  const value = 1;
  
  // Convert HSV to RGB
  return hsvToRgb(hue, saturation, value);
}

/**
 * Convert canvas click coordinates to HSV values
 * @param {number} x - X coordinate relative to canvas center
 * @param {number} y - Y coordinate relative to canvas center
 * @param {number} radius - Radius of the color wheel
 * @returns {object} HSV values {h, s, v} or null if outside wheel
 */
export function coordsToHsv(x, y, radius) {
  const distance = Math.sqrt(x * x + y * y);
  
  // Check if click is outside the circle
  if (distance > radius) {
    return null;
  }
  
  // Calculate hue from angle
  let hue = Math.atan2(y, x) * (180 / Math.PI);
  if (hue < 0) hue += 360;
  
  // Calculate saturation from distance to center
  const saturation = distance / radius;
  
  // Value is always 1 for maximum brightness
  const value = 1;
  
  return { h: hue, s: saturation, v: value };
}

/**
 * Get accuracy badge text and class based on accuracy percentage
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @returns {object} Badge info {text, className}
 */
export function getAccuracyBadge(accuracy) {
  if (accuracy >= 95) {
    return { text: 'Perfect!', className: 'accuracy-perfect' };
  } else if (accuracy >= 85) {
    return { text: 'Excellent', className: 'accuracy-excellent' };
  } else if (accuracy >= 70) {
    return { text: 'Great', className: 'accuracy-great' };
  } else if (accuracy >= 50) {
    return { text: 'Good', className: 'accuracy-good' };
  } else {
    return { text: 'Keep Trying', className: 'accuracy-poor' };
  }
}

/**
 * Get ranking badge class based on position
 * @param {number} position - Position in leaderboard (1-based)
 * @returns {string} CSS class name
 */
export function getRankingBadgeClass(position) {
  if (position === 1) return 'ranking-gold';
  if (position === 2) return 'ranking-silver';
  if (position === 3) return 'ranking-bronze';
  return 'ranking-default';
}
