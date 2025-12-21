# Project Architecture

This project follows the **bulletproof-react** pattern for better code organization and maintainability.

## Folder Structure

```
src/
├── app/                          # Application-level setup
│   ├── providers.tsx            # All React providers (Query, Router)
│   └── index.ts                 # Public exports
│
├── components/                   # Shared components across features
│   └── ui/                      # Chakra UI wrapper components
│       ├── color-mode.tsx       # Dark mode components
│       ├── provider.tsx         # Chakra provider
│       ├── toaster.tsx          # Toast notifications
│       └── tooltip.tsx          # Tooltip component
│
├── features/                     # Feature-based modules (self-contained)
│   ├── auth/                    # Authentication feature
│   │   ├── components/          # Auth-specific components
│   │   │   ├── login-page.tsx  # Login page component
│   │   │   └── protected-layout.tsx  # Protected routes layout
│   │   ├── lib/                # Auth business logic
│   │   │   └── auth.ts         # Auth functions
│   │   └── index.ts            # Public API
│   │
│   ├── dashboard/              # Dashboard feature
│   │   ├── components/         # Dashboard components
│   │   │   └── dashboard-page.tsx
│   │   └── index.ts
│   │
│   └── users/                  # Users management feature
│       ├── api/                # Users API calls (future)
│       ├── components/         # User-related components
│       │   └── users-page.tsx
│       ├── types/              # User type definitions
│       │   └── index.ts
│       └── index.ts
│
├── lib/                        # Shared utilities & configuration
│   ├── query-client.ts        # TanStack Query setup
│   ├── router.ts              # TanStack Router setup
│   └── supabase.ts            # Supabase client (future)
│
├── routes/                     # TanStack Router file-based routes
│   ├── __root.tsx             # Root layout
│   ├── index.tsx              # Landing page (/)
│   ├── login.tsx              # Login route (/login)
│   ├── _authenticated.tsx     # Protected routes layout
│   └── _authenticated/        # Protected routes
│       ├── dashboard.tsx      # /dashboard
│       └── users.tsx          # /users
│
├── types/                      # Global TypeScript types
│
├── utils/                      # Utility functions
│
├── app-root.tsx               # Root App component
└── main.tsx                   # Application entry point
```

## Key Principles

### 1. Feature-Based Organization

Each feature is self-contained with its own:

- Components
- API calls
- Hooks
- Types
- Business logic

### 2. Thin Routes, Thick Features

Routes (`routes/`) are minimal - they only handle routing logic and import components from features.

```tsx
// routes/_authenticated/dashboard.tsx (THIN)
import { DashboardPage } from '@/features/dashboard';

export const Route = createFileRoute('/_authenticated/dashboard')({
    component: DashboardPage,
});

// features/dashboard/components/dashboard-page.tsx (THICK)
export function DashboardPage() {
    // All business logic, state, API calls here
}
```

### 3. Public APIs via index.ts

Each feature exports only what's needed through `index.ts`:

```tsx
// features/auth/index.ts
export { LoginPage } from './components/login-page';
export { isAuthenticated } from './lib/auth';
// Internal implementation details stay private
```

### 4. File-Based Routing (TanStack Router)

- Routes stay in `routes/` folder for TanStack Router
- `_authenticated` prefix = protected routes
- Layout files (like `_authenticated.tsx`) wrap child routes

### 5. Shared vs Feature Components

- `components/` = truly shared across multiple features
- `features/*/components/` = specific to that feature

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching & caching
- **Chakra UI v3** - Component library
- **Vite** - Build tool
- **Supabase** - Backend (planned)

## Adding a New Feature

1. Create feature folder: `src/features/my-feature/`
2. Add subdirectories as needed:
    - `components/` - Feature UI components
    - `api/` - API calls
    - `hooks/` - Custom hooks
    - `types/` - TypeScript types
    - `utils/` - Feature utilities
3. Create `index.ts` to export public API
4. Add route in `routes/` that imports from your feature
5. Update navigation if needed

## Example: Adding a "Settings" Feature

```bash
# 1. Create folder structure
mkdir -p src/features/settings/{components,api,hooks,types}

# 2. Create components
# src/features/settings/components/settings-page.tsx

# 3. Create public API
# src/features/settings/index.ts
export { SettingsPage } from "./components/settings-page";

# 4. Create route
# src/routes/_authenticated/settings.tsx
import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/features/settings";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

# 5. Add to navigation
# Update features/auth/components/protected-layout.tsx
```

## Benefits

✅ **Scalability** - Easy to add new features without touching existing ones
✅ **Maintainability** - Clear separation of concerns
✅ **Testability** - Features can be tested in isolation
✅ **Team Collaboration** - Different devs can work on different features
✅ **Code Reusability** - Clear public APIs via index.ts
✅ **Type Safety** - TypeScript throughout
