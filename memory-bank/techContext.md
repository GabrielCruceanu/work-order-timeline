# Technical Context

## Technology Stack (Mandatory)

- **Angular 21.0.0** (standalone components required)
- **TypeScript** (strict mode)
- **SCSS** for all styling
- **Reactive Forms** (FormGroup, FormControl, Validators)
- **ng-select** for dropdown/select components
- **@ng-bootstrap/ng-bootstrap** (ngb-datepicker) for date picking

## Angular v21 Modern Patterns (Required)

### Component Architecture

- **Standalone Components Only**: No NgModules
- **Signals for State**: Use signals for all reactive state management
- **Functional Patterns**: Prefer functional components over class-based
- **Dependency Injection**: Use `inject()` function in functional contexts
- **Change Detection**: OnPush strategy by default for all components

### Signal-Based APIs

Use signal-based APIs instead of decorators:

- `input()` - Component inputs
- `output()` - Component outputs
- `model()` - Two-way binding
- `viewChild()` - View child references
- `contentChild()` - Content child references

### Control Flow

Use new Angular control flow syntax:

- `@if` / `@else` - Conditional rendering
- `@for` - List rendering
- `@switch` / `@case` / `@default` - Switch statements

### Example Component Pattern

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ExampleComponent {
  // Signal-based inputs
  name = input.required<string>();
  count = input(0);

  // Signal-based outputs
  clicked = output<void>();

  // Inject dependencies
  private service = inject(ExampleService);

  // Signal for reactive state
  data = signal<Data[]>([]);
}
```

## Dependencies

### Runtime Dependencies

- `@angular/common`: ^21.0.0
- `@angular/core`: ^21.0.0
- `@angular/forms`: ^21.0.0
- `@angular/platform-browser`: ^21.0.0
- `@angular/router`: ^21.0.0
- `@ng-bootstrap/ng-bootstrap`: ^20.0.0
- `@ng-select/ng-select`: ^21.1.3
- `bootstrap-icons`: ^1.13.1
- `rxjs`: ~7.8.0

### Dev Dependencies

- `@angular/cli`: ^21.0.0
- `@angular/build`: ^21.0.0
- `typescript`: ~5.9.2
- `vitest`: ^4.0.8

## Development Setup

### Running the Application

```bash
ng serve
# or
npm start
```

### Build

```bash
ng build
```

### Testing

```bash
ng test
```

## Technical Constraints

### Form Validation Requirements

- All fields required
- End date must be after start date
- No overlap with existing orders on same work center

### Responsiveness

- Should not break badly on smaller screens
- Acceptable to require horizontal scroll on mobile

### Initial View

- Center timeline on today's date
- Show reasonable range based on zoom level:
  - Day view: ±2 weeks
  - Week view: ±2 months
  - Month view: ±6 months

## Key Implementation Notes

### Date Positioning

- Calculate bar positions based on dates relative to visible timeline range
- Convert dates to pixel positions relative to container width
- Handle scroll offset when calculating positions
- Recalculate on zoom level changes

### Timeline Structure

- Left panel: Work Center names (fixed, does not scroll horizontally)
- Right panel: Timeline grid (horizontally scrollable)
- Current day indicator: Vertical line showing today's date
- Row hover state: Highlighted background

### Form Fields

| Field           | Type        | Component      | Notes                           |
| --------------- | ----------- | -------------- | ------------------------------- |
| Work Order Name | Text input  | FormControl    | Required                        |
| Status          | Dropdown    | ng-select      | Default: "Open"                 |
| Start Date      | Date picker | ngb-datepicker | Pre-filled from click position  |
| End Date        | Date picker | ngb-datepicker | Pre-filled: Start Date + 7 days |

## Status Colors

| Status      | Color         | Description                |
| ----------- | ------------- | -------------------------- |
| Open        | Blue          | Default status on creation |
| In Progress | Blue/Purple   | Work has started           |
| Complete    | Green         | Work finished              |
| Blocked     | Yellow/Orange | Work is blocked            |

## Code Style

### Prettier Configuration

- Print width: 100
- Single quotes
- Angular HTML parser

### Styling Methodology

- **BEM (Block Element Modifier)** for all CSS class naming
- **Atomic Design** for component organization
- **SCSS** with organized structure:
  - Abstracts (variables, mixins, functions)
  - Base (reset, typography)
  - Components (component-specific styles)
  - Utilities (helper classes)

## AI Tools Usage

- Feel free to use AI assistants for styling, date calculations, debugging, or component architecture
- If using AI for key decisions, save prompts in markdown files
- Document the problem-solving process
