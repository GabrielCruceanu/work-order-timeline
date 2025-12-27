import { Injectable, effect, signal } from '@angular/core';
import { WorkOrderDocument, WorkOrderStatus } from '../models/work-order.model';
import { generateSampleWorkOrders } from '../mocks/work-orders.mock';

/**
 * Service for managing work orders with localStorage persistence
 */
@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  // localStorage key for work orders
  private readonly STORAGE_KEY = 'work-order-timeline:workOrders';

  // Signal-based state management
  private _workOrders = signal<WorkOrderDocument[]>([]);
  readonly workOrders = this._workOrders.asReadonly();

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();

    // Automatically save to localStorage whenever work orders change
    effect(() => {
      const orders = this._workOrders();
      this.saveToStorage(orders);
    });
  }

  /**
   * Load work orders from localStorage
   * Falls back to sample data if localStorage is empty or invalid
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WorkOrderDocument[];
        // Validate that parsed data is an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._workOrders.set(parsed);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load work orders from localStorage:', error);
    }

    // Fallback to sample data if localStorage is empty or invalid
    this.initializeSampleData();
  }

  /**
   * Save work orders to localStorage
   */
  private saveToStorage(orders: WorkOrderDocument[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save work orders to localStorage:', error);
    }
  }

  /**
   * Initialize with sample work orders
   * This will also trigger localStorage save via effect()
   */
  initializeSampleData(): void {
    const sampleWorkOrders = generateSampleWorkOrders();
    this._workOrders.set(sampleWorkOrders);
  }

  /**
   * Clear all work orders and reset to sample data
   */
  resetToSampleData(): void {
    this.initializeSampleData();
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
