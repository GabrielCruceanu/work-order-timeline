import { Component, HostListener, inject, signal } from '@angular/core';
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
        (emptySlotClicked)="onEmptyCellClick($event)"
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

  // Handle empty cell click from grid
  onEmptyCellClick(data: { workCenterId: string; date: Date }) {
    // Set prefilled data for create panel
    this.prefilledPanelData.set({
      workCenterId: data.workCenterId,
      date: data.date,
    });

    // Open panel in create mode
    this.panelMode.set('create');
    this.selectedWorkOrder.set(null);
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

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Don't trigger if typing in input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // 'N' key - New work order
    if (event.key === 'n' || event.key === 'N') {
      if (!this.isPanelOpen()) {
        this.openCreatePanelWithDefaults();
        event.preventDefault();
      }
    }

    // 'ESC' key - Close panel
    if (event.key === 'Escape') {
      if (this.isPanelOpen()) {
        this.onPanelClose();
        event.preventDefault();
      }
    }
  }

  private openCreatePanelWithDefaults() {
    // Default to first work center and today
    const firstWorkCenter = this.workCenterService.workCenters()[0];
    if (!firstWorkCenter) return;

    this.prefilledPanelData.set({
      workCenterId: firstWorkCenter.docId,
      date: new Date(),
    });

    this.panelMode.set('create');
    this.selectedWorkOrder.set(null);
    this.isPanelOpen.set(true);
  }

  private generateId(): string {
    return `wo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
