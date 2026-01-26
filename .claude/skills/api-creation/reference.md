# API Creation Reference

## Decision Tree: Query vs Mutation

```
Does it modify data?
├── NO → Query
│   ├── Single item? → queryOptions with detail key
│   └── List? → queryOptions with list key + filters
│
└── YES → Mutation
    ├── Create? → POST, invalidate list queries
    ├── Update? → PATCH, invalidate detail + list
    └── Delete? → DELETE, invalidate list, remove detail
```

## Query Invalidation Strategy

| Action | Invalidate |
|--------|------------|
| Create item | List queries |
| Update item | Detail + List queries |
| Delete item | List queries, remove detail from cache |
| Bulk update | All related queries |

## Optimistic Updates

Use when immediate UI feedback is important:

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', variables.userId] })

      // Snapshot current value
      const previousUser = queryClient.getQueryData(['users', variables.userId])

      // Optimistically update
      queryClient.setQueryData(['users', variables.userId], (old: User) => ({
        ...old,
        ...variables.data,
      }))

      return { previousUser }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(['users', variables.userId], context.previousUser)
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] })
    },
  })
}
```

## Pagination Pattern

```typescript
type GetUsersParams = {
  page: number
  pageSize: number
  filters?: UserFilters
}

type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}

const getUsers = async ({ page, pageSize, filters }: GetUsersParams): Promise<PaginatedResponse<User>> => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .range(from, to)

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  }
}

export const useUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  })
}
```

## Infinite Query Pattern

```typescript
export const useInfiniteUsers = (filters?: UserFilters) => {
  return useInfiniteQuery({
    queryKey: userKeys.list(filters),
    queryFn: ({ pageParam = 0 }) => getUsers({ page: pageParam, pageSize: 20, filters }),
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.pageSize < lastPage.total
      return hasMore ? lastPage.page + 1 : undefined
    },
    initialPageParam: 0,
  })
}
```

## Common Supabase Operations

### Filtering
```typescript
.eq('column', value)           // Equal
.neq('column', value)          // Not equal
.gt('column', value)           // Greater than
.gte('column', value)          // Greater than or equal
.lt('column', value)           // Less than
.lte('column', value)          // Less than or equal
.like('column', '%pattern%')   // LIKE (case sensitive)
.ilike('column', '%pattern%')  // ILIKE (case insensitive)
.in('column', [1, 2, 3])       // IN array
.is('column', null)            // IS NULL
```

### Ordering
```typescript
.order('created_at', { ascending: false })
```

### Limiting
```typescript
.limit(10)
.range(0, 9)  // First 10 items
```

## Error Handling Patterns

```typescript
// In API function
const getUser = async ({ userId }: GetUserParams): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    // Log for debugging
    console.error('Failed to fetch user:', error)
    throw error
  }

  return data
}

// In component
const { data, error, isLoading } = useUser(userId)

if (error) {
  return <ErrorAlert message={error.message} />
}
```
