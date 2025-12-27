import { Component, effect, inject, signal } from '@angular/core';
import { TimelineHeaderComponent } from './components/organisms/timeline-header/timeline-header';
import { TimelineGridComponent } from './components/organisms/timeline-grid/timeline-grid';
import { WorkOrderPanelComponent } from './components/organisms/work-order-panel/work-order-panel';
import { ZoomLevel } from '@/app/shared/constants/app.constants';
import { WorkCenterService } from '@/app/core/services/work-center.service';
import { WorkOrderService } from '@/app/core/services/work-order.service';
import { WorkOrderDocument } from '@/app/core/models/work-order.model';

/**
 * Main timeline component
 */
@Component({
  selector: 'app-timeline',
  imports: [TimelineHeaderComponent, TimelineGridComponent, WorkOrderPanelComponent],
  template: `
    <div class="timeline">
      <app-timeline-header [currentZoom]="zoomLevel()" (zoomChanged)="onZoomChanged($event)" />
      <app-timeline-grid
        [workCenters]="workCenterService.workCenters()"
        [workOrders]="workOrderService.workOrders()"
        [zoomLevel]="zoomLevel()"
        (workOrderEdit)="onWorkOrderEdit($event)"
      />
      <app-work-order-panel
        [isOpen]="isPanelOpen()"
        [mode]="panelMode()"
        [workOrder]="selectedWorkOrder()"
        [prefilledData]="prefilledPanelData()"
        [workCenters]="workCenterService.workCenters()"
        [existingWorkOrders]="workOrderService.workOrders()"
        (closePanel)="onPanelClose()"
        (saveWorkOrder)="onWorkOrderSave($event)"
        (deleteWorkOrder)="onWorkOrderDeleteFromPanel($event)"
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

  // Panel state signals
  isPanelOpen = signal(false);
  panelMode = signal<'create' | 'edit'>('create');
  selectedWorkOrder = signal<WorkOrderDocument | null>(null);
  prefilledPanelData = signal<{ workCenterId?: string; date?: Date } | null>(null);

  constructor() {
    // Initialize sample data
    this.workCenterService.initializeSampleData();
    this.workOrderService.initializeSampleData();
  }

  protected onZoomChanged(zoom: ZoomLevel) {
    this.zoomLevel.set(zoom);
  }

  // Handle edit from work order bar
  onWorkOrderEdit(workOrder: WorkOrderDocument) {
    this.selectedWorkOrder.set(workOrder);
    this.panelMode.set('edit');
    this.isPanelOpen.set(true);
  }

  // Handle save
  onWorkOrderSave(data: Partial<WorkOrderDocument>) {
    if (this.panelMode() === 'create' && data.data) {
      // Create new work order
      this.workOrderService.addWorkOrder({
        docId: this.generateId(),
        docType: 'workOrder',
        data: data.data,
      } as WorkOrderDocument);
    } else if (this.panelMode() === 'edit' && data.docId && data.data) {
      // Update existing work order
      this.workOrderService.updateWorkOrder(data.docId, data.data);
    }
    this.onPanelClose();
  }

  // Handle delete from panel
  onWorkOrderDeleteFromPanel(docId: string) {
    this.workOrderService.deleteWorkOrder(docId);
    this.onPanelClose();
  }

  // Close panel
  onPanelClose() {
    this.isPanelOpen.set(false);
    this.selectedWorkOrder.set(null);
    this.prefilledPanelData.set(null);
  }

  private generateId(): string {
    return `wo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
