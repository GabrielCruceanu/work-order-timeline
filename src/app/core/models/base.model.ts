/**
 * Base model interfaces for document structure
 * All documents follow this pattern: { docId, docType, data }
 */

export interface BaseDocument {
  docId: string;
  docType: string;
  data: Record<string, unknown>;
}
