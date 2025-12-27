import { WorkOrderDocument, WorkOrderStatus } from '../models/work-order.model';

/**
 * Generate sample work orders for testing and development
 * @param today - The reference date (defaults to current date)
 * @returns Array of sample work order documents
 */
export function generateSampleWorkOrders(today: Date = new Date()): WorkOrderDocument[] {
  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  // Base sample work orders
  const baseWorkOrders: WorkOrderDocument[] = [
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

  // Generate 100 additional mock work orders (ensuring no overlaps with base orders)
  const additionalWorkOrders = generateAdditionalWorkOrders(today, formatDate, baseWorkOrders);

  return [...baseWorkOrders, ...additionalWorkOrders];
}

/**
 * Generate 100 additional mock work orders with varied data
 * Ensures no overlapping orders on the same work center
 */
function generateAdditionalWorkOrders(
  today: Date,
  formatDate: (date: Date) => string,
  baseOrders: WorkOrderDocument[] = []
): WorkOrderDocument[] {
  const workCenterIds = ['wc-001', 'wc-002', 'wc-003', 'wc-004', 'wc-005'];
  const statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];
  const greekLetters = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omicron',
    'Pi',
    'Rho',
    'Sigma',
    'Tau',
    'Upsilon',
    'Phi',
    'Chi',
    'Psi',
    'Omega',
  ];

  const orders: WorkOrderDocument[] = [];
  let orderIndex = 9; // Start from wo-009

  // Track used date ranges per work center to prevent overlaps
  const usedRanges = new Map<string, Array<{ start: Date; end: Date }>>();
  workCenterIds.forEach(id => {
    usedRanges.set(id, []);
  });

  // Initialize with base orders to prevent overlaps
  baseOrders.forEach(order => {
    const workCenterId = order.data.workCenterId;
    const startDate = new Date(order.data.startDate);
    const endDate = new Date(order.data.endDate);
    const ranges = usedRanges.get(workCenterId) || [];
    ranges.push({ start: startDate, end: endDate });
    usedRanges.set(workCenterId, ranges);
  });

  /**
   * Check if a date range overlaps with existing ranges for a work center
   */
  const hasOverlap = (workCenterId: string, startDate: Date, endDate: Date): boolean => {
    const ranges = usedRanges.get(workCenterId) || [];
    return ranges.some(range => {
      // Overlap check: start1 < end2 && start2 < end1
      return startDate < range.end && range.start < endDate;
    });
  };

  /**
   * Add a date range to the used ranges for a work center
   */
  const addRange = (workCenterId: string, startDate: Date, endDate: Date): void => {
    const ranges = usedRanges.get(workCenterId) || [];
    ranges.push({ start: startDate, end: endDate });
    usedRanges.set(workCenterId, ranges);
  };

  // Generate orders sequentially, ensuring no overlaps
  for (let i = 0; i < 500; i++) {
    // Distribute work centers evenly
    const workCenterId = workCenterIds[i % workCenterIds.length];

    // Distribute statuses evenly
    const status = statuses[i % statuses.length];

    // Generate varied date ranges
    // Start with a base offset and try different positions to find non-overlapping dates
    const baseOffset = (i % 60) - 30; // Range from -30 to +29 days
    const duration = 3 + (i % 14); // Duration from 3 to 16 days

    // Try multiple positions to find a non-overlapping slot
    // Expand search range if needed (up to ±180 days)
    let foundSlot = false;
    let searchRange = 60; // Start with 60 day range
    let attempts = 0;
    const maxAttempts = 500; // Prevent infinite loops

    while (!foundSlot && attempts < maxAttempts) {
      // Try different offsets within the search range
      for (let offset = 0; offset < searchRange && !foundSlot; offset++) {
        const daysOffset = baseOffset + (offset % searchRange) - Math.floor(searchRange / 2);
        const startDate = new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000);
        const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

        // Check if this range overlaps with existing orders for this work center
        if (!hasOverlap(workCenterId, startDate, endDate)) {
          // Generate name using Greek letters and numbers
          const letterIndex = Math.floor(i / 4) % greekLetters.length;
          const number = Math.floor(i / greekLetters.length) + 1;
          const name = `Order ${greekLetters[letterIndex]} ${number}`;

          orders.push({
            docId: `wo-${String(orderIndex).padStart(3, '0')}`,
            docType: 'workOrder',
            data: {
              name,
              workCenterId,
              status,
              startDate: formatDate(startDate),
              endDate: formatDate(endDate),
            },
          });

          // Mark this range as used
          addRange(workCenterId, startDate, endDate);

          orderIndex++;
          foundSlot = true;
        }
        attempts++;
      }

      // Expand search range if no slot found
      if (!foundSlot) {
        searchRange += 30; // Expand by 30 days
      }
    }

    // If we still couldn't find a slot, place it far in the future
    if (!foundSlot) {
      const startDate = new Date(today.getTime() + (180 + i * 20) * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
      const letterIndex = Math.floor(i / 4) % greekLetters.length;
      const number = Math.floor(i / greekLetters.length) + 1;
      const name = `Order ${greekLetters[letterIndex]} ${number}`;

      orders.push({
        docId: `wo-${String(orderIndex).padStart(3, '0')}`,
        docType: 'workOrder',
        data: {
          name,
          workCenterId,
          status,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      addRange(workCenterId, startDate, endDate);
      orderIndex++;
    }
  }

  return orders;
}
