# Prompting System

## Purpose

This document defines best practices for interacting with AI assistants (like Cursor/Claude) on this project. Following these patterns ensures clear communication, efficient task completion, and consistent code quality.

## Core Principles

### 1. Context-First Communication

**Always provide context before making requests.**

```
❌ Bad: "Add a button component"
✅ Good: "Create a button atom component in shared/components/atoms/ following our BEM naming convention and Angular 21 signal-based patterns"
```

**Why**: AI needs to understand where new code fits within the existing architecture.

### 2. Progressive Disclosure

**Break complex tasks into smaller, manageable steps.**

```
❌ Bad: "Build the entire timeline feature"
✅ Good:
1. "First, create the TimelineGrid component structure"
2. "Next, implement the date column rendering logic"
3. "Now add the work order bar positioning"
```

**Why**: Smaller steps are easier to verify, test, and debug. Each step builds upon the previous one.

### 3. Explicit Design Requirements

**Reference specific design files and states when implementing UI.**

```
❌ Bad: "Make it look nice"
✅ Good: "Match the 'Work Order Schedule - Default.jpg' design exactly, including the header spacing (24px), title font size (2rem), and color (#5659ff)"
```

**Why**: Pixel-perfect implementation requires exact specifications.

### 4. Documentation-Driven Development

**Update memory bank files when significant changes occur.**

```
✅ Good: "After implementing TimelineGrid, update progress.md to mark Phase 2 as complete and update activeContext.md with any new patterns discovered"
```

**Why**: Memory bank is the source of truth across sessions.

## Prompt Patterns

### Pattern 1: Feature Implementation

**Structure**: Context → Requirements → Design Reference → Implementation Approach

```markdown
I need to implement the WorkOrderBar component.

**Context:**

- Location: features/timeline/components/molecules/work-order-bar/
- Purpose: Display work order name, status badge, and three-dot menu
- Parent: TimelineGrid organism

**Requirements:**

- Follow Atomic Design (molecule level)
- Use Angular 21 signals and standalone components
- Use BEM naming convention
- Implement OnPush change detection

**Design Reference:**

- Match "Work Order Schedule - Default.jpg" for default state
- Match "Options CTA Controls (shown on hover).jpg" for hover state
- Status colors from variables: Open (#5659ff), In Progress (#6f42c1), Complete (#28a745), Blocked (#ffc107)

**Implementation:**

- Component should accept workOrder as signal input
- Emit events for edit/delete actions using signal outputs
- Three-dot menu shows on hover only
```

### Pattern 2: Bug Fix

**Structure**: Symptom → Expected Behavior → Current Behavior → Context

```markdown
The work order bars are not positioning correctly.

**Expected:** Bars should align with their start/end dates on the timeline
**Current:** Bars appear at random positions

**Context:**

- TimelineGrid is using Day zoom level
- Date calculations are in date.utils.ts
- Bar positioning logic is in timeline-grid.component.ts lines 45-60

**Debug Steps:**

1. Check if start/end dates are being parsed correctly
2. Verify pixel position calculations
3. Test with different zoom levels
```

### Pattern 3: Design Verification

**Structure**: Component → Design File → Specific Elements → Measurements

```markdown
Verify that the Create/Edit Panel matches the design.

**Component:** WorkOrderPanel
**Design Files:**

- "Create New Event - Placeholder and Defaults.jpg"
- "Create New Event - Active Text Field.jpg"

**Check:**

- Panel width: Should be 400px
- Panel slide animation: 0.3s ease-in-out
- Form field spacing: 16px vertical gaps
- Title font size: 1.5rem (24px)
- Close button position: top-right, 16px from edges
- Background color: #ffffff
- Shadow: 0 4px 12px rgba(0,0,0,0.15)

If any mismatches found, update to match design exactly.
```

### Pattern 4: Code Review

**Structure**: File → Standards → Specific Checks

```markdown
Review timeline-grid.component.ts for Angular 21 best practices.

**Check for:**

- ✅ Standalone component (no NgModule)
- ✅ OnPush change detection
- ✅ Signal-based inputs/outputs (input(), output())
- ✅ inject() for dependency injection
- ✅ New control flow (@if, @for, @switch)
- ✅ BEM naming in template
- ✅ Proper TypeScript typing (no 'any')

**Report:**

- List any violations found
- Suggest corrections
- Explain why each pattern matters
```

### Pattern 5: Memory Bank Update

**Structure**: Trigger → Files to Review → Update Focus

```markdown
**update memory bank**

**Recent Changes:**

- Completed TimelineGrid component
- Implemented zoom level switching
- Added current day indicator

**Files to Review:**

- progress.md - Update Phase 2 status
- activeContext.md - Document zoom level implementation patterns
- systemPatterns.md - Add timeline positioning algorithm details

**Focus Areas:**

- What new patterns were discovered?
- What challenges were encountered?
- What decisions need documentation?
```

## Communication Patterns

### Clarity Markers

Use these phrases to ensure clear intent:

**For Implementation:**

- "Create..." (build from scratch)
- "Update..." (modify existing)
- "Fix..." (resolve issue)
- "Refactor..." (improve code quality)
- "Verify..." (check correctness)

**For Design:**

- "Match exactly..." (pixel-perfect required)
- "Follow pattern from..." (use existing example)
- "Extract measurements from..." (analyze design file)

**For Documentation:**

- "Document in..." (specific memory bank file)
- "Update memory bank" (comprehensive review)
- "Add to progress.md" (track completion)

### Constraint Declaration

Be explicit about constraints:

```markdown
**Constraints:**

- Must complete within 2 hours
- Cannot use external libraries beyond package.json
- Must maintain backwards compatibility
- Performance: Should handle 100+ work orders smoothly
```

### Success Criteria

Define "done" clearly:

```markdown
**Definition of Done:**

- [ ] Component matches design pixel-perfect
- [ ] All TypeScript strict mode errors resolved
- [ ] OnPush change detection working correctly
- [ ] No console errors or warnings
- [ ] Memory bank updated (progress.md)
```

## Advanced Patterns

### Chain of Thought Prompting

For complex problems, request reasoning:

```markdown
Explain how to implement overlap detection for work orders.

**Think through:**

1. What data do we need to compare?
2. What makes two orders overlap?
3. How do we exclude the current order when editing?
4. What edge cases exist?
5. What's the most efficient algorithm?

Then implement the solution in validation.utils.ts
```

### Few-Shot Learning

Provide examples of desired output:

````markdown
Create status badge component similar to existing components.

**Example Pattern (from button component):**

```typescript
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input(false);
  clicked = output<void>();
}
```
````

Follow this same pattern for StatusBadgeComponent with:

- Input: status (WorkOrderStatus type)
- No outputs needed
- BEM classes based on status

````

### Iterative Refinement

Build incrementally with checkpoints:

```markdown
Let's build the TimelineGrid in stages.

**Stage 1:** Basic structure (header, left panel, right panel)
→ Verify structure looks correct before continuing

**Stage 2:** Add date column rendering
→ Verify dates display correctly for Day zoom

**Stage 3:** Add work order bars (without interactions)
→ Verify positioning calculations

**Stage 4:** Add hover states and interactions
→ Final verification against design

After each stage, wait for my confirmation before proceeding.
````

## Anti-Patterns (Avoid These)

### ❌ Vague Requests

```
Bad: "Make it better"
Bad: "Fix the bug"
Bad: "Add some styling"
```

**Why**: No clear success criteria, AI must guess intent.

### ❌ Assumption-Heavy Requests

```
Bad: "Use the standard pattern" (which standard?)
Bad: "Make it look right" (according to what?)
Bad: "Follow best practices" (which practices?)
```

**Why**: Projects have specific standards that may differ from general best practices.

### ❌ Overloaded Requests

```
Bad: "Build the timeline component with all features, update the docs, write tests, and create a demo"
```

**Why**: Too many tasks increase error likelihood and make debugging harder.

### ❌ Missing Context

```
Bad: "The date function doesn't work"
```

**Better**: "The calculateBarPosition function in date.utils.ts returns NaN when given dates in ISO format. Expected: pixel position number."

## Project-Specific Patterns

### Design-First Implementation

This project requires pixel-perfect design matching:

```markdown
Before implementing [component]:

1. **Study Design Files:**
   - Open relevant .jpg files from brief/design/
   - Note exact measurements (use ruler tool if needed)
   - Extract colors, font sizes, spacing values

2. **Document Specifications:**
   - List measurements in prompt or memory-bank/designSpecs.md
   - Reference SCSS variables when available
   - Note interactive states (hover, focus, active)

3. **Implement with Measurements:**
   - Use exact pixel values, not estimates
   - Test against design files
   - Verify all states match

4. **Verify:**
   - Compare side-by-side with design
   - Check spacing with browser dev tools
   - Test all interactive states
```

### Signal-Based State Management

Angular 21 requires signals for reactivity:

````markdown
When creating components with state:

**Always use:**

- `signal()` for local state
- `input()` for props
- `output()` for events
- `computed()` for derived state
- `effect()` for side effects

**Never use:**

- `@Input()` decorator
- `@Output()` decorator
- `ngOnInit()` for initialization (prefer constructor or field initialization)
- Manual change detection triggers

**Example:**

```typescript
export class ExampleComponent {
  // Props
  data = input.required<Data>();

  // Local state
  isOpen = signal(false);

  // Derived state
  isEmpty = computed(() => this.data().length === 0);

  // Events
  itemClicked = output<string>();

  // Method
  toggle() {
    this.isOpen.update(v => !v);
  }
}
```
````

````

### Atomic Design Hierarchy

Components must follow strict organization:

```markdown
When creating a new component, first determine its atomic level:

**Atoms** (Basic building blocks):
- Single purpose, highly reusable
- Examples: Button, Input, Icon, Label
- No business logic
- Location: shared/components/atoms/

**Molecules** (Simple combinations):
- Combine 2-3 atoms
- Examples: FormField (Label + Input), SearchBar (Input + Button)
- Minimal logic
- Location: shared/components/molecules/ or feature/components/molecules/

**Organisms** (Complex sections):
- Combine multiple molecules/atoms
- Examples: Header, Sidebar, TimelineGrid
- Business logic present
- Location: shared/components/organisms/ or feature/components/organisms/

**Templates** (Page layouts):
- Arrange organisms
- No data, only layout
- Location: feature/templates/

**Pages** (Complete views):
- Templates + data
- Full business logic
- Location: feature/pages/ or feature/[feature].component.ts
````

## Memory Bank Integration

### When to Update Memory Bank

Update memory bank in these situations:

1. **After Major Milestones**
   - Completed a phase from progress.md
   - Implemented a core feature
   - Made architectural decisions

2. **When Discovering Patterns**
   - Found a better way to do something
   - Identified a project-specific convention
   - Solved a complex problem

3. **On User Request**
   - User says "update memory bank"
   - Requires reviewing ALL files, updating relevant ones

4. **When Blocked**
   - Document the blocker in activeContext.md
   - Update progress.md with known issues

### How to Update Memory Bank

**Process:**

```markdown
1. Read current state of relevant files
2. Identify what changed
3. Update affected files:
   - activeContext.md - Current focus, recent changes, next steps
   - progress.md - What's completed, what's left, status
   - systemPatterns.md - New patterns, architectural decisions
   - [other files as needed]
4. Ensure consistency across files
5. Confirm updates with user
```

**Example Update Prompt:**

```markdown
I've completed the TimelineGrid component. Update memory bank:

**Changes Made:**

- TimelineGrid component fully implemented
- Date column rendering working for all zoom levels
- Current day indicator added
- Fixed/scrollable panel layout working

**Files to Update:**

- progress.md: Mark Phase 2 as complete
- activeContext.md: Document grid layout pattern, move focus to Phase 3
- systemPatterns.md: Add timeline positioning algorithm documentation

**New Patterns Discovered:**

- CSS Grid layout for fixed/scrollable panels
- Date calculation strategy for different zoom levels
- Performance optimization for rendering many bars
```

## Verification Patterns

### Self-Review Checklist

Before considering work complete, verify:

```markdown
**Code Quality:**

- [ ] TypeScript strict mode passes (no errors)
- [ ] All components use OnPush change detection
- [ ] Signals used correctly (input(), output(), signal())
- [ ] BEM naming used consistently
- [ ] No console warnings or errors

**Design Accuracy:**

- [ ] Matches design files pixel-perfect
- [ ] All interactive states implemented (hover, focus, active)
- [ ] Colors match design exactly
- [ ] Spacing matches design exactly
- [ ] Typography matches (Circular Std, correct sizes)

**Functionality:**

- [ ] All required features working
- [ ] Edge cases handled
- [ ] Error states handled
- [ ] Form validation working

**Documentation:**

- [ ] Memory bank updated if significant changes
- [ ] Code comments for complex logic
- [ ] Progress.md reflects current status
```

### Design Comparison

For UI components:

```markdown
**Design Verification Process:**

1. **Side-by-Side Comparison:**
   - Open design file in one window
   - Open running app in another
   - Compare element by element

2. **Measurement Check:**
   - Use browser dev tools to measure spacing
   - Compare with design measurements
   - Adjust if discrepancies found

3. **Interactive States:**
   - Test hover states
   - Test focus states
   - Test active states
   - Verify animations/transitions

4. **Color Extraction:**
   - Use color picker on design file
   - Compare with implemented colors
   - Update if not exact match

5. **Typography Check:**
   - Verify font family (Circular Std)
   - Check font sizes (use dev tools)
   - Check font weights
   - Check line heights
```

## Error Recovery

### When Something Goes Wrong

**Effective Error Reporting:**

```markdown
**Issue:** [Brief description]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What is happening]

**Steps to Reproduce:**

1. [First step]
2. [Second step]
3. [Result]

**Context:**

- File: [specific file]
- Line: [if known]
- Related code: [reference or snippet]

**What I've Tried:**

- [Attempt 1]
- [Attempt 2]

**Request:** [What you need AI to do]
```

### Rollback Requests

If changes aren't working:

```markdown
The recent changes to TimelineGrid aren't working as expected.

**Rollback to:**

- Previous version before [specific change]
- Or: State where [specific feature] was working

**What to preserve:**

- [Any good changes to keep]

**Then we'll:**

- [Alternative approach]
```

## Collaboration Patterns

### Iterative Development

Work together in cycles:

```markdown
**Cycle Structure:**

1. **Plan** - Define what to build next
2. **Implement** - AI writes code
3. **Review** - User tests/reviews
4. **Refine** - Adjust based on feedback
5. **Document** - Update memory bank
6. **Repeat**

**Example:**
"Let's work on the zoom level dropdown together:

1. First, show me the structure you'd use
2. I'll review and provide feedback
3. Then implement with my feedback incorporated
4. We'll test all three zoom levels
5. Finally, update activeContext.md with any patterns"
```

### Decision Points

When multiple approaches exist:

```markdown
I need to implement date range calculation. I see two approaches:

**Option A: Use native Date objects**
Pros: No dependencies, fast
Cons: More manual calculations, timezone complexity

**Option B: Use date-fns library**
Pros: Tested utilities, easier calculations
Cons: Additional dependency (but it's small)

**Project Context:**

- We prefer minimal dependencies
- Date calculations are straightforward
- No timezone conversion needed

**Recommendation:** Option A (native Date)

**Request your input before proceeding.**
```

## Quick Reference

### Essential Commands

```markdown
# Start new feature

"Create [component] in [location] following [pattern]"

# Fix issue

"Fix [issue] in [file] - Expected: [X], Actual: [Y]"

# Verify design

"Verify [component] matches [design-file.jpg] exactly"

# Update docs

"Update memory bank after completing [feature]"

# Review code

"Review [file] for [standards]"

# Explain approach

"Explain how to implement [feature], then implement it"
```

### Context Keywords

Use these to provide quick context:

- `@design` - Reference design files
- `@patterns` - Follow systemPatterns.md
- `@atomic` - Atomic Design hierarchy
- `@signals` - Angular 21 signal patterns
- `@bem` - BEM naming convention
- `@pixel-perfect` - Exact design match required

### Priority Indicators

Signal urgency/importance:

- `CRITICAL:` - Must be fixed immediately
- `IMPORTANT:` - High priority, address soon
- `NICE-TO-HAVE:` - Can be done later
- `FUTURE:` - Post-MVP consideration

## Best Practices Summary

1. **Always provide context** - Don't assume AI remembers
2. **Be specific with design requirements** - Pixel values, colors, measurements
3. **Break down complex tasks** - Progressive disclosure
4. **Reference existing patterns** - Point to systemPatterns.md
5. **Verify incrementally** - Check work at each stage
6. **Update documentation** - Keep memory bank current
7. **Use clear language** - Avoid ambiguity
8. **Define success criteria** - What does "done" mean?
9. **Request explanations** - Understand before implementing
10. **Iterate and refine** - Work in cycles, not one-shot

## Conclusion

Effective prompting is about **clear communication**, **structured thinking**, and **iterative refinement**. By following these patterns, we ensure:

- Faster development cycles
- Fewer misunderstandings
- Higher code quality
- Better design accuracy
- Consistent documentation

The memory bank is our shared knowledge base. The prompting system is how we effectively communicate to maintain and grow that knowledge.
