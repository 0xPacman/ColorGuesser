import type { RGB, HSV, HSL } from '@/types';

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rNorm) h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
    else if (max === gNorm) h = ((bNorm - rNorm) / d + 2) / 6;
    else h = ((rNorm - gNorm) / d + 4) / 6;
  }

  return {
    h: h * 360,
    s: max === 0 ? 0 : d / max,
    v: max,
  };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rNorm) h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
    else if (max === gNorm) h = ((bNorm - rNorm) / d + 2) / 6;
    else h = ((rNorm - gNorm) / d + 4) / 6;
  }

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  return { h: h * 360, s, l };
}

export function calculateColorSimilarity(c1: RGB, c2: RGB): number {
  // Weighted Euclidean distance (human perception)
  const dr = c2.r - c1.r;
  const dg = c2.g - c1.g;
  const db = c2.b - c1.b;
  const distance = Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
  const maxDistance = Math.sqrt(0.3 * 255 * 255 + 0.59 * 255 * 255 + 0.11 * 255 * 255);
  return Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));
}

export function generateRandomColor(difficulty: 'easy' | 'medium' | 'hard' | 'extreme' = 'medium'): RGB {
  let hue = Math.random() * 360;
  let saturation: number;
  let value: number;

  switch (difficulty) {
    case 'easy':
      saturation = 0.5 + Math.random() * 0.5;
      value = 0.5 + Math.random() * 0.5;
      break;
    case 'medium':
      saturation = 0.3 + Math.random() * 0.7;
      value = 0.4 + Math.random() * 0.6;
      break;
    case 'hard':
      saturation = 0.15 + Math.random() * 0.85;
      value = 0.2 + Math.random() * 0.8;
      break;
    case 'extreme':
      saturation = Math.random() * 0.4 + 0.6;
      value = Math.random() * 0.4 + 0.6;
      hue = Math.random() * 60 + (Math.random() > 0.5 ? 0 : 180);
      break;
    default:
      saturation = 0.3 + Math.random() * 0.7;
      value = 0.4 + Math.random() * 0.6;
  }

  return hsvToRgb(hue, saturation, value);
}

export function coordsToHsv(x: number, y: number, radius: number): HSV | null {
  const distance = Math.sqrt(x * x + y * y);
  if (distance > radius) return null;

  let hue = Math.atan2(y, x) * (180 / Math.PI);
  if (hue < 0) hue += 360;

  return {
    h: hue,
    s: distance / radius,
    v: 1,
  };
}

export function getAccuracyBadge(accuracy: number): { text: string; color: string; emoji: string } {
  if (accuracy >= 99) return { text: 'PERFECT!', color: 'text-yellow-400', emoji: '👑' };
  if (accuracy >= 95) return { text: 'Amazing', color: 'text-yellow-300', emoji: '✨' };
  if (accuracy >= 90) return { text: 'Excellent', color: 'text-emerald-400', emoji: '🌟' };
  if (accuracy >= 80) return { text: 'Great', color: 'text-green-400', emoji: '🔥' };
  if (accuracy >= 70) return { text: 'Good', color: 'text-blue-400', emoji: '👍' };
  if (accuracy >= 50) return { text: 'Okay', color: 'text-orange-400', emoji: '😐' };
  if (accuracy >= 30) return { text: 'Close', color: 'text-orange-500', emoji: '🤔' };
  return { text: 'Keep Trying', color: 'text-red-400', emoji: '💪' };
}

export function getRankingBadge(position: number): { className: string; label: string } {
  if (position === 1) return { className: 'bg-yellow-500 text-black', label: '1st' };
  if (position === 2) return { className: 'bg-slate-300 text-black', label: '2nd' };
  if (position === 3) return { className: 'bg-amber-600 text-white', label: '3rd' };
  return { className: 'bg-white/10 text-white/60', label: `${position}th` };
}

export function getWarmthHint(target: RGB, guess: RGB): string {
  const targetHsv = rgbToHsv(target);
  const guessHsv = rgbToHsv(guess);

  const hueDiff = Math.abs(targetHsv.h - guessHsv.h);
  const satDiff = Math.abs(targetHsv.s - guessHsv.s);
  const valDiff = Math.abs(targetHsv.v - guessHsv.v);

  const maxDiff = Math.max(hueDiff / 360, satDiff, valDiff);

  if (maxDiff < 0.05) return 'Almost there!';
  if (maxDiff < 0.15) return 'Very close!';
  if (maxDiff < 0.3) return 'Getting warm';
  if (maxDiff < 0.5) return 'Room temperature';
  return 'Still cold...';
}

export function generateColorName(color: RGB): string {
  const hsl = rgbToHsl(color);
  const hue = hsl.h;
  const sat = hsl.s;
  const light = hsl.l;

  if (sat < 0.1) {
    if (light > 0.9) return 'White';
    if (light < 0.15) return 'Black';
    return 'Gray';
  }

  const hues = [
    { range: [345, 360], name: 'Red' },
    { range: [0, 15], name: 'Red' },
    { range: [15, 35], name: 'Orange' },
    { range: [35, 50], name: 'Yellow' },
    { range: [50, 70], name: 'Lime' },
    { range: [70, 140], name: 'Green' },
    { range: [140, 170], name: 'Cyan' },
    { range: [170, 200], name: 'Sky Blue' },
    { range: [200, 230], name: 'Blue' },
    { range: [230, 260], name: 'Indigo' },
    { range: [260, 290], name: 'Purple' },
    { range: [290, 320], name: 'Magenta' },
    { range: [320, 345], name: 'Pink' },
  ];

  const hueName = hues.find(h => hue >= h.range[0] && hue < h.range[1])?.name || 'Unknown';

  if (light > 0.8) return `Light ${hueName}`;
  if (light < 0.3) return `Dark ${hueName}`;
  if (sat < 0.4) return `Pale ${hueName}`;
  if (sat > 0.8) return `Vivid ${hueName}`;
  return hueName;
}
