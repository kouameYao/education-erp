---
name: testing-agent
description: >-
  Write and review unit/integration tests for React components, hooks, services,
  and utilities using Vitest, React Testing Library, nock, and TanStack Query.
  Use when asked to "write tests", "add tests", "test this component", "create
  unit tests", "add test coverage", or when working on any *.test.ts(x) file.
---

# Testing Agent

Write high-quality tests for a Next.js + React codebase using **Vitest**, **@testing-library/react**, **nock**, and **TanStack Query**.

## Before Writing Any Test

1. **Read the source file** being tested — understand its props, dependencies, rendered output, and side effects.
2. **Check for an existing test file** in a colocated `__tests__/` directory or beside the source file.
3. **Identify the users** of the code: the end user (what they see/click) and the developer (what props they pass).
4. **List use cases** before writing any code — ask "what would be the worst thing to break here?"

## Test File Conventions

| What       | Convention                                                                             |
| ---------- | -------------------------------------------------------------------------------------- |
| Location   | `__tests__/<subject>.test.tsx` colocated next to the module                            |
| Pure utils | `<file>.test.ts` beside the source                                                     |
| Extension  | `.test.ts(x)` — never `.spec`                                                          |
| Imports    | `import { describe, expect, it, vi, beforeEach } from 'vitest'` (explicit, not global) |

## Writing a Component Test

Follow the **Arrange-Act-Assert** pattern. One behaviour per `it` block.

### Template

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MyComponent } from "../my-component";

// 1. Mocks — only boundaries (network, navigation, heavy children)
vi.mock("@/services/some-service", () => ({
  useSomeHook: () => ({ mutate: vi.fn(), isPending: false }),
}));

// 2. Shared mock references — declared ABOVE vi.mock
const mockCallback = vi.fn();

// 3. Default props factory
const defaultProps = {
  open: true,
  onClose: mockCallback,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("MyComponent", () => {
  // Happy path first
  it("renders the main content when open", () => {
    render(<MyComponent {...defaultProps} />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  // User interactions
  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<MyComponent {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockCallback).toHaveBeenCalledWith(false);
  });

  // Edge cases
  it("renders nothing when closed", () => {
    render(<MyComponent {...defaultProps} open={false} />);
    expect(screen.queryByText(/expected text/i)).not.toBeInTheDocument();
  });
});
```

### Query Priority

Use the most accessible query available:

1. `getByRole` — buttons, links, headings, dialogs
2. `getByLabelText` — form inputs
3. `getByText` — display text
4. `getByTestId` — last resort only

Use `queryBy*` for absence assertions. Use `findBy*` for async appearance.

### Interactions

Always `userEvent` over `fireEvent`:

```tsx
const user = userEvent.setup();
await user.click(element);
await user.type(input, "text");
```

### Async

```tsx
await waitFor(() => {
  expect(mockFn).toHaveBeenCalledWith(expected);
});
```

Never use `setTimeout` / `sleep`. Use `waitFor` or `findBy*`.

## Writing a Service / Hook Test (TanStack Query)

### Template

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMyMutation } from "../my-service";

const BASE_URL = "http://localhost:3000";

vi.mock("@/lib/axios", async () => {
  const { default: axios } = await import("axios");
  return {
    apiClient: axios.create({ baseURL: BASE_URL, adapter: "http" }),
  };
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => nock.cleanAll());
afterEach(() => {
  nock.cleanAll();
  expect(nock.pendingMocks()).toHaveLength(0);
});

describe("useMyMutation", () => {
  it("returns data on success", async () => {
    nock(BASE_URL).post("/endpoint", params).reply(200, responseData);

    const { result } = renderHook(() => useMyMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(params);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toEqual(responseData);
  });

  it("sets isError on failure", async () => {
    nock(BASE_URL).post("/endpoint").reply(500, { message: "Error" });

    const { result } = renderHook(() => useMyMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(params);
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

Key rules:

- **New `QueryClient` per test** — never share.
- **Always `retry: false`** — prevents timeouts.
- Assert on `isSuccess` / `isError` before reading `data`.

## Testing Components That Use nuqs (Query Params)

Components using `useQueryState(s)` from nuqs need the `withNuqsTestingAdapter` — **never mock nuqs hooks manually**.

### Component test template

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  withNuqsTestingAdapter,
  type UrlUpdateEvent,
} from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";

import { MyFilterComponent } from "../my-filter-component";

it("updates the query param when the user types", async () => {
  const user = userEvent.setup();
  const onUrlUpdate = vi.fn<[UrlUpdateEvent]>();

  render(<MyFilterComponent />, {
    wrapper: withNuqsTestingAdapter({
      searchParams: "?q=initial",
      onUrlUpdate,
    }),
  });

  const input = screen.getByRole("textbox");
  await user.clear(input);
  await user.type(input, "updated");

  expect(onUrlUpdate).toHaveBeenCalled();
  const event = onUrlUpdate.mock.calls.at(-1)![0];
  expect(event.searchParams.get("q")).toBe("updated");
});
```

### Hook test template

```tsx
import { renderHook, act } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";

it("initializes from search params", () => {
  const { result } = renderHook(() => useMyQueryHook(), {
    wrapper: withNuqsTestingAdapter({
      searchParams: { step: "2" },
    }),
  });

  expect(result.current.step).toBe(2);
});
```

Key rules:

- Pass initial search params as a query string (`'?q=hello'`), `URLSearchParams`, or record (`{ q: 'hello' }`).
- Assert URL changes via `onUrlUpdate` callback — use `event.queryString` or `event.searchParams`.
- Adapter is **immutable by default** (resets to initial params each update). Use `hasMemory: true` only for multi-step flows.
- **Never** `vi.mock('nuqs')` — always use the testing adapter.

## Writing a Pure Function Test

```tsx
import { describe, expect, it } from "vitest";
import { myUtil } from "../my-util";

describe("myUtil", () => {
  it("handles the standard case", () => {
    expect(myUtil("input")).toBe("expected");
  });

  it("handles edge cases", () => {
    expect(myUtil("")).toBe("fallback");
    expect(myUtil(undefined)).toBe("fallback");
  });
});
```

Always test: zero, negative, `undefined`, empty string, boundary values.

## What to Mock vs. What to Keep Real

| Mock (boundaries)                    | Keep real (integration)             |
| ------------------------------------ | ----------------------------------- |
| HTTP requests (nock)                 | Child components (when lightweight) |
| `next/navigation` (already in setup) | State management within component   |
| `next/image` (already in setup)      | Form validation logic               |
| Heavy/unrelated child components     | Event handlers wiring               |
| `sonner` toast                       | Conditional rendering               |
| External WebSocket connections       | Props → rendered output             |

## When to Recommend Refactoring Before Testing

If writing the test requires painful setup, the problem is the source code, not the test. **Pause and suggest a refactor to the user before proceeding.**

When recommending refactors, reference the project's Vercel-authored skills for production-tested patterns. Read the relevant skill before suggesting a specific refactor.

### Composition issues → read `vercel-composition-patterns` skill

- **5+ mocks needed just to render** — too coupled. Refactor using **compound components** with shared context (`architecture-compound-components`), or inject dependencies via a **context interface** (`state-context-interface`).
- **Boolean prop explosion** making test permutations unmanageable — replace with **explicit variant components** (`patterns-explicit-variants`).
- **Deeply nested render props** — switch to **children over render props** (`patterns-children-over-render-props`), which are simpler to render in tests.
- **State shared between siblings via prop drilling** — **lift state into a provider** (`state-lift-state`) so each child can be tested independently with a mock provider.

### Performance & architecture issues → read `vercel-react-best-practices` skill

- **Business logic trapped in `useEffect`** — **move to event handlers** (`rerender-move-effect-to-event`) or extract into a pure function / custom hook.
- **Derived state computed in effects** — **derive during render** (`rerender-derived-state-no-effect`), eliminating async timing that causes flaky tests.
- **One component fetches, validates, and renders** — move data fetching to the **service layer** (`services/` pattern), parallelize independent fetches with `Promise.all` (`async-parallel`), keep the component as a thin rendering layer.
- **Direct `fetch`/`axios` inside a component** — move to the service layer so the network boundary is mockable.
- **Heavy third-party imports loaded eagerly** — use **`next/dynamic`** (`bundle-dynamic-imports`) so tests don't load unrelated code.
- **A giant file mixing concerns** — separate UI, logic, and side effects into distinct modules.

### Accessibility issues → read `web-design-guidelines` skill

- **Components without accessible roles/labels** — add proper ARIA attributes so tests can use `getByRole` / `getByLabelText` instead of brittle `getByTestId`.
- **Missing keyboard navigation** — add `onKeyDown` handlers so interactions are testable with `userEvent.keyboard`.

### How to recommend it

Format clearly: _"This [component/module] is hard to test because [specific reason]. I recommend refactoring using [specific Vercel pattern] first — it will reduce coupling and make both the code and the tests simpler."_

Then, if the user agrees, read the relevant Vercel skill and do the refactor before writing any test.

## Deciding What to Test

For a given module, think in this order:

1. **What use cases does this code support?** Write a test per use case.
2. **Happy path** — does it work under normal conditions?
3. **Error states** — network failure, invalid input, empty data.
4. **Edge cases** — null, boundary values, rapid interactions.
5. **Accessibility** — keyboard navigation, ARIA attributes on interactive elements.

Do NOT test:

- Internal state variable names
- Implementation details (private methods, CSS class names)
- Third-party library internals
- One-liner passthrough components with no logic

## When a Test Fails

**Always investigate the source code before modifying the test.**

Follow this order:

1. **Read the error message and stack trace** — determine if the failure is in the source code or in the test setup.
2. **Open and read the source file** — check if the implementation actually matches what the test expects. Look for wrong prop wiring, missing conditions, typos in handlers, broken logic.
3. **Confirm the behaviour manually** if ambiguous — does the feature work as expected in the browser?
4. **Fix the source code** if it has a real bug. The test did its job.
5. **Fix the test only** if the source code is correct — the test may have an outdated selector, stale mock, or wrong expected value.

**Never:**

- Add `.skip` to a failing test without understanding why it fails.
- Weaken an assertion (`toEqual` → `toBeDefined`) just to make it pass.
- Delete a test because it's "flaky" without investigating the root cause.

A test that breaks after a pure refactor (no behaviour change) is a **false negative** — the test was testing implementation details; fix the test. A test that breaks after a code change is probably catching a **real bug** — fix the source.

## Test Quality Checklist

Before finishing, verify:

- [ ] Each `it` block tests one behaviour
- [ ] Test names describe user-facing behaviour, not implementation
- [ ] `beforeEach` clears all mocks
- [ ] No `setTimeout` / `sleep` — only `waitFor` / `findBy*`
- [ ] `userEvent` used instead of `fireEvent`
- [ ] Accessible queries used (`getByRole`, `getByLabelText`) before `getByTestId`
- [ ] Happy path tested before edge cases
- [ ] No snapshot tests on large/dynamic component trees
- [ ] Mocks are minimal — only at boundaries
- [ ] `nock.pendingMocks()` asserted empty in `afterEach` (for service tests)
