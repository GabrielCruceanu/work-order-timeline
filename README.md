# Work Order Timeline

An interactive timeline component for a manufacturing ERP system that allows users to visualize, create, and edit work orders across multiple work centers.

## Features

- **Timeline Grid** with Day/Week/Month/Hour zoom levels
- **Work Order Bars** with status indicators (Open, In Progress, Complete, Blocked)
- **Create/Edit Panel** with form validation and overlap detection
- **Interactive Timeline** - Click to create, edit, and delete work orders
- **Overlap Detection** - Prevents scheduling conflicts on the same work center
- **"Today" Button** - Quick navigation to today's date with smooth scrolling
- **Keyboard Shortcuts** - `N` to create new work order, `ESC` to close panel
- **localStorage Persistence** - Work orders and work centers persist across browser sessions
- **Tooltips** - Helpful hints on hover for better UX

## Technology Stack

- **Angular 21.0.0** - Standalone components with signals
- **TypeScript** - Strict mode
- **SCSS** - Styled with BEM methodology
- **Reactive Forms** - FormGroup, FormControl, Validators
- **ng-select** - Dropdown components
- **@ng-bootstrap/ng-bootstrap** - Date picker (ngb-datepicker)

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 21.0.0+

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm start
# or
ng serve
```

3. **Open your browser:**

Navigate to `http://localhost:4200/`

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting. Configuration is in `.prettierrc`.

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check
```

## Project Structure

```
src/app/
├── core/                    # Singleton services, models, utils
│   ├── models/              # TypeScript interfaces
│   ├── services/            # Business logic services
│   └── utils/               # Helper functions
├── shared/                  # Shared components, directives, pipes
│   ├── components/          # Atomic components (atoms/molecules/organisms)
│   ├── constants/           # App-wide constants
│   ├── directives/          # Shared directives
│   └── pipes/               # Shared pipes
├── features/                # Feature modules
│   └── timeline/            # Timeline feature
│       ├── components/      # Feature-specific components
│       ├── services/        # Feature services
│       └── models/           # Feature models
└── styles/                  # Global styles
    ├── abstracts/           # Variables, mixins, functions
    ├── base/                # Reset, typography
    ├── components/          # Component styles
    └── utilities/           # Helper classes
```

## Architecture

### Design Patterns

- **Atomic Design** - Components organized as atoms → molecules → organisms
- **BEM Methodology** - CSS class naming convention
- **Standalone Components** - No NgModules, all components are standalone
- **Signals** - Reactive state management using Angular signals
- **OnPush Change Detection** - Default strategy for performance

### Key Principles

- Single Responsibility Principle
- Dependency Injection via `inject()` function
- Signal-based APIs (`input()`, `output()`, `model()`)
- New control flow syntax (`@if`, `@for`, `@switch`)

## Sample Data

The application includes sample data:

- **5 Work Centers**: Extrusion Line A, CNC Machine 1, Assembly Station, Quality Control, Packaging Line
- **8 Work Orders**: Across different centers with all status types represented

Sample data is automatically loaded on first launch. Once you create or modify work orders, they are saved to localStorage and will persist across browser sessions.

## Building

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

```bash
ng test
```

Runs unit tests via [Karma](https://karma-runner.github.io).

## Design Reference

- **Sketch File**: https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667
- **Font**: Circular Std (loaded from CDN)

## Keyboard Shortcuts

- **`N`** - Create a new work order (opens panel with default values)
- **`ESC`** - Close the work order panel

## Data Persistence

Work orders and work centers are automatically saved to browser localStorage. This means:

- Your data persists across browser sessions
- No server required - everything is stored locally
- To reset to sample data, clear your browser's localStorage for this domain

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [Prettier Documentation](https://prettier.io/docs/en/)
