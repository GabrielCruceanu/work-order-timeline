# Design Specifications

## Design Reference Files

All design images are located in `brief/design/` folder:

1. **Work Order Schedule - Default.jpg** - Default timeline view
2. **Work Order Schedule - View Selection.jpg** - Timescale/zoom level selection
3. **Work Order Schedule - Options CTA Controls (shown on hover).jpg** - Work order bar hover state with three-dot menu
4. **Work Order Schedule - Edit and Delete Controls Expanded.jpg** - Dropdown menu with Edit/Delete options
5. **Work Order Schedule - Create New Event - With Selection.jpg** - Create panel with date selection
6. **Work Order Schedule - Create New Event - Placeholder and Defaults.jpg** - Create panel initial state
7. **Work Order Schedule - Create New Event - Active Text Field.jpg** - Create panel with active input field
8. **Work Order Schedule - Create New Event - Status Dropdown.jpg** - Create panel with status dropdown open

**Sketch File:** https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667

## Design Requirements

### Pixel-Perfect Implementation

**CRITICAL**: All implementations must match the provided designs exactly:

- Colors must match precisely
- Spacing must match exactly (use pixel values from designs)
- Typography must match (Circular Std font family)
- Component dimensions must match
- Hover states must match
- Interactive states must match

## Layout Structure

### Default View (Work Order Schedule - Default.jpg)

**Header Section:**

- Title: "Work Orders" (left side)
- Timescale dropdown (right side)
- Container max-width: 1293px (from variables)
- Padding and spacing per design

**Timeline Grid:**

- Left panel: Work center names (fixed, does not scroll)
- Right panel: Timeline grid (horizontally scrollable)
- Current day indicator: Vertical line
- Row structure per design

### Work Order Bars

**Default State:**

- Bar displays work order name
- Status badge (pill style)
- Bar color based on status
- Positioning based on start/end dates

**Hover State (Options CTA Controls):**

- Three-dot menu appears on hover
- Menu button styling per design
- Hover effects per design

**Expanded Menu (Edit and Delete Controls):**

- Dropdown menu opens
- Edit option
- Delete option
- Menu styling per design

## Create/Edit Panel

### Panel Structure

**Slide-out Panel:**

- Slides in from the right
- Fixed width per design
- Background color per design
- Shadow/elevation per design

### Form States

**1. Placeholder and Defaults:**

- Work Order Name: Placeholder text
- Status: Default "Open" selected
- Start Date: Pre-filled from click position
- End Date: Pre-filled (Start Date + 7 days)
- Form field styling per design

**2. Active Text Field:**

- Input field focus state
- Border color change
- Placeholder behavior
- Text styling per design

**3. Status Dropdown:**

- Dropdown open state
- Options list styling
- Selected state
- Hover states per design

**4. With Selection:**

- Date picker selection state
- Selected date display
- Calendar styling per design

## Color Specifications

### Status Colors (from variables)

- **Open**: `#5659ff` (Blue)
- **In Progress**: `#6f42c1` (Blue/Purple)
- **Complete**: `#28a745` (Green)
- **Blocked**: `#ffc107` (Yellow/Orange)

### Additional Colors (from variables)

- **Primary**: `#5659ff`
- **Primary Shade**: `#3e40db`
- **Secondary**: `#aaafff`
- **Text Label**: `#687196`
- **Text Disabled**: `#d8dceb`
- **Stroke Color**: `#f0f1f5`
- **Background**: `#ffffff` (white)

### Colors from Design Images

**Extract exact colors from design images:**

- Background colors
- Border colors
- Text colors
- Hover state colors
- Focus state colors
- Shadow colors

## Typography

### Font Family

- **Primary**: "Circular-Std", sans-serif
- Loaded from: `https://naologic-com-assets.naologic.com/fonts/circular-std/circular-std.css`

### Font Sizes (from variables)

- Base: 16px
- Headings: 2rem, 1.75rem, 1.5rem, 1.25rem, 1.125rem, 1rem

### Font Weights

- Normal: 400
- Medium: 500
- Bold: 700

## Spacing

### Spacing Scale (from variables)

- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- XXL: 48px

### Layout Spacing

- Container max-width: 1293px
- Padding per component per design
- Margins per design

## Component Specifications

### Timeline Header

- Title: "Work Orders" (H1)
- Timescale dropdown (ng-select)
- Container layout per design
- Spacing per design

### Timeline Grid

- Left panel: Fixed width per design
- Right panel: Scrollable, width per design
- Row height per design
- Column width based on zoom level

### Work Order Bar

- Height per design
- Border radius per design
- Padding per design
- Status badge styling per design
- Three-dot menu styling per design

### Create/Edit Panel

- Width per design
- Slide animation per design
- Form field spacing per design
- Button styling per design
- Close button per design

## Interactive States

### Hover States

- Work order bar hover
- Three-dot menu button hover
- Form field hover
- Button hover
- All hover states must match design

### Focus States

- Input field focus
- Dropdown focus
- Date picker focus
- All focus states must match design

### Active States

- Button active
- Menu item active
- Selected state
- All active states must match design

## Responsive Behavior

- Should not break on smaller screens
- Horizontal scroll acceptable on mobile
- Maintain design integrity at all breakpoints

## Design Validation Checklist

Before considering implementation complete, verify:

- [ ] Colors match design images exactly
- [ ] Spacing matches design images exactly
- [ ] Typography matches design (Circular Std, sizes, weights)
- [ ] Component dimensions match design
- [ ] Hover states match design
- [ ] Focus states match design
- [ ] Active states match design
- [ ] Panel slide animation matches design
- [ ] Dropdown styling matches design
- [ ] Form field styling matches design
- [ ] Button styling matches design
- [ ] Status badges match design
- [ ] Work order bars match design
- [ ] Timeline grid matches design
- [ ] Header matches design

## Design Implementation Priority

1. **Default View** - Start with default timeline view
2. **Work Order Bars** - Implement bars with correct styling
3. **Hover States** - Add hover interactions
4. **Create Panel** - Implement panel with all states
5. **Edit Panel** - Implement edit functionality
6. **Polish** - Match all interactive states exactly

## Notes

- Always reference design images when implementing
- Use design images for exact measurements
- Extract colors directly from design images
- Verify spacing against design images
- Test all interactive states against design images
