# Project Brief

## Overview

Build a **Work Order Schedule Timeline** component for a manufacturing ERP system. This is an interactive timeline that allows users to visualize, create, and edit work orders across multiple work centers.

## Time Constraint

**6-8 hour timebox** - If time runs out, add `@upgrade` comments on incomplete parts explaining what would be built next.

## Core Requirements

### Must Implement

1. **Timeline Grid** with Day/Week/Month zoom levels
2. **Work Order Bars** with status indicators (Open, In Progress, Complete, Blocked)
3. **Create/Edit Slide-out Panel** with form validation
4. **Overlap Detection** - Show error if work orders overlap on same work center

### Required Deliverables

1. Working Angular 17+ application
2. Pixel-perfect implementation matching Sketch designs
3. Sample data (work centers + work orders)
4. Loom demo (5-10 min)
5. GitHub repo with README

## Design Reference

- **Sketch File:** https://www.sketch.com/s/d56a77de-9753-45a8-af7a-d93a42276667
- **Font Family:** Circular Std
- **Font Import:** `https://naologic-com-assets.naologic.com/fonts/circular-std/circular-std.css`
- **Font Usage:** `font-family: 'Circular-Std', sans-serif;`

Expectation: **Pixel-perfect implementation** matching provided designs.

## Evaluation Criteria

- **Design Implementation (40%)**: Pixel-perfect accuracy, responsive behavior, visual polish
- **Functionality (40%)**: Core features, interactions, edge cases
- **Code Quality (20%)**: Angular best practices, clean code, communication

## Bonus Features (Optional)

- localStorage persistence
- Automated test suite
- Smooth animations/transitions
- Keyboard navigation
- Infinite scroll
- "Today" button
- Tooltip on bar hover
- Accessibility features
