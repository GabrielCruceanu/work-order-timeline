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
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkCenterDocument } from '@/app/core/models/work-center.model';
import { WorkOrderDocument } from '@/app/core/models/work-order.model';
import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { DateColumn, DateRange } from '@/app/features/timeline/models/timeline.model';
import {
  addHours,
  addDays,
  addWeeks,
  addMonths,
  startOfHour,
  endOfHour,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  formatDate,
  getWeekNumber,
  differenceInDays,
} from '@/app/core/utils/date.utils';
import { WorkOrderBarComponent } from '@/app/features/timeline/components/molecules/work-order-bar/work-order-bar';

@Component({
  selector: 'app-timeline-grid',
  standalone: true,
  imports: [CommonModule, WorkOrderBarComponent, NgbTooltipModule],
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
  workOrderEdit = output<WorkOrderDocument>();
  emptySlotClicked = output<{ workCenterId: string; date: Date }>();

  // Local state
  currentDate = signal<Date>(new Date());

  // Computed signals
  dateRange = computed<DateRange>(() => {
    return this.calculateDateRange(this.zoomLevel());
  });

  gridColumns = computed<DateColumn[]>(() => {
    const zoom = this.zoomLevel();
    const range = this.dateRange();
    return this.generateDateColumns(range, zoom);
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

  // Computed signal for bars grouped by work center
  workOrdersByCenter = computed(() => {
    const orders = this.workOrders();
    const centers = this.workCenters();

    // Group orders by work center
    const grouped = new Map<string, WorkOrderDocument[]>();

    centers.forEach(center => {
      grouped.set(center.docId, []);
    });

    orders.forEach(order => {
      const centerId = order.data.workCenterId;
      const list = grouped.get(centerId);
      if (list) {
        list.push(order);
      }
    });

    return grouped;
  });

  // Computed signal for column width based on zoom level
  columnWidth = computed(() => {
    const zoom = this.zoomLevel();
    const columnWidths: Record<ZoomLevel, number> = {
      hour: 60,
      day: 120,
      week: 180,
      month: 180,
    };
    return columnWidths[zoom];
  });

  // ViewChild references for scroll synchronization
  leftPanelRef = viewChild<ElementRef<HTMLDivElement>>('leftPanel');
  rightContentRef = viewChild<ElementRef<HTMLDivElement>>('rightContent');

  /**
   * Scroll to today's position in the timeline
   * Centers today's date in the visible viewport
   */
  scrollToToday(): void {
    const todayPos = this.todayPosition();
    const rightContent = this.rightContentRef()?.nativeElement;

    if (todayPos !== null && rightContent) {
      // Calculate scroll position to center today in the viewport
      const containerWidth = rightContent.clientWidth;
      const scrollPosition = todayPos - containerWidth / 2;

      // Scroll smoothly to today's position
      rightContent.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });
    }
  }

  // Track function for @for loop to ensure proper updates when zoom changes
  trackColumn(column: DateColumn): string {
    return `${this.zoomLevel()}-${column.date.getTime()}-${column.width}`;
  }

  // Tooltip text
  readonly emptySlotTooltip = 'Click to create work order';

  /**
   * Sync vertical scroll between left and right panels
   * Also handles infinite scroll detection
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
      case 'hour': {
        // Show ±12 hours (24 hours total)
        start = addHours(today, -12);
        end = addHours(today, 12);
        break;
      }
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
      hour: 60,
      day: 120,
      week: 180, // Increased from 140 to accommodate full week labels
      month: 180,
    };

    const width = columnWidths[zoomLevel];

    switch (zoomLevel) {
      case 'hour': {
        // Generate one column per hour
        currentDate = startOfHour(dateRange.start);
        while (currentDate <= dateRange.end) {
          const hour = currentDate.getHours();
          const label = `${String(hour).padStart(2, '0')}:00`;
          columns.push({
            date: new Date(currentDate),
            label,
            width,
          });
          currentDate = addHours(currentDate, 1);
        }
        break;
      }
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
          // More compact format: "W48: Nov 24 - Nov 30"
          const label = `W${weekNumber}: ${startLabel} - ${endLabel}`;
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

  // Method to get orders for specific work center
  getOrdersForCenter(centerId: string): WorkOrderDocument[] {
    return this.workOrdersByCenter().get(centerId) || [];
  }

  // Handle bar events
  onWorkOrderEdit(workOrder: WorkOrderDocument) {
    this.workOrderEdit.emit(workOrder);
  }

  onWorkOrderDelete(workOrder: WorkOrderDocument) {
    // Delete is handled directly in the timeline component
    // This method can be used if needed for direct deletion
    console.log('Delete work order:', workOrder);
  }

  onWorkOrderClick(workOrder: WorkOrderDocument) {
    this.workOrderSelected.emit(workOrder);
  }

  /**
   * Handle click on timeline row (empty cell)
   */
  onTimelineRowClick(event: MouseEvent, workCenter: WorkCenterDocument) {
    // Check if click was on work order bar (ignore if so)
    const target = event.target as HTMLElement;
    if (target.closest('app-work-order-bar')) {
      return; // Don't create if clicking on existing bar
    }

    // Calculate click position
    const clickData = this.calculateClickPosition(event, workCenter);

    // Emit event
    this.emptySlotClicked.emit({
      workCenterId: clickData.workCenterId,
      date: clickData.date,
    });
  }

  /**
   * Calculate click position and determine date
   */
  private calculateClickPosition(
    event: MouseEvent,
    workCenter: WorkCenterDocument
  ): { workCenterId: string; date: Date } {
    // Get click position relative to timeline row
    const timelineRowElement = event.currentTarget as HTMLElement;
    const rect = timelineRowElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Calculate which date was clicked based on zoom level
    const date = this.pixelToDate(clickX);

    return {
      workCenterId: workCenter.docId,
      date,
    };
  }

  /**
   * Convert pixel position to date based on zoom level
   *
   * Algorithm:
   * 1. Calculate how many columns (hours/days/weeks/months) from the start date
   * 2. Add that offset to the start date
   * 3. Snap to appropriate boundary (hour start, week start, month start)
   * 4. Clamp to visible date range to prevent out-of-bounds dates
   *
   * Edge cases handled:
   * - Clicking before start date: returns start date
   * - Clicking after end date: returns end date
   * - Week/Month views: snaps to start of period for consistency
   *
   * @param pixelX - Horizontal pixel position relative to timeline row
   * @returns Date corresponding to the clicked position
   */
  private pixelToDate(pixelX: number): Date {
    const columnWidth = this.columnWidth();
    const zoomLevel = this.zoomLevel();
    const startDate = this.dateRange().start;
    const endDate = this.dateRange().end;

    let date: Date;

    switch (zoomLevel) {
      case 'hour': {
        // Each column = 1 hour = 60px
        // Calculate which hour was clicked by dividing pixel position by column width
        const hoursFromStart = Math.floor(pixelX / columnWidth);
        date = addHours(startDate, hoursFromStart);
        // Snap to start of hour (00:00) for consistency
        date = startOfHour(date);
        break;
      }
      case 'day': {
        // Each column = 1 day = 120px
        // Calculate which day was clicked
        const daysFromStart = Math.floor(pixelX / columnWidth);
        date = addDays(startDate, daysFromStart);
        // No snapping needed - day view already represents full days
        break;
      }

      case 'week': {
        // Each column = 1 week = 180px
        // Calculate which week was clicked
        const weeksFromStart = Math.floor(pixelX / columnWidth);
        date = addWeeks(startDate, weeksFromStart);
        // Snap to start of week (Monday) for consistency
        // This ensures clicking anywhere in a week column selects the week start
        date = startOfWeek(date);
        break;
      }

      case 'month': {
        // Each column = 1 month = 180px
        // Calculate which month was clicked
        const monthsFromStart = Math.floor(pixelX / columnWidth);
        date = addMonths(startDate, monthsFromStart);
        // Snap to start of month (1st day) for consistency
        // This ensures clicking anywhere in a month column selects the 1st
        date = startOfMonth(date);
        break;
      }

      default:
        date = new Date();
    }

    // Clamp to visible range to prevent dates outside the timeline
    // This handles edge cases where calculations might go slightly out of bounds
    if (date < startDate) date = new Date(startDate);
    if (date > endDate) date = new Date(endDate);

    return date;
  }

  /**
   * Calculate pixel position of today indicator line
   *
   * This method calculates where to draw the vertical "today" line on the timeline.
   * The calculation varies by zoom level:
   *
   * - Hour view: Calculate hours difference, multiply by hour column width
   * - Day view: Calculate days difference, multiply by day column width
   * - Week view: Calculate weeks difference + position within week (0-1), multiply by week column width
   * - Month view: Calculate months difference + position within month (0-1), multiply by month column width
   *
   * For week and month views, we need to account for the position WITHIN the period:
   * - Week: Which day of the week (Monday = 0, Sunday = 6/7)
   * - Month: Which day of the month (1st = 0, last day = ~1)
   *
   * @param today - Today's date
   * @param startDate - Start date of the visible timeline range
   * @param zoomLevel - Current zoom level
   * @returns Pixel position from the left edge of the timeline, or null if today is outside visible range
   */
  private calculateTodayPosition(today: Date, startDate: Date, zoomLevel: ZoomLevel): number {
    const columnWidths: Record<ZoomLevel, number> = {
      hour: 60,
      day: 120,
      week: 180, // Increased from 140 to match column width
      month: 180,
    };

    const width = columnWidths[zoomLevel];

    switch (zoomLevel) {
      case 'hour': {
        // Calculate exact hours difference (can be fractional)
        const hoursDiff = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff * width;
      }
      case 'day': {
        // Calculate whole days difference
        const daysDiff = differenceInDays(today, startDate);
        return daysDiff * width;
      }
      case 'week': {
        // Calculate which week today falls in
        const startWeek = startOfWeek(startDate);
        const todayWeek = startOfWeek(today);
        const daysDiff = differenceInDays(todayWeek, startWeek);
        const weeksDiff = daysDiff / 7;

        // Calculate position within the week (0 = Monday, 1 = Sunday)
        // Convert Sunday (0) to 7 for calculation, then normalize to 0-1 range
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // Monday = 1, Sunday = 7
        const dayPosition = (dayOfWeek - 1) / 7; // Normalize to 0-1 (Monday = 0, Sunday = ~0.857)

        // Total position = weeks offset + fractional position within week
        return (weeksDiff + dayPosition) * width;
      }
      case 'month': {
        // Calculate which month today falls in
        const startMonth = startOfMonth(startDate);
        const todayMonth = startOfMonth(today);
        let monthsDiff = 0;
        let tempDate = new Date(startMonth);

        // Count months by iterating (handles variable month lengths correctly)
        while (tempDate < todayMonth) {
          tempDate = addMonths(tempDate, 1);
          monthsDiff++;
        }

        // Calculate position within the month (0 = 1st, 1 = last day)
        const dayOfMonth = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const dayPosition = (dayOfMonth - 1) / daysInMonth; // Normalize to 0-1 range

        // Total position = months offset + fractional position within month
        return (monthsDiff + dayPosition) * width;
      }
    }
  }
}
