import type { SizeChartRow, SizeProfile } from "./types";

export interface SizeRecommendation {
  size: string;
  confidence: "high" | "medium" | "low";
  notes: string[];
}

// Ease allowance (cm) added to the body measurement estimate before matching the chart,
// so "regular" fit isn't skin-tight and "loose" isn't a tent.
const EASE_CM: Record<SizeProfile["fitPreference"], number> = {
  slim: 2,
  regular: 6,
  loose: 10,
};

/**
 * Extremely rough estimate of chest/waist/hip from height+weight+body shape.
 * This is explicitly a placeholder heuristic for the quiz mode — the UI must say
 * "this is an estimate" per the master brief. Real measurement comes from the
 * (not-yet-built) camera mode or the customer's own tape-measure input.
 */
function estimateBodyMeasurements(heightCm: number, weightKg: number, shape: SizeProfile["bodyShape"]) {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const baseWaist = bmi * 2.9;
  const shapeAdjust: Record<SizeProfile["bodyShape"], { chest: number; waist: number; hip: number }> = {
    rectangle: { chest: 0, waist: 0, hip: 0 },
    triangle: { chest: -2, waist: -1, hip: 4 },
    "inverted-triangle": { chest: 4, waist: 0, hip: -2 },
    oval: { chest: 2, waist: 6, hip: 2 },
    hourglass: { chest: 2, waist: -3, hip: 2 },
  };
  const adj = shapeAdjust[shape];

  return {
    chestCm: Math.round(baseWaist + 14 + adj.chest),
    waistCm: Math.round(baseWaist + adj.waist),
    hipCm: Math.round(baseWaist + 10 + adj.hip),
  };
}

export function recommendSize(profile: SizeProfile, chart: SizeChartRow[]): SizeRecommendation | null {
  if (!chart.length) return null;

  const estimate = estimateBodyMeasurements(profile.heightCm, profile.weightKg, profile.bodyShape);
  const ease = EASE_CM[profile.fitPreference];

  let best: { row: SizeChartRow; score: number } | null = null;
  for (const row of chart) {
    const score =
      Math.abs(row.chestCm - (estimate.chestCm + ease)) +
      Math.abs(row.waistCm - (estimate.waistCm + ease)) +
      Math.abs(row.hipCm - (estimate.hipCm + ease));
    if (!best || score < best.score) best = { row, score };
  }

  if (!best) return null;

  const notes: string[] = [];
  const confidence: SizeRecommendation["confidence"] = best.score < 8 ? "high" : best.score < 16 ? "medium" : "low";

  if (best.row.hipCm < estimate.hipCm + ease - 4) notes.push("May feel snug at the hips — consider sizing up.");
  if (best.row.chestCm > estimate.chestCm + ease + 6) notes.push("May run roomy through the chest.");
  if (confidence === "low") notes.push("Your measurements fall between sizes — check the full size chart to confirm.");

  return { size: best.row.size, confidence, notes };
}
