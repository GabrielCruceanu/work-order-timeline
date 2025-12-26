/**
 * Validation utility functions
 */

/**
 * Validate that end date is after start date
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
}

/**
 * Validate that a date string is in ISO format (YYYY-MM-DD)
 */
export function isValidISODate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate that a string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}
