import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { WorkOrderDocument, WorkOrderStatus } from '@/app/core/models/work-order.model';
import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { differenceInDays, differenceInMonths } from '@/app/core/utils/date.utils';
import { StatusBadgeComponent } from '@/app/shared/components/atoms/status-badge/status-badge';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './work-order-bar.html',
  styleUrls: ['./work-order-bar.scss'],
})
export class WorkOrderBarComponent {
  // Signal inputs
  workOrder = input.required<WorkOrderDocument>();
  columnWidth = input.required<number>();
  zoomLevel = input.required<ZoomLevel>();
  dateRangeStart = input.required<Date>();

  // Signal outputs
  editClicked = output<WorkOrderDocument>();
  deleteClicked = output<WorkOrderDocument>();
  barClicked = output<WorkOrderDocument>();

  // Local state
  isHovered = signal(false);
  isMenuOpen = signal(false);
  menuPosition = signal<{ top: number; right: number } | null>(null);

  // Element references
  private elementRef = inject(ElementRef);
  actionsButton = viewChild<HTMLButtonElement>('actionsButton');

  // Computed signals
  barPosition = computed(() => {
    return this.calculatePosition();
  });

  /**
   * Calculate the pixel position and width of the work order bar
   *
   * This method converts work order date ranges into pixel positions on the timeline.
   * The calculation varies by zoom level:
   *
   * - Hour view: Calculate hours from start, multiply by hour column width (60px)
   * - Day view: Calculate days from start, multiply by day column width (120px)
   * - Week view: Calculate weeks from start (days / 7), multiply by week column width (180px)
   * - Month view: Calculate months from start using differenceInMonths (handles variable month lengths),
   *               multiply by month column width (180px)
   *
   * The bar width represents the duration of the work order in the same units as the zoom level.
   *
   * Edge cases handled:
   * - Minimum width: Bars are always at least 80px wide for visibility and interaction
   * - Padding: 4px left padding, 8px total (4px left + 4px right) subtracted from width
   *
   * @returns Object with `left` (pixels from left edge) and `width` (pixels) properties
   */
  private calculatePosition(): { left: number; width: number } {
    const workOrder = this.workOrder();
    const startDate = new Date(workOrder.data.startDate);
    const endDate = new Date(workOrder.data.endDate);
    const dateRangeStart = this.dateRangeStart();
    const columnWidth = this.columnWidth();
    const zoomLevel = this.zoomLevel();

    const daysFromStart = differenceInDays(startDate, dateRangeStart);
    const durationDays = differenceInDays(endDate, startDate);

    let left: number;
    let width: number;

    switch (zoomLevel) {
      case 'hour': {
        // Calculate exact hours (can be fractional for precise positioning)
        const hoursFromStart = (startDate.getTime() - dateRangeStart.getTime()) / (1000 * 60 * 60);
        const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        left = hoursFromStart * columnWidth;
        width = durationHours * columnWidth;
        break;
      }
      case 'day':
        // Simple day-based calculation: each day = one column width
        left = daysFromStart * columnWidth;
        width = durationDays * columnWidth;
        break;
      case 'week':
        // Convert days to weeks (divide by 7) for week-based positioning
        // Each week column represents 7 days
        left = (daysFromStart / 7) * columnWidth;
        width = (durationDays / 7) * columnWidth;
        break;
      case 'month': {
        // Use differenceInMonths which handles variable month lengths correctly
        // This accounts for months with 28, 29, 30, or 31 days
        const monthsFromStart = differenceInMonths(startDate, dateRangeStart);
        const monthsDuration = differenceInMonths(endDate, startDate);
        left = monthsFromStart * columnWidth;
        width = monthsDuration * columnWidth;
        break;
      }
    }

    // Add 4px left padding for visual spacing
    left += 4;

    // Enforce minimum width of 80px for visibility and interaction
    // Subtract 8px total padding (4px left + 4px right) from calculated width
    width = Math.max(width - 8, 80);

    return { left, width };
  }

  toggleMenu() {
    const wasOpen = this.isMenuOpen();
    this.isMenuOpen.update(open => !open);

    if (!wasOpen && this.isMenuOpen()) {
      // Calculate position when opening menu
      setTimeout(() => {
        const button = this.actionsButton();
        if (button) {
          const rect = button.getBoundingClientRect();
          this.menuPosition.set({
            top: rect.bottom + 4, // 4px gap below button
            right: window.innerWidth - rect.right, // Align to button's right edge
          });
        }
      }, 0);
    } else {
      this.menuPosition.set(null);
    }
  }

  onEdit() {
    this.editClicked.emit(this.workOrder());
    this.isMenuOpen.set(false);
  }

  onDelete() {
    this.deleteClicked.emit(this.workOrder());
    this.isMenuOpen.set(false);
  }

  onBarClick(event: MouseEvent) {
    // Only emit if not clicking menu button
    if (!(event.target as HTMLElement).closest('.work-order-bar__menu-button')) {
      this.barClicked.emit(this.workOrder());
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.isMenuOpen()) return;

    const target = event.target as HTMLElement;
    const clickedInsideBar = this.elementRef.nativeElement.contains(target);
    const clickedInsideMenu = target.closest('.work-order-bar__actions-menu') !== null;

    if (!clickedInsideBar && !clickedInsideMenu) {
      this.isMenuOpen.set(false);
    }
  }
}
