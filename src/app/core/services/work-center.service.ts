import { Injectable, effect, signal } from '@angular/core';
import { WorkCenterDocument } from '../models/work-center.model';

/**
 * Service for managing work centers with localStorage persistence
 */
@Injectable({
  providedIn: 'root',
})
export class WorkCenterService {
  // localStorage key for work centers
  private readonly STORAGE_KEY = 'work-order-timeline:workCenters';

  // Signal-based state management
  private _workCenters = signal<WorkCenterDocument[]>([]);
  readonly workCenters = this._workCenters.asReadonly();

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();

    // Automatically save to localStorage whenever work centers change
    effect(() => {
      const centers = this._workCenters();
      this.saveToStorage(centers);
    });
  }

  /**
   * Load work centers from localStorage
   * Falls back to sample data if localStorage is empty or invalid
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WorkCenterDocument[];
        // Validate that parsed data is an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._workCenters.set(parsed);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load work centers from localStorage:', error);
    }

    // Fallback to sample data if localStorage is empty or invalid
    this.initializeSampleData();
  }

  /**
   * Save work centers to localStorage
   */
  private saveToStorage(centers: WorkCenterDocument[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(centers));
    } catch (error) {
      console.error('Failed to save work centers to localStorage:', error);
    }
  }

  /**
   * Initialize with sample work centers
   * This will also trigger localStorage save via effect()
   */
  initializeSampleData(): void {
    const sampleWorkCenters: WorkCenterDocument[] = [
      {
        docId: 'wc-001',
        docType: 'workCenter',
        data: { name: 'Extrusion Line A' },
      },
      {
        docId: 'wc-002',
        docType: 'workCenter',
        data: { name: 'CNC Machine 1' },
      },
      {
        docId: 'wc-003',
        docType: 'workCenter',
        data: { name: 'Assembly Station' },
      },
      {
        docId: 'wc-004',
        docType: 'workCenter',
        data: { name: 'Quality Control' },
      },
      {
        docId: 'wc-005',
        docType: 'workCenter',
        data: { name: 'Packaging Line' },
      },
    ];

    this._workCenters.set(sampleWorkCenters);
  }

  /**
   * Clear all work centers and reset to sample data
   */
  resetToSampleData(): void {
    this.initializeSampleData();
  }

  /**
   * Get work center by ID
   */
  getWorkCenterById(docId: string): WorkCenterDocument | undefined {
    return this._workCenters().find((wc: WorkCenterDocument) => wc.docId === docId);
  }

  /**
   * Add a new work center
   */
  addWorkCenter(workCenter: WorkCenterDocument): void {
    this._workCenters.update((centers: WorkCenterDocument[]) => [...centers, workCenter]);
  }
}
