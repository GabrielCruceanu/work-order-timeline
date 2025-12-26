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
