# Modern Dashboard Architecture

*A comprehensive approach to building a scalable, accessible admin dashboard for Cartpanda's funnels + checkout product.*

## 1. Architecture

### Route & Page Structure

```
src/
├── app/                    # Next.js app router (or React Router)
│   ├── (auth)/            # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── layout.tsx     # Shared dashboard shell
│   │   ├── page.tsx       # Overview/home
│   │   ├── funnels/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── subscriptions/
│   │   ├── analytics/
│   │   ├── disputes/
│   │   └── settings/
│   └── api/               # API routes (if using Next.js)
├── features/              # Feature modules (domain-driven)
│   ├── funnels/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── utils/
│   ├── orders/
│   ├── customers/
│   └── ...
├── components/            # Shared UI components
│   ├── ui/               # Primitives (Button, Input, etc.)
│   ├── layout/           # Shell, Sidebar, Header
│   └── data-display/     # Tables, Charts, Cards
└── lib/                  # Utilities, constants, configs
```

### Avoiding Spaghetti

1. **Feature modules own their domain**: Each feature folder contains its own components, hooks, API calls, and types. No cross-feature imports except through explicit public APIs.

2. **Barrel exports**: Each feature has an `index.ts` that exports only what other features need:
   ```typescript
   // features/orders/index.ts
   export { OrdersTable } from './components/OrdersTable';
   export { useOrders } from './hooks/useOrders';
   export type { Order } from './types';
   ```

3. **Dependency rules**:
   - `components/ui` → no feature imports
   - `features/*` → can import from `components/` and `lib/`
   - `features/*` → cannot import from other `features/*`
   - If cross-feature data needed → lift to shared API layer

4. **Colocation**: Tests, stories, and styles live next to their components.

## 2. Design System

### Build vs Buy

**Recommendation: Build on top of Radix UI + Tailwind CSS**

- **Why not fully custom?** Too slow, accessibility is hard, reinventing wheels
- **Why not Material UI?** Hard to customize, opinionated styling, bundle size
- **Why Radix?** Unstyled, accessible, composable, widely adopted

### Enforcing Consistency

1. **Design tokens in code**:
   ```typescript
   // lib/design-tokens.ts
   export const tokens = {
     colors: { primary: 'hsl(168, 76%, 36%)', ... },
     spacing: { xs: '4px', sm: '8px', md: '16px', ... },
     typography: { 
       headingLg: 'font-semibold text-2xl tracking-tight',
       ... 
     },
   };
   ```

2. **Component variants with CVA**:
   ```typescript
   const buttonVariants = cva('base-styles', {
     variants: {
       variant: { primary: '...', secondary: '...' },
       size: { sm: '...', md: '...', lg: '...' },
     },
     defaultVariants: { variant: 'primary', size: 'md' },
   });
   ```

3. **Storybook for documentation**: Every component has stories showing all states.

4. **ESLint rules**: Ban inline colors, enforce token usage.

5. **Accessibility in components**:
   - All interactive elements have focus states
   - Color contrast ≥ 4.5:1 for text
   - All forms have proper labels
   - Keyboard navigation works everywhere

## 3. Data Fetching + State

### Server State vs Client State

| Type | Tool | Examples |
|------|------|----------|
| **Server state** | TanStack Query | API data, lists, entities |
| **Client state** | Zustand / React Context | UI state, modals, sidebar |
| **Form state** | React Hook Form + Zod | Validation, field tracking |
| **URL state** | nuqs / useSearchParams | Filters, pagination, sorts |

### Query Caching Strategy

```typescript
// features/orders/hooks/useOrders.ts
export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.list(filters),
    staleTime: 30 * 1000,      // Fresh for 30s
    gcTime: 5 * 60 * 1000,     // Cache for 5min
    placeholderData: keepPreviousData, // Smooth pagination
  });
};
```

### Loading/Error/Empty States

```typescript
// Standardized data display wrapper
const DataView = ({ query, empty, children }) => {
  if (query.isPending) return <Skeleton />;
  if (query.isError) return <ErrorState retry={query.refetch} />;
  if (query.data.length === 0) return empty;
  return children(query.data);
};
```

### Tables with Filters/Sorts/Pagination

- Use TanStack Table for headless table logic
- Store filter/sort/page in URL params (shareable, bookmarkable)
- Debounce filter inputs (300ms)
- Optimistic UI for selections

## 4. Performance

### Bundle Splitting

```typescript
// Route-based splitting (automatic with Next.js app router)
// Component-based splitting for heavy features
const FunnelBuilder = lazy(() => import('@/features/funnels/FunnelBuilder'));
```

### Virtualization

- **Large lists**: Use `@tanstack/react-virtual`
- **When?** > 100 items visible
- **Tables**: Virtual rows, fixed column widths

### Avoiding Rerenders

1. **Memoization**: `memo()` for expensive components
2. **Stable references**: `useCallback`, `useMemo` for props
3. **Selective subscriptions**: Zustand selectors, Query select option
4. **State colocation**: Keep state close to where it's used

### Instrumentation

```typescript
// Performance monitoring
import { getCLS, getFID, getLCP } from 'web-vitals';

// Report to analytics
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);

// Custom metrics
performance.mark('dashboard-loaded');
performance.measure('dashboard-ttl', 'navigationStart', 'dashboard-loaded');
```

**"Dashboard feels slow" checklist:**
1. LCP > 2.5s? → Optimize critical path
2. Long tasks? → Profile with DevTools
3. Network waterfall? → Parallel requests, preloading
4. Rerender storms? → React DevTools Profiler

## 5. DX & Team Scaling

### Onboarding Engineers

1. **ARCHITECTURE.md**: This document, kept updated
2. **Quick start**: One-command setup (`bun dev`)
3. **Example PRs**: Linked in docs showing how to add a feature
4. **Pair programming**: First week buddy system

### Conventions We Enforce

| What | How |
|------|-----|
| **Code formatting** | Prettier (on save, on commit) |
| **Linting** | ESLint with strict config |
| **Type safety** | `strict: true`, no `any` without comment |
| **Imports** | Absolute paths (`@/`), sorted |
| **Commits** | Conventional commits |
| **PRs** | Template with checklist |
| **Components** | Props interface, JSDoc for public API |

### Preventing One-off UI

1. **Component library first**: Check Storybook before building
2. **Code review**: "Is there an existing component for this?"
3. **Weekly design sync**: Review new patterns, deprecate old ones
4. **Chromatic**: Visual regression testing

## 6. Testing Strategy

### Testing Pyramid

| Level | What | Coverage |
|-------|------|----------|
| **Unit** | Utils, hooks, pure functions | 80%+ |
| **Component** | Interactive components in isolation | Key flows |
| **Integration** | Feature modules with mocked API | Happy paths |
| **E2E** | Critical user journeys | Login, checkout |

### Minimum Before Shipping

1. **TypeScript compiles** (types are tests)
2. **Unit tests for business logic** (calculations, validation)
3. **Component tests for interactive UI** (forms, modals)
4. **One E2E for critical path** (login → create funnel → save)

### Tools

- **Vitest**: Fast unit tests
- **React Testing Library**: Component tests
- **MSW**: API mocking
- **Playwright**: E2E tests

## 7. Release & Quality

### Feature Flags

```typescript
// Using a service like LaunchDarkly or Flagsmith
const { isEnabled } = useFeatureFlag('new-analytics-dashboard');

return isEnabled ? <NewAnalytics /> : <LegacyAnalytics />;
```

### Staged Rollouts

1. **Internal** → Team tests in production
2. **Beta** → 5% of users, monitor errors
3. **Gradual** → 25% → 50% → 100%
4. **Rollback** → One-click disable via feature flag

### Error Monitoring

- **Sentry**: Error tracking with source maps
- **LogRocket/FullStory**: Session replay for debugging
- **Alerts**: Slack notification for new errors

### Ship Fast but Safe

1. **Feature flags** → Ship incomplete features safely
2. **Trunk-based dev** → Small, frequent PRs
3. **CI/CD** → Automated tests, preview deployments
4. **Observability** → Know before users report

---

## Summary

Building a scalable dashboard is about:

1. **Clear boundaries** → Feature modules, dependency rules
2. **Shared foundation** → Design system, common patterns
3. **Right abstractions** → Query hooks, data display components
4. **Team conventions** → Enforced via tooling, not willpower
5. **Incremental improvement** → Feature flags, gradual rollouts

The goal is a codebase where any engineer can pick up any ticket and know exactly where to look and how to implement it consistently.
