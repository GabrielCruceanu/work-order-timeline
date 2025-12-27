import { Component, effect, inject, signal } from '@angular/core';
import { TimelineHeaderComponent } from './components/organisms/timeline-header/timeline-header';
import { TimelineGridComponent } from './components/organisms/timeline-grid/timeline-grid';
import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { WorkCenterService } from '@/app/core/services/work-center.service';
import { WorkOrderService } from '@/app/core/services/work-order.service';

/**
 * Main timeline component
 */
@Component({
  selector: 'app-timeline',
  imports: [TimelineHeaderComponent, TimelineGridComponent],
  template: `
    <div class="timeline">
      <app-timeline-header [currentZoom]="zoomLevel()" (zoomChanged)="onZoomChanged($event)" />
      <app-timeline-grid
        [workCenters]="workCenterService.workCenters()"
        [workOrders]="workOrderService.workOrders()"
        [zoomLevel]="zoomLevel()"
      />
    </div>
  `,
  styles: [
    `
      .timeline {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }
    `,
  ],
})
export class TimelineComponent {
  protected workCenterService = inject(WorkCenterService);
  protected workOrderService = inject(WorkOrderService);

  zoomLevel = signal<ZoomLevel>('day');

  constructor() {
    // Initialize sample data
    this.workCenterService.initializeSampleData();
    this.workOrderService.initializeSampleData();
  }

  protected onZoomChanged(zoom: ZoomLevel) {
    this.zoomLevel.set(zoom);
  }
}
