# Cartpanda Dashboard Architecture & Strategy

## Vision
A modern, scalable admin dashboard for Cartpanda's funnels and checkout ecosystem. This platform supports multiple features (funnels, orders, customers, etc.) while maintaining high performance, consistency, and accessibility.

## core Principles

### 1. Speed & Consistency at Scale
To ensure the dashboard stays fast as it grows:
- **Feature-Sliced Architecture**: Code is organized by domain (e.g., `features/funnels`, `features/orders`) rather than technical layer. This prevents spaghetti code and makes boundaries clear.
- **Strict Design System**: We use a unified Design System (based on Radix UI + Tailwind) rather than ad-hoc styling. This ensures every page looks and behaves consistently.
- **Performance Budget**: We enforce limits on bundle sizes and monitor Core Web Vitals (LCP, CLS). Expensive logic moves to Web Workers or Server Components.

### 2. Parallel Engineering (No Chaos)
To support multiple engineers shipping simultaneously:
- **Decoupled Features**: Each feature module is self-contained. Changing the "Orders" module shouldn't break "Funnels".
- **Barrel Exports**: Modules expose a clean public API via `index.ts`. Internals are private.
- **Automated Testing**: CI pipelines run unit, integration, and e2e tests on every PR, ensuring no regressions.

### 3. Avoiding the "Big Rewrite"
To evolve without needing total rewrites:
- **Incremental Refactoring**: We improve code in small, continuous steps (scout rule).
- **Abstractions over Libraries**: We wrap 3rd party libraries (like charts or tables) in our own components. If we switch libraries, we only change the wrapper, not every page.
- **Feature Flags**: New major versions of features are built alongside old ones and rolled out gradually.

### 4. Accessibility (WCAG Standards)
To ensure the dashboard is usable by everyone:
- **Semantic HTML**: We use proper `<button>`, `<nav>`, and `<main>` tags.
- **Keyboard Navigation**: All interactive elements are focusable and usable without a mouse.
- **Contrast & Aria**: We adhere to AA contrast ratios and use ARIA labels where visual context isn't enough.

---

## Bonus Features Strategy

### Funnel Builder Specifics

1.  **Snap to Grid**:
    *   **Implementation**: Enabled via React Flow's `snapToGrid` prop.
    *   **Goal**: Ensures nodes align perfectly for clean diagrams.
    
2.  **Mini-map**:
    *   **Implementation**: Integrated React Flow `MiniMap` with custom styling.
    *   **Goal**: Easy navigation for large, complex funnels.
    
3.  **Undo/Redo**:
    *   **Implementation**: Using `zundo` middleware with Zustand.
    *   **Goal**: Fearless editing. Users can experiment and revert changes instantly.
    
4.  **Deletion**:
    *   **Implementation**: Support for Node and Edge deletion via Backspace/Delete keys and UI buttons.
    *   **Reference**: Standard React Flow interaction models.
    
5.  **Validation Panel**:
    *   **Implementation**: Real-time logic checking for "Orphan nodes", "Missing Thank You page", etc.
    *   **UI**: A dedicated, unobtrusive panel that lists issues with "Click to Fix" functionality.
