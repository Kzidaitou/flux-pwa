/**
 * Formatting Utility Functions
 */

// Format currency (e.g., 12.5 -> $12.50)
export const formatCurrency = (amount: number, currency = '$'): string => {
  if (isNaN(amount)) return `${currency}0.00`
  return `${currency}${amount.toFixed(2)}`
}

// Format generic number (e.g., kWh)
export const formatKwh = (val: number): string => {
  return `${val.toFixed(2)} kWh`
}

// Format generic percentage
export const formatPercent = (val: number): string => {
  return `${Math.round(val)}%`
}
