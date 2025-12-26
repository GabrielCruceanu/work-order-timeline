import { BaseDocument } from './base.model';

/**
 * Work Center Document
 * Represents production lines, machines, or work areas where work orders are scheduled
 */
export interface WorkCenterDocument extends BaseDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}
