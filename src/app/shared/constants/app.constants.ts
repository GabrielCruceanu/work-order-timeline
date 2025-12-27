/**
 * Application-wide constants
 */

export const APP_NAME = 'Work Order Timeline';

/**
 * Work order status options
 */
export const WORK_ORDER_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'blocked', label: 'Blocked' },
] as const;

/**
 * Timeline zoom levels
 */
export type ZoomLevel = 'hour' | 'day' | 'week' | 'month';

export const ZOOM_LEVELS: ZoomLevel[] = ['hour', 'day', 'week', 'month'];

/**
 * Default date range buffers for each zoom level
 */
export const ZOOM_LEVEL_BUFFERS = {
  hour: 1, // ±1 day
  day: 14, // ±2 weeks
  week: 60, // ±2 months
  month: 180, // ±6 months
} as const;
