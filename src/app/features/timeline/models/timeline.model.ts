/**
 * Timeline-specific models
 */

export interface TimelineDateRange {
  start: Date;
  end: Date;
}

export interface TimelineColumn {
  date: Date;
  width: number;
  label: string;
}

/**
 * Date range for timeline calculations
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Date column definition for timeline grid
 */
export interface DateColumn {
  date: Date;
  label: string;
  width: number;
}
