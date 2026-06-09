import { sumEmissions } from '../src/utils/emissions';

describe('Emissions Sum Utility Tests', () => {
  it('should accurately sum positive emission categories and round to 2 decimals', () => {
    expect(sumEmissions(5.4, 8.2, 3.5)).toBe(17.1);
    expect(sumEmissions(10.125, 20.556, 5.211)).toBe(35.89);
  });

  it('should safely handle zero or empty (null/undefined) inputs by defaulting them to 0', () => {
    expect(sumEmissions(0, 0, 0)).toBe(0);
    expect(sumEmissions(undefined, null, undefined)).toBe(0);
    expect(sumEmissions(12.35, undefined, null)).toBe(12.35);
  });

  it('should prevent negative values by clamping them to 0 before summing', () => {
    expect(sumEmissions(-10.5, 8.25, -3.5)).toBe(8.25);
    expect(sumEmissions(-50, -20.5, -5.2)).toBe(0);
  });
});
