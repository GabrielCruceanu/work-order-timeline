import { Injectable, signal } from '@angular/core';
import { WorkCenterDocument } from '../models/work-center.model';

/**
 * Service for managing work centers
 */
@Injectable({
  providedIn: 'root',
})
export class WorkCenterService {
  // Signal-based state management
  private _workCenters = signal<WorkCenterDocument[]>([]);
  readonly workCenters = this._workCenters.asReadonly();

  /**
   * Initialize with sample work centers
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
