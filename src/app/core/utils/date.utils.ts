/**
 * Date utility functions for timeline calculations
 */

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Add hours to a date
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return formatDateToISO(new Date());
}

/**
 * Check if two date ranges overlap
 */
export function dateRangesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Get the start of an hour
 */
export function startOfHour(date: Date): Date {
  const result = new Date(date);
  result.setMinutes(0, 0, 0);
  return result;
}

/**
 * Get the end of an hour
 */
export function endOfHour(date: Date): Date {
  const result = new Date(date);
  result.setMinutes(59, 59, 999);
  return result;
}

/**
 * Get the start of a day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of a day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Add weeks to a date
 */
export function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Get the start of the week (Monday)
 */
export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  result.setDate(diff);
  return startOfDay(result);
}

/**
 * Get the end of the week (Sunday)
 */
export function endOfWeek(date: Date): Date {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return endOfDay(result);
}

/**
 * Get the start of the month
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
}

/**
 * Get the end of the month
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
}

/**
 * Calculate difference in days between two dates
 */
export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const timeDiff = dateLeft.getTime() - dateRight.getTime();
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the difference in months between two dates
 *
 * Returns fractional months (e.g., 1.5 for 1 month and 15 days) to enable precise
 * positioning of work order bars in month view. This is critical for accurate
 * visual representation when work orders span partial months.
 *
 * Algorithm:
 * 1. Calculate whole months difference (years * 12 + months)
 * 2. Add fractional month based on day difference:
 *    - If daysDiff > 0: Add fraction based on days in the target month
 *    - If daysDiff < 0: Subtract fraction based on days in the source month
 *
 * Example:
 *   Jan 15 to Feb 20 = 1 month + 5 days = 1 + (5/28) ≈ 1.18 months
 *   Feb 20 to Jan 15 = -1 month - 5 days = -1 - (5/28) ≈ -1.18 months
 *
 * Note: Uses actual days in month (28/29/30/31) for accurate fractional calculation
 *
 * @param dateLeft - Later date (or date being positioned)
 * @param dateRight - Earlier date (or reference date)
 * @returns Positive value if dateLeft is after dateRight, negative if before
 */
export function differenceInMonths(dateLeft: Date, dateRight: Date): number {
  const yearsDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  const monthsDiff = dateLeft.getMonth() - dateRight.getMonth();
  const daysDiff = dateLeft.getDate() - dateRight.getDate();

  let totalMonths = yearsDiff * 12 + monthsDiff;

  // Add fractional month based on days for precise positioning
  // This accounts for variable month lengths (28-31 days)
  if (daysDiff > 0) {
    // Days are ahead: add fraction based on days in target month
    const daysInMonth = new Date(dateLeft.getFullYear(), dateLeft.getMonth() + 1, 0).getDate();
    totalMonths += daysDiff / daysInMonth;
  } else if (daysDiff < 0) {
    // Days are behind: subtract fraction based on days in source month
    const daysInMonth = new Date(dateRight.getFullYear(), dateRight.getMonth() + 1, 0).getDate();
    totalMonths += daysDiff / daysInMonth;
  }

  return totalMonths;
}

/**
 * Format date according to format string
 * Supports: 'MM/DD', 'MMM DD', 'MMMM YYYY', 'ddd MM/DD', 'Week W (MMM DD - MMM DD)'
 */
export function formatDate(date: Date, format: string): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthNamesFull = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (format === 'MM/DD') {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  }

  if (format === 'ddd MM/DD') {
    const dayName = dayNames[date.getDay()];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${dayName} ${month}/${day}`;
  }

  if (format === 'MMMM YYYY') {
    const month = monthNamesFull[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  if (format === 'MMM DD') {
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    return `${month} ${day}`;
  }

  // Default: return ISO format
  return formatDateToISO(date);
}

/**
 * Get week number of the year (ISO week)
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
