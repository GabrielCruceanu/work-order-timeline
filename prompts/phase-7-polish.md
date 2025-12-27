# Phase 7: Polish & Pixel-Perfect Design Implementation Prompt

## Context

Phase 7 focuses on **pixel-perfect design implementation** - matching every detail from the provided design mockups. This is the final polish phase that transforms a functional application into a production-ready, professionally designed product. Every color, spacing, font size, border radius, shadow, and transition must match the design specifications exactly.

**Primary Goal:** Match all 8 design states pixel-perfectly

**Approach:** Systematic verification against design images, extracting exact measurements, colors, and animations.

**Design Files to Match:**

1. ✅ `Work Order Schedule - Default.jpg` - Base state
2. ✅ `Work Order Schedule - View Selection.jpg` - Zoom dropdown open
3. ✅ `Work Order Schedule - Options CTA Controls (shown on hover).jpg` - Three-dot menu hover
4. ✅ `Work Order Schedule - Edit and Delete Controls Expanded.jpg` - Action menu open
5. ✅ `Work Order Schedule - Create New Event - Placeholder and Defaults.jpg` - Panel default state
6. ✅ `Work Order Schedule - Create New Event - Active Text Field.jpg` - Input focus state
7. ✅ `Work Order Schedule - Create New Event - With Selection.jpg` - Form filled state
8. ✅ `Work Order Schedule - Create New Event - Status Dropdown.jpg` - Status dropdown open

## Design Analysis Summary

### Color Palette (Extracted from Design)

**Primary Colors:**

```scss
// Primary Brand
$primary: #5659ff; // Primary blue (buttons, selected states, current indicator)
$primary-light: rgba(86, 89, 255, 0.1); // Current month background

// Status Colors
$status-open: #00bcd4; // Cyan/turquoise
$status-open-bg: rgba(0, 188, 212, 0.1);

$status-in-progress: #6366f1; // Indigo/blue-purple
$status-in-progress-bg: rgba(99, 102, 241, 0.1);

$status-complete: #10b981; // Green
$status-complete-bg: rgba(16, 185, 129, 0.1);

$status-blocked: #f59e0b; // Orange/amber
$status-blocked-bg: rgba(245, 158, 11, 0.1);

// Neutrals
$text-primary: #1f2937; // Dark gray for headings
$text-secondary: #6b7280; // Medium gray for labels
$text-placeholder: #9ca3af; // Light gray for placeholders

$border-color: #e5e7eb; // Light gray borders
$background: #ffffff; // White
$background-hover: #f9fafb; // Very light gray
$background-overlay: rgba(0, 0, 0, 0.5); // Panel overlay

// Shadows
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
$shadow-panel: -4px 0 20px rgba(0, 0, 0, 0.15); // Left shadow for panel
```

### Typography (Circular Std)

```scss
// Font Family (already loaded)
$font-family:
  'Circular-Std',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

// Font Sizes
$font-size-xs: 0.75rem; // 12px - small labels, badges
$font-size-sm: 0.875rem; // 14px - body text, form inputs
$font-size-base: 1rem; // 16px - base text
$font-size-lg: 1.125rem; // 18px - section headings
$font-size-xl: 1.5rem; // 24px - page headings
$font-size-2xl: 2rem; // 32px - large headings

// Font Weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line Heights
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

### Spacing Scale

```scss
// Consistent spacing (based on 4px base unit)
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.25rem; // 20px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-10: 2.5rem; // 40px
$space-12: 3rem; // 48px
```

### Border Radius

```scss
$radius-sm: 4px; // Form fields, badges
$radius-md: 6px; // Buttons, cards
$radius-lg: 8px; // Panels, modals
$radius-full: 9999px; // Pills, badges
```

### Transitions

```scss
$transition-fast: 0.1s ease;
$transition-base: 0.15s ease;
$transition-slow: 0.3s ease;

// Common transition combinations
$transition-colors:
  color 0.15s ease,
  background-color 0.15s ease,
  border-color 0.15s ease;
$transition-transform: transform 0.15s ease;
$transition-opacity: opacity 0.15s ease;
$transition-all: all 0.15s ease;
```

## Requirements

### Technical Standards

- ✅ Match design pixel-perfectly (exact colors, spacing, typography)
- ✅ Verify against all 8 design states
- ✅ Smooth animations and transitions
- ✅ Responsive design (min-width: 1200px recommended)
- ✅ CSS variables for maintainability
- ✅ BEM naming convention
- ✅ No hardcoded values (use variables)

### Design Verification Checklist

**Colors:**

- [ ] Primary blue exactly matches (#5659FF)
- [ ] All 4 status colors match exactly
- [ ] Status badge backgrounds match (semi-transparent)
- [ ] Text colors match (primary, secondary, placeholder)
- [ ] Border colors match
- [ ] Hover states match
- [ ] Focus states match (blue border)
- [ ] Current month indicator matches

**Typography:**

- [ ] Font family: Circular Std applied everywhere
- [ ] Page heading: "Work Orders" - correct size and weight
- [ ] Panel heading: "Work Order Details" - correct size
- [ ] Labels: correct size and color
- [ ] Placeholders: correct color (gray)
- [ ] Form input text: correct size

**Spacing:**

- [ ] Panel padding: ~24-32px
- [ ] Form field gaps: ~16-20px
- [ ] Button spacing: ~12px between buttons
- [ ] Timeline cell padding: matches design
- [ ] Work order bar padding: matches design
- [ ] Status badge padding: ~4-6px horizontal

**Components:**

- [ ] Buttons: correct height, padding, border radius
- [ ] Form fields: correct height, border, focus state
- [ ] Status badges: pill shape, correct colors
- [ ] Dropdowns: correct shadow, border, hover states
- [ ] Three-dot menu: correct positioning and styling
- [ ] Panel: correct width (~400-480px), shadow
- [ ] Timeline grid: correct column widths, borders

**Interactive States:**

- [ ] Button hover: correct color change
- [ ] Form input focus: blue border appears
- [ ] Dropdown hover: light gray background
- [ ] Timeline row hover: subtle background
- [ ] Work order bar hover: three-dot menu appears
- [ ] Transitions: all smooth (0.15s ease)

## Implementation Strategy

### Stage 1: Color System Refactor

**Goal:** Create a centralized color system with exact design colors

**Create:** `src/styles/abstracts/_colors.scss`

```scss
// _colors.scss - Design System Colors

// Primary
$color-primary: #5659ff;
$color-primary-light: rgba(86, 89, 255, 0.1);
$color-primary-dark: #4245cc;

// Status Colors
$color-status-open: #00bcd4;
$color-status-open-bg: rgba(0, 188, 212, 0.1);
$color-status-open-border: rgba(0, 188, 212, 0.2);

$color-status-in-progress: #6366f1;
$color-status-in-progress-bg: rgba(99, 102, 241, 0.1);
$color-status-in-progress-border: rgba(99, 102, 241, 0.2);

$color-status-complete: #10b981;
$color-status-complete-bg: rgba(16, 185, 129, 0.1);
$color-status-complete-border: rgba(16, 185, 129, 0.2);

$color-status-blocked: #f59e0b;
$color-status-blocked-bg: rgba(245, 158, 11, 0.1);
$color-status-blocked-border: rgba(245, 158, 11, 0.2);

// Neutrals
$color-gray-50: #f9fafb;
$color-gray-100: #f3f4f6;
$color-gray-200: #e5e7eb;
$color-gray-300: #d1d5db;
$color-gray-400: #9ca3af;
$color-gray-500: #6b7280;
$color-gray-600: #4b5563;
$color-gray-700: #374151;
$color-gray-800: #1f2937;
$color-gray-900: #111827;

// Semantic Colors
$color-text-primary: $color-gray-900;
$color-text-secondary: $color-gray-500;
$color-text-placeholder: $color-gray-400;

$color-border: $color-gray-200;
$color-border-focus: $color-primary;

$color-background: #ffffff;
$color-background-hover: $color-gray-50;
$color-background-overlay: rgba(0, 0, 0, 0.5);

// Shadows
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04);
$shadow-panel: -4px 0 20px rgba(0, 0, 0, 0.15);
$shadow-dropdown: 0 4px 12px rgba(0, 0, 0, 0.1);
```

**Update:** `src/styles/abstracts/_variables.scss` to import colors

```scss
// Import color system
@import 'colors';

// Typography
$font-family-base:
  'Circular-Std',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.125rem; // 18px
$font-size-xl: 1.5rem; // 24px
$font-size-2xl: 2rem; // 32px

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// Spacing (4px base unit)
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.25rem; // 20px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-10: 2.5rem; // 40px
$space-12: 3rem; // 48px

// Border Radius
$radius-sm: 4px;
$radius-md: 6px;
$radius-lg: 8px;
$radius-full: 9999px;

// Transitions
$transition-fast: 0.1s ease;
$transition-base: 0.15s ease;
$transition-slow: 0.3s ease;

$transition-colors:
  color $transition-base,
  background-color $transition-base,
  border-color $transition-base;
$transition-transform: transform $transition-base;
$transition-opacity: opacity $transition-base;
```

**Verification:** Colors are centralized and reusable

---

### Stage 2: Status Badge Polish

**Goal:** Match status badge design exactly

**Reference:** All design images show status badges with specific styling

**Badge Specs from Design:**

- Shape: Pill (full border-radius)
- Padding: 4px 8px (vertical, horizontal)
- Font size: 12px
- Font weight: 500
- Text color: Status color (darker shade)
- Background: Status color (10% opacity)
- Border: Optional 1px (20% opacity)

**Update:** `src/app/shared/components/atoms/status-badge/status-badge.scss`

```scss
@import '../../../../../styles/abstracts/variables';

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: $space-1 $space-2; // 4px 8px
  border-radius: $radius-full;
  font-size: $font-size-xs; // 12px
  font-weight: $font-weight-medium; // 500
  line-height: $line-height-tight;
  white-space: nowrap;

  // Open status
  &--open {
    color: darken($color-status-open, 10%);
    background: $color-status-open-bg;
    border: 1px solid $color-status-open-border;
  }

  // In Progress status
  &--in-progress {
    color: darken($color-status-in-progress, 10%);
    background: $color-status-in-progress-bg;
    border: 1px solid $color-status-in-progress-border;
  }

  // Complete status
  &--complete {
    color: darken($color-status-complete, 10%);
    background: $color-status-complete-bg;
    border: 1px solid $color-status-complete-border;
  }

  // Blocked status
  &--blocked {
    color: darken($color-status-blocked, 15%);
    background: $color-status-blocked-bg;
    border: 1px solid $color-status-blocked-border;
  }
}
```

**Verification:** Status badges match design pixel-perfectly

---

### Stage 3: Button System Polish

**Goal:** Match button design exactly

**Reference:** `Create New Event` panels show Cancel (secondary) and Create (primary) buttons

**Button Specs from Design:**

- Height: 40px
- Padding: 10px 20px
- Border radius: 6px
- Font size: 14px
- Font weight: 500
- Transition: 0.15s ease

**Primary Button:**

- Background: #5659FF
- Text: White
- Hover: Slightly darker blue
- Disabled: 50% opacity

**Secondary Button:**

- Background: White
- Text: Gray (#6B7280)
- Border: 1px solid #E5E7EB
- Hover: Light gray background

**Update:** `src/app/shared/components/atoms/button/button.scss`

```scss
@import '../../../../../styles/abstracts/variables';

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: $space-2 $space-5; // 10px 20px
  border: none;
  border-radius: $radius-md; // 6px
  font-family: $font-family-base;
  font-size: $font-size-sm; // 14px
  font-weight: $font-weight-medium; // 500
  line-height: $line-height-normal;
  cursor: pointer;
  transition:
    $transition-colors,
    box-shadow $transition-base;
  outline: none;

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }

  // Primary button
  &--primary {
    background: $color-primary;
    color: $color-background;

    &:hover:not(:disabled) {
      background: $color-primary-dark;
    }

    &:active:not(:disabled) {
      background: darken($color-primary, 15%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  // Secondary button
  &--secondary {
    background: $color-background;
    color: $color-text-secondary;
    border: 1px solid $color-border;

    &:hover:not(:disabled) {
      background: $color-background-hover;
      border-color: $color-gray-300;
    }

    &:active:not(:disabled) {
      background: $color-gray-100;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  // Danger/Delete button
  &--danger {
    background: #ef4444;
    color: $color-background;

    &:hover:not(:disabled) {
      background: #dc2626;
    }

    &:active:not(:disabled) {
      background: #b91c1c;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
```

**Verification:** Buttons match design exactly

---

### Stage 4: Form Field Polish

**Goal:** Match form input design exactly

**Reference:** `Create New Event` panels show various input states

**Form Field Specs from Design:**

- Height: 44px
- Padding: 12px 16px
- Border: 1px solid #E5E7EB
- Border radius: 6px
- Font size: 14px
- Placeholder color: #9CA3AF
- Focus: Blue border (#5659FF)
- Transition: 0.15s ease

**Update:** `src/app/shared/components/molecules/form-field/form-field.scss`

```scss
@import '../../../../../styles/abstracts/variables';

.form-field {
  display: flex;
  flex-direction: column;
  gap: $space-2; // 8px

  &__label {
    font-size: $font-size-sm; // 14px
    font-weight: $font-weight-medium; // 500
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__input,
  &__textarea,
  &__select {
    width: 100%;
    height: 44px;
    padding: $space-3 $space-4; // 12px 16px
    border: 1px solid $color-border;
    border-radius: $radius-md; // 6px
    font-family: $font-family-base;
    font-size: $font-size-sm; // 14px
    color: $color-text-primary;
    background: $color-background;
    transition:
      $transition-colors,
      box-shadow $transition-base;
    outline: none;

    &::placeholder {
      color: $color-text-placeholder;
    }

    &:hover:not(:disabled):not(:focus) {
      border-color: $color-gray-300;
    }

    &:focus {
      border-color: $color-border-focus;
      box-shadow: 0 0 0 3px rgba(86, 89, 255, 0.1);
    }

    &:disabled {
      background: $color-gray-50;
      color: $color-text-placeholder;
      cursor: not-allowed;
    }

    &--error {
      border-color: #ef4444;

      &:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }

  &__textarea {
    height: auto;
    min-height: 80px;
    resize: vertical;
  }

  &__error {
    font-size: $font-size-xs; // 12px
    color: #ef4444;
    line-height: $line-height-tight;
  }

  &__hint {
    font-size: $font-size-xs; // 12px
    color: $color-text-secondary;
    line-height: $line-height-tight;
  }
}
```

**Verification:** Form fields match design, focus states work correctly

---

### Stage 5: WorkOrderPanel Polish

**Goal:** Match panel design pixel-perfectly

**Reference:** All "Create New Event" design images

**Panel Specs from Design:**

- Width: 480px
- Background: White
- Shadow: Large left shadow
- Padding: 32px
- Header: Title + subtitle + close button
- Form: Fields with 20px gaps
- Footer: Buttons right-aligned with 12px gap

**Update:** `src/app/features/timeline/components/organisms/work-order-panel/work-order-panel.scss`

```scss
@import '../../../../../../styles/abstracts/variables';

.work-order-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  height: 100vh;
  background: $color-background;
  box-shadow: $shadow-panel;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform $transition-slow;

  &--open {
    transform: translateX(0);
  }

  // Header
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: $space-8 $space-8 $space-6; // 32px 32px 24px
    border-bottom: 1px solid $color-border;
  }

  &__header-content {
    flex: 1;
  }

  &__title {
    font-size: $font-size-xl; // 24px
    font-weight: $font-weight-semibold; // 600
    color: $color-text-primary;
    margin: 0 0 $space-2; // 0 0 8px
    line-height: $line-height-tight;
  }

  &__subtitle {
    font-size: $font-size-sm; // 14px
    color: $color-text-secondary;
    margin: 0;
    line-height: $line-height-normal;
  }

  &__close {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: $space-4;
    background: none;
    border: none;
    border-radius: $radius-sm;
    font-size: 24px;
    color: $color-text-secondary;
    cursor: pointer;
    transition: $transition-colors;

    &:hover {
      background: $color-background-hover;
      color: $color-text-primary;
    }

    &:active {
      background: $color-gray-100;
    }
  }

  // Body
  &__body {
    flex: 1;
    overflow-y: auto;
    padding: $space-6 $space-8; // 24px 32px
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-5; // 20px
  }

  // Footer
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-6 $space-8 $space-8; // 24px 32px 32px
    border-top: 1px solid $color-border;
  }

  &__footer-actions {
    display: flex;
    gap: $space-3; // 12px
    margin-left: auto;
  }

  &__delete-button {
    margin-right: auto;
  }
}

// Overlay
.work-order-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background-overlay;
  z-index: 999;
  opacity: 0;
  transition: opacity $transition-slow;
  pointer-events: none;

  &--visible {
    opacity: 1;
    pointer-events: auto;
  }
}
```

**Verification:** Panel matches design exactly, animations smooth

---

### Stage 6: Dropdown Polish (Zoom & Three-Dot Menu)

**Goal:** Match dropdown design exactly

**Reference:** "View Selection" and "Edit and Delete Controls Expanded"

**Dropdown Specs from Design:**

- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 6px
- Shadow: 0 4px 12px rgba(0,0,0,0.1)
- Padding: 4px (around items)
- Item padding: 10px 16px
- Item hover: Light gray background
- Item selected: Blue text

**Update:** `src/app/shared/components/molecules/dropdown/dropdown.scss`

```scss
@import '../../../../../styles/abstracts/variables';

.dropdown {
  position: relative;
  display: inline-block;

  &__trigger {
    // Inherits button styling or custom styling
  }

  &__menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 140px;
    background: $color-background;
    border: 1px solid $color-border;
    border-radius: $radius-md; // 6px
    box-shadow: $shadow-dropdown;
    padding: $space-1; // 4px
    z-index: 1000;
    opacity: 0;
    transform: translateY(-8px);
    transition:
      opacity $transition-base,
      transform $transition-base;
    pointer-events: none;

    &--open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    &--right {
      left: auto;
      right: 0;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: $space-2 $space-4; // 10px 16px
    border: none;
    border-radius: $radius-sm; // 4px
    background: none;
    font-family: $font-family-base;
    font-size: $font-size-sm; // 14px
    color: $color-text-primary;
    text-align: left;
    cursor: pointer;
    transition: $transition-colors;

    &:hover {
      background: $color-background-hover;
    }

    &:active {
      background: $color-gray-100;
    }

    &--selected {
      color: $color-primary;
      font-weight: $font-weight-medium;
    }

    &--danger {
      color: #ef4444;

      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }

  &__divider {
    height: 1px;
    margin: $space-1 0;
    background: $color-border;
  }
}
```

**Update ZoomControl Dropdown Styling:**

```scss
// src/app/features/timeline/components/molecules/zoom-control/zoom-control.scss
@import '../../../../../../styles/abstracts/variables';

.zoom-control {
  position: relative;

  &__button {
    display: flex;
    align-items: center;
    gap: $space-2;
    height: 36px;
    padding: $space-2 $space-4;
    background: $color-background;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-family: $font-family-base;
    font-size: $font-size-sm;
    color: $color-text-primary;
    cursor: pointer;
    transition: $transition-colors;

    &:hover {
      background: $color-background-hover;
      border-color: $color-gray-300;
    }

    &--open {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba(86, 89, 255, 0.1);
    }
  }

  &__label {
    font-weight: $font-weight-normal;
  }

  &__value {
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: $color-text-secondary;
    transition: transform $transition-base;

    &--rotated {
      transform: rotate(180deg);
    }
  }

  // Dropdown menu uses shared dropdown styles
  &__menu {
    @extend .dropdown__menu;
    min-width: 120px;
  }

  &__option {
    @extend .dropdown__item;
  }
}
```

**Verification:** Dropdowns match design, hover states work

---

### Stage 7: Timeline Grid Polish

**Goal:** Match timeline grid styling exactly

**Reference:** All design images show the timeline grid

**Grid Specs from Design:**

- Work Center column: Fixed width (~200px)
- Timeline cells: Height 60px, 1px border
- Header: Gray text, 14px
- Current month: Blue background highlight
- Row hover: Very subtle gray
- Borders: #E5E7EB

**Update:** `src/app/features/timeline/components/organisms/timeline-grid/timeline-grid.scss`

```scss
@import '../../../../../../styles/abstracts/variables';

.timeline-grid {
  display: flex;
  flex-direction: column;
  background: $color-background;

  // Header
  &__header {
    display: flex;
    height: 48px;
    border-bottom: 1px solid $color-border;
    background: $color-background;
  }

  &__work-center-header {
    width: 200px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: $space-3 $space-4;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    border-right: 1px solid $color-border;
  }

  &__timeline-header {
    flex: 1;
    display: flex;
    overflow-x: auto;
    scrollbar-width: none; // Firefox

    &::-webkit-scrollbar {
      display: none; // Chrome, Safari
    }
  }

  &__column-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-3 $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-normal;
    color: $color-text-secondary;
    border-right: 1px solid $color-border;
    white-space: nowrap;
    text-align: center;

    &--current {
      background: $color-primary-light;
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }

  // Body
  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &__row {
    display: flex;
    border-bottom: 1px solid $color-border;

    &:last-child {
      border-bottom: none;
    }
  }

  &__work-center {
    width: 200px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: $space-4;
    font-size: $font-size-sm;
    font-weight: $font-weight-normal;
    color: $color-text-primary;
    border-right: 1px solid $color-border;
    background: $color-background;
  }

  &__timeline-row {
    flex: 1;
    position: relative;
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    transition: background $transition-base;

    &::-webkit-scrollbar {
      display: none;
    }

    &--hoverable {
      cursor: pointer;

      &:hover {
        background: rgba(241, 243, 245, 0.5);
      }
    }
  }

  &__cell {
    height: 60px;
    flex-shrink: 0;
    border-right: 1px solid $color-border;
  }

  &__bars-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    padding: $space-2 0;

    app-work-order-bar {
      pointer-events: auto;
    }
  }

  // Current day indicator
  &__today-indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $color-primary;
    z-index: 10;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: -3px;
      width: 8px;
      height: 8px;
      background: $color-primary;
      border-radius: 50%;
    }
  }
}
```

**Verification:** Grid matches design, current day indicator correct

---

### Stage 8: Work Order Bar Polish

**Goal:** Match work order bar design exactly

**Reference:** All design images show work order bars with status badges

**Bar Specs from Design:**

- Height: ~44px (within 60px row)
- Padding: 8px 12px
- Border radius: 6px
- Background: Semi-transparent status color
- Border: 1px status color (optional)
- Text: Truncate with ellipsis
- Status badge: Right side
- Three-dot menu: Right side on hover

**Update:** `src/app/features/timeline/components/molecules/work-order-bar/work-order-bar.scss`

```scss
@import '../../../../../../styles/abstracts/variables';

.work-order-bar {
  position: absolute;
  display: flex;
  align-items: center;
  gap: $space-2;
  height: 44px;
  padding: $space-2 $space-3; // 8px 12px
  border-radius: $radius-md; // 6px
  cursor: pointer;
  transition: $transition-all;
  z-index: 1;

  // Status-based styling
  &--open {
    background: $color-status-open-bg;
    border: 1px solid $color-status-open-border;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 188, 212, 0.15);
      z-index: 2;
    }
  }

  &--in-progress {
    background: $color-status-in-progress-bg;
    border: 1px solid $color-status-in-progress-border;

    &:hover {
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
      z-index: 2;
    }
  }

  &--complete {
    background: $color-status-complete-bg;
    border: 1px solid $color-status-complete-border;

    &:hover {
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
      z-index: 2;
    }
  }

  &--blocked {
    background: $color-status-blocked-bg;
    border: 1px solid $color-status-blocked-border;

    &:hover {
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
      z-index: 2;
    }
  }

  &__name {
    flex: 1;
    font-size: $font-size-sm; // 14px
    font-weight: $font-weight-medium; // 500
    color: $color-text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__status {
    flex-shrink: 0;
  }

  &__actions {
    flex-shrink: 0;
    position: relative;
    opacity: 0;
    transition: opacity $transition-base;

    .work-order-bar:hover & {
      opacity: 1;
    }
  }

  &__actions-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: none;
    border: none;
    border-radius: $radius-sm;
    color: $color-text-secondary;
    cursor: pointer;
    transition: $transition-colors;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: $color-text-primary;
    }

    &--active {
      background: rgba(0, 0, 0, 0.08);
      color: $color-text-primary;
    }
  }

  &__actions-menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 120px;
    background: $color-background;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    box-shadow: $shadow-dropdown;
    padding: $space-1;
    z-index: 1000;
  }

  &__actions-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: $space-2 $space-3;
    border: none;
    border-radius: $radius-sm;
    background: none;
    font-family: $font-family-base;
    font-size: $font-size-sm;
    color: $color-text-primary;
    text-align: left;
    cursor: pointer;
    transition: $transition-colors;

    &:hover {
      background: $color-background-hover;
    }

    &--danger {
      color: #ef4444;

      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }
}
```

**Verification:** Work order bars match design, hover states work

---

### Stage 9: Timeline Header & Page Polish

**Goal:** Match header and page layout exactly

**Reference:** "Default" design image

**Header Specs:**

- Page heading: "Work Orders" - 32px, bold
- Timescale label: "Timescale" - 14px, gray
- Spacing: Proper gaps between elements

**Update:** `src/app/features/timeline/components/organisms/timeline-header/timeline-header.scss`

```scss
@import '../../../../../../styles/abstracts/variables';

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-6 $space-8; // 24px 32px
  background: $color-background;
  border-bottom: 1px solid $color-border;

  &__left {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__title {
    font-size: $font-size-2xl; // 32px
    font-weight: $font-weight-bold; // 700
    color: $color-text-primary;
    margin: 0;
    line-height: $line-height-tight;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: $space-3;
  }

  &__label {
    font-size: $font-size-sm; // 14px
    font-weight: $font-weight-normal;
    color: $color-text-secondary;
  }
}
```

**Verification:** Header matches design

---

### Stage 10: Final Polish & Testing

**Goal:** Verify all 8 design states match pixel-perfectly

**Testing Checklist:**

**1. Default View:**

- [ ] "Work Orders" heading correct size and weight
- [ ] "Timescale" label and dropdown positioned correctly
- [ ] Current month highlighted in blue
- [ ] Work order bars display correctly
- [ ] Status badges match colors exactly
- [ ] Grid borders and spacing correct

**2. View Selection (Zoom Dropdown):**

- [ ] Dropdown opens smoothly
- [ ] Options: Hour, Day, Week, Month
- [ ] Selected option highlighted in blue
- [ ] Hover state shows light gray
- [ ] Dropdown shadow matches

**3. Options CTA Controls (Hover):**

- [ ] Three-dot menu appears on bar hover
- [ ] Icon positioned correctly
- [ ] Hover shows background change

**4. Edit and Delete Controls Expanded:**

- [ ] Dropdown opens on three-dot click
- [ ] "Edit" and "Delete" options visible
- [ ] Hover states work
- [ ] Delete text is red
- [ ] Dropdown shadow and border correct

**5. Create New Event - Placeholder:**

- [ ] Panel slides in from right
- [ ] Panel width: 480px
- [ ] Title: "Work Order Details" correct size
- [ ] Subtitle gray color matches
- [ ] Form fields have correct spacing (20px)
- [ ] Placeholder text color matches
- [ ] Cancel button styling correct
- [ ] Create button blue matches #5659FF

**6. Create New Event - Active Text Field:**

- [ ] Input focus shows blue border
- [ ] Focus shadow (blue glow) appears
- [ ] Text color correct while typing
- [ ] Border transition smooth

**7. Create New Event - With Selection:**

- [ ] Form populated with data
- [ ] Status badge "Open" cyan color matches
- [ ] Date format displayed correctly
- [ ] All fields styled correctly

**8. Create New Event - Status Dropdown:**

- [ ] Dropdown opens on click
- [ ] All 4 status options visible
- [ ] Status colors match exactly
- [ ] Hover states work
- [ ] Selected status highlighted

**Responsive & Polish:**

- [ ] All transitions smooth (0.15s ease)
- [ ] No layout shifts or jumps
- [ ] Hover states work on all interactive elements
- [ ] Focus states visible for keyboard navigation
- [ ] Colors match exactly (use color picker to verify)
- [ ] Spacing consistent throughout
- [ ] Typography hierarchy clear
- [ ] Shadows subtle and consistent

## Definition of Done

- [x] Color system implemented with exact design colors
- [x] Status badges match design pixel-perfectly
- [x] Buttons match design (primary, secondary, danger)
- [x] Form fields match design with correct focus states
- [x] WorkOrderPanel matches design exactly
- [x] Dropdowns match design (zoom, three-dot, status)
- [x] Timeline grid matches design
- [x] Work order bars match design with hover states
- [x] Timeline header matches design
- [x] All 8 design states verified and matching
- [x] All colors verified with color picker
- [x] All spacing verified with measurements
- [x] All typography verified (sizes, weights, line heights)
- [x] All transitions smooth (0.15s ease)
- [x] All interactive states working (hover, focus, active)
- [x] No console errors or warnings
- [x] Responsive design works (min 1200px width)
- [x] Memory bank updated (progress.md marked complete)

## After Completion

**Update Memory Bank:**

```markdown
**Phase 7 Complete:**

- Design system established with exact colors
- All components match design pixel-perfectly
- 8 design states verified
- Typography system using Circular Std
- Spacing system (4px base unit)
- Transition system (0.15s ease standard)
- Status color coding exact match
- Form field styling with focus states
- Button system (primary, secondary, danger)
- Panel slide-out animation smooth
- Dropdown styling consistent

**Files Updated:**

- progress.md: Mark Phase 7 as complete
- activeContext.md: Document that design matching is complete, ready for final QA
- systemPatterns.md: Add design system patterns, color usage, spacing guidelines

**Design System Patterns:**

- Color variables: 4 status colors, neutral scale
- Typography scale: xs to 2xl
- Spacing scale: 1-12 (4px base)
- Border radius: sm to full
- Transitions: fast, base, slow
- Shadows: sm, md, lg, xl, panel, dropdown
```

## Common Issues & Solutions

### Issue 1: Colors Don't Match Exactly

**Cause:** Using approximate colors instead of exact values  
**Solution:** Use color picker tool on design images to extract exact hex values

### Issue 2: Spacing Slightly Off

**Cause:** Using inconsistent spacing values  
**Solution:** Use spacing variables from 4px base unit system

### Issue 3: Fonts Look Different

**Cause:** Circular Std not loading correctly  
**Solution:** Verify font link in index.html and font-family in CSS

### Issue 4: Transitions Feel Abrupt

**Cause:** Wrong easing or duration  
**Solution:** Use 0.15s ease for most transitions (standard across design)

### Issue 5: Focus States Not Visible

**Cause:** Outline removed without replacement  
**Solution:** Use blue border and shadow for focus states

### Issue 6: Hover States Overlap

**Cause:** Z-index not managed properly  
**Solution:** Increase z-index on hover for work order bars

## Notes

- **Pixel-perfect matters** - Use browser dev tools to measure exact spacing
- **Color picker is your friend** - Extract exact colors from design images
- **Test all interactive states** - Hover, focus, active, disabled
- **Smooth animations** - 0.15s ease is the standard
- **Typography hierarchy** - Clear visual hierarchy with size and weight
- **Consistent spacing** - Use spacing variables, never hardcode px values
- **Design system thinking** - Reusable variables and patterns

## Quick Command

```
I need to implement Phase 7: Polish & Pixel-Perfect Design.

Follow the prompt in prompts/phase-7-polish.md
Work through stages 1-10 sequentially.
After each stage, verify against design images.
Use exact colors from design (color picker tool).
Match all 8 design states pixel-perfectly.
Test all interactive states (hover, focus, active).
Ensure smooth transitions (0.15s ease).
When complete, update memory bank.
```

## Figma/Sketch Notes

The design files are in Sketch format. Key measurements to extract:

- **Colors:** Use color picker to get exact hex values
- **Typography:** Font sizes, weights, line heights
- **Spacing:** Margins, paddings, gaps between elements
- **Borders:** Width, radius, color
- **Shadows:** X offset, Y offset, blur, spread, color
- **Dimensions:** Component widths, heights

**Tools:**

- Browser DevTools for measurement
- Color picker extensions
- Sketch app for direct inspection (if available)

## Design System Summary

```scss
// Quick Reference
$primary: #5659ff;
$status-open: #00bcd4;
$status-in-progress: #6366f1;
$status-complete: #10b981;
$status-blocked: #f59e0b;

$font-family: 'Circular-Std';
$font-size-sm: 0.875rem; // 14px - most common
$font-weight-medium: 500; // standard weight

$space-2: 0.5rem; // 8px - small gaps
$space-4: 1rem; // 16px - standard spacing
$space-6: 1.5rem; // 24px - large spacing

$radius-md: 6px; // standard border radius
$transition-base: 0.15s ease; // standard transition
```

This design system ensures consistency across all components and makes the codebase maintainable.
