/**
 * Format number to Indian Rupees (INR)
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the ₹ symbol (default: true)
 * @returns Formatted currency string
 */
export function formatINR(amount: number, includeSymbol: boolean = true): string {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  
  return includeSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format number to INR in thousands (K format)
 * @param amount - The amount to format
 * @returns Formatted currency string with K suffix
 */
export function formatINRK(amount: number): string {
  return `₹${(amount / 1000).toFixed(0)}K`;
}

/**
 * Format number to INR in lakhs (L format) - Indian number system
 * @param amount - The amount to format
 * @returns Formatted currency string with L suffix
 */
export function formatINRL(amount: number): string {
  return `₹${(amount / 100000).toFixed(2)}L`;
}
