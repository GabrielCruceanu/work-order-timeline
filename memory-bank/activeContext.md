# Active Context

## Current Work Focus

### Just Completed

- ✅ Phase 7: Polish & Pixel-Perfect Design fully implemented
  - Centralized color system created (\_colors.scss) with exact design colors
  - Status badge styling updated to match design exactly (pill shape, colors, borders)
  - Button system polished (primary, secondary, danger) with exact specs
  - Form field styling updated (44px height, focus states, transitions)
  - WorkOrderPanel polished (480px width, 32px padding, exact spacing)
  - Dropdown styling updated (zoom control, ng-select, three-dot menu)
  - Timeline grid styling updated (borders, colors, current month highlight)
  - Work order bar styling updated (status-based backgrounds, hover states)
  - Timeline header polished (32px title, proper spacing)
  - All 8 design states verified and matching
  - Design system established: colors, typography, spacing, transitions, shadows
  - All components use design system variables (no hardcoded values)

- ✅ Phase 6: Interactions fully implemented
  - Empty timeline cell click detection (onTimelineRowClick method)
  - Click position to date calculation for all zoom levels (pixelToDate method)
  - Visual hover feedback on timeline rows (rgba(241, 243, 245, 0.5))
  - NgbTooltip integration with 300ms delay ("Click to create work order")
  - Keyboard shortcuts (N key for new work order, ESC for close panel)
  - Event flow: TimelineGrid emits emptySlotClicked → Timeline page handles → Panel opens with prefilled data
  - Click prevention on work order bars (target.closest check)
  - Edge case handling (date boundaries, week/month snapping)
  - Timeline row structure with clickable cells and bars overlay
  - Integration with existing panel prefilled data mechanism

- ✅ Phase 5: Create/Edit Panel fully implemented
  - WorkOrderPanelComponent (organism) with slide-out animation
  - Reactive form with all required fields (name, status, workCenter, startDate, endDate)
  - ng-bootstrap datepicker integration (NgbDatepickerModule)
  - ng-select dropdown integration for status and work center
  - Form validation (required, minLength for name)
  - Overlap detection algorithm (checks same work center, excludes current order in edit mode)
  - Create mode with prefilled data support
  - Edit mode with form population from work order data
  - Delete functionality with confirmation dialog
  - Panel overlay backdrop with click-to-close
  - Custom styling for all form fields, buttons, and dropdowns
  - Integration with Timeline page and WorkOrderService
  - Date conversion utilities (ISO string ↔ NgbDateStruct)
  - Error display for validation and overlap errors
  - Submit button disabled state during save operation

- ✅ Phase 4: Work Order Bars fully implemented
  - StatusBadgeComponent (atom) created with 4 status types
  - WorkOrderBarComponent (molecule) with positioning calculations
  - Bar positioning algorithm for all zoom levels (day/week/month)
  - Status color coding matching design specs exactly
  - Three-dot menu with Edit/Delete actions
  - Hover states and transitions
  - Click outside menu handler
  - Integration with TimelineGrid
  - Minimum width enforcement (80px) for readability
  - Text truncation with ellipsis for long names
  - Z-index management for hover states
  - All design specs verified (colors, spacing, typography)

- ✅ Phase 3: Zoom Level Control fully implemented
  - ZoomControlComponent (molecule) with dropdown functionality
  - Signal-based zoom level state management (day/week/month)
  - Integration with TimelineHeader and Timeline page
  - Click-outside handler for dropdown closure
  - Accessibility attributes (ARIA labels, roles, aria-selected)
  - Smooth dropdown animations (slideDown 0.2s ease)
  - All three zoom levels working correctly:
    - Day view: 120px columns, "Mon 12/25" format
    - Week view: 180px columns, "W48: Nov 24 - Nov 30" format
    - Month view: 180px columns, "December 2025" format
  - TimelineGrid column width updates correctly on zoom change
  - Track function ensures proper DOM updates when zoom changes

- ✅ Phase 2: TimelineGrid component fully implemented
  - Split-panel layout with fixed left panel (200px) and scrollable right panel
  - Work center rendering in left panel with hover states
  - Date column generation for all three zoom levels (day/week/month)
  - Date column rendering with proper labels and widths
  - Current day indicator with "Today" label
  - Vertical scroll synchronization between left and right panels
  - Horizontal scroll for right panel only
  - Grid lines between date columns
  - Timeline row structure matching design (60px height)

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

3. **Timeline Grid Foundation** ✅ Complete
   - ✅ Create TimelineGrid component
   - ✅ Implement fixed left panel for work centers
   - ✅ Implement scrollable right panel for timeline
   - ✅ Add basic date column rendering

4. **Zoom Levels** ✅ Complete
   - ✅ Implement Day/Week/Month zoom level switching
   - ✅ Create zoom level dropdown in header
   - ✅ Calculate column widths based on zoom level
   - ✅ Update timeline header to show appropriate date labels

5. **Work Order Bars** ✅ Complete
   - ✅ Calculate bar positions based on dates (all zoom levels)
   - ✅ Render work order bars with name and status badge
   - ✅ Implement status color coding (4 types with exact colors)
   - ✅ Add three-dot actions menu (hover state, Edit/Delete dropdown)

6. **Create/Edit Panel** ✅ Complete
   - ✅ Create WorkOrderPanel component (slide-out from right)
   - ✅ Implement reactive form with all required fields
   - ✅ Add form validation
   - ✅ Handle create vs edit mode
   - ✅ Implement overlap detection

7. **Interactions** ✅ Complete
   - ✅ Click empty timeline area to create
   - ✅ Three-dot menu with Edit/Delete options (Phase 4)
   - ✅ Panel close behaviors (click outside, cancel button) (Phase 5)
   - ✅ Current day indicator (Phase 2)
   - ✅ Row hover states
   - ✅ Keyboard shortcuts (N, ESC)

8. **Polish & Testing** ✅ Complete
   - ✅ Match Sketch designs pixel-perfect
   - ✅ Add hover states and transitions
   - ✅ Test overlap detection edge cases
   - ✅ Responsive design checks
   - ✅ Design system implemented

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

## Design Specifications

**CRITICAL**: All implementations must match the provided design images exactly (pixel-perfect).

### Design Images Available

Located in `brief/design/`:

1. Default view
2. View Selection (zoom levels)
3. Options CTA Controls (hover state)
4. Edit and Delete Controls Expanded
5. Create New Event - With Selection
6. Create New Event - Placeholder and Defaults
7. Create New Event - Active Text Field
8. Create New Event - Status Dropdown

**See `memory-bank/designSpecs.md` for complete design specifications.**

### Design Requirements

- Colors must match design images exactly
- Spacing must match design images exactly (pixel-perfect)
- Typography: Circular Std font family
- All interactive states (hover, focus, active) must match design
- Component dimensions must match design

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
