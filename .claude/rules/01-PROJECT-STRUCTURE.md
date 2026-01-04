# Project Structure Guide

## 📂 Complete Folder Structure

```
src/
├── app/                         # Application-level setup
│   ├── providers.tsx            # All React providers (Query, Router)
│   └── index.ts                 # Public exports
│
├── components/                  # Shared components across the app
│   ├── ui/                      # Base UI components (Button, Input, etc)
│   ├── forms/                   # Form components
│   ├── layouts/                 # Layout components
│   └── errors/                  # Error boundaries and fallbacks
|
├── features/                    # Feature-based modules (self-contained)
│   ├── auth/                    # Authentication feature
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── dashboard/              # Dashboard feature
│   └── users/                  # Users management feature
│
├── lib/                       # Shared utilities & configuration
│   ├── api-client.ts          # Axios/fetch setup
│   ├── query-client.ts        # TanStack Query setup
│   ├── router.ts              # TanStack Router setup
│   └── supabase.ts            # Supabase client setup
│
├── routes/                    # TanStack Router file-based routes
│   ├── __root.tsx             # Root layout
│   ├── index.tsx              # Landing page (/)
│   ├── login.tsx              # Login route (/login)
│   ├── _authenticated.tsx     # Protected routes layout
│   └── _authenticated/        # Protected routes
│       ├── dashboard.tsx      # /dashboard
│       └── users.tsx          # /users
│
├── types/                     # Global TypeScript types
│
├── utils/                     # Utility functions
|
├── config/                    # Config files 
│   └── paths.ts               # Project paths
│
├── app-root.tsx               # Root App component
└── main.tsx                   # Application entry point
```

---

## 📝 File Naming Conventions

### Files
- **Components**: `kebab-case.tsx` (e.g., `login-form.tsx`)
- **Hooks**: `kebab-case.ts` starting with `use-` (e.g., `use-auth.ts`)
- **Utils**: `kebab-case.ts` (e.g., `format-date.ts`)
- **Types**: `kebab-case.ts` (e.g., `user-types.ts`)
- **Tests**: `*.test.tsx` or `*.spec.tsx`

### Folders
- **All folders**: `kebab-case` (e.g., `user-profile`)
- **Exception**: `__tests__`, `__mocks__`

### Components
- **Component names**: PascalCase (e.g., `export const LoginForm`)
- **File name matches component**: `login-form.tsx` exports `LoginForm`

---

## 🔄 Import Rules

### ✅ Allowed Imports

```typescript
// ✅ Features can import from shared code
// In features/users/components/user-card.tsx
import { Button } from '@/components/ui/button'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { formatDate } from '@/utils/format'

// ✅ Routes can import from features
// In routes/authenticated/users.tsx
import { ProtectedRoute } from '@/features/authentication'
import { UserProfile } from '@/features/users'

// ✅ Shared can import from other shared
// In components/forms/text-field.tsx
import { cn } from '@/utils/cn'
```

### ❌ Forbidden Imports

```typescript
// ❌ NEVER import across features
// In features/users/components/user-card.tsx
import { useAuth } from '@/features/authentication/hooks/use-auth' // NO!

// Solution: Compose at the app level or move to shared
// In routes/authenticated/users.tsx
import { useAuth } from '@/features/authentication'
import { UserCard } from '@/features/users'

function UsersPage() {
  const { user } = useAuth()
  return <UserCard user={user} />
}
```

---

## 🎯 Colocation Strategy

**Principle**: "Place components, functions, styles, and state as close as possible to where they are being used"

### Example: Good Colocation

```typescript
// features/users/components/user-list.tsx
import { UserCard } from './user-card' // Same folder ✅

// If UserListSkeleton is only used here, define it in the same file:
const UserListSkeleton = () => {
  return <div>Loading...</div>
}

export const UserList = () => {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      {/* ... */}
    </Suspense>
  )
}
```

---

## 🧩 Component Organization Within Files

### Small Components (< 100 lines)
Keep everything in one file.

### Large Components (> 100 lines)
Consider splitting and creating subfolders inside the components folder of the feature.

```
features/users/components/user-profile/
├── index.tsx                  # Main component
├── user-profile-header.tsx    # Sub-component
├── user-profile-stats.tsx     # Sub-component
└── user-profile-skeleton.tsx  # Loading state
```

---

## 📋 Checklist for New Features

When creating a new feature:

- [ ] Create feature folder: `features/my-feature/`
- [ ] Add only needed subfolders (api, components, hooks, etc.)
- [ ] Create `index.ts` to export public API
- [ ] Keep components colocated with their feature
- [ ] Use absolute imports (`@/...`)
- [ ] Follow kebab-case naming
- [ ] Add types in feature's `types/` folder
- [ ] Document complex logic

---

## 🎓 Key Principles Summary

1. **Feature-based organization** - Group by feature, not by type
2. **Colocation** - Keep related code together
3. **Unidirectional flow** - shared → features → app
4. **No cross-feature imports** - Compose at app level
5. **Public APIs** - Use index.ts for feature exports
6. **Direct imports** - Avoid barrel files for components (Vite)
7. **Kebab-case** - For all files and folders
8. **ESLint enforcement** - Let tooling enforce rules
