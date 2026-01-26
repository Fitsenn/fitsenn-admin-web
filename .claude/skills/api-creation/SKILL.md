# API Creation Skill

**Rule Tag**: `API`

## Critical Rules

1. **ALWAYS use `queryOptions`** pattern for queries
2. **ALWAYS structure query keys** with factory pattern
3. **ALWAYS invalidate related queries** in mutations
4. **ALWAYS type request params and responses**
5. **NEVER store server data** in component state
6. **NEVER use `any`** for API types

## File Structure

```
features/[feature]/api/
├── get-[resource].ts         # Query hook
├── get-[resources].ts        # List query hook
├── create-[resource].ts      # Create mutation
├── update-[resource].ts      # Update mutation
├── delete-[resource].ts      # Delete mutation
└── query-keys.ts             # Query key factory (optional)
```

## Templates

See `templates/` folder for:
- `query.ts` - Query hook template
- `mutation.ts` - Mutation hook template
- `query-keys.ts` - Query key factory

## Query Pattern

```typescript
import type { User } from '@/types/user'

import { queryOptions, useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

// 1. Types
type GetUserParams = {
  userId: string
}

// 2. API function (private)
const getUser = async ({ userId }: GetUserParams): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// 3. Query options (exported for prefetching)
export const getUserQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId],
    queryFn: () => getUser({ userId }),
  })
}

// 4. Hook (main export)
export const useUser = (userId: string) => {
  return useQuery(getUserQueryOptions(userId))
}
```

## Mutation Pattern

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

type UpdateUserParams = {
  userId: string
  data: Partial<User>
}

const updateUser = async ({ userId, data }: UpdateUserParams): Promise<User> => {
  const { data: user, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return user
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      // Invalidate related queries
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
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}
```

## Supabase Patterns

### Simple Query
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value)
```

### Query with Relations
```typescript
const { data, error } = await supabase
  .from('users')
  .select(`
    *,
    profile:profiles(*),
    posts(id, title)
  `)
```

### RPC Call
```typescript
const { data, error } = await supabase.rpc('function_name', {
  param1: value1,
  param2: value2,
})
```

### Error Handling
```typescript
if (error) {
  // Supabase errors have code, message, details
  throw new Error(error.message)
}
```

## Checklist

- [ ] Uses `queryOptions` pattern
- [ ] Query keys are structured
- [ ] Types defined for params and response
- [ ] Mutations invalidate related queries
- [ ] Supabase errors handled
- [ ] Named exports
- [ ] No `any` types
- [ ] Hook named with `use` prefix
