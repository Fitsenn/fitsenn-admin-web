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

// 1. Types
type GetUserParams = { userId: string }
type GetUserResponse = { user: User }

// 2. API function
const getUser = async ({ userId }: GetUserParams): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// 3. Query options
export const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser({ userId }),
  })
}

// 4. Hook
export const useUser = (userId: string) => {
  return useQuery(getUserQueryOptions(userId))
}
```

## Mutation Pattern

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['users', user.id] })
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
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

## Architecture Anti-Patterns

| Don't | Do |
|-------|-----|
| Import across features | Compose at app level |
| Store server data in useState | Use React Query |
| Create barrel files for components | Direct imports |
| Use relative imports outside folder | Use `@/` absolute imports |
| Prop drill through many levels | Use Context |
| Put business logic in components | Extract to hooks/API layer |

## Verification Checklist

- [ ] No cross-feature imports
- [ ] Server data uses React Query
- [ ] Forms use React Hook Form + Zod
- [ ] Query keys follow structure pattern
- [ ] Mutations invalidate related queries
- [ ] Routes import from features (not internals)
