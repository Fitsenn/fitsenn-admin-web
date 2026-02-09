# Core Architecture

**Rule Tag**: `CORE`

## Bulletproof React Architecture

This project follows Bulletproof React Architecture principles emphasizing maintainability and scalability through feature-based organization.

## Data Flow (Unidirectional)

```
┌─────────────┐
│   Shared    │  ← Can be imported by features and app
│ (components,│
│  hooks, lib)│
└─────────────┘
      ↑
      │
┌─────────────┐
│  Features   │  ← Can import from shared
│             │     CANNOT import from other features
└─────────────┘
      ↑
      │
┌─────────────┐
│  App/Routes │  ← Can import from features and shared
└─────────────┘
```

**Critical Rule**: Features NEVER import from other features. Compose at app/route level.

## Feature Module Structure

Each feature is self-contained:

```
features/
└── users/
    ├── api/                # API calls (queries, mutations)
    │   ├── get-users.ts
    │   └── update-user.ts
    ├── components/         # Feature UI components
    │   ├── users-page.tsx
    │   └── users-table.tsx
    ├── hooks/              # Feature-specific hooks
    ├── types/              # Feature types
    └── index.ts            # Public API exports
```

## State Management Strategy

### 1. Server Cache State (React Query)
- ALL server data goes through React Query
- NEVER store server data in local state
- Use `queryOptions` for reusable query configs

```typescript
const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  })
}
```

### 2. Component State (useState/useReducer)
- Start with component state
- Elevate only when necessary
- Use `useReducer` for complex state logic

### 3. Application State (Context)
- Global UI state (theme, auth, notifications)
- Localize as close as possible to consumers
- Create dedicated providers and hooks

### 4. Form State (React Hook Form)
- ALL forms use React Hook Form + Zod
- Define schemas in separate `.schema.ts` files
- Use `FormRHF` component wrapper

### 5. URL State (TanStack Router)
- Leverage URL for shareable state
- Use search params for filters/pagination

## API Layer Pattern

```typescript
// features/users/api/get-user.ts

// 1. Types - define return types directly in API files
export type GetUserParams = { userId: string }
export type GetUserReturn = User

// 2. API function
const getUser = async ({ userId }: GetUserParams): Promise<GetUserReturn> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return transformers.fromDatabase(data)
}

// 3. Hook (queryOptions only needed if prefetching)
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser({ userId }),
    enabled: !!userId,
  })
}
```

## Mutation Pattern

**Prefer updating query cache over invalidating** when the mutation returns sufficient data:

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // ✅ Preferred: Update cache directly
      queryClient.setQueryData(['users', updatedUser.id], updatedUser)

      // Update list cache if needed
      queryClient.setQueryData(['users', 'list'], (old: User[] | undefined) => {
        if (!old) return old
        return old.map(user => user.id === updatedUser.id ? updatedUser : user)
      })
    },
  })
}

// Use invalidation when:
// - Mutation doesn't return full updated data
// - Multiple related queries need refresh
// - Complex cache relationships
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

## Query Key Structure

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Filters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
```

## Route Structure (TanStack Router)

```
routes/
├── __root.tsx              # Root layout (providers, devtools)
├── index.tsx               # Landing page (/)
├── login.tsx               # Public login route
├── _authenticated.tsx      # Protected layout wrapper
└── _authenticated/         # Protected routes
    ├── dashboard.tsx
    └── users.tsx
```

## Database Type Transformation

Use Supabase-generated types and transform them to app types:

```typescript
// src/types/user.ts
import type { Tables } from './database.types'
import type { SnakeToCamel } from './utility-types'

// Database type (snake_case from Supabase)
export type DatabaseUser = Tables<'users'>

// App type (camelCase for frontend)
export type User = SnakeToCamel<DatabaseUser>
```

**Always use transformers when interacting with backend:**

```typescript
import { transformers } from '@/utils/data-transformers'

// Reading from database
const { data } = await supabase.from('users').select('*')
return transformers.fromDatabase(data)  // snake_case → camelCase

// Writing to database
const dbData = transformers.toDatabase(userData)  // camelCase → snake_case
await supabase.from('users').insert(dbData)
```

## Date Handling

**Always use `useDateHelpers` hook** for date formatting to ensure timezone consistency:

```typescript
import { useDateHelpers } from '@/hooks/use-date-helpers'

const MyComponent = () => {
  const { dateFormatHelper } = useDateHelpers()

  // Format Unix timestamp (seconds) with timezone
  const formatted = dateFormatHelper(user.createdAt, 'SHORT_DATE')  // "DD-MM-YYYY"
}
```

Available formats: `SHORT_DATE`, `LONG_DATE`, `TIME`, `FULL_DATE_TIME`

## Architecture Anti-Patterns

| Don't | Do |
|-------|-----|
| Import across features | Compose at app level |
| Store server data in useState | Use React Query |
| Create barrel files for components | Direct imports |
| Use relative imports outside folder | Use `@/` absolute imports |
| Prop drill through many levels | Use Context |
| Put business logic in components | Extract to hooks/API layer |
| Invalidate cache when data is available | Update cache directly with `setQueryData` |
| Use raw database types in components | Transform with `SnakeToCamel` utility type |
| Format dates manually | Use `useDateHelpers` hook |

## Verification Checklist

- [ ] No cross-feature imports
- [ ] Server data uses React Query
- [ ] Forms use React Hook Form + Zod
- [ ] Query keys follow structure pattern
- [ ] Mutations update cache when possible (prefer over invalidation)
- [ ] Routes import from features (not internals)
- [ ] Database types transformed with `transformers.fromDatabase/toDatabase`
- [ ] Dates formatted with `useDateHelpers`
