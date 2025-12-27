import { Injectable } from '@angular/core';
import { ZOOM_LEVEL_BUFFERS, ZoomLevel } from '../../../shared/constants/app.constants';

/**
 * Service for timeline-specific business logic
 */
@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  /**
   * Calculate column width based on zoom level
   */
  calculateColumnWidth(zoomLevel: ZoomLevel, containerWidth: number, dateRange: number): number {
    // This will be implemented based on the actual timeline requirements
    // For now, return a placeholder calculation
    const baseWidth = containerWidth / dateRange;

    switch (zoomLevel) {
      case 'day':
        return baseWidth;
      case 'week':
        return baseWidth * 7;
      case 'month':
        return baseWidth * 30;
      default:
        return baseWidth;
    }
  }

  /**
   * Get the date range for a given zoom level
   */
  getDateRange(zoomLevel: ZoomLevel): { start: Date, end: Date } {
    const buffer = ZOOM_LEVEL_BUFFERS[zoomLevel];
    const today = new Date();
    const start = new Date(today.getTime() - buffer);
    const end = new Date(today.getTime() + buffer);
    return { start, end };
  }
}
