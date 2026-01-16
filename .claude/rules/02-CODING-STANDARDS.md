When I say 'check protocol', add to the start of the response 'Rules are active in 02 file'.

# React Coding Standards & Best Practices

## 🎯 Core Principles

1. **Type Safety First** - TypeScript everywhere, no `any`
2. **Explicit Over Implicit** - Clear, readable code over clever tricks
3. **Composition Over Inheritance** - React components favor composition
4. **Colocation** - Keep related code together
5. **Progressive Enhancement** - Start simple, add complexity when needed

### Type Annotations
- **ALWAYS** Type props and return types explicitly
- **NEVER**  Use `any`
- Use `unknown` when type is truly unknown
- **ALWAYS** Define types close to their usage
- **ALWAYS** use types instead of interfaces
- **PREFER** Don't use type assertions unless absolutely necessary

### Component Structure
- **ALWAYS** Follow the same consistent component structure
```typescript
// 1. Imports
import { Button } from '@/components/ui/button'

// 1. Types
type UserProfileProps = {
  user: User
  onUpdate?: (user: User) => void
}

// 2. Component
const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  // 3. Hooks (in consistent order)
  const [isEditing, setIsEditing] = useState(false)

  // 4. Queries/Mutations
  const { data } = useUserQuery(user.id)

  // 5. Effects
  useEffect(() => {
    // ...
  }, [])

  // 6. Event handlers
  const handleEdit = () => {
    setIsEditing(true)
  }

  // 7. Render helpers (if needed)
  const renderStats = () => {
    return <div>{/* stats */}</div>
  }

  // 8. Early returns
  if (!user) return null

  // 9. Main render
  return (
    <div>
      {/* component JSX */}
    </div>
  )
}

// 10. Export component
export { UserProfile };
```

### OTHER RULES

- **ALWAYS** Use named exports
- **ALWAYS** Use descriptive variable names and prefix boolean variables with is/has/should
- **PREFER** Destructure props in function signature and use default parameters where needed - EXCEPT when implementing wrapper components - where we should spread remaining props (<button {...props} />)

---

## 🔄 State Management Standards

### Component State

```typescript
// ✅ DO: Start with component state
const [isOpen, setIsOpen] = useState(false)

// ✅ DO: Use useReducer for complex state
type State = {
  isLoading: boolean
  error: Error | null
  data: User | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User }
  | { type: 'FETCH_ERROR'; payload: Error }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null }
    case 'FETCH_SUCCESS':
      return { isLoading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { isLoading: false, error: action.payload, data: null }
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, initialState)
```

### Avoid Prop Drilling

```typescript
// ❌ DON'T: Pass props through multiple levels
<Layout user={user}>
  <Header user={user}>
    <UserMenu user={user} />
  </Header>
</Layout>

// ✅ DO: Use Context for shared state
const UserContext = createContext<User | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const user = useContext(UserContext)
  if (!user) throw new Error('useUser must be used within UserProvider')
  return user
}

```


## 🎨 Styling Standards


## 📡 API & Data Fetching Standards

### API Function Structure

```typescript
// ✅ DO: Separate API function from React Query hook
// features/users/api/get-user.ts
import { api } from '@/lib/api-client'
import { queryOptions, useQuery } from '@tanstack/react-query'

// 1. Types
export interface GetUserParams {
  userId: string
}

export interface GetUserResponse {
  user: User
}

// 2. API function
export const getUser = async ({ userId }: GetUserParams): Promise<User> => {
  const response = await api.get<GetUserResponse>(`/users/${userId}`)
  return response.data.user
}

// 3. Query options (for reusability)
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

### Query Keys

```typescript
// ✅ DO: Use structured query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Usage:
useQuery({
  queryKey: userKeys.detail(userId),
  queryFn: () => getUser({ userId }),
})
```

### Mutations

```typescript
// features/users/api/update-user.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { userKeys } from './query-keys'

export interface UpdateUserParams {
  userId: string
  data: Partial<User>
}

export const updateUser = async ({ userId, data }: UpdateUserParams): Promise<User> => {
  const response = await api.patch<User>(`/users/${userId}`, data)
  return response.data
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
```

---

## 📋 Form Standards

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ✅ DO: Define schema with Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // data is typed and validated
    await login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Login
      </button>
    </form>
  )
}
```

---

## 🧪 Testing Standards

### Component Tests

```typescript
import { render, screen } from '@/testing/test-utils'
import { UserCard } from './user-card'

describe('UserCard', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' }

    render(<UserCard user={user} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = { id: '1', name: 'John Doe' }
    const onEdit = vi.fn()

    render(<UserCard user={user} onEdit={onEdit} />)

    await userEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEdit).toHaveBeenCalledWith(user)
  })
})
```

---

## 🎓 Key Takeaways

1. **Type everything** - No `any`, use `unknown` when needed
2. **Consistent structure** - Follow established patterns
3. **Early returns** - Simplify conditional logic
4. **Extract components** - No nested definitions
5. **Colocate code** - Keep related code together
6. **Composition** - Favor it over prop drilling
7. **Test behavior** - Not implementation details
8. **Let tooling enforce** - Use ESLint, Prettier, TypeScript strict mode
