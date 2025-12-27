# System Patterns

## 🎯 Core Principles

### 1. Angular v21 Modern Patterns

- **ALWAYS use standalone components** (no NgModules)
- **ALWAYS use signals** for reactive state management
- **PREFER functional patterns** over class-based when possible
- **USE inject() function** for dependency injection in functional contexts
- **IMPLEMENT OnPush change detection strategy** by default
- **LEVERAGE new control flow syntax** (@if, @for, @switch)
- **UTILIZE signal-based APIs**: input(), output(), model(), viewChild(), contentChild()

### 2. Atomic Design Methodology

Components must follow strict atomic hierarchy:

- **atoms/** → Basic building blocks (buttons, inputs, icons)
- **molecules/** → Simple combinations of atoms (search-bar, form-field)
- **organisms/** → Complex UI sections (header, sidebar, form-group)
- **templates/** → Page layouts without data (dashboard-layout, auth-layout)
- **pages/** → Complete views with data and logic (dashboard-page, login-page)

### 3. BEM (Block Element Modifier) Methodology

- **Block**: `.component-name`
- **Element**: `.component-name__element`
- **Modifier**: `.component-name--modifier`
- **NEVER nest BEM selectors** more than 3 levels deep
- **NO generic class names** (avoid `.title`, `.button`, use `.card__title`, `.form__button`)

### 4. Object-Oriented Principles

- **Single Responsibility**: Each class/component does ONE thing
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable
- **Interface Segregation**: Many specific interfaces > one general
- **Dependency Inversion**: Depend on abstractions, not concretions

## Architecture Overview

### Component Structure

```
TimelineComponent (main container)
├── TimelineHeader (zoom selector, title)
├── TimelineGrid
│   ├── WorkCenterList (fixed left panel)
│   └── TimelineView (scrollable right panel)
│       ├── TimelineColumns (date headers)
│       ├── WorkOrderBar (for each order)
│       │   └── ActionsMenu (three-dot menu)
│       └── CurrentDayIndicator (vertical line)
└── WorkOrderPanel (slide-out for create/edit)
    └── WorkOrderForm (reactive form)
```

## Data Structures

### Document Pattern

All documents follow this structure:

```typescript
{
  docId: string; // Unique identifier
  docType: string; // Document type
  data: {
    // Document-specific fields
  }
}
```

### Work Center Document

```typescript
interface WorkCenterDocument {
  docId: string;
  docType: 'workCenter';
  data: {
    name: string;
  };
}
```

### Work Order Document

```typescript
interface WorkOrderDocument {
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

type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';
```

## Key Design Patterns

### Scroll Synchronization Pattern

- Use `viewChild()` to get references to scrollable containers
- Bind scroll events on both panels
- Sync scroll positions: `leftPanel.scrollTop = rightContent.scrollTop` (and vice versa)
- Only right panel scrolls horizontally
- Both panels scroll together vertically
- Prevents infinite scroll loops by checking if positions differ before syncing

### CSS Grid Split-Panel Pattern

- Use CSS Grid with `grid-template-columns: 200px 1fr` for fixed/flexible split
- Left panel: `overflow-y: auto`, `overflow-x: hidden`
- Right panel: `overflow: auto` (both directions)
- Header section: `overflow-x: auto` for horizontal scroll of date columns
- Content section: `overflow: auto` for both directions with scroll sync

### Timeline Positioning

- Calculate bar positions based on dates relative to visible timeline range
- Handle zoom level changes (recalculate column widths)
- Ensure smooth horizontal scrolling
- Left panel must stay fixed while timeline scrolls

**Work Order Bar Positioning Algorithm**:

- **Day view**: Each column = 1 day (120px), position = daysFromStart \* columnWidth
- **Week view**: Each column = 1 week (180px), position = (daysFromStart / 7) \* columnWidth
- **Month view**: Each column = 1 month (180px), position = monthsFromStart \* columnWidth
- Uses `differenceInDays()` and `differenceInMonths()` utility functions
- Minimum width: 80px (enforced to ensure text readability)
- Padding: 4px from left edge, 8px total (4px each side) subtracted from width

### Status Color System

**Work Order Bar Colors** (by status):

- **Open**: Background #5659ff, Border #4c51bf
- **In Progress**: Background #6f42c1, Border #5a34a1
- **Complete**: Background #28a745, Border #218838
- **Blocked**: Background #ffc107, Border #e0a800
- Text on all bars: #ffffff

**Status Badge Colors** (by status):

- **Open**: Background #e7f5ff, Text #1971c2
- **In Progress**: Background #f3e5f5, Text #7b1fa2
- **Complete**: Background #d4edda, Text #155724
- **Blocked**: Background #fff3cd, Text #856404

### Date Range Calculation

- **Day view**: Show 14 days (today ± 7 days)
- **Week view**: Show 8 weeks (current week ± 4 weeks, adjusted to include full weeks)
- **Month view**: Show 6 months (current month ± 3 months, adjusted to include full months)
- Use `startOfWeek()`, `endOfWeek()`, `startOfMonth()`, `endOfMonth()` utilities for precise boundaries
- Date ranges are computed signals that react to zoom level changes

### Date Column Generation

- Generate columns based on zoom level and date range
- **Day columns**: 120px width, format "Mon 12/25"
- **Week columns**: 140px width, format "Week 52 (Dec 25 - Dec 31)"
- **Month columns**: 180px width, format "December 2025"
- Use `formatDate()` utility with format strings for consistent labeling
- Columns are generated as computed signals for reactive updates

### Today Indicator Positioning

- Calculate pixel offset from left edge of timeline based on:
  - Current date position within visible date range
  - Zoom level column width
  - Day position within week (for week view)
  - Day position within month (for month view)
- Hide indicator if current date is outside visible range
- Position calculated as computed signal for reactive updates

### Form State Management

- Single panel component for both create and edit
- Use a mode flag: `'create' | 'edit'`
- Reset form when opening in create mode
- Populate form when opening in edit mode
- Use `effect()` to populate form when panel opens (reacts to `isOpen()` signal)
- Form controls use NgbDateStruct for datepicker fields (converted from/to ISO strings)

### Reactive Forms with ng-bootstrap Datepicker

**Implementation Pattern**:

- Form controls for date fields use `FormControl<NgbDateStruct | null>`
- Convert ISO date strings to NgbDateStruct when populating form: `{ year, month, day }`
- Convert NgbDateStruct back to ISO string on submit: `new Date(year, month - 1, day).toISOString().split('T')[0]`
- Use `formControlName` with `ngbDatepicker` directive on readonly input
- Datepicker toggles via `#ref="ngbDatepicker"` and `(click)="ref.toggle()"`

**Date Conversion Utilities**:

```typescript
// ISO to NgbDateStruct
private isoToNgbDate(isoDate: string): NgbDateStruct | null {
  const date = new Date(isoDate);
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

// NgbDateStruct to ISO
private ngbDateToISO(ngbDate: NgbDateStruct | null): string {
  const date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  return date.toISOString().split('T')[0];
}
```

### Reactive Forms with ng-select

**Implementation Pattern**:

- Use `formControlName` directly with ng-select component
- Bind items array, `bindLabel`, and `bindValue` properties
- Use custom templates (`ng-label-tmp`, `ng-option-tmp`) for custom display (e.g., status with colored dots)
- Works seamlessly with reactive forms - no additional configuration needed

### Overlap Detection

- Check if new/edited order overlaps with existing orders on same work center
- Exclude the order being edited from overlap check
- Show error message and prevent save if overlap detected
- Overlap algorithm: `startDate < orderEnd && endDate > orderStart`
- Error displayed as alert component above form fields
- Overlap check runs on form submit before save

### Zoom Level Handling

- Day view: Shows individual days in header (120px per column), format "Mon 12/25"
- Week view: Shows weeks in header (180px per column), format "W48: Nov 24 - Nov 30"
- Month view: Shows months in header (180px per column), format "December 2025"
- All zoom levels show same data, just different scales
- Recalculate column widths on zoom change via computed signals
- Date range automatically adjusts based on zoom level
- Column labels format differently per zoom level using `formatDate()` utility
- Use track function in @for loop that includes zoom level to ensure proper DOM updates

### Dropdown Component Pattern

**Implementation Pattern**:

- Signal-based state management (`isOpen = signal(false)`)
- Click-outside handler using `@HostListener('document:click')`
- Computed signal for current label display
- Accessibility attributes (aria-expanded, aria-label, role="menu", role="menuitem", aria-selected)
- Smooth animations (slideDown keyframe animation)
- BEM naming convention

**Key Pattern**:

```typescript
@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const clickedInside = this.elementRef.nativeElement.contains(target);
  if (!this.isOpen() || clickedInside) return;
  this.isOpen.set(false);
}
```

### @for Loop Tracking Pattern

**Problem**: When computed signals change, Angular may not update DOM elements correctly if tracking function doesn't account for all relevant properties.

**Solution**: Create track function that includes all properties that affect rendering:

```typescript
// In component
trackColumn(column: DateColumn): string {
  return `${this.zoomLevel()}-${column.date.getTime()}-${column.width}`;
}

// In template
@for (column of gridColumns(); track trackColumn(column)) {
  <div [style.width.px]="column.width">{{ column.label }}</div>
}
```

**Key Points**:

- Include all properties that affect rendering in track function
- Use string concatenation for multiple values
- Ensures Angular creates new DOM elements when properties change
- Prevents stale style bindings

### Empty Cell Click Handling Pattern

**Implementation Pattern**:

- Timeline rows have clickable area with cells for each date column
- Bars container is absolutely positioned on top with `pointer-events: none`
- Bars re-enable pointer events: `app-work-order-bar { pointer-events: auto; }`
- Click handler checks if click target is within work order bar using `target.closest('app-work-order-bar')`
- Calculate click date from pixel position using `getBoundingClientRect()` and `pixelToDate()` algorithm

**Click Position to Date Calculation**:

```typescript
private pixelToDate(pixelX: number): Date {
  const columnWidth = this.columnWidth();
  const zoomLevel = this.zoomLevel();
  const startDate = this.dateRange().start;
  const endDate = this.dateRange().end;

  let date: Date;

  switch (zoomLevel) {
    case 'day':
      const daysFromStart = Math.floor(pixelX / columnWidth);
      date = addDays(startDate, daysFromStart);
      break;
    case 'week':
      const weeksFromStart = Math.floor(pixelX / columnWidth);
      date = addWeeks(startDate, weeksFromStart);
      date = startOfWeek(date); // Snap to week start
      break;
    case 'month':
      const monthsFromStart = Math.floor(pixelX / columnWidth);
      date = addMonths(startDate, monthsFromStart);
      date = startOfMonth(date); // Snap to month start
      break;
  }

  // Clamp to visible range
  if (date < startDate) date = new Date(startDate);
  if (date > endDate) date = new Date(endDate);

  return date;
}
```

**Key Points**:

- Use `getBoundingClientRect()` to get relative position (accounts for scroll automatically)
- Floor division to determine which column was clicked
- Snap to week/month start for appropriate zoom levels
- Clamp to visible date range boundaries
- Pass calculated date to panel via prefilled data signal

## Component Responsibilities

### TimelineComponent

- Main orchestrator
- Manages work centers and work orders data
- Handles panel open/close state
- Coordinates zoom level changes

### TimelineGrid

- Renders work center rows
- Calculates date column positions
- Handles horizontal scrolling
- Renders work order bars at correct positions
- **Split-panel layout**: CSS Grid with fixed left panel (200px) and flexible right panel
- **Scroll synchronization**: ViewChild references to sync vertical scroll between panels
- **Date column rendering**: Computed signals for date range and columns based on zoom level
- **Today indicator**: Absolute positioned vertical line with computed pixel offset
- **Empty cell click handling**: Click handler on timeline rows, calculates date from pixel position
- **Visual hover feedback**: Hover state with rgba(241, 243, 245, 0.5) background and pointer cursor
- **NgbTooltip integration**: Tooltip on hover with 300ms delay for better UX
- **Click prevention**: Checks if click target is work order bar before emitting empty cell click

### WorkOrderBar

- Displays work order name and status badge
- Shows three-dot actions menu (appears on hover)
- Handles click events for edit/delete
- Computed signals for positioning and styling
- Status-based color coding (4 types: open, in-progress, complete, blocked)
- Minimum width enforcement (80px)
- Text truncation with ellipsis for long names
- Z-index elevation on hover (z-index: 10)
- Click outside handler for menu closure

### WorkOrderPanel

- Slide-out panel from right (400px width, fixed position)
- Contains reactive form with 5 fields: name, status, workCenterId, startDate, endDate
- Handles create vs edit mode via `mode` signal input
- Validates form (required, minLength) and checks overlaps
- Emits save/cancel/delete events
- Panel state managed via `isOpen` signal input
- Form populated via `effect()` when panel opens
- Date conversion between ISO strings (data model) and NgbDateStruct (form controls)
- Uses ng-bootstrap datepicker and ng-select for form fields
- Custom styling with BEM methodology
- Panel overlay backdrop with fade-in animation
- Slide-in/out animation using CSS transform (translateX)
- Accepts `prefilledData` signal input for work center and date when creating from timeline click

## Data Flow

1. **Initial Load**: Load sample work centers and work orders
2. **Create Flow**: Click timeline → Open panel → Fill form → Validate → Save → Update timeline
3. **Edit Flow**: Click menu → Open panel → Populate form → Modify → Validate → Save → Update timeline
4. **Delete Flow**: Click menu → Confirm → Remove from data → Update timeline
5. **Zoom Change**: Select zoom level → Recalculate columns → Re-render timeline

### Signal Flow for UI Controls

**Pattern**: Component → Organism → Page → Feature

Example: Zoom Control Flow

```
ZoomControlComponent (molecule)
  ↓ zoomChanged event
TimelineHeaderComponent (organism)
  ↓ zoomChanged event
TimelineComponent (page)
  ↓ updates zoomLevel signal
TimelineGridComponent (organism)
  ↓ recomputes columns based on zoomLevel
```

**Key Points**:

- Use signal inputs (`input()`) for data flowing down
- Use signal outputs (`output()`) for events flowing up
- Page component manages state with signals
- Child components react to signal changes via computed signals
- OnPush change detection ensures efficient updates

## 📁 Project Structure

```
src/app/
├── core/                           # Singleton services, guards, interceptors
│   ├── models/                     # TypeScript interfaces & types
│   │   ├── base.model.ts          # Base interfaces
│   │   ├── work-center.model.ts
│   │   └── work-order.model.ts
│   ├── services/                   # Business logic services
│   │   ├── work-center.service.ts
│   │   └── work-order.service.ts
│   ├── guards/                     # Route guards
│   ├── interceptors/               # HTTP interceptors
│   └── utils/                      # Helper functions
│       ├── date.utils.ts
│       └── validation.utils.ts
│
├── shared/                         # Shared components, directives, pipes
│   ├── components/                 # Atomic components
│   │   ├── atoms/
│   │   │   ├── button/
│   │   │   │   ├── button.component.ts
│   │   │   │   ├── button.component.scss
│   │   │   │   └── button.component.spec.ts
│   │   │   ├── input/
│   │   │   └── icon/
│   │   ├── molecules/
│   │   │   ├── form-field/
│   │   │   ├── date-picker/
│   │   │   └── dropdown/
│   │   └── organisms/
│   │       ├── navigation/
│   │       └── sidebar/
│   ├── directives/
│   ├── pipes/
│   └── constants/
│       └── app.constants.ts
│
├── features/                       # Feature modules (lazy-loaded)
│   └── timeline/
│       ├── components/
│       │   ├── organisms/
│       │   │   ├── timeline-grid/
│       │   │   ├── timeline-header/
│       │   │   └── work-order-panel/
│       │   └── molecules/
│       │       ├── work-order-bar/
│       │       └── zoom-control/
│       ├── services/
│       │   └── timeline.service.ts
│       ├── models/
│       │   └── timeline.model.ts
│       └── timeline.component.ts
│
└── styles/                         # Global styles
    ├── abstracts/
    │   ├── _variables.scss        # SCSS variables
    │   ├── _mixins.scss           # Reusable mixins
    │   └── _functions.scss        # SCSS functions
    ├── base/
    │   ├── _reset.scss            # CSS reset
    │   └── _typography.scss       # Font definitions
    ├── components/                # Component-specific styles
    └── utilities/
        └── _helpers.scss          # Utility classes
```

## Design Specifications

**CRITICAL**: All implementations must be pixel-perfect matches to the provided design images.

### Design Reference

- **Design Images**: Located in `brief/design/` (8 states documented)
- **Sketch File**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667
- **Complete Specs**: See `memory-bank/designSpecs.md`

### Key Design Requirements

- Colors must match design images exactly
- Spacing must match design images exactly (pixel values)
- Typography: Circular Std font family
- All interactive states must match design
- Component dimensions must match design

### Design States to Implement

1. Default timeline view
2. Zoom level selection
3. Work order bar hover (three-dot menu)
4. Edit/Delete dropdown expanded
5. Create panel with date selection
6. Create panel initial state
7. Create panel active text field
8. Create panel status dropdown
