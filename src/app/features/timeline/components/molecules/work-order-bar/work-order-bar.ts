import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
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

  // Element reference for click outside detection
  private elementRef = inject(ElementRef);

  // Computed signals
  barPosition = computed(() => {
    return this.calculatePosition();
  });

  barStyles = computed(() => {
    const status = this.workOrder().data.status;
    return this.getStatusStyles(status);
  });

  // Methods
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
      case 'day':
        left = daysFromStart * columnWidth;
        width = durationDays * columnWidth;
        break;
      case 'week':
        left = (daysFromStart / 7) * columnWidth;
        width = (durationDays / 7) * columnWidth;
        break;
      case 'month': {
        const monthsFromStart = differenceInMonths(startDate, dateRangeStart);
        const monthsDuration = differenceInMonths(endDate, startDate);
        left = monthsFromStart * columnWidth;
        width = monthsDuration * columnWidth;
        break;
      }
    }

    // Add padding and enforce minimum width
    left += 4;
    width = Math.max(width - 8, 80); // Minimum 80px width

    return { left, width };
  }

  private getStatusStyles(status: WorkOrderStatus) {
    const styles = {
      open: { background: '#5659ff', border: '1px solid #4c51bf' },
      'in-progress': { background: '#6f42c1', border: '1px solid #5a34a1' },
      complete: { background: '#28a745', border: '1px solid #218838' },
      blocked: { background: '#ffc107', border: '1px solid #e0a800' },
    };
    return styles[status];
  }

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
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

    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.isMenuOpen.set(false);
    }
  }
}
