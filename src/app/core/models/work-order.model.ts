import { BaseDocument } from './base.model';

/**
 * Work Order Status types
 */
export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

/**
 * Work Order Document
 * Represents a scheduled work order on a specific work center
 */
export interface WorkOrderDocument extends BaseDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string; // References WorkCenterDocument.docId
    status: WorkOrderStatus;
    startDate: string; // ISO format (e.g., "2025-01-15")
    endDate: string; // ISO format
  };
}
