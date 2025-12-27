import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { WorkCenterDocument } from '@/app/core/models/work-center.model';
import { WorkOrderDocument } from '@/app/core/models/work-order.model';
import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { DateColumn, DateRange } from '@/app/features/timeline/models/timeline.model';
import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  formatDate,
  getWeekNumber,
  differenceInDays,
} from '@/app/core/utils/date.utils';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-grid.html',
  styleUrls: ['./timeline-grid.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineGridComponent {
  // Signal inputs
  workCenters = input.required<WorkCenterDocument[]>();
  workOrders = input.required<WorkOrderDocument[]>();
  zoomLevel = input.required<ZoomLevel>();

  // Signal outputs
  workOrderSelected = output<WorkOrderDocument>();
  emptySlotClicked = output<{ workCenterId: string; date: Date }>();

  // Local state
  currentDate = signal<Date>(new Date());

  // Computed signals
  dateRange = computed<DateRange>(() => {
    return this.calculateDateRange(this.zoomLevel());
  });

  gridColumns = computed<DateColumn[]>(() => {
    return this.generateDateColumns(this.dateRange(), this.zoomLevel());
  });

  todayPosition = computed<number | null>(() => {
    const today = this.currentDate();
    const range = this.dateRange();
    const zoomLevel = this.zoomLevel();

    // Check if today is within the visible range
    if (today < range.start || today > range.end) {
      return null;
    }

    return this.calculateTodayPosition(today, range.start, zoomLevel);
  });

  // ViewChild references for scroll synchronization
  leftPanelRef = viewChild<ElementRef<HTMLDivElement>>('leftPanel');
  rightContentRef = viewChild<ElementRef<HTMLDivElement>>('rightContent');

  /**
   * Sync vertical scroll between left and right panels
   */
  onRightPanelScroll(event: Event): void {
    const leftPanel = this.leftPanelRef()?.nativeElement;
    const rightContent = this.rightContentRef()?.nativeElement;

    if (leftPanel && rightContent) {
      // Sync left panel scroll with right panel scroll
      leftPanel.scrollTop = rightContent.scrollTop;
    }
  }

  /**
   * Sync vertical scroll when left panel is scrolled
   */
  onLeftPanelScroll(event: Event): void {
    const leftPanel = this.leftPanelRef()?.nativeElement;
    const rightContent = this.rightContentRef()?.nativeElement;

    if (leftPanel && rightContent) {
      // Sync right panel scroll with left panel scroll
      rightContent.scrollTop = leftPanel.scrollTop;
    }
  }

  /**
   * Calculate date range based on zoom level
   * Day: today ± 7 days (14 days total)
   * Week: current week ± 3.5 weeks (8 weeks total)
   * Month: current month ± 2.5 months (6 months total)
   */
  private calculateDateRange(zoomLevel: ZoomLevel): DateRange {
    const today = this.currentDate();
    let start: Date;
    let end: Date;

    switch (zoomLevel) {
      case 'day':
        start = addDays(today, -7);
        end = addDays(today, 7);
        break;
      case 'week': {
        const currentWeekStart = startOfWeek(today);
        // Show 8 weeks: current week ± 3.5 weeks (4 weeks before, 4 weeks after)
        start = addWeeks(currentWeekStart, -4);
        end = addWeeks(currentWeekStart, 4);
        // Adjust end to include the full last week
        end = endOfWeek(end);
        break;
      }
      case 'month': {
        const currentMonthStart = startOfMonth(today);
        // Show 6 months: current month ± 2.5 months (3 months before, 3 months after)
        start = addMonths(currentMonthStart, -3);
        end = addMonths(currentMonthStart, 3);
        // Adjust end to include the full last month
        end = endOfMonth(end);
        break;
      }
    }

    return { start, end };
  }

  /**
   * Generate date columns based on date range and zoom level
   */
  private generateDateColumns(dateRange: DateRange, zoomLevel: ZoomLevel): DateColumn[] {
    const columns: DateColumn[] = [];
    let currentDate = new Date(dateRange.start);

    // Column widths based on zoom level
    const columnWidths: Record<ZoomLevel, number> = {
      day: 120,
      week: 140,
      month: 180,
    };

    const width = columnWidths[zoomLevel];

    switch (zoomLevel) {
      case 'day': {
        // Generate one column per day
        while (currentDate <= dateRange.end) {
          const label = formatDate(currentDate, 'ddd MM/DD');
          columns.push({
            date: new Date(currentDate),
            label,
            width,
          });
          currentDate = addDays(currentDate, 1);
        }
        break;
      }
      case 'week': {
        // Generate one column per week
        currentDate = startOfWeek(dateRange.start);
        while (currentDate <= dateRange.end) {
          const weekEnd = endOfWeek(currentDate);
          const weekNumber = getWeekNumber(currentDate);
          const startLabel = formatDate(currentDate, 'MMM DD');
          const endLabel = formatDate(weekEnd, 'MMM DD');
          const label = `Week ${weekNumber} (${startLabel} - ${endLabel})`;
          columns.push({
            date: new Date(currentDate),
            label,
            width,
          });
          currentDate = addWeeks(currentDate, 1);
        }
        break;
      }
      case 'month': {
        // Generate one column per month
        currentDate = startOfMonth(dateRange.start);
        while (currentDate <= dateRange.end) {
          const label = formatDate(currentDate, 'MMMM YYYY');
          columns.push({
            date: new Date(currentDate),
            label,
            width,
          });
          currentDate = addMonths(currentDate, 1);
        }
        break;
      }
    }

    return columns;
  }

  /**
   * Calculate pixel position of today indicator
   */
  private calculateTodayPosition(today: Date, startDate: Date, zoomLevel: ZoomLevel): number {
    const columnWidths: Record<ZoomLevel, number> = {
      day: 120,
      week: 140,
      month: 180,
    };

    const width = columnWidths[zoomLevel];

    switch (zoomLevel) {
      case 'day': {
        const daysDiff = differenceInDays(today, startDate);
        return daysDiff * width;
      }
      case 'week': {
        const startWeek = startOfWeek(startDate);
        const todayWeek = startOfWeek(today);
        const daysDiff = differenceInDays(todayWeek, startWeek);
        const weeksDiff = daysDiff / 7;
        // Position within the week (0-1)
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // Monday = 1, Sunday = 7
        const dayPosition = (dayOfWeek - 1) / 7;
        return (weeksDiff + dayPosition) * width;
      }
      case 'month': {
        const startMonth = startOfMonth(startDate);
        const todayMonth = startOfMonth(today);
        let monthsDiff = 0;
        let tempDate = new Date(startMonth);
        while (tempDate < todayMonth) {
          tempDate = addMonths(tempDate, 1);
          monthsDiff++;
        }
        // Position within the month (0-1)
        const dayOfMonth = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const dayPosition = (dayOfMonth - 1) / daysInMonth;
        return (monthsDiff + dayPosition) * width;
      }
    }
  }
}
