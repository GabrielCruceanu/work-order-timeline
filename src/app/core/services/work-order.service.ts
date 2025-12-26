import { Injectable, signal } from '@angular/core';
import { WorkOrderDocument, WorkOrderStatus } from '../models/work-order.model';

/**
 * Service for managing work orders
 */
@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  // Signal-based state management
  private _workOrders = signal<WorkOrderDocument[]>([]);
  readonly workOrders = this._workOrders.asReadonly();

  /**
   * Initialize with sample work orders
   */
  initializeSampleData(): void {
    const today = new Date();
    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    const sampleWorkOrders: WorkOrderDocument[] = [
      {
        docId: 'wo-001',
        docType: 'workOrder',
        data: {
          name: 'Order Alpha',
          workCenterId: 'wc-001',
          status: 'complete',
          startDate: formatDate(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-002',
        docType: 'workOrder',
        data: {
          name: 'Order Beta',
          workCenterId: 'wc-002',
          status: 'in-progress',
          startDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-003',
        docType: 'workOrder',
        data: {
          name: 'Order Gamma',
          workCenterId: 'wc-003',
          status: 'open',
          startDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-004',
        docType: 'workOrder',
        data: {
          name: 'Order Delta',
          workCenterId: 'wc-004',
          status: 'blocked',
          startDate: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-005',
        docType: 'workOrder',
        data: {
          name: 'Order Epsilon',
          workCenterId: 'wc-001',
          status: 'open',
          startDate: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-006',
        docType: 'workOrder',
        data: {
          name: 'Order Zeta',
          workCenterId: 'wc-003',
          status: 'in-progress',
          startDate: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-007',
        docType: 'workOrder',
        data: {
          name: 'Order Eta',
          workCenterId: 'wc-005',
          status: 'complete',
          startDate: formatDate(new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
        },
      },
      {
        docId: 'wo-008',
        docType: 'workOrder',
        data: {
          name: 'Order Theta',
          workCenterId: 'wc-002',
          status: 'open',
          startDate: formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)),
          endDate: formatDate(new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000)),
        },
      },
    ];

    this._workOrders.set(sampleWorkOrders);
  }

  /**
   * Get work orders by work center ID
   */
  getWorkOrdersByWorkCenterId(workCenterId: string): WorkOrderDocument[] {
    return this._workOrders().filter(
      (wo: WorkOrderDocument) => wo.data.workCenterId === workCenterId
    );
  }

  /**
   * Get work order by ID
   */
  getWorkOrderById(docId: string): WorkOrderDocument | undefined {
    return this._workOrders().find((wo: WorkOrderDocument) => wo.docId === docId);
  }

  /**
   * Add a new work order
   */
  addWorkOrder(workOrder: WorkOrderDocument): void {
    this._workOrders.update((orders: WorkOrderDocument[]) => [...orders, workOrder]);
  }

  /**
   * Update an existing work order
   */
  updateWorkOrder(docId: string, updates: Partial<WorkOrderDocument['data']>): void {
    this._workOrders.update((orders: WorkOrderDocument[]) =>
      orders.map((order: WorkOrderDocument) =>
        order.docId === docId ? { ...order, data: { ...order.data, ...updates } } : order
      )
    );
  }

  /**
   * Delete a work order
   */
  deleteWorkOrder(docId: string): void {
    this._workOrders.update((orders: WorkOrderDocument[]) =>
      orders.filter((order: WorkOrderDocument) => order.docId !== docId)
    );
  }

  /**
   * Check if a work order overlaps with existing orders on the same work center
   */
  hasOverlap(
    workCenterId: string,
    startDate: string,
    endDate: string,
    excludeDocId?: string
  ): boolean {
    const orders = this.getWorkOrdersByWorkCenterId(workCenterId).filter(
      order => order.docId !== excludeDocId
    );

    return orders.some(order => {
      const orderStart = new Date(order.data.startDate);
      const orderEnd = new Date(order.data.endDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      // Check if date ranges overlap: start1 < end2 && start2 < end1
      return newStart < orderEnd && orderStart < newEnd;
    });
  }
}
