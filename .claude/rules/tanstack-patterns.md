# TanStack Patterns

**Rule Tag**: `TANSTACK`

## TanStack Router

### File-Based Routing Structure

```
routes/
├── __root.tsx              # Root layout
├── index.tsx               # / (landing)
├── login.tsx               # /login (public)
├── _authenticated.tsx      # Layout for protected routes
└── _authenticated/         # Protected route children
    ├── dashboard.tsx
    ├── users.tsx
    └── settings.tsx
```

### Route File Pattern

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/features/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
```

### Protected Route Layout

```typescript
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ProtectedLayout } from '@/features/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  ),
})
```

### Route with Params

```typescript
// routes/_authenticated/users/$userId.tsx
export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserDetailPage,
})

// In component
const { userId } = useParams({ from: '/_authenticated/users/$userId' })
```

### Route with Search Params

```typescript
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().optional().default(1),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/users')({
  validateSearch: searchSchema,
  component: UsersPage,
})

// In component
const { page, search } = useSearch({ from: '/_authenticated/users' })
```

### Navigation

```typescript
import { Link, useNavigate } from '@tanstack/react-router'

// Declarative
<Link to="/users/$userId" params={{ userId: '123' }}>
  View User
</Link>

// Programmatic
const navigate = useNavigate()
navigate({ to: '/users', search: { page: 2 } })
```

## TanStack Query

### Query Options Pattern (Required)

```typescript
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
  })
}

export const useUser = (userId: string) => {
  return useQuery(getUserQueryOptions(userId))
}
```

### Query Key Factory

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Filters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
```

### Mutation with Invalidation

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

### Handling Query States

```typescript
const { data, isLoading, isError, error } = useUsers()

if (isLoading) return <Spinner />
if (isError) return <ErrorAlert message={error.message} />
return <UserList users={data} />
```

### Dependent Queries

```typescript
const { data: user } = useUser(userId)

const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => getPosts(userId),
  enabled: !!user,
})
```

### Pagination with keepPreviousData

```typescript
import { keepPreviousData } from '@tanstack/react-query'

export const useUsers = (params: PaginatedParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  })
}
```

## Router + Query Integration

### Prefetch on Route Load

```typescript
export const Route = createFileRoute('/_authenticated/users/$userId')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      getUserQueryOptions(params.userId)
    )
  },
  component: UserDetailPage,
})
```

### Search Params as Query Key

```typescript
const UsersPage = () => {
  const { page, search } = useSearch({ from: '/_authenticated/users' })
  const navigate = useNavigate()
  const { data } = useUsers({ page, search })

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage, search } })
  }

  return <UserTable data={data} onPageChange={handlePageChange} />
}
```

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Store server data in useState | Use React Query |
| Manual refetching | Let Query handle it |
| Custom loading state | Use isLoading from Query |
| Hardcode query keys | Use key factory |
| Skip invalidation | Always invalidate on mutation |

## Verification Checklist

- [ ] Routes use `createFileRoute`
- [ ] Protected routes have `beforeLoad`
- [ ] Queries use `queryOptions` pattern
- [ ] Query keys are structured
- [ ] Mutations invalidate related queries
- [ ] Loading/error states handled
- [ ] Search params validated with Zod
