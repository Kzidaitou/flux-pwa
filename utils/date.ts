/**
 * Date & Time Utility Functions
 */

// Format duration from a start timestamp (e.g., 120000ms -> 2 min)
export const formatDurationMins = (startTime: number): string => {
  if (!startTime) return '0 min'
  const minutes = Math.floor((Date.now() - startTime) / 60000)
  return `${minutes} min`
}

// Format Date to locale string
export const formatDateTime = (dateStr: string | number): string => {
  return new Date(dateStr).toLocaleString()
}
