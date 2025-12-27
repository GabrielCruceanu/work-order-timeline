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
      day: 120,
      week: 180,
      month: 180,
    };
    return columnWidths[zoom];
  });

  // ViewChild references for scroll synchronization
  leftPanelRef = viewChild<ElementRef<HTMLDivElement>>('leftPanel');
  rightContentRef = viewChild<ElementRef<HTMLDivElement>>('rightContent');

  // Track function for @for loop to ensure proper updates when zoom changes
  trackColumn(column: DateColumn): string {
    return `${this.zoomLevel()}-${column.date.getTime()}-${column.width}`;
  }

  // Tooltip text
  readonly emptySlotTooltip = 'Click to create work order';

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
      week: 180, // Increased from 140 to accommodate full week labels
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
   * Handles edge cases: boundaries, week/month snapping
   */
  private pixelToDate(pixelX: number): Date {
    const columnWidth = this.columnWidth();
    const zoomLevel = this.zoomLevel();
    const startDate = this.dateRange().start;
    const endDate = this.dateRange().end;

    let date: Date;

    switch (zoomLevel) {
      case 'day': {
        // Each column = 1 day = 120px
        const daysFromStart = Math.floor(pixelX / columnWidth);
        date = addDays(startDate, daysFromStart);
        break;
      }

      case 'week': {
        // Each column = 1 week = 180px
        const weeksFromStart = Math.floor(pixelX / columnWidth);
        date = addWeeks(startDate, weeksFromStart);
        // Snap to start of week
        date = startOfWeek(date);
        break;
      }

      case 'month': {
        // Each column = 1 month = 180px
        const monthsFromStart = Math.floor(pixelX / columnWidth);
        date = addMonths(startDate, monthsFromStart);
        // Snap to start of month
        date = startOfMonth(date);
        break;
      }

      default:
        date = new Date();
    }

    // Clamp to visible range
    if (date < startDate) date = new Date(startDate);
    if (date > endDate) date = new Date(endDate);

    return date;
  }

  /**
   * Calculate pixel position of today indicator
   */
  private calculateTodayPosition(today: Date, startDate: Date, zoomLevel: ZoomLevel): number {
    const columnWidths: Record<ZoomLevel, number> = {
      day: 120,
      week: 180, // Increased from 140 to match column width
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
