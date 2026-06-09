/**
 * Sums up carbon emissions from energy, transport, and food sectors.
 * Enforces positive values and rounds the result to 2 decimal places.
 * Handles undefined, null, or missing inputs by defaulting them to 0.
 */
export const sumEmissions = (
  energy?: number | null,
  transport?: number | null,
  food?: number | null
): number => {
  const e = Math.max(0, Number(energy) || 0);
  const t = Math.max(0, Number(transport) || 0);
  const f = Math.max(0, Number(food) || 0);
  
  return parseFloat((e + t + f).toFixed(2));
};
