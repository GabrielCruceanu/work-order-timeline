# Active Context

## Current Work Focus

### Just Completed

- ✅ Set up Circular Std font import and global font-family rule in `styles.scss`

### Next Steps (Priority Order)

1. **Project Setup & Structure**

   - Set up folder structure following Atomic Design (atoms/molecules/organisms)
   - Create core/ folder with models, services, utils
   - Create shared/ folder with atomic components
   - Create features/timeline/ folder for timeline feature
   - Set up styles/ folder with abstracts, base, components, utilities
   - Set up Angular standalone component structure
   - Create main TimelineComponent
   - Set up routing if needed (or single page app)

2. **Data Models & Services**

   - Create TypeScript interfaces for WorkCenterDocument and WorkOrderDocument
   - Create service for managing work centers and work orders
   - Generate sample data (5+ work centers, 8+ work orders)

3. **Timeline Grid Foundation**

   - Create TimelineGrid component
   - Implement fixed left panel for work centers
   - Implement scrollable right panel for timeline
   - Add basic date column rendering

4. **Zoom Levels**

   - Implement Day/Week/Month zoom level switching
   - Create zoom level dropdown in header
   - Calculate column widths based on zoom level
   - Update timeline header to show appropriate date labels

5. **Work Order Bars**

   - Calculate bar positions based on dates
   - Render work order bars with name and status badge
   - Implement status color coding
   - Add three-dot actions menu

6. **Create/Edit Panel**

   - Create WorkOrderPanel component (slide-out from right)
   - Implement reactive form with all required fields
   - Add form validation
   - Handle create vs edit mode
   - Implement overlap detection

7. **Interactions**

   - Click empty timeline area to create
   - Three-dot menu with Edit/Delete options
   - Panel close behaviors (click outside, cancel button)
   - Current day indicator
   - Row hover states

8. **Polish & Testing**
   - Match Sketch designs pixel-perfect
   - Add hover states and transitions
   - Test overlap detection edge cases
   - Responsive design checks

## Active Decisions

### Font Implementation

- Font CSS imported via `@import` in `styles.scss`
- Global font-family applied using universal selector `*`
- Font also linked in `index.html` (redundant but harmless)

### Component Architecture

- Will use standalone components (Angular 21 best practice)
- **MUST use standalone components** (no NgModules)
- **MUST use signals** for all reactive state management
- **MUST use OnPush change detection** by default
- **MUST use signal-based APIs**: input(), output(), model(), viewChild(), contentChild()
- **MUST use new control flow**: @if, @for, @switch syntax
- **MUST use inject()** for dependency injection
- **MUST follow Atomic Design**: atoms → molecules → organisms → templates → pages
- **MUST use BEM methodology** for all CSS class naming
- Single panel component for both create and edit modes
- Service-based data management

## Current Considerations

### Timeline Positioning Strategy

- Need to calculate visible date range based on zoom level
- Convert dates to pixel positions relative to container
- Handle scroll offset when positioning bars
- Consider performance with many work orders

### Overlap Detection Algorithm

- Check if date ranges overlap: `start1 < end2 && start2 < end1`
- Only check orders on same work center
- Exclude current order when editing
- Show clear error message to user

### Sample Data Requirements

- At least 5 work centers with realistic names
- At least 8 work orders across different centers
- All 4 status types represented
- At least one work center with multiple (non-overlapping) orders
- Orders spanning different date ranges

## Known Challenges

1. **Date Calculations**: Converting dates to pixel positions accurately
2. **Overlap Detection**: Efficiently checking overlaps without false positives
3. **Zoom Level Transitions**: Smoothly recalculating column widths
4. **Scroll Synchronization**: Keeping left panel fixed while right scrolls
5. **Design Matching**: Achieving pixel-perfect match with Sketch designs

## Questions to Resolve

- Should we use a date library (like date-fns) or native Date objects?
- How to handle timezone considerations?
- Should panel animations be CSS transitions or Angular animations?
- What's the best approach for infinite scroll (if implementing bonus)?
