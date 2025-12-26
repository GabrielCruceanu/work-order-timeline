# Product Context

## Problem Statement

Manufacturing facilities need to visualize work orders across multiple work centers (production lines, machines, etc.). Planners need to:

- See all scheduled work orders at a glance
- Quickly identify order status (Open, In Progress, Complete, Blocked)
- Create new work orders by clicking on the timeline
- Edit existing work orders
- Switch between day/week/month views for different planning horizons

## User Experience Goals

### Primary Interactions

1. **Visualization**

   - View work orders across multiple work centers simultaneously
   - Understand scheduling at different time scales (day/week/month)
   - Identify status at a glance through color coding

2. **Creation**

   - Click empty timeline area to create new work order
   - Pre-filled start date based on click position
   - Simple form with validation

3. **Editing**

   - Access via three-dot menu on work order bar
   - Edit all properties including dates
   - Prevent overlapping schedules

4. **Navigation**
   - Switch zoom levels to see different planning horizons
   - Horizontal scroll through timeline
   - Fixed work center names on left side

## Key User Flows

### Create Work Order

1. User clicks empty area on timeline
2. Panel slides in from right
3. Form pre-filled with start date from click position
4. User fills in name, selects status, adjusts dates
5. System validates no overlap
6. On save, work order appears on timeline

### Edit Work Order

1. User clicks three-dot menu on work order bar
2. Selects "Edit" from dropdown
3. Panel opens with existing data
4. User modifies fields
5. System validates (excluding current order from overlap check)
6. On save, timeline updates

### Delete Work Order

1. User clicks three-dot menu
2. Selects "Delete"
3. Work order removed from timeline

## Success Criteria

- Intuitive timeline visualization
- Fast work order creation/editing
- Clear error feedback for overlaps
- Smooth zoom level transitions
- Responsive design that doesn't break on smaller screens
