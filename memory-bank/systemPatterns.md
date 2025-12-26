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

### Timeline Positioning

- Calculate bar positions based on dates relative to visible timeline range
- Handle zoom level changes (recalculate column widths)
- Ensure smooth horizontal scrolling
- Left panel must stay fixed while timeline scrolls

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

- Day view: Shows individual days in header
- Week view: Shows weeks in header
- Month view: Shows months in header
- All zoom levels show same data, just different scales
- Recalculate column widths on zoom change

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
