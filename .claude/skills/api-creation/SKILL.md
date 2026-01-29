---
name: creating-api-hooks
description: Creates TanStack Query hooks with Supabase integration. Use when adding data fetching, mutations, or API layer code. Triggers on requests for queries, mutations, API hooks, or data fetching.
---

# Creating API Hooks

## Query Pattern

```typescript
import { queryOptions, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type GetUserParams = { userId: string }

const getUser = async ({ userId }: GetUserParams): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const getUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser({ userId }),
  })

export const useUser = (userId: string) =>
  useQuery(getUserQueryOptions(userId))
```

## Mutation Pattern

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

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

## Critical Rules

1. **ALWAYS use `queryOptions`** pattern for queries
2. **ALWAYS invalidate** related queries in mutations
3. **ALWAYS type** request params and responses
4. **NEVER store** server data in useState
5. **NEVER use `any`** for API types

## Query Key Structure

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Filters) => [...userKeys.lists(), filters] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}
```

## File Structure

```
features/[feature]/api/
├── get-[resource].ts      # Query hook
├── create-[resource].ts   # Create mutation
├── update-[resource].ts   # Update mutation
└── delete-[resource].ts   # Delete mutation
```

## Reference

- **Templates**: See [templates/](templates/) folder
- **Patterns & decisions**: See [reference.md](reference.md)

## Checklist

- [ ] Uses `queryOptions` pattern
- [ ] Query keys are structured
- [ ] Types defined for params and response
- [ ] Mutations invalidate related queries
- [ ] Named exports
