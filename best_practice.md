# Readability-first React Frontend Guide

A simplified, readability-first React frontend structure and set of practices you can adopt quickly. Keeps things easy to navigate, minimizes indirection, and scales reasonably without complexity.

---

## Guiding principles (short)
- Prefer clarity over cleverness.  
- Flat, predictable structure per feature.  
- Small components with clear names.  
- Fewer abstractions: use React + hooks + a light state layer.  
- TypeScript optional but recommended for clarity.

---

## Recommended folder layout (simple)
```
src/
  index.tsx                // app bootstrap
  App.tsx                  // top-level routes + providers
  api/                     // small API client + endpoints
    apiClient.ts
    books.ts
    auth.ts
  features/                // feature-first, each folder self-contained
    books/
      BookListPage.tsx     // route-level page
      BookItem.tsx         // presentational component
      useBooks.ts          // data fetching hook
      books.css
    cart/
      CartPage.tsx
      CartItem.tsx
      useCart.ts
    auth/
      LoginPage.tsx
      useAuth.ts
  components/              // small shared UI, minimal abstractions
    Button.tsx
    Modal.tsx
    Layout.tsx             // Header/Footer common shell
  hooks/                   // generic reusable hooks
    useDebounce.ts
    useLocalStorage.ts
  styles/                  // global CSS / variables (colors, spacing)
    globals.css
  utils/                   // tiny helpers (formatCurrency, formatDate)
  types/                   // app-wide types/interfaces
  assets/                  // images/icons
  setupTests.ts
```

---

## Why this is readable
- Feature folders contain pages, components, and hooks for that feature — open one folder and see everything.  
- Minimal indirection: no separate global folders for slices/services/components.  
- Hooks colocated with their feature: easier to discover and refactor.  
- Shared components remain small and generic in `components/`.  
- Centralized API client so components use straightforward hooks.

---

## State & data fetching (simple choices)
- Local UI state: React `useState` / `useReducer`.  
- Server data: React Query (recommended) OR simple custom hooks that call `api/` and manage loading/error.  
- Global state: Keep minimal. Use Context for auth and cart if simple. Add Redux/Zustand only when needed.

---

## Coding conventions for readability
- Files named by primary export (e.g., `BookListPage.tsx` exports `BookListPage`).  
- Avoid default exports — use named exports.  
- Keep components small; prefer many focused components over one big file.  
- One responsibility per hook.  
- Clear prop names: `<BookItem book={book} onAddToCart={...} />`.  
- Prefer component-scoped CSS modules or plain classNames + `globals.css`.

---

## Error handling & loading states
- Use consistent `{ data, error, isLoading }` pattern in hooks.  
- Show clear loading states on pages and buttons.  
- Handle errors in hooks and render predictable UI (toasts/snackbars for transient errors).

---

## Testing (minimal but effective)
- Unit tests: React Testing Library + Jest for components and hooks.  
- E2E: One main happy-path test (browse → add to cart → checkout) with Playwright or Cypress.

---

## Tooling (keep lightweight)
- TypeScript (recommended).  
- ESLint + Prettier.  
- Husky + lint-staged to run linters on commit.  
- React Query if you want caching and simpler async UX.

---

## Simple example: useBooks hook (pseudo)
- `api/books.ts`: `fetchBooks(page)` → returns JSON.  
- `features/books/useBooks.ts`: calls `fetchBooks`, returns `{ books, isLoading, error, refetch }`.  
- `BookListPage` imports `useBooks` and maps books to `<BookItem />`.

---

## Incremental improvements (prioritized)
1. Move to this feature-first, flat structure.  
2. Centralize API calls in `src/api`.  
3. Add one small shared `Layout` and `Button` in `components/`.  
4. Add basic auth context (`src/features/auth/useAuth` + provider).  
5. Introduce React Query for caching and simpler async handling.  
6. Add TypeScript gradually (start with core models: `Book`, `User`, `Order`).

---