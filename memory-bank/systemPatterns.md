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

### Overlap Detection

- Check if new/edited order overlaps with existing orders on same work center
- Exclude the order being edited from overlap check
- Show error message and prevent save if overlap detected

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

### WorkOrderBar

- Displays work order name and status badge
- Shows three-dot actions menu
- Handles click events for edit/delete

### WorkOrderPanel

- Slide-out panel from right
- Contains reactive form
- Handles create vs edit mode
- Validates form and checks overlaps
- Emits save/cancel events

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
